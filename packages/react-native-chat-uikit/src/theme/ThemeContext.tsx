import * as React from 'react';

import type { Theme } from '../types';
import LightTheme from './LightTheme';

const ThemeContext = React.createContext<Theme>(LightTheme);

ThemeContext.displayName = 'IMUIKitThemeContext';

export default ThemeContext;
