import type { ThemeContextType } from '../contexts';
import { darkPalette } from '../utils/defaultColorPalette';
import BaseTheme from './BaseTheme';

const DarkTheme: ThemeContextType = {
  scheme: 'dark',
  paperColors: darkPalette,
  colors: {
    primary: darkPalette.primary,
    background: darkPalette.background,
    text: darkPalette.primary,
    border: darkPalette.secondary,
    backdrop: darkPalette.backdrop,
    button: {
      enabled: {
        background: darkPalette.primary,
        content: darkPalette.onPrimary,
      },
      disabled: {
        background: darkPalette.secondary,
        content: darkPalette.onSecondary,
      },
      pressed: {
        background: darkPalette.secondary,
        content: darkPalette.onSecondary,
      },
    },
    input: {
      enabled: {
        background: darkPalette.background,
        text: darkPalette.primary,
        highlight: darkPalette.tertiary,
        placeholder: darkPalette.secondary,
      },
      disabled: {
        background: darkPalette.background,
        text: darkPalette.secondary,
        highlight: darkPalette.secondary,
        placeholder: darkPalette.secondary,
      },
    },
    error: darkPalette.error,
    badge: {
      content: 'white',
      background: 'red',
    },
    avatar: darkPalette.onBackground,
    transparent: 'transparent',
    card: {
      background: darkPalette.card.background,
      title: darkPalette.card.title,
      body: darkPalette.card.body,
      button: darkPalette.card.button,
    },
    divider: darkPalette.divider,
  },
  fonts: BaseTheme.fonts!,
};

export default DarkTheme;
