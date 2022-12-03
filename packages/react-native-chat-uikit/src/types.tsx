import type React from 'react';
import type { ChatClient } from 'react-native-chat-sdk';

export type Keyof<T extends {}> = Extract<keyof T, string>;

export type ProviderProps<T extends {}> = Required<React.PropsWithChildren<T>>;

export type Theme = {
  scheme: 'light' | 'dark' | string;
  colors: {
    primary: string;
    background: string;
    text: string;
    border: string;
  };
};

export type ChatSdk = {
  client: ChatClient;
  isLogged: boolean;
};
