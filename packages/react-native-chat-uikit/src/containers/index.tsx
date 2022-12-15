import * as React from 'react';
import { Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { ThemeProvider } from '../contexts/ThemeContext';
import DarkTheme from '../theme/DarkTheme';
import LightTheme from '../theme/LightTheme';
import type { ThemeContextType } from '../types';

export type ContainerProps = React.PropsWithChildren<{
  option?: {
    appKey: string;
    autoLogin: boolean;
  };
  localization?: {};
  theme?: ThemeContextType | undefined;
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
  const t = React.useMemo<ThemeContextType>(() => {
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
    return LightTheme;
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
