import * as React from 'react';
import { AlertButton, Text, View } from 'react-native';

import { useHeaderContext } from '../contexts/HeaderContext';
import { useThemeContext } from '../contexts/ThemeContext';
import createStyleSheet, {
  createStyleSheetP,
} from '../styles/createStyleSheet';
import type { ButtonStateColor } from '../types';
import Button from './Button';
import DialogBox from './DialogBox';
import Modal from './Modal';

export type AlertItem = {
  title: string | undefined;
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
  title,
  message,
  buttons = [{ text: 'OK' }],
}: AlertProps): JSX.Element {
  if (buttons.length > 2) {
    throw new Error('Supports a maximum of two buttons.');
  }

  const { defaultStatusBarTranslucent: statusBarTranslucent } =
    useHeaderContext();
  const { colors, fonts } = useThemeContext();
  const disableBackgroundClose = true;
  const transparent = true;

  const contentFC = () => {
    if (message !== undefined) {
      return (
        <View style={styles.titleContainer1}>
          <Text
            numberOfLines={1}
            style={[{ color: colors.card.title }, fonts.title]}
          >
            {title}
          </Text>
          <View style={styles.messageContainer}>
            <Text style={[{ color: 'rgba(108, 113, 146, 1)' }, fonts.subtitle]}>
              {message}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.titleContainer2}>
          <Text
            numberOfLines={1}
            style={[
              {
                color: colors.card.title,
              },
              fonts.title,
            ]}
          >
            {title}
          </Text>
        </View>
      );
    }
  };

  const buttonStyle1 = useStyleSheet(0, buttons.length).button;
  const buttonStyle2 = useStyleSheet(1, buttons.length).button;

  const buttonColor1: Partial<ButtonStateColor> = {
    enabled: {
      background: 'rgba(242, 242, 242, 1)',
      content: 'rgba(0, 0, 0, 1)',
    },
    pressed: {
      background: 'rgba(230, 230, 230, 1)',
      content: 'rgba(0, 0, 0, 1)',
    },
  };

  return (
    <Modal
      onRequestClose={onHide}
      onDismiss={onDismiss}
      statusBarTranslucent={statusBarTranslucent}
      visible={visible}
      backgroundStyle={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
      disableBackgroundClose={disableBackgroundClose}
      transparent={transparent}
      backdropColor={colors.backdrop}
    >
      <DialogBox style={styles.container}>
        {contentFC()}
        {/* <Divider /> */}

        <View style={styles.buttonContainer}>
          {buttons.map(({ text, onPress }, index) => {
            return (
              <Button
                key={text + index.toString()}
                style={
                  buttons.length === 2
                    ? index === 0
                      ? buttonStyle1
                      : buttonStyle2
                    : buttonStyle2
                }
                color={
                  buttons.length === 2
                    ? index === 0
                      ? buttonColor1
                      : undefined
                    : undefined
                }
                onPress={() => {
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
    paddingTop: 20,
  },
  titleContainer1: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  titleContainer2: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  messageContainer: {
    paddingTop: 16,
    marginBottom: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 20,
  },
});

const useStyleSheet = (index: number, count: number) => {
  const styles = createStyleSheetP(
    (params: { index: number; count: number }) => {
      return {
        button: {
          width: params.count === 1 ? '90%' : '40%',
          borderRadius: 22,
          height: 36,
        },
      };
    },
    { index, count }
  );
  return styles;
};
