import React from 'react';
import { Animated, Easing, StyleProp, ViewStyle } from 'react-native';

import { useThemeContext } from '../contexts/ThemeContext';
import { LocalIcon, LocalIconName } from './Icon';

type LoadingProps = {
  name?: LocalIconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export default function Loading({
  name = 'loading',
  size = 24,
  color,
  style,
}: LoadingProps): JSX.Element {
  const { colors } = useThemeContext();
  return (
    <Rotate style={style}>
      <LocalIcon name={name} size={size} color={color ?? colors.primary} />
    </Rotate>
  );
}

const useLoopAnimated = (duration: number, useNativeDriver = true) => {
  const animated = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(animated, {
        toValue: 1,
        duration,
        useNativeDriver,
        easing: Easing.inOut(Easing.linear),
      }),
      { resetBeforeIteration: true }
    ).start();

    return () => {
      animated.stopAnimation();
      animated.setValue(0);
    };
  }, [animated, duration, useNativeDriver]);

  return animated;
};

const Rotate = ({
  children,
  style,
}: React.PropsWithChildren<{ style: StyleProp<ViewStyle> }>) => {
  const loop = useLoopAnimated(1000);
  const rotate = loop.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  return (
    <Animated.View style={[style, { transform: [{ rotate }] }]}>
      {children}
    </Animated.View>
  );
};
