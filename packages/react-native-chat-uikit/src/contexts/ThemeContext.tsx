import * as React from 'react';

import LightTheme from '../theme/LightTheme';
import type { ThemeContextType } from '../types';

const ThemeContext = React.createContext<ThemeContextType>(LightTheme);
ThemeContext.displayName = 'IMUIKitThemeContext';

type ThemeType = {
  value: ThemeContextType;
};

type ThemeProps = React.PropsWithChildren<ThemeType>;

export function ThemeProvider({ value, children }: ThemeProps) {
  console.log('ThemeContext:', ThemeContext.displayName);
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextType {
  const theme = React.useContext(ThemeContext);
  if (!theme) throw Error('IMUIKitThemeContext is not provided');
  return theme;
}
