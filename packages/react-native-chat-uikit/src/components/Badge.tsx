import React from 'react';
import { Platform, StyleProp, Text, View, ViewStyle } from 'react-native';

import { useThemeContext } from '../contexts/ThemeContext';
import createStyleSheet from '../styles/createStyleSheet';
import { truncatedBadgeCount } from '../utils/format';

type BadgeProps = {
  count: number;
  maxCount?: number | undefined;
  badgeColor?: string | undefined;
  textColor?: string | undefined;
  style?: StyleProp<ViewStyle> | undefined;
  size?: 'small' | 'default' | undefined;
};

export default function Badge({
  count,
  maxCount,
  badgeColor,
  textColor,
  style,
  size = 'default',
}: BadgeProps): JSX.Element {
  const { colors, fonts } = useThemeContext();
  const isSmall = size === 'small';
  return (
    <View
      style={[
        isSmall ? styles.badgeSmall : styles.badgeDefault,
        {
          backgroundColor: badgeColor ?? colors.badge.background,
        },
        count >= 10 &&
          (isSmall ? styles.badgeSmallPadding : styles.badgeDefaultPadding),
        style,
      ]}
    >
      <Text
        style={[{ color: textColor ?? colors.badge.content }, fonts.caption]}
      >
        {truncatedBadgeCount(count, maxCount)}
      </Text>
    </View>
  );
}

const styles = createStyleSheet({
  badgeDefault: {
    paddingTop: Platform.select({ ios: 2, android: 2 }),
    minWidth: 20,
    minHeight: 20,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDefaultPadding: {
    paddingHorizontal: 8,
  },
  badgeSmall: {
    paddingTop: Platform.select({ ios: 3, android: 2 }),
    minWidth: 16,
    minHeight: 16,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSmallPadding: {
    paddingHorizontal: 4,
  },
});
