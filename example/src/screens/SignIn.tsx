import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import {
  Button,
  TextInput,
  useHeaderContext,
  useThemeContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getLogo2 } from '../components/Logo';
import { useAppI18nContext } from '../contexts/AppI18nContext';
import type { ScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<ScreenParamsList>;

export default function SignInScreen({
  route,
  navigation,
}: Props): JSX.Element {
  console.log('route:', route);
  const AUTO_FOCUS = Platform.select({
    ios: false,
    android: true,
    default: false,
  });
  const enableKeyboardAvoid = true;
  const {
    defaultStatusBarTranslucent: statusBarTranslucent,
    defaultTopInset: topInset,
  } = useHeaderContext();
  const { colors } = useThemeContext();
  const { login } = useAppI18nContext();
  const [, setId] = React.useState('');
  const [, setPassword] = React.useState('');
  return (
    <SafeAreaView
      mode="padding"
      style={{ flex: 1 }}
      edges={['right', 'left', 'bottom']}
    >
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          // backgroundColor: 'darkcyan'
        }}
      >
        <View
          style={{
            flex: 1,
            width: '80%',
            justifyContent: 'center',
            // backgroundColor: 'darkorange',
            flexGrow: 10,
          }}
        >
          <KeyboardAvoidingView
            enabled={enableKeyboardAvoid}
            behavior={Platform.select({ ios: 'padding', default: 'height' })}
            keyboardVerticalOffset={
              enableKeyboardAvoid && statusBarTranslucent ? -topInset : 0
            }
            pointerEvents="box-none"
          >
            {getLogo2({ size: 200, radius: 100 })}
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 40,
                  fontWeight: '600',
                  marginTop: -35,
                  marginBottom: 35,
                }}
              >
                {login.logo}
              </Text>
            </View>
            <TextInput
              autoFocus={AUTO_FOCUS}
              multiline={false}
              placeholder={login.id}
              clearButtonMode="while-editing"
              onChangeText={(text) => setId(text)}
              style={{ height: 40, borderRadius: 40 }}
            />
            <TextInput
              autoFocus={AUTO_FOCUS}
              multiline={false}
              placeholder={login.pass}
              textContentType="password"
              visible-password={false}
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
              style={{ height: 40, borderRadius: 40 }}
            />
            <Button
              style={{ height: 40, borderRadius: 40 }}
              onPress={() => {
                navigation.push('Home', { params: undefined });
              }}
            >
              {login.button}
            </Button>
            <View style={{ flexDirection: 'row' }}>
              <Text>{login.tip}</Text>
              <Text
                onPress={() => {
                  navigation.push('SignUp', { params: undefined });
                }}
              >
                {login.register}
              </Text>
            </View>
          </KeyboardAvoidingView>
        </View>
        <View
          style={{
            flex: 1,
            width: '90%',
            // backgroundColor: 'darkorchid',
            flexGrow: 1,
          }}
        />
      </View>
    </SafeAreaView>
  );
}
