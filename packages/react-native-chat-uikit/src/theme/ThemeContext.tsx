import * as React from 'react';

import type { Theme } from '../types';
import DefaultTheme from './DefaultTheme';

const ThemeContext = React.createContext<Theme>(DefaultTheme);

ThemeContext.displayName = 'IMUIKitThemeContext';

export default ThemeContext;
