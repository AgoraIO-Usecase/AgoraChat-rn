import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import createStyleSheet from '../styles/createStyleSheet';
import useTheme from '../theme/useTheme';
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
  const { colors, fonts } = useTheme();
  const [pending, setPending] = useState(false);
  const _onHide = () => {
    if (!pending) onHide();
  };

  return (
    <Modal
      onClose={_onHide}
      onDismiss={onDismiss}
      statusBarTranslucent={false}
      visible={visible}
      backgroundStyle={{ alignItems: 'center', justifyContent: 'center' }}
    >
      <DialogBox>
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
});
