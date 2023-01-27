import * as React from 'react';
import { useWindowDimensions, View } from 'react-native';

import { useThemeContext } from '../contexts';
import createStyleSheet from '../styles/createStyleSheet';
import type { ContentStateProps } from '../types';

export default function ContentState(props: ContentStateProps): JSX.Element {
  const { colors } = useThemeContext();
  const { container, children } = props;
  const { width, height } = useWindowDimensions();
  return (
    <View
      pointerEvents="none"
      style={[
        { backgroundColor: colors.backdrop, width: width, height: height },
        styles.container,
        container,
      ]}
    >
      {children}
    </View>
  );
}

const styles = createStyleSheet({
  container: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
