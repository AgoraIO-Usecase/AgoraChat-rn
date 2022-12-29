import type { TextStyle } from 'react-native';

import type { ActionMenuItem } from './components/ActionMenu';
import type { AlertItem } from './components/Alert';
import type { BottomSheetItem } from './components/BottomSheet';
import type { PromptItem } from './components/Prompt';
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

export type DialogTask =
  | {
      type: 'ActionMenu';
      props: ActionMenuItem;
    }
  | {
      type: 'Alert';
      props: AlertItem;
    }
  | {
      type: 'Prompt';
      props: PromptItem;
    }
  | {
      type: 'BottomSheet';
      props: BottomSheetItem;
    };

export type DialogPropsT<
  T extends DialogTask['type'],
  U extends DialogTask = DialogTask
> = U extends { type: T; props: infer P } ? P : never;
