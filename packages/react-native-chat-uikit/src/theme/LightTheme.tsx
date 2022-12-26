import type { ThemeContextType } from '../types';
import { lightPalette } from '../utils/defaultColorPalette';
import BaseTheme from './BaseTheme';

const LightTheme: ThemeContextType = {
  scheme: 'light',
  paperColors: lightPalette,
  colors: {
    primary: lightPalette.primary,
    background: lightPalette.background,
    text: lightPalette.primary,
    border: lightPalette.secondary,
    card: lightPalette.primaryContainer,
    backdrop: lightPalette.backdrop,
    button: {
      enabled: {
        background: lightPalette.primary,
        content: lightPalette.onPrimary,
      },
      disabled: {
        background: lightPalette.secondary,
        content: lightPalette.onSecondary,
      },
      pressed: {
        background: lightPalette.secondary,
        content: lightPalette.onSecondary,
      },
    },
    input: {
      enabled: {
        background: lightPalette.surfaceVariant,
        text: lightPalette.primary,
        highlight: lightPalette.tertiary,
        placeholder: lightPalette.secondary,
      },
      disabled: {
        background: lightPalette.surfaceVariant,
        text: lightPalette.secondary,
        highlight: lightPalette.secondary,
        placeholder: lightPalette.secondary,
      },
    },
    error: lightPalette.error,
    badge: {
      content: 'white',
      background: 'red',
    },
    avatar: lightPalette.onBackground,
    transparent: 'transparent',
  },
  fonts: BaseTheme.fonts!,
};

export default LightTheme;
