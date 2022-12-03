import * as React from 'react';
import {} from 'react-native';

import type { ProviderProps, Theme } from '../types';
import ThemeContext from './ThemeContext';

type Props = ProviderProps<{
  value: Theme;
}>;

export default function ThemeProvider({ value, children }: Props) {
  console.log('ThemeContext:', ThemeContext.displayName);
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
