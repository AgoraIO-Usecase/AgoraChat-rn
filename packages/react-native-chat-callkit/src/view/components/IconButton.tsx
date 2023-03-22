import * as React from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';

import { IconName, LocalIcon } from './LocalIcon';

type IconButtonProps = {
  disabled?: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  color?: string;
  backgroundColor?: string;
  iconName?: IconName;
  size?: number;
  containerSize?: number;
};

export function IconButton(props: IconButtonProps): JSX.Element {
  const {
    disabled,
    onPress,
    color,
    backgroundColor,
    iconName,
    size,
    containerSize,
  } = props;
  const clickTimeoutRef = React.useRef(true);
  const onPressInternal = (event: GestureResponderEvent) => {
    if (clickTimeoutRef.current === true) {
      clickTimeoutRef.current = false;
      setTimeout(() => {
        clickTimeoutRef.current = true;
      }, 1000);
      onPress?.(event);
    }
  };
  return (
    <TouchableOpacity
      style={{
        height: containerSize ?? 64,
        width: containerSize ?? 64,
        backgroundColor: backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: containerSize ? containerSize / 2 : undefined,
      }}
      disabled={disabled}
      onPress={onPressInternal}
    >
      <LocalIcon
        name={iconName ?? 'default_avatar'}
        color={color}
        size={size}
      />
    </TouchableOpacity>
  );
}
