import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import createStyleSheet from '../styles/createStyleSheet';
import useTheme from '../theme/useTheme';

type DialogBoxProps = React.PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;
const DialogBox = ({ style, children }: DialogBoxProps) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.card }, style]}>
      {children}
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    width: 280,
    borderRadius: 4,
  },
});

export default DialogBox;
