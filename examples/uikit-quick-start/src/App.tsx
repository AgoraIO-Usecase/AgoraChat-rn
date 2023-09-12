/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { GlobalContainer as UikitContainer } from 'react-native-chat-uikit';

import { appKey, autoLogin, debugModel } from './AppConfig';
import { ChatScreen } from './Chat';
import { MainScreen } from './Main';

const Root = createNativeStackNavigator();

export const App = () => {
  return (
    <UikitContainer
      option={{
        appKey: appKey,
        autoLogin: autoLogin,
        debugModel: debugModel,
      }}
    >
      <NavigationContainer>
        <Root.Navigator initialRouteName="Main">
          <Root.Screen name="Main" component={MainScreen} />
          <Root.Screen name="Chat" component={ChatScreen} />
        </Root.Navigator>
      </NavigationContainer>
    </UikitContainer>
  );
};
