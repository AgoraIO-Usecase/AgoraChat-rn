import './utils/globals';

import { CameraRoll as MediaLibrary } from '@react-native-camera-roll/camera-roll';
import Clipboard from '@react-native-clipboard/clipboard';
import FirebaseMessage from '@react-native-firebase/messaging';
import {
  createMaterialBottomTabNavigator,
  MaterialBottomTabScreenProps,
} from '@react-navigation/material-bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  DarkTheme as NDarkTheme,
  DefaultTheme as NDefaultTheme,
  NavigationAction,
  NavigationContainer,
  NavigationProp,
  NavigationState,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { registerRootComponent } from 'expo';
import * as React from 'react';
import { Linking, Platform, Pressable, View } from 'react-native';
import * as Audio from 'react-native-audio-recorder-player';
import { ChatClient } from 'react-native-chat-sdk';
import {
  Container as UIKitContainer,
  createScaleFactor,
  createStringSetEn2,
  DarkTheme,
  LightTheme,
  Loading,
  LocalIcon,
  Services,
} from 'react-native-chat-uikit';
import CreateThumbnail from 'react-native-create-thumbnail';
import * as DocumentPicker from 'react-native-document-picker';
import FileAccess from 'react-native-file-access';
import ImagePicker from 'react-native-image-picker';
import Permissions from 'react-native-permissions';
import VideoComponent from 'react-native-video';

import Dev from './__dev__';
import HeaderTitle from './components/HeaderTitle';
import TabBarIcon from './components/TabBarIcon';
import { AppChatSdkContext } from './contexts/AppImSdkContext';
import { AppStringSet } from './I18n/AppCStringSet.en';
import type { RootParamsList, ScreenParamsList } from './routes';
import Add from './screens/Add';
import AddContact from './screens/add/AddContact';
import ContactList from './screens/ContactList';
import ConversationList from './screens/ConversationList';
import GroupList from './screens/GroupList';
import MySetting from './screens/MySetting';
import RequestList from './screens/RequestList';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import { createAppScaleFactor } from './styles/createAppScaleFactor';

if (Platform.OS === 'web') {
  console.error('web platforms are not supported.');
}

const Root = createNativeStackNavigator<RootParamsList>();

const Contact = createMaterialTopTabNavigator<RootParamsList>();

const ContactScreen = ({
  navigation,
  route,
}: MaterialBottomTabScreenProps<ParamListBase, 'Contact'>): JSX.Element => {
  console.log('test:ContactScreen:', route, navigation);
  return (
    <Contact.Navigator>
      <Contact.Screen name="ContactList" component={ContactList} />
      <Contact.Screen name="GroupList" component={GroupList} />
      <Contact.Screen name="RequestList" component={RequestList} />
    </Contact.Navigator>
  );
};

const Home = createMaterialBottomTabNavigator<RootParamsList>();

const HomeScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<ParamListBase, 'Home'>): JSX.Element => {
  console.log('test:HomeScreen:', route, navigation);
  const shifting = true;
  return (
    <Home.Navigator
      shifting={shifting}
      labeled={false}
      activeColor="blue"
      inactiveColor="black"
      barStyle={{ backgroundColor: 'white' }}
    >
      <Home.Screen
        name="ConversationList"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              type="ConversationList"
            />
          ),
        }}
        component={ConversationList}
      />
      <Home.Screen
        name="Contact"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} type="Contact" />
          ),
        }}
        component={ContactScreen}
      />
      <Home.Screen
        name="MySetting"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} type="MySetting" />
          ),
        }}
        component={MySetting}
      />
    </Home.Navigator>
  );
};

const Login = createNativeStackNavigator<RootParamsList>();

const LoginScreen = (
  _props: NativeStackScreenProps<ParamListBase, 'Login'>
): JSX.Element => {
  return (
    <Login.Navigator>
      <Root.Screen
        name="SignIn"
        options={{
          headerShown: false,
        }}
        component={SignIn}
      />
      <Root.Screen
        name="SignUp"
        options={{
          headerShown: false,
        }}
        component={SignUp}
      />
    </Login.Navigator>
  );
};

