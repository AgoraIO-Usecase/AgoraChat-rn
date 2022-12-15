import React from 'react';
import { Pressable, StyleProp, Text, ViewStyle } from 'react-native';

import { useThemeContext } from '../contexts/ThemeContext';
import createStyleSheet from '../styles/createStyleSheet';
import type { ButtonColor } from '../types';
import type { LocalIconName } from './Icon';
import { LocalIcon } from './Icon';

type ButtonProps = React.PropsWithChildren<{
  icon?: LocalIconName | undefined;
  disabled?: boolean | undefined;
  onPress?: () => void | undefined;
  style?: StyleProp<ViewStyle> | undefined;
  color?: Partial<ButtonColor> | undefined;
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
    if (disabled) return colors.button.disabled;
    if (pressed) return colors.button.pressed;
    return colors.button.enabled;
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => {
        const s = getStateColor(pressed, disabled);
        return [
          { backgroundColor: color?.background ?? s.background },
          styles.container,
          style,
        ];
      }}
    >
      {({ pressed }) => {
        const s = getStateColor(pressed, disabled);

        return (
          <>
            {icon && (
              <LocalIcon
                size={24}
                name={icon}
                color={color?.content ?? s.content}
                parentStyle={styles.icon}
              />
            )}
            <Text
              style={[
                styles.text,
                { color: color?.content ?? s.content },
                fonts.button,
              ]}
            >
              {children}
            </Text>
          </>
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
