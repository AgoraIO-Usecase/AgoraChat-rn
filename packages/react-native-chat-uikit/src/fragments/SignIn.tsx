import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import Button from '../components/Button';
import { LocalIcon } from '../components/Icon';
import TextInput from '../components/TextInput';
import { useHeaderContext, useI18nContext } from '../contexts';
import { getScaleFactor } from '../styles/createScaleFactor';
import createStyleSheet from '../styles/createStyleSheet';
import { autoFocus } from '../utils/platform';

type Props = {
  onLogin?: () => void;
  onRegister?: () => void;
};

export default function SignInFragment(props: Props): JSX.Element {
  const { onLogin, onRegister } = props;
  const sf = getScaleFactor();
  const enableKeyboardAvoid = true;
  const { defaultStatusBarTranslucent: statusBarTranslucent } =
    useHeaderContext();
  const { login } = useI18nContext();
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
    <KeyboardAvoidingView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      enabled={enableKeyboardAvoid}
      behavior={Platform.select({ ios: 'padding', default: 'height' })}
      keyboardVerticalOffset={
        enableKeyboardAvoid && statusBarTranslucent ? sf(80) : 0
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
              size={sf(250)}
              style={{ borderRadius: 0 }}
            />
          </View>
          <TextInput
            autoFocus={autoFocus()}
            multiline={false}
            placeholder={login.id}
            clearButtonMode="while-editing"
            onChangeText={(text) => setId(text)}
            style={styles.item}
          />
          <View style={{ height: sf(18) }} />
          <TextInput
            autoFocus={autoFocus()}
            multiline={false}
            placeholder={login.pass}
            textContentType="password"
            visible-password={false}
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
            style={styles.item}
          />
          <View style={{ height: sf(18) }} />
          <Button disabled={disabled} style={styles.button} onPress={onLogin}>
            {login.button}
          </Button>
          <View style={styles.tr}>
            <Text style={styles.tip}>{login.tip}</Text>
            <Text
              style={styles.register}
              onPress={() => {
                setDisabled(true);
                onRegister?.();
              }}
            >
              {login.register}
            </Text>
          </View>
          <View style={styles.space} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
