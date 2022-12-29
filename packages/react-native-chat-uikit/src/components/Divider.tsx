import * as React from 'react';
import { ColorValue, StyleProp, View, ViewStyle } from 'react-native';

import { useThemeContext } from '../contexts/ThemeContext';
import createStyleSheet from '../styles/createStyleSheet';

type DividerProps = {
  style?: StyleProp<ViewStyle> | undefined;
  space?: number | undefined;
  color?: ColorValue | undefined;
};

export default function Divider({ style, space, color }: DividerProps) {
  const { colors } = useThemeContext();
  return (
    <View style={[style, styles.divider, { paddingHorizontal: space }]}>
      <View
        style={[
          styles.inner,
          {
            backgroundColor: color ?? colors.divider,
          },
        ]}
      />
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
