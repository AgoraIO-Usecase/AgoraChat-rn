import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  Button,
  createStyleSheet,
  LocalIcon,
  TextInput,
  useHeaderContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppI18nContext } from '../contexts/AppI18nContext';
import { useStyleSheet } from '../hooks/useStyleSheet';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

export default function SignInScreen({ navigation }: Props): JSX.Element {
  const AUTO_FOCUS = Platform.select({
    ios: false,
    android: true,
    default: false,
  });
  const enableKeyboardAvoid = true;
  const { defaultStatusBarTranslucent: statusBarTranslucent } =
    useHeaderContext();
  const { login } = useAppI18nContext();
  const [id, setId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [disabled, setDisabled] = React.useState(true);

  React.useEffect(() => {
    if (id.length > 0 && password.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [id.length, password.length]);

  return (
    <SafeAreaView
      mode="padding"
      style={useStyleSheet().safe}
      edges={['right', 'left', 'bottom']}
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        enabled={enableKeyboardAvoid}
        behavior={Platform.select({ ios: 'padding', default: 'height' })}
        keyboardVerticalOffset={
          enableKeyboardAvoid && statusBarTranslucent ? 80 : 0
        }
        pointerEvents="box-none"
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View>
            <View style={styles.space} />
            <View>
              <LocalIcon
                name="login_icon"
                size={250}
                style={{ borderRadius: 0 }}
              />
            </View>
            <TextInput
              autoFocus={AUTO_FOCUS}
              multiline={false}
              placeholder={login.id}
              clearButtonMode="while-editing"
              onChangeText={(text) => setId(text)}
              style={styles.item}
            />
            <View style={{ height: 18 }} />
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
            <View style={{ height: 18 }} />
            <Button
              disabled={disabled}
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
                  setDisabled(true);
                  navigation.push('SignUp', { params: undefined });
                }}
              >
                {login.register}
              </Text>
            </View>
            <View style={styles.space} />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = createStyleSheet({
  space: {
    flexGrow: 1,
    flexShrink: 1,
  },
  item: {
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 20,
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
