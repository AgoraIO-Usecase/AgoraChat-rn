import type { ThemeContextType } from '../types';
import { lightPalette } from '../utils/defaultColorPalette';
import BaseTheme from './BaseTheme';

const LightTheme: ThemeContextType = {
  scheme: 'light',
  paperColors: lightPalette,
  colors: {
    primary: lightPalette.primary,
    background: lightPalette.onPrimary,
    text: lightPalette.primary,
    border: lightPalette.secondary,
    backdrop: lightPalette.backdrop,
    button: {
      enabled: {
        background: lightPalette.button.enabled.background,
        content: lightPalette.button.enabled.content,
      },
      disabled: {
        background: lightPalette.button.disabled.background,
        content: lightPalette.button.disabled.content,
      },
      pressed: {
        background: lightPalette.button.pressed.background,
        content: lightPalette.button.pressed.content,
      },
    },
    input: {
      enabled: {
        background: lightPalette.input.background,
        text: lightPalette.input.text,
        highlight: lightPalette.input.highlight,
        placeholder: lightPalette.input.placeholder,
      },
      disabled: {
        background: lightPalette.input.background,
        text: lightPalette.input.text,
        highlight: lightPalette.input.highlight,
        placeholder: lightPalette.input.placeholder,
      },
    },
    error: lightPalette.error,
    badge: {
      content: 'white',
      background: 'red',
    },
    avatar: lightPalette.onBackground,
    transparent: 'transparent',
    card: {
      background: lightPalette.card.background,
      title: lightPalette.card.title,
      body: lightPalette.card.body,
      button: lightPalette.card.button,
    },
    divider: lightPalette.divider,
  },
  fonts: BaseTheme.fonts!,
};

export default LightTheme;
