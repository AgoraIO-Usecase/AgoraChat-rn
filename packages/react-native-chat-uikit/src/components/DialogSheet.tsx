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
  ButtonItem: typeof ButtonSheetItem;
  CustomItem: typeof CustomSheetItem;
} = ({ style, children }) => {
  const { colors } = useThemeContext();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card.background },
        style,
      ]}
    >
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
const ButtonSheetItem = ({
  icon,
  title,
  iconColor,
  titleColor,
}: SheetItemProps) => {
  const { colors, fonts } = useThemeContext();
  return (
    <View
      style={[
        styles.sheetItemContainer,
        { backgroundColor: 'rgba(250, 250, 250, 1)' },
      ]}
    >
      {icon && (
        <LocalIcon
          name={icon}
          color={iconColor ?? colors.primary}
          containerStyle={styles.sheetItemIcon}
        />
      )}
      <Text
        numberOfLines={1}
        style={[
          styles.sheetItemText,
          { color: titleColor ?? colors.text },
          fonts.sheet,
        ]}
      >
        {title}
      </Text>
    </View>
  );
};

const CustomSheetItem = ({
  icon,
  title,
  iconColor,
  titleColor,
}: SheetItemProps) => {
  const { colors, fonts } = useThemeContext();
  return (
    <View
      style={[
        styles.sheetItemContainer,
        { backgroundColor: 'rgba(250, 250, 250, 1)' },
      ]}
    >
      {icon && (
        <LocalIcon
          name={icon}
          color={iconColor ?? colors.primary}
          containerStyle={styles.sheetItemIcon}
        />
      )}
      <Text
        numberOfLines={1}
        style={[
          styles.sheetItemText,
          { color: titleColor ?? colors.text },
          fonts.sheet,
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
    alignItems: 'center',
  },
  sheetItemContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    minWidth: '90%',
    borderRadius: 24,
  },
  sheetItemIcon: {
    marginLeft: 16,
  },
  sheetItemText: {
    marginHorizontal: 24,
  },
});

DialogSheet.ButtonItem = ButtonSheetItem;
DialogSheet.CustomItem = CustomSheetItem;
export default DialogSheet;
