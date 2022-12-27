import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import {
  Button,
  createStyleSheet,
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
  const { defaultStatusBarTranslucent: statusBarTranslucent } =
    useHeaderContext();
  const { colors } = useThemeContext();
  const { login } = useAppI18nContext();
  const [, setId] = React.useState('');
  const [, setPassword] = React.useState('');
  return (
    <SafeAreaView
      mode="padding"
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={['right', 'left', 'bottom']}
    >
      <View style={styles.container1}>
        <View style={styles.container2}>
          <KeyboardAvoidingView
            enabled={enableKeyboardAvoid}
            behavior={Platform.select({ ios: 'padding', default: 'height' })}
            keyboardVerticalOffset={
              enableKeyboardAvoid && statusBarTranslucent ? 80 : 0
            }
            pointerEvents="box-none"
          >
            <View style={styles.logo}>
              {getLogo2({ size: 250, radius: 0 })}
            </View>
            <TextInput
              autoFocus={AUTO_FOCUS}
              multiline={false}
              placeholder={login.id}
              clearButtonMode="while-editing"
              onChangeText={(text) => setId(text)}
              style={styles.item}
            />
            <TextInput
              autoFocus={AUTO_FOCUS}
              multiline={false}
              placeholder={login.pass}
              textContentType="password"
              visible-password={false}
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
              style={styles.item}
            />
            <Button
              style={styles.button}
              onPress={() => {
                navigation.push('Home', { params: undefined });
              }}
            >
              {login.button}
            </Button>
            <View style={styles.tr}>
              <Text style={styles.tip}>{login.tip}</Text>
              <Text
                style={styles.register}
                onPress={() => {
                  navigation.push('SignUp', { params: undefined });
                }}
              >
                {login.register}
              </Text>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = createStyleSheet({
  container1: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: 'darkcyan',
  },
  container2: {
    flex: 1,
    width: '87.2%',
    justifyContent: 'center',
    // backgroundColor: 'darkorange',
    flexGrow: 1,
  },
  logo: {
    marginBottom: 35,
  },
  item: {
    height: 48,
    borderRadius: 24,
    marginBottom: 18,
  },
  button: {
    height: 48,
    borderRadius: 24,
    marginBottom: 31,
  },
  tr: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  tip: {
    color: 'rgba(153, 153, 153, 1)',
  },
  register: {
    paddingLeft: 10,
    color: 'rgba(17, 78, 255, 1)',
    fontWeight: '600',
  },
});
