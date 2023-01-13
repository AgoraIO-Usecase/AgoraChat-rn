import type { ThemeContextType } from '../contexts';
import { defaultScaleFactor } from '../styles/createScaleFactor';

const BaseTheme: Partial<ThemeContextType> = {
  fonts: {
    primary: {
      fontWeight: 'normal',
      fontSize: defaultScaleFactor(16),
      lineHeight: defaultScaleFactor(20),
    },
    button: {
      fontWeight: 'bold',
      fontSize: defaultScaleFactor(14),
      lineHeight: defaultScaleFactor(16),
      letterSpacing: defaultScaleFactor(0.4),
    },
    input: {
      fontWeight: 'normal',
      fontSize: defaultScaleFactor(16),
      lineHeight: defaultScaleFactor(20),
    },
    title: {
      fontWeight: '600',
      fontSize: defaultScaleFactor(16),
      lineHeight: defaultScaleFactor(20),
      letterSpacing: defaultScaleFactor(-0.2),
    },
    subtitle: {
      fontWeight: 'normal',
      fontSize: defaultScaleFactor(16),
      lineHeight: defaultScaleFactor(22),
    },
    body: {
      fontWeight: 'normal',
      fontSize: defaultScaleFactor(16),
      lineHeight: defaultScaleFactor(20),
    },
    caption: {
      fontWeight: 'normal',
      fontSize: defaultScaleFactor(12),
      lineHeight: defaultScaleFactor(12),
    },
    sheet: {
      fontWeight: '600',
      fontSize: defaultScaleFactor(16),
      lineHeight: defaultScaleFactor(22),
    },
  },
};
export default BaseTheme;
