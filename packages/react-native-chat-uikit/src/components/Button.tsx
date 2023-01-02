import React from 'react';
import { Pressable, StyleProp, Text, ViewStyle } from 'react-native';

import { useThemeContext } from '../contexts/ThemeContext';
import createStyleSheet from '../styles/createStyleSheet';
import type { ButtonStateColor } from '../types';
import type { LocalIconName } from './Icon';
import { LocalIcon } from './Icon';

type ButtonProps = React.PropsWithChildren<{
  icon?: LocalIconName | undefined;
  disabled?: boolean | undefined;
  onPress?: () => void | undefined;
  style?: StyleProp<ViewStyle> | undefined;
  color?: Partial<ButtonStateColor> | undefined;
}>;
export default function Button({
  icon,
  disabled,
  onPress,
  style,
  color,
  children,
}: ButtonProps): JSX.Element {
  const { colors, fonts } = useThemeContext();

  const getStateColor = (pressed: boolean, disabled?: boolean) => {
    if (disabled) {
      if (color?.disabled !== undefined) {
        return color.disabled;
      }
      return colors.button.disabled;
    }
    if (pressed) {
      if (color?.pressed !== undefined) {
        return color.pressed;
      }
      return colors.button.pressed;
    }
    if (color?.enabled !== undefined) {
      return color.enabled;
    }
    return colors.button.enabled;
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => {
        const s = getStateColor(pressed, disabled);
        return [{ backgroundColor: s.background }, styles.container, style];
      }}
    >
      {({ pressed }) => {
        const s = getStateColor(pressed, disabled);

        return (
          <React.Fragment>
            {icon && (
              <LocalIcon
                size={24}
                name={icon}
                color={s.content}
                containerStyle={styles.icon}
              />
            )}
            <Text style={[styles.text, { color: s.content }, fonts.button]}>
              {children}
            </Text>
          </React.Fragment>
        );
      }}
    </Pressable>
  );
}

const styles = createStyleSheet({
  container: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { marginVertical: -4, marginRight: 8 },
  text: {},
});
