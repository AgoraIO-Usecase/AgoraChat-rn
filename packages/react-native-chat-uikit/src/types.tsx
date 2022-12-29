import type { TextStyle } from 'react-native';
import type { ChatClient } from 'react-native-chat-sdk';

import type { darkPalette, lightPalette } from './utils/defaultColorPalette';

export type Keyof<T extends {}> = Extract<keyof T, string>;
export type Nullable<T> = T | null;
export type Undefinable<T> = T | undefined;
export type PartialNullable<T> = {
  [P in keyof T]?: T[P] | null;
};

export type PartialDeep<T> = T extends object
  ? T extends Function
    ? T
    : {
        [P in keyof T]?: PartialDeep<T[P]>;
      }
  : T;

export type RequiredDeep<T> = T extends object
  ? T extends Function
    ? T
    : {
        [P in keyof T]-?: RequiredDeep<T[P]>;
      }
  : T;

export type ColorPaletteType = typeof lightPalette | typeof darkPalette;

export type FontAttributes = Pick<
  TextStyle,
  'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'fontWeight'
>;

export type ItemColor = {
  background: string;
  content: string;
};

export type InputColor = {
  background: string;
  text: string;
  highlight: string;
  placeholder: string;
};

export type ButtonColor = {
  disabled: ItemColor;
  enabled: ItemColor;
  pressed: ItemColor;
};

export type ToastType = 'normal' | 'error' | 'success';
export type ToastContextType = { show(text: string, type?: ToastType): void };

export type ThemeContextType = {
  scheme: 'light' | 'dark' | string;
  paperColors: ColorPaletteType;
  colors: {
    primary: string;
    background: string;
    text: string;
    border: string;
    backdrop: string;
    button: ButtonColor;
    input: {
      enabled: InputColor;
      disabled: InputColor;
    };
    error: string;
    badge: ItemColor;
    avatar: string;
    transparent: 'transparent';
    card: {
      background: string;
      title: string;
      body: string;
      button: string;
    };
    divider: string;
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

export interface ChatSdkContextType {
  client: ChatClient;
}

export type HeaderContextType = {
  defaultHeight: number;
  defaultStatusBarTranslucent: boolean;
  defaultTitleAlign: 'left' | 'center';
  defaultTopInset: number;
};

export type UIKitStringSet = {
  xxx: {
    yyy: string;
    zzz: (a: Date) => string;
  };
  ttt: {
    yyy: string;
  };
};

export type ExtensionStringSet<T extends {} | undefined> = Omit<
  T,
  keyof UIKitStringSet
>;

export type StringSet<T extends {} | undefined> = UIKitStringSet &
  ExtensionStringSet<T>;

export interface StringSetContextType {
  xxx: {
    yyy: string;
    zzz: (a: Date) => string;
  };
  ttt: {
    yyy: string;
  };
}
