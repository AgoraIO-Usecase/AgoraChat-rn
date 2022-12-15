import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { useThemeContext } from '../contexts/ThemeContext';
import createStyleSheet from '../styles/createStyleSheet';

type DividerProps = {
  style?: StyleProp<ViewStyle>;
  space?: number;
};

export default function Divider({ style, space }: DividerProps) {
  const { colors } = useThemeContext();
  return (
    <View style={[style, styles.divider, { paddingHorizontal: space }]}>
      <View style={[styles.inner, { backgroundColor: colors.background }]} />
    </View>
  );
}

const styles = createStyleSheet({
  divider: {
    width: '100%',
    height: 1,
  },
  inner: {
    width: '100%',
    height: '100%',
  },
});
