import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useThemeContext } from '../contexts/ThemeContext';
import createStyleSheet from '../styles/createStyleSheet';
import Divider from './Divider';
import { LocalIcon, LocalIconName } from './Icon';

export type MenuBarProps = {
  name: string;
  icon: LocalIconName;
  variant?: 'default' | 'contained' | undefined;
  disabled?: boolean | undefined;
  iconBackgroundColor?: string | undefined;
  actionLabel?: string | undefined;
  actionItem?: React.ReactNode | undefined;
  onPress: () => void;
};
export default function MenuBar({
  name,
  icon,
  variant = 'default',
  disabled,
  iconBackgroundColor,
  actionLabel,
  actionItem = null,
  onPress,
}: MenuBarProps) {
  const { colors, fonts } = useThemeContext();
  return (
    <View>
      <Pressable disabled={disabled} onPress={onPress} style={styles.container}>
        {icon && (
          <LocalIcon
            name={icon}
            size={variant === 'contained' ? 16 : 24}
            color={colors.primary}
            parentStyle={[
              styles.icon,
              variant === 'contained' && styles.containedIcon,
              variant === 'contained' && {
                backgroundColor: iconBackgroundColor ?? colors.background,
              },
            ]}
          />
        )}
        <Text numberOfLines={1} style={[styles.name, fonts.subtitle]}>
          {name}
        </Text>
        {Boolean(actionLabel) && (
          <Text
            numberOfLines={1}
            style={[
              styles.actionLabel,
              fonts.subtitle,
              { color: colors.background },
            ]}
          >
            {actionLabel}
          </Text>
        )}
        {actionItem}
      </Pressable>
      <Divider />
    </View>
  );
}

const styles = createStyleSheet({
  container: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    marginRight: 8,
  },
  icon: {
    marginRight: 16,
  },
  containedIcon: {
    borderRadius: 24,
    padding: 4,
  },
  actionLabel: {
    marginRight: 4,
  },
});
