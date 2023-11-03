import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  ScreenContainer,
  TextInput,
  useChatSdkContext,
} from 'react-native-chat-uikit';

import {
  defaultId,
  defaultTargetId,
  defaultToken,
  dlog,
  RootParamsList,
} from './AppConfig';
// import { LogMemo } from './AppLog';

export function MainScreen({
  navigation,
}: NativeStackScreenProps<typeof RootParamsList>): JSX.Element {
  dlog.log('test:', defaultId, defaultToken);
  const placeholder1 = 'Please enter the user ID';
  const placeholder2 = 'Please enter the user password or token';
  const placeholder3 = 'Please enter the user ID of the peer user';
  const [id, setId] = React.useState(defaultId);
  const [token, setToken] = React.useState(defaultToken);
  const [chatId, setChatId] = React.useState(defaultTargetId);
  const { login: loginAction, logout: logoutAction } = useChatSdkContext();

  const login = () => {
    loginAction({
      id: id,
      pass: token,
      onResult: (result: { result: boolean; error?: any }) => {
        dlog.log('loginAction:', result.result, result.error);
      },
    });
  };
  const logout = () => {
    logoutAction({
      onResult: (result: { result: boolean; error?: any }) => {
        dlog.log('logout:', result.result, result.error);
      },
    });
  };
  const gotoChat = () => {
    if (chatId.length > 0) {
      navigation.push('Chat', { chatId: chatId, chatType: 0 });
    }
  };
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={placeholder1}
            value={id}
            onChangeText={(t) => {
              setId(t);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder={placeholder2}
            value={token}
            onChangeText={(t) => {
              setToken(t);
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button style={styles.button} onPress={login}>
            SIGN IN
          </Button>
          <Button style={styles.button} onPress={logout}>
            SIGN OUT
          </Button>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={placeholder3}
            value={chatId}
            onChangeText={(t) => {
              setChatId(t);
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button style={styles.button} onPress={gotoChat}>
            START CHAT
          </Button>
        </View>
        {/* <LogMemo /> */}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  button: {
    height: 40,
    marginHorizontal: 10,
  },
  inputContainer: {
    marginHorizontal: 20,
  },
  input: {
    height: 40,
    borderBottomColor: '#0041FF',
    borderBottomWidth: 1,
    backgroundColor: 'white',
    marginVertical: 10,
  },
});
