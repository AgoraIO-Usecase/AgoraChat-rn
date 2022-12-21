import * as React from 'react';
import { Animated, Text } from 'react-native';

import { useThemeContext } from '../contexts/ThemeContext';
import createStyleSheet from '../styles/createStyleSheet';
import type { ToastType } from '../types';
import { LocalIcon } from './Icon';

type ToastProps = React.PropsWithChildren<{
  top?: number | undefined;
  bottom?: number | undefined;
  visible: boolean;
  type: ToastType;
  children: string;
}>;

const useOpacity = () => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const transition = React.useCallback(
    (value: number) =>
      Animated.timing(opacity, {
        toValue: value,
        duration: 500,
        useNativeDriver: true,
      }).start(),
    [opacity]
  );
  return {
    opacity,
    show: () => transition(1),
    hide: () => transition(0),
  };
};

export default function Toast({
  visible,
  type,
  children,
  top,
  bottom,
}: ToastProps): JSX.Element {
  const { colors, fonts } = useThemeContext();
  const { opacity, show, hide } = useOpacity();

  const color = React.useMemo(() => {
    if (type === 'error') {
      return colors.error;
    }
    if (type === 'success') {
      return colors.card;
    }
    return 'transparent';
  }, [colors.card, colors.error, type]);

  const backgroundColor = React.useMemo(() => {
    return colors.background;
  }, [colors.background]);

  React.useEffect(() => {
    const isVisible = (visible: boolean) => (visible ? show() : hide());
    isVisible(visible);
  }, [hide, show, visible]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.toast, { opacity, top, bottom, backgroundColor }]}
    >
      {type !== 'normal' && (
        <LocalIcon
          name={type === 'success' ? 'alert_success' : 'alert_error'}
          color={color}
          containerStyle={styles.icon}
        />
      )}
      <Text
        numberOfLines={2}
        style={[styles.text, { color: colors.primary }, fonts.body]}
      >
        {children}
      </Text>
    </Animated.View>
  );
}

const styles = createStyleSheet({
  toast: {
    position: 'absolute',
    height: 48,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 24,
    flexDirection: 'row',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    maxWidth: 240,
    paddingHorizontal: 4,
  },
  toastPosition: {
    bottom: 60,
  },
});
