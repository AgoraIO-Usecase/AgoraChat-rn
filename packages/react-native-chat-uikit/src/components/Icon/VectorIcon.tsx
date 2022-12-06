import * as React from 'react';
import { ColorValue, StyleSheet, Text } from 'react-native';

import useTheme from '../../theme/useTheme';

// Optionally require vector-icons referenced from react-native-paper:
// https://github.com/callstack/react-native-paper/blob/4b26429c49053eaa4c3e0fae208639e01093fa87/src/components/MaterialCommunityIcon.tsx#L14
// react-navigation/packages/material-bottom-tabs/src/views/MaterialBottomTabView.tsx
let MaterialCommunityIcons: React.ComponentType<
  React.ComponentProps<
    typeof import('react-native-vector-icons/MaterialCommunityIcons').default
  >
>;

try {
  // Optionally require vector-icons
  MaterialCommunityIcons =
    require('react-native-vector-icons/MaterialCommunityIcons').default;
} catch (e: any) {
  let isErrorLogged = false;

  // Fallback component for icons
  MaterialCommunityIcons = ({
    name,
    color,
    size,
    selectionColor: _0,
    onLayout: _1,
    ...rest
  }) => {
    if (!isErrorLogged) {
      if (
        !/(Cannot find module|Module not found|Cannot resolve module)/.test(
          e.message
        )
      ) {
        console.error(e);
      }

      console.warn(
        `Tried to use the icon '${name}' in a component from '@react-navigation/material-bottom-tabs', but 'react-native-vector-icons/MaterialCommunityIcons' could not be loaded.`,
        `To remove this warning, try installing 'react-native-vector-icons' or use another method to specify icon: https://reactnavigation.org/docs/material-bottom-tab-navigator/#tabbaricon.`
      );

      isErrorLogged = true;
    }

    return (
      // @ts-expect-error: we're passing icon props to text, but we don't care about it since it's just fallback
      <Text
        {...rest}
        style={[
          styles.icon,
          {
            color: typeof color !== 'number' ? color : undefined,
            fontSize: size,
          },
        ]}
      >
        □
      </Text>
    );
  };
}

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
});

export interface IconProps {
  /**
   * Size of the icon, can also be passed as fontSize in the style object.
   *
   * @default 12
   */
  size?: number | undefined;

  /**
   * Name of the icon to show
   *
   * See Icon Explorer app
   *
   * {@link file:///Users/asterisk/Codes/zuoyu/react-native-chat-library/node_modules/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json}
   *
   * {@link https://github.com/oblador/react-native-vector-icons/blob/master/glyphmaps/MaterialCommunityIcons.json}
   */
  name: string;

  /**
   * Color of the icon
   *
   */
  color?: ColorValue | number | undefined;
}

export default function VectorIcon({
  name,
  size,
  color,
}: IconProps): JSX.Element {
  const { colors } = useTheme();
  return (
    <MaterialCommunityIcons
      name={name}
      color={color ?? colors.primary}
      size={size}
      style={styles.icon}
    />
  );
}
