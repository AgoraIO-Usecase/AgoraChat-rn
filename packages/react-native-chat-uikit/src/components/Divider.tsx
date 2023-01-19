import * as React from 'react';
import { ColorValue, StyleProp, View, ViewStyle } from 'react-native';

import { useThemeContext } from '../contexts/ThemeContext';
import createStyleSheet from '../styles/createStyleSheet';

type DividerProps = {
  style?: StyleProp<ViewStyle> | undefined;
  space?: number | undefined;
  color?: ColorValue | undefined;
  height?: number | undefined;
  marginLeft?: number | undefined;
  marginRight?: number | undefined;
};

export default function Divider({
  style,
  space,
  color,
  height,
  marginLeft,
  marginRight,
}: DividerProps) {
  const { colors } = useThemeContext();
  return (
    <View
      style={[
        styles.divider,
        style,
        {
          paddingHorizontal: space,
          height: height,
          marginLeft: marginLeft,
          marginRight: marginRight,
        },
      ]}
    >
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
    // width: '100%',
    height: 1,
    marginLeft: 0,
    marginRight: 0,
  },
  inner: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
