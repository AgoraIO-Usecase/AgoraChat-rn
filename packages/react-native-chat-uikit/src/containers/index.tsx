import * as React from 'react';
import { Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import DarkTheme from '../theme/DarkTheme';
import DefaultTheme from '../theme/DefaultTheme';
import LightTheme from '../theme/LightTheme';
import ThemeProvider from '../theme/ThemeProvider';
import type { Theme } from '../types';

export type ContainerProps = React.PropsWithChildren<{
  option?: {
    appKey: string;
    autoLogin: boolean;
  };
  localization?: {};
  theme?: Theme | undefined;
  context?: {};
  hook?: {};
  service?: {};
  sdk?: {};
}>;

export function Container({
  option,
  localization,
  theme,
  context,
  hook,
  service,
  sdk,
  children,
}: ContainerProps): JSX.Element {
  console.log(option, localization, theme, context, hook, service, sdk);
  const t = React.useMemo<Theme>(() => {
    console.log('test:Container:', theme);
    if (theme) {
      if (theme.scheme === 'light') {
        return LightTheme;
      } else if (theme.scheme === 'dark') {
        console.log('1');
        return DarkTheme;
      } else {
        return theme;
      }
    }
    return DefaultTheme;
  }, [theme]);
  // return (
  //   <ThemeProvider value={t}>
  //     {children ? (
  //       children
  //     ) : (
  //       <Text style={{ backgroundColor: t.colors.background }}>
  //         children node is empty.
  //       </Text>
  //     )}
  //   </ThemeProvider>
  // );
  return (
    <SafeAreaProvider>
      <ThemeProvider value={t}>
        {children ? (
          children
        ) : (
          <SafeAreaView edges={['right', 'bottom', 'left']}>
            <Text style={{ backgroundColor: t.colors.background }}>
              children node is empty.
            </Text>
          </SafeAreaView>
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
