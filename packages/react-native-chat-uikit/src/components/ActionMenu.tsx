import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { useHeaderContext } from '../contexts/HeaderContext';
import { useThemeContext } from '../contexts/ThemeContext';
import createStyleSheet from '../styles/createStyleSheet';
import DialogBox from './DialogBox';
import Loading from './Loading';
import Modal from './Modal';

export type ActionMenuItem = {
  title?: string | undefined;
  menuItems: {
    title: string;
    onPress?: (() => Promise<void>) | (() => void) | undefined;
    onError?: () => void | undefined;
  }[];
};

type ActionMenuProps = {
  visible: boolean;
  onHide: () => void;
  onError?: (error: unknown) => void | undefined;
  onDismiss?: () => void | undefined;
} & ActionMenuItem;

export default function ActionMenu({
  visible,
  onHide,
  onError,
  onDismiss,
  title,
  menuItems,
}: ActionMenuProps): JSX.Element {
  const { colors, fonts } = useThemeContext();
  const { defaultStatusBarTranslucent } = useHeaderContext();
  const [pending, setPending] = useState(false);
  const transparent = true;
  const _onHide = () => {
    if (!pending) onHide();
  };

  return (
    <Modal
      type="fade"
      onClose={_onHide}
      onDismiss={onDismiss}
      statusBarTranslucent={defaultStatusBarTranslucent}
      visible={visible}
      backgroundStyle={{ alignItems: 'center', justifyContent: 'center' }}
      transparent={transparent}
      // backdropColor="rgba(100, 10, 200, 0.5)"
    >
      <DialogBox style={{ backgroundColor: colors.card }}>
        <View style={styles.title}>
          <Text
            numberOfLines={1}
            // style={{ flex: 1 }}
            style={[
              {
                maxWidth: pending ? '86%' : '100%',
                color: colors.primary,
              },
              fonts.title,
            ]}
          >
            {title}
          </Text>
          {pending && (
            <Loading
              size={20}
              color={colors.primary}
              style={{ width: '10%', marginLeft: '4%' }}
            />
          )}
        </View>
        <View style={styles.buttonContainer}>
          {menuItems.map((item, index) => {
            return (
              <TouchableOpacity
                activeOpacity={0.55}
                key={item.title + index.toString()}
                style={styles.button}
                disabled={pending}
                onPress={async () => {
                  setPending(true);
                  try {
                    await item.onPress?.();
                  } catch (e: unknown) {
                    const errorHandler = onError ?? item.onError;
                    errorHandler?.(e);
                    if (!errorHandler)
                      console.error('ActionMenu onPress error', e);
                  } finally {
                    onHide();
                    setPending(false);
                  }
                }}
              >
                <Text
                  numberOfLines={1}
                  style={[{ color: colors.primary }, fonts.subtitle]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </DialogBox>
    </Modal>
  );
}

const styles = createStyleSheet({
  title: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 4,
    marginBottom: 8,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  container: {
    backgroundColor: 'rgba(235, 235, 235, 1)',
  },
});
