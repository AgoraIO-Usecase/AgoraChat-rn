import React from 'react';
import { Platform, StyleProp, Text, View, ViewStyle } from 'react-native';

import { useThemeContext } from '../contexts/ThemeContext';
import createStyleSheet from '../styles/createStyleSheet';
import { truncatedBadgeCount } from '../utils/format';

type BadgeProps = {
  count?: number;
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
        count !== undefined
          ? isSmall
            ? styles.badgeSmall
            : styles.badgeDefault
          : styles.badgeDotSmall,
        {
          backgroundColor: badgeColor ?? colors.badge.background,
        },
        count !== undefined
          ? count >= 10 &&
            (isSmall ? styles.badgeSmallPadding : styles.badgeDefaultPadding)
          : styles.badgeSmallPadding,
        style,
      ]}
    >
      {count !== undefined ? (
        <Text
          style={[{ color: textColor ?? colors.badge.content }, fonts.caption]}
        >
          {truncatedBadgeCount(count, maxCount)}
        </Text>
      ) : null}
    </View>
  );
}

const styles = createStyleSheet({
  badgeDefault: {
    paddingTop: Platform.select({ ios: 2, android: 2 }),
    minWidth: 19,
    minHeight: 19,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDefaultPadding: {
    paddingHorizontal: 6,
  },
  badgeSmall: {
    paddingTop: Platform.select({ ios: 3, android: 2 }),
    minWidth: 16,
    minHeight: 16,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDotSmall: {
    minWidth: 10,
    minHeight: 10,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSmallPadding: {
    paddingHorizontal: 4,
  },
});