const HomeHeaderRight = (props: HeaderButtonProps): JSX.Element => {
  console.log('test:HomeHeaderRight:', props);
  const navigation = useNavigation<NavigationProp<ScreenParamsList>>();
  return (
    <Pressable
      onPress={() => {
        navigation.navigate('Add', { params: { value: 'test' } });
      }}
    >
      <View style={{ padding: 10, marginRight: -10 }}>
        <LocalIcon name="chat_nav_add" style={{ padding: 0 }} size={20} />
      </View>
    </Pressable>
  );
};

const __KEY__ = '__KEY__';
const __TEST__ = true;

console.log('DEV:', __DEV__);
console.log('TEST:', __TEST__);

export default function App() {
  createScaleFactor.updateScaleFactor(createAppScaleFactor());

  const isLightTheme = LightTheme.scheme === 'light';

  const permission = Services.createPermissionService({
    permissions: Permissions,
    firebaseMessage: FirebaseMessage,
  });

  const storage = Services.createLocalStorageService();

  const [isReady, setIsReady] = React.useState(__DEV__ ? false : true);
  const [initialState, setInitialState] = React.useState();

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (Platform.OS !== 'web' && initialUrl == null) {
          // Only restore state if there's no deep link and we're not on web
          const savedStateString = await storage.getItem(__KEY__);
          const state = savedStateString
            ? JSON.parse(savedStateString)
            : undefined;

          if (state !== undefined) {
            setInitialState(state);
          }
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady, storage]);

  if (!isReady) {
    return null;
  }

  if (__TEST__) {
    return Dev();
  }

  return (
    <React.StrictMode>
      <UIKitContainer
        option={{ appKey: '', autoLogin: false }}
        theme={isLightTheme ? LightTheme : DarkTheme}
        localization={createStringSetEn2(new AppStringSet())}
        sdk={
          new AppChatSdkContext({
            client: ChatClient.getInstance(),
            autoLogin: false,
          })
        }
        header={{
          defaultTitleAlign: 'center',
          defaultStatusBarTranslucent: true,
          defaultHeight: 44,
          defaultTopInset: 44,
        }}
        services={{
          clipboard: Services.createClipboardService({
            clipboard: Clipboard,
          }),
          notification: Services.createNotificationService({
            firebaseMessage: FirebaseMessage,
            permission: permission,
          }),
          media: Services.createMediaService({
            videoModule: VideoComponent,
            videoThumbnail: CreateThumbnail,
            imagePickerModule: ImagePicker,
            documentPickerModule: DocumentPicker,
            mediaLibraryModule: MediaLibrary,
            fsModule: FileAccess,
            audioModule: Audio,
            permission: permission,
          }),
          permission: permission,
          storage: storage,
        }}
      >
        <NavigationContainer
          initialState={initialState}
          theme={isLightTheme ? NDefaultTheme : NDarkTheme}
          onStateChange={(state: NavigationState | undefined) => {
            console.log('test:onStateChange:', state);
            storage.setItem(__KEY__, JSON.stringify(state));
          }}
          onUnhandledAction={(action: NavigationAction) => {
            console.log('test:onUnhandledAction:', action);
          }}
          fallback={
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <Loading color="rgba(15, 70, 230, 1)" size={45} />
            </View>
          }
        >
          <Root.Navigator initialRouteName="SignIn">
            <Root.Screen
              name="Login"
              options={{
                headerShown: false,
              }}
              component={LoginScreen}
            />
            <Root.Screen
              name="Home"
              options={() => {
                return {
                  headerBackVisible: true,
                  headerRight: HomeHeaderRight,
                  headerTitle: () => <HeaderTitle name="Chats" />,
                };
              }}
              component={HomeScreen}
            />
            <Root.Group>
              <Root.Screen
                name="Add"
                options={{ headerShown: true, presentation: 'modal' }}
                component={Add}
              />
              <Root.Screen name="AddContact" component={AddContact} />
            </Root.Group>
          </Root.Navigator>
        </NavigationContainer>
      </UIKitContainer>
    </React.StrictMode>
  );
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
