import React from 'react';
import {
  Keyboard,
  Platform,
  Text,
  TextInput as RNTextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { useHeaderContext } from '../contexts/HeaderContext';
import { useThemeContext } from '../contexts/ThemeContext';
import createStyleSheet from '../styles/createStyleSheet';
import Button from './Button';
import DialogBox from './DialogBox';
import Modal from './Modal';
import TextInput from './TextInput';

export type PromptItem = {
  title: string;
  placeholder?: string | undefined;
  defaultValue?: string | undefined;
  onSubmit?: (text: string) => void | undefined;
  submitLabel?: string | undefined;
  onCancel?: () => void | undefined;
  cancelLabel?: string | undefined;
};

type PromptProps = {
  visible: boolean;
  onHide: () => void;
  onDismiss?: () => void;
  autoFocus?: boolean;
} & PromptItem;
export default function Prompt({
  onDismiss,
  visible,
  onHide,
  autoFocus = true,
  title,
  defaultValue = '',
  placeholder = 'Enter',
  onSubmit,
  onCancel,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
}: PromptProps): JSX.Element {
  const { defaultStatusBarTranslucent } = useHeaderContext();
  const { fonts } = useThemeContext();
  const inputRef = React.useRef<RNTextInput>(null);
  const { width, height } = useWindowDimensions();
  const { colors } = useThemeContext();

  const buttons = [
    { text: cancelLabel, onPress: () => onCancel?.() },
    { text: submitLabel, onPress: () => onSubmit?.(text) },
  ];

  const [text, setText] = React.useState(defaultValue);
  const clearButtonMode = 'while-editing';
  const transparent = true;

  // FIXME: autoFocus trick with modal
  // Android
  // - InputProps.autoFocus is not trigger keyboard appearing.
  // - InputRef.focus() is trigger keyboard appearing, but position of keyboard selection is always the start of text.
  // iOS
  // - InputProps.autoFocus is trigger weird UI behavior on landscape mode.
  React.useEffect(() => {
    if (autoFocus && visible) {
      setTimeout(() => {
        if (Platform.OS === 'android') inputRef.current?.blur();
        inputRef.current?.focus();
      }, 250);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocus, visible, `${width}-${height}`]);

  return (
    <Modal
      enableKeyboardAvoid
      disableBackgroundClose
      onRequestClose={onHide}
      onDismiss={() => {
        setText('');
        onDismiss?.();
      }}
      statusBarTranslucent={defaultStatusBarTranslucent}
      visible={visible}
      backgroundStyle={{ alignItems: 'center', justifyContent: 'center' }}
      backdropColor={colors.backdrop}
      transparent={transparent}
    >
      <DialogBox style={styles.container}>
        {Boolean(title) && (
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={[{ color: 'black' }, fonts.title]}>
              {title}
            </Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            autoFocus={autoFocus && Platform.OS === 'android'}
            ref={inputRef}
            placeholder={placeholder}
            value={text}
            onChangeText={setText}
            clearButtonMode={clearButtonMode}
            style={{
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderRadius: 20,
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          {buttons.map(({ text, onPress }, index) => {
            return (
              <Button
                key={text + index.toString()}
                style={[styles.button, {}]}
                color={
                  index === 0
                    ? {
                        enabled: {
                          content: 'black',
                          background: 'rgba(242, 242, 242, 1)',
                        },
                        pressed: {
                          content: 'black',
                          background: 'rgba(242, 242, 242, 1)',
                        },
                      }
                    : undefined
                }
                onPress={() => {
                  Keyboard.dismiss();
                  try {
                    onPress?.();
                  } finally {
                    onHide();
                  }
                }}
              >
                {text}
              </Button>
            );
          })}
        </View>
      </DialogBox>
    </Modal>
  );
}

const styles = createStyleSheet({
  container: {
    paddingTop: 8,
  },
  titleContainer: {
    // backgroundColor: 'red',
    width: '100%',
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 12,
  },
  button: {
    borderRadius: 18,
    paddingHorizontal: 20,
    height: 36,
  },
});
