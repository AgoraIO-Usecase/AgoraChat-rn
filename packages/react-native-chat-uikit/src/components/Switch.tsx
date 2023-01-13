import React from 'react';
import { Animated, Platform, Pressable } from 'react-native';

import { useThemeContext } from '../contexts/ThemeContext';
import createStyleSheet from '../styles/createStyleSheet';

type SwitchProps = {
  trackColor?: string | undefined;
  thumbColor?: string | undefined;
  inactiveThumbColor?: string | undefined;
  inactiveTrackColor?: string | undefined;
  value: boolean;
  onChangeValue: (val: boolean) => void;
  size?: number | undefined;
};

export default function Switch({
  trackColor,
  thumbColor,
  inactiveThumbColor,
  inactiveTrackColor,
  value,
  onChangeValue,
  size,
}: SwitchProps): JSX.Element {
  const { colors } = useThemeContext();
  const position = React.useRef(new Animated.Value(0)).current;

  const changedStyles = React.useMemo(() => {
    if (size) {
      OFFSET = { H: size, W: size };
      return createStyleSheet({
        container: {
          ...styles.container,
          width: OFFSET.W + OFFSET.H,
          height: OFFSET.H,
        },
        track: {
          ...styles.track,
          borderRadius: OFFSET.H / 2,
        },
        thumb: {
          ...styles.thumb,
          width: OFFSET.W - (OFFSET.W * 0.2 > 1 ? OFFSET.W * 0.2 : 1),
          height: OFFSET.W - (OFFSET.H * 0.2 > 1 ? OFFSET.H * 0.2 : 1),
          borderRadius: OFFSET.W / 2,
        },
        thumbOn: {
          ...styles.thumbOn,
          left: OFFSET.H / 2,
        },
        thumbOff: {
          ...styles.thumbOff,
          left: -OFFSET.H / 2,
        },
      });
    }
    return styles;
  }, [size]);

  React.useEffect(() => {
    const animation = Animated.timing(position, {
      toValue: value ? changedStyles.thumbOn.left : changedStyles.thumbOff.left,
      duration: 150,
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [
    changedStyles.thumbOff.left,
    changedStyles.thumbOn.left,
    position,
    value,
  ]);

  const createInterpolate = <T extends string>(offValue: T, onValue: T) => {
    return position.interpolate({
      inputRange: [changedStyles.thumbOff.left, changedStyles.thumbOn.left],
      outputRange: [offValue, onValue],
      extrapolate: 'clamp',
    });
  };
  const trackColorValue = createInterpolate(
    inactiveTrackColor ?? colors.background,
    trackColor ?? colors.primary
  );
  const thumbColorValue = createInterpolate(
    inactiveThumbColor ?? colors.background,
    thumbColor ?? colors.primary
  );

  return (
    <Pressable
      onPress={() => onChangeValue(!value)}
      style={[changedStyles.container]}
    >
      <Animated.View
        style={[changedStyles.track, { backgroundColor: trackColorValue }]}
      />
      <Animated.View
        style={[
          changedStyles.thumb,
          {
            backgroundColor: thumbColorValue,
            transform: [{ translateX: position }],
          },
        ]}
      />
    </Pressable>
  );
}

let OFFSET = { W: 20, H: 20 };

const styles = createStyleSheet({
  container: {
    width: OFFSET.W + OFFSET.H,
    height: OFFSET.H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    width: '100%',
    height: '100%',
    borderRadius: OFFSET.H / 2,
    position: 'absolute',
  },
  thumb: {
    width: OFFSET.W - (OFFSET.W * 0.2 > 1 ? OFFSET.W * 0.2 : 1),
    height: OFFSET.W - (OFFSET.H * 0.2 > 1 ? OFFSET.H * 0.2 : 1),
    borderRadius: OFFSET.W / 2,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: 'black',
        shadowRadius: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      },
    }),
  },
  thumbOn: {
    left: OFFSET.H / 2,
  },
  thumbOff: {
    left: -OFFSET.H / 2,
  },
});

// type StylesKeys = keyof typeof styles;

// const changeSize = (name: StylesKeys, size?: number | undefined) => {
//   if (size) {
//     OFFSET = { H: size, W: size };
//   }
//   if (name === 'container') {
//     if (size === undefined) {
//       return styles.container;
//     }
//     return {
//       ...styles.container,
//       width: OFFSET.W + OFFSET.H,
//       height: OFFSET.H,
//     };
//   } else if (name === 'track') {
//     if (size === undefined) {
//       return styles.track;
//     }
//     return {
//       ...styles.track,
//       borderRadius: OFFSET.H / 2,
//     };
//   } else if (name === 'thumb') {
//     if (size === undefined) {
//       return styles.thumb;
//     }
//     return {
//       ...styles.thumb,
//       width: OFFSET.W - (OFFSET.W * 0.2 > 1 ? OFFSET.W * 0.2 : 1),
//       height: OFFSET.W - (OFFSET.H * 0.2 > 1 ? OFFSET.H * 0.2 : 1),
//       borderRadius: OFFSET.W / 2,
//     };
//   } else if (name === 'thumbOn') {
//     if (size === undefined) {
//       return styles.thumbOn;
//     }
//     return {
//       ...styles.thumbOn,
//       left: OFFSET.H / 2,
//     };
//   } else if (name === 'thumbOff') {
//     if (size === undefined) {
//       return styles.thumbOff;
//     }
//     return {
//       ...styles.thumbOff,
//       left: -OFFSET.H / 2,
//     };
//   } else {
//     throw new Error('impossible');
//   }
// };
