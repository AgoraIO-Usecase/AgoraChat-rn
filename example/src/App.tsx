import './utils/globals';

import { CameraRoll as MediaLibrary } from '@react-native-camera-roll/camera-roll';
import Clipboard from '@react-native-clipboard/clipboard';
import FirebaseMessage from '@react-native-firebase/messaging';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  DarkTheme as NDarkTheme,
  DefaultTheme as NDefaultTheme,
  NavigationContainer,
  NavigationProp,
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
import { Platform } from 'react-native';
import * as Audio from 'react-native-audio-recorder-player';
import { ChatClient } from 'react-native-chat-sdk';
import {
  Container,
  createStringSetEn,
  DarkTheme,
  LightTheme,
  Services,
} from 'react-native-chat-uikit';
import CreateThumbnail from 'react-native-create-thumbnail';
import * as DocumentPicker from 'react-native-document-picker';
import FileAccess from 'react-native-file-access';
import ImagePicker from 'react-native-image-picker';
import { Button } from 'react-native-paper';
import Permissions from 'react-native-permissions';
import VideoComponent from 'react-native-video';

import Dev from './__dev__';
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

if (Platform.OS === 'web') {
  console.error('web platforms are not supported.');
}

const Root = createNativeStackNavigator<RootParamsList>();

// Type '({ route, navigation, }: NativeStackScreenProps<NativeStackParams, 'MyText'>) => JSX.Element' is not assignable to type 'ScreenComponentType<ParamListBase, "MyText"> | undefined'.
// export const RootStack = createNativeStackNavigator();
// const RootStack = createNativeStackNavigator<NativeStackParams>();

export type NativeStackParams = {
  MyText: { age: number } | undefined;
  Article: { author: string } | undefined;
};

const Contact = createMaterialTopTabNavigator<RootParamsList>();

const ContactScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<ParamListBase, 'Contact'>) => {
  console.log(route, navigation);
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
}: NativeStackScreenProps<ParamListBase, 'Home'>) => {
  console.log(route, navigation);
  return (
    <Home.Navigator>
      <Home.Screen name="ConversationList" component={ConversationList} />
      <Home.Screen name="Contact" component={ContactScreen} />
      <Home.Screen name="MySetting" component={MySetting} />
    </Home.Navigator>
  );
};

const Login = createNativeStackNavigator<RootParamsList>();

const LoginScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<ParamListBase, 'Login'>) => {
  console.log(route, navigation);
  return (
    <Login.Navigator>
      <Root.Screen name="SignIn" component={SignIn} />
      <Root.Screen name="SignUp" component={SignUp} />
    </Login.Navigator>
  );
};

const HomeHeaderRight = (props: HeaderButtonProps) => {
  console.log('props:', props);
  const navigation = useNavigation<NavigationProp<ScreenParamsList>>();
  return (
    <Button
      mode="text"
      uppercase={false}
      onPress={() => {
        navigation.navigate('Add', { params: { value: 'test' } });
      }}
    >
      Add
    </Button>
  );
};

export default function App() {
  React.useEffect(() => {
    console.log('test:');
  }, []);

  if (__DEV__) {
    return Dev();
  } else {
    const isLightTheme = LightTheme.scheme === 'light';

    const permission = Services.createPermissionService({
      permissions: Permissions,
      firebaseMessage: FirebaseMessage,
    });

    return (
      <Container
        option={{ appKey: '', autoLogin: false }}
        theme={isLightTheme ? LightTheme : DarkTheme}
        localization={createStringSetEn()}
        sdk={{ client: ChatClient.getInstance(), isLogged: false }}
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
        }}
      >
        <NavigationContainer theme={isLightTheme ? NDefaultTheme : NDarkTheme}>
          <Root.Navigator initialRouteName="SignIn">
            <Root.Screen name="Login" component={LoginScreen} />
            <Root.Screen
              name="Home"
              options={{
                headerRight: HomeHeaderRight,
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
      </Container>
    );
  }
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
