import React from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { useThemeContext } from '../contexts/ThemeContext';
import createStyleSheet from '../styles/createStyleSheet';
import type { LocalIconName } from './Icon';
import { LocalIcon } from './Icon';

type DialogSheetProps = React.PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;
const DialogSheet: ((props: DialogSheetProps) => JSX.Element) & {
  Item: typeof SheetItem;
} = ({ style, children }) => {
  const { colors } = useThemeContext();
  return (
    <View style={[styles.container, { backgroundColor: colors.card }, style]}>
      {children}
    </View>
  );
};

export type SheetItemProps = {
  icon?: LocalIconName;
  iconColor?: string;
  title: string;
  titleColor?: string;
};
const SheetItem = ({ icon, title, iconColor, titleColor }: SheetItemProps) => {
  const { colors, fonts } = useThemeContext();
  return (
    <View style={[styles.sheetItemContainer, { backgroundColor: colors.card }]}>
      {icon && (
        <LocalIcon
          name={icon}
          color={iconColor ?? colors.primary}
          parentStyle={styles.sheetItemIcon}
        />
      )}
      <Text
        numberOfLines={1}
        style={[
          styles.sheetItemText,
          { color: titleColor ?? colors.text },
          fonts.subtitle,
        ]}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    overflow: 'hidden',
    flexDirection: 'column',
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  sheetItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
  },
  sheetItemIcon: {
    marginLeft: 16,
  },
  sheetItemText: {
    flex: 1,
    marginHorizontal: 24,
  },
});

DialogSheet.Item = SheetItem;
export default DialogSheet;
