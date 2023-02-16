import * as React from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHeaderContext } from '../contexts/HeaderContext';
import { useThemeContext } from '../contexts/ThemeContext';
import DialogSheet from './DialogSheet';
import type { LocalIconName } from './Icon';
import Modal from './Modal';

type ButtonItemType = {
  icon?: LocalIconName;
  iconColor?: string;
  title: string;
  titleColor?: string;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

type CustomItemType<Props extends {} = {}> = {
  key: string;
  Custom: React.ComponentType<Props>;
  CustomProps: Props;
  // Custom: React.ReactElement<Props>; // !!! Cannot display dynamically.
};

type ItemType = ButtonItemType | CustomItemType;

export type BottomSheetItem = {
  sheetItems: ItemType[];
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
      onRequestClose={onHide}
      onDismiss={onDismiss}
      statusBarTranslucent={defaultStatusBarTranslucent}
      visible={visible}
      backgroundStyle={{ alignItems: 'center', justifyContent: 'flex-end' }}
      transparent={transparent}
      backdropColor={colors.backdrop}
    >
      <DialogSheet style={{ width, paddingBottom: bottom }}>
        {sheetItems.map((value, idx) => {
          if (Object.getOwnPropertyNames(value).includes('title')) {
            const { onPress, ...props } = value as ButtonItemType;
            return (
              <TouchableOpacity
                activeOpacity={0.75}
                key={props.title + idx.toString}
                style={{ paddingLeft: left, paddingRight: right }}
                onPress={async () => {
                  await onHide();
                  try {
                    onPress?.();
                  } catch (e) {
                    console.warn(e);
                  }
                }}
              >
                <DialogSheet.ButtonItem {...props} />
              </TouchableOpacity>
            );
          } else if (Object.getOwnPropertyNames(value).includes('key')) {
            const { Custom, CustomProps, key } = value as CustomItemType;
            return (
              <View
                key={key}
                style={{ paddingLeft: left, paddingRight: right }}
              >
                {/* {Custom} */}
                <Custom {...CustomProps} />
              </View>
            );
          } else {
            return null;
          }
        })}
      </DialogSheet>
    </Modal>
  );
}
