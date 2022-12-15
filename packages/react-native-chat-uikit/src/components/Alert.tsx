import React from 'react';
import { AlertButton, Text, View } from 'react-native';

import { useHeaderContext } from '../contexts/HeaderContext';
import { useThemeContext } from '../contexts/ThemeContext';
import createStyleSheet from '../styles/createStyleSheet';
import Button from './Button';
import DialogBox from './DialogBox';
import Modal from './Modal';

export type AlertItem = {
  title?: string | undefined;
  message?: string | undefined;
  buttons?: AlertButton[] | undefined;
};

type AlertProps = {
  visible: boolean;
  onHide: () => void;
  onDismiss?: () => void;
} & AlertItem;

export default function Alert({
  onDismiss,
  visible,
  onHide,
  title = '',
  message = '',
  buttons = [{ text: 'OK' }],
}: AlertProps): JSX.Element {
  const { defaultStatusBarTranslucent: statusBarTranslucent } =
    useHeaderContext();
  const { colors, fonts } = useThemeContext();
  const disableBackgroundClose = true;
  const transparent = true;

  return (
    <Modal
      onClose={onHide}
      onDismiss={onDismiss}
      statusBarTranslucent={statusBarTranslucent}
      visible={visible}
      backgroundStyle={{ alignItems: 'center', justifyContent: 'center' }}
      disableBackgroundClose={disableBackgroundClose}
      transparent={transparent}
    >
      <DialogBox style={styles.container}>
        {Boolean(title) && (
          <View style={styles.titleContainer}>
            <Text
              numberOfLines={1}
              style={[{ flex: 1, color: colors.text }, fonts.title]}
            >
              {title}
            </Text>
          </View>
        )}

        <View style={styles.messageContainer}>
          {Boolean(message) && (
            <Text style={[{ color: colors.primary }, fonts.subtitle]}>
              {message}
            </Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {buttons.map(({ text = 'OK', onPress }, index) => {
            return (
              <Button
                key={text + index.toString()}
                style={styles.button}
                onPress={() => {
                  try {
                    onPress?.();
                  } finally {
                    onHide();
                  }
                }}
                color={{ content: 'red' }}
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
    paddingTop: 20,
  },
  titleContainer: {
    paddingBottom: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageContainer: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  button: {
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 12,
  },
});
