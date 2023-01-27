import type { ChatClient } from 'react-native-chat-sdk';

import type {
  ButtonStateColor,
  ColorPaletteType,
  ContentStateProps,
  DialogPropsT,
  FontAttributes,
  InputStateColor,
  ItemColor,
  ToastType,
} from '../types';

export type ThemeContextType = {
  scheme: 'light' | 'dark' | string;
  paperColors: ColorPaletteType;
  colors: {
    primary: string;
    background: string;
    text: string;
    border: string;
    backdrop: string;
    button: ButtonStateColor;
    input: InputStateColor;
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
    sheet: FontAttributes;
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

export interface StringSetContextType {
  xxx: {
    yyy: string;
    zzz: (a: Date) => string;
  };
  ttt: {
    yyy: string;
  };
}

export type ToastContextType = {
  showToast(text: string, type?: ToastType): void;
};

export type DialogContextType = {
  openMenu: (props: DialogPropsT<'ActionMenu'>) => void;
  openAlert: (props: DialogPropsT<'Alert'>) => void;
  openPrompt: (props: DialogPropsT<'Prompt'>) => void;
  openSheet: (props: DialogPropsT<'BottomSheet'>) => void;
};

export type VoiceStateContextType = {
  showState: (props?: ContentStateProps) => void;
  hideState: () => void;
};
