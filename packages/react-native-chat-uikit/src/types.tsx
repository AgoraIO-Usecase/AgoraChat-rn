import type React from 'react';
import type { TextStyle } from 'react-native';
import type { ChatClient } from 'react-native-chat-sdk';

export type Keyof<T extends {}> = Extract<keyof T, string>;

export type ProviderProps<T extends {}> = Required<React.PropsWithChildren<T>>;

export type FontAttributes = Pick<
  TextStyle,
  'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'fontWeight'
>;

export type Theme = {
  scheme: 'light' | 'dark' | string;
  colors: {
    primary: string;
    background: string;
    text: string;
    border: string;
    card: string;
    mask: string;
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

export type ChatSdk = {
  client: ChatClient;
  isLogged: boolean;
};
