import type { TextStyle } from 'react-native';
import type { ChatClient } from 'react-native-chat-sdk';

import type { ColorPaletteType } from './utils/defaultColorPalette';

export type Keyof<T extends {}> = Extract<keyof T, string>;

export type FontAttributes = Pick<
  TextStyle,
  'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'fontWeight'
>;

export type ButtonColor = {
  background: string;
  content: string;
};

export type InputColor = {
  background: string;
  text: string;
  highlight: string;
  placeholder: string;
};

export type ThemeContextType = {
  scheme: 'light' | 'dark' | string;
  paperColors: ColorPaletteType;
  colors: {
    primary: string;
    background: string;
    text: string;
    border: string;
    card: string;
    backdrop: string;
    button: {
      disabled: ButtonColor;
      enabled: ButtonColor;
      pressed: ButtonColor;
    };
    input: {
      enabled: InputColor;
      disabled: InputColor;
    };
  };
  fonts: {
    primary: FontAttributes;
    button: FontAttributes;
    input: FontAttributes;
    title: FontAttributes;
    subtitle: FontAttributes;
    body: FontAttributes;
    caption: FontAttributes;
  };
};

export type ChatSdkContextType = {
  client: ChatClient;
  isLogged: boolean;
};

export type HeaderContextType = {
  defaultHeight: number;
  defaultStatusBarTranslucent: boolean;
  defaultTitleAlign: 'left' | 'center';
  defaultTopInset: number;
};
