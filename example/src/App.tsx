import './utils/globals';

import { CameraRoll as MediaLibrary } from '@react-native-camera-roll/camera-roll';
import Clipboard from '@react-native-clipboard/clipboard';
import FirebaseMessage from '@react-native-firebase/messaging';
import {
  DarkTheme as NDarkTheme,
  DefaultTheme as NDefaultTheme,
  NavigationAction,
  NavigationContainer,
  NavigationState,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { registerRootComponent } from 'expo';
import * as React from 'react';
import { Linking, Platform, View } from 'react-native';
import * as Audio from 'react-native-audio-recorder-player';
import { ChatClient } from 'react-native-chat-sdk';
import {
  createStringSetEn2,
  DarkTheme,
  LightTheme,
  Loading,
  Services,
  UIKitContainer,
  updateScaleFactor,
} from 'react-native-chat-uikit';
import CreateThumbnail from 'react-native-create-thumbnail';
import * as DocumentPicker from 'react-native-document-picker';
import * as FileAccess from 'react-native-file-access';
import * as ImagePicker from 'react-native-image-picker';
import * as Permissions from 'react-native-permissions';
import VideoComponent from 'react-native-video';

import Dev from './__dev__';
import { GroupInviteHeader } from './components/GroupInviteHeader';
import HeaderTitle from './components/HeaderTitle';
import HomeHeaderRight from './components/HomeHeaderRight';
import { AppChatSdkContext } from './contexts/AppImSdkContext';
import { AppStringSet } from './I18n/AppCStringSet.en';
import type { RootParamsList } from './routes';
import Add from './screens/Add';
import AddContact from './screens/add/AddContact';
import Chat from './screens/chat/Chat';
import ContactList from './screens/ContactList';
import HomeScreen from './screens/Home';
import ContactInfo from './screens/info/ContactInfo';
import GroupInfo from './screens/info/GroupInfo';
import LoginScreen from './screens/Login';
import { createAppScaleFactor } from './styles/createAppScaleFactor';

if (Platform.OS === 'web') {
  console.error('web platforms are not supported.');
}

const Root = createNativeStackNavigator<RootParamsList>();

const __KEY__ = '__KEY__';
let __TEST__ = true;

try {
  const env = require('./env');
  __TEST__ = env.test ?? false;
} catch (e) {
  console.warn('test:', e);
}

console.log('DEV:', __DEV__);
console.log('TEST:', __TEST__);

export default function App() {
  updateScaleFactor(createAppScaleFactor());

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
  console.log('test:App:isReady:', isReady);

  if (!isReady) {
    return null;
  }

  const formatNavigationState = (
    state: NavigationState | undefined,
    result: string[] & string[][]
  ) => {
    if (state) {
      const ret: string[] & string[][] = [];
      for (const route of state.routes) {
        ret.push(route.name);
        if (route.state) {
          formatNavigationState(
            route.state as NavigationState | undefined,
            ret
          );
        }
      }
      result.push(ret);
    }
  };

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
        {__TEST__ === true ? (
          Dev()
        ) : (
          <NavigationContainer
            initialState={initialState}
            theme={isLightTheme ? NDefaultTheme : NDarkTheme}
            onStateChange={(state: NavigationState | undefined) => {
              const rr: string[] & string[][] = [];
              formatNavigationState(state, rr);
              console.log(
                'test:onStateChange:',
                JSON.stringify(rr, undefined, '  ')
              );
              // console.log('test:onStateChange:o:', JSON.stringify(state));
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
                <Root.Screen name="ContactInfo" component={ContactInfo} />
                <Root.Screen name="GroupInfo" component={GroupInfo} />
                <Root.Screen
                  name="ContactList"
                  options={({ route }) => {
                    return {
                      headerBackVisible: true,
                      headerRight: GroupInviteHeader,
                      headerTitle: route.name,
                    };
                  }}
                  component={ContactList}
                />
                <Root.Screen name="Chat" component={Chat} />
              </Root.Group>
            </Root.Navigator>
          </NavigationContainer>
        )}
      </UIKitContainer>
    </React.StrictMode>
  );
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
