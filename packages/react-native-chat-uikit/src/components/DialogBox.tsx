import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { useThemeContext } from '../contexts/ThemeContext';
import createStyleSheet from '../styles/createStyleSheet';

type DialogBoxProps = React.PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;
const DialogBox = ({ style, children }: DialogBoxProps) => {
  const { colors } = useThemeContext();
  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }, style]}
    >
      {children}
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    width: 270,
    borderRadius: 14,
  },
});

export default DialogBox;
