import * as React from 'react';

import LightTheme from '../theme/LightTheme';
import type { ThemeContextType } from './types';

const ThemeContext = React.createContext<ThemeContextType>(LightTheme);
ThemeContext.displayName = 'IMUIKitThemeContext';

type ThemeType = {
  value: ThemeContextType;
};

type ThemeContextProps = React.PropsWithChildren<ThemeType>;

export function ThemeContextProvider({ value, children }: ThemeContextProps) {
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/**
 * Use theme components.
 */
export function useThemeContext(): ThemeContextType {
  const theme = React.useContext(ThemeContext);
  if (!theme) throw Error(`${ThemeContext.displayName} is not provided`);
  return theme;
}
