import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from 'react-native';
import {
  Button,
  createStyleSheet,
  createStyleSheetP,
  defaultScaleFactor as scaleFactor,
  LocalIcon,
  TextInput,
  ThemeContextType,
  useAlert,
  useHeaderContext,
  useThemeContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppI18nContext } from '../contexts/AppI18nContext';
import type { ScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<ScreenParamsList>;

export default function SignUpScreen({ navigation }: Props): JSX.Element {
  const AUTO_FOCUS = Platform.select({
    ios: false,
    android: true,
    default: false,
  });
  const enableKeyboardAvoid = true;

  const { defaultStatusBarTranslucent: statusBarTranslucent } =
    useHeaderContext();
  const { register, login } = useAppI18nContext();
  const { openAlert } = useAlert();

  const [id, setId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [disabled, setDisabled] = React.useState(true);
  const [tip, setTip] = React.useState('');

  React.useEffect(() => {
    if (id.length > 0 && password.length > 0 && confirm.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [confirm.length, id.length, password.length]);

  return (
    <SafeAreaView
      mode="padding"
      style={useStyleSheet().safe}
      edges={['right', 'left', 'bottom']}
    >
      <View style={styles.container1}>
        <View style={styles.container2}>
          <KeyboardAvoidingView
            enabled={enableKeyboardAvoid}
            behavior={Platform.select({ ios: 'padding', default: 'height' })}
            keyboardVerticalOffset={
              enableKeyboardAvoid && statusBarTranslucent ? 44 : 0
            }
            pointerEvents="box-none"
          >
            <View style={styles.logo}>
              <LocalIcon
                name="register_icon"
                size={250}
                style={{ borderRadius: 0 }}
              />
            </View>
            <View style={[styles.tip, { opacity: tip.length > 0 ? 1 : 0 }]}>
              <LocalIcon name="loginFail" size={scaleFactor(14)} />
              <Text style={styles.comment}>{tip}</Text>
            </View>
            <TextInput
              autoFocus={AUTO_FOCUS}
              multiline={false}
              placeholder={register.id}
              clearButtonMode="while-editing"
              onChangeText={(text) => setId(text)}
              style={styles.item}
            />
            <TextInput
              autoFocus={AUTO_FOCUS}
              multiline={false}
              placeholder={register.pass}
              textContentType="password"
              visible-password={false}
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
              style={styles.item}
            />
            <TextInput
              autoFocus={AUTO_FOCUS}
              multiline={false}
              placeholder={register.confirm}
              textContentType="password"
              visible-password={false}
              secureTextEntry
              onChangeText={(text) => setConfirm(text)}
              style={styles.item}
            />
            <Button
              disabled={disabled}
              style={styles.button}
              onPress={() => {
                if (password !== confirm) {
                  console.log('test: password not match');
                  setTip(register.comment(1));
                } else if (password === '1') {
                  console.log('test: success');
                  Keyboard.dismiss();
                  openAlert({
                    title: register.comment(5),
                    buttons: [
                      {
                        text: login.button,
                        onPress: () => {
                          navigation.goBack();
                        },
                      },
                    ],
                  });
                }
              }}
            >
              {register.button}
            </Button>
            <View style={styles.tr}>
              <Text
                style={styles.register}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                {register.back}
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
  },
  container2: {
    flex: 1,
    width: '87.2%',
    justifyContent: 'center',
    flexGrow: 1,
  },
  logo: {
    marginBottom: -8,
  },
  tip: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 18,
  },
  comment: {
    marginLeft: 5,
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
    alignItems: 'center',
  },
  register: {
    paddingLeft: 10,
    color: 'rgba(17, 78, 255, 1)',
    fontWeight: '600',
  },
});

const useStyleSheet = () => {
  const styles = createStyleSheetP((theme: ThemeContextType) => {
    const { colors } = theme;
    return {
      safe: { flex: 1, backgroundColor: colors.background },
    };
  }, useThemeContext());
  return styles;
};
