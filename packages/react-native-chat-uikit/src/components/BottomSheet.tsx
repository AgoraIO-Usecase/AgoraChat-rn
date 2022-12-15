import React from 'react';
import { TouchableOpacity, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHeaderContext } from '../contexts/HeaderContext';
import { useThemeContext } from '../contexts/ThemeContext';
import DialogSheet from './DialogSheet';
import type { LocalIconName } from './Icon';
import Modal from './Modal';

export type BottomSheetItem = {
  sheetItems: {
    icon?: LocalIconName;
    iconColor?: string;
    title: string;
    titleColor?: string;
    onPress: () => void;
  }[];
};
type BottomSheetProps = {
  visible: boolean;
  onHide: () => Promise<void>;
  onError?: (error: unknown) => void;
  onDismiss?: () => void;
} & BottomSheetItem;
export default function BottomSheet({
  onDismiss,
  onHide,
  visible,
  sheetItems,
}: BottomSheetProps): JSX.Element {
  const { defaultStatusBarTranslucent } = useHeaderContext();
  const { colors } = useThemeContext();
  const { width } = useWindowDimensions();
  const { bottom, left, right } = useSafeAreaInsets();
  const transparent = true;
  return (
    <Modal
      type="slide"
      onClose={onHide}
      onDismiss={onDismiss}
      statusBarTranslucent={defaultStatusBarTranslucent}
      visible={visible}
      backgroundStyle={{ alignItems: 'center', justifyContent: 'flex-end' }}
      transparent={transparent}
      backdropColor={colors.backdrop}
    >
      <DialogSheet style={{ width, paddingBottom: bottom }}>
        {sheetItems.map(({ onPress, ...props }, idx) => (
          <TouchableOpacity
            activeOpacity={0.75}
            key={props.title + idx.toString}
            style={{ paddingLeft: left, paddingRight: right }}
            onPress={async () => {
              await onHide();
              try {
                onPress();
              } catch (e) {
                console.warn(e);
              }
            }}
          >
            <DialogSheet.Item {...props} />
          </TouchableOpacity>
        ))}
      </DialogSheet>
    </Modal>
  );
}
