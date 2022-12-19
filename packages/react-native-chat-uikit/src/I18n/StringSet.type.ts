import type { Locale } from 'date-fns';

import type {
  ExtensionStringSet,
  PartialDeep,
  StringSet,
  UIKitStringSet,
} from '../types';

export type StringSetOptions<T extends {} | undefined> = {
  locate: Locale;
  overrides?: PartialDeep<UIKitStringSet> & ExtensionStringSet<T>;
};

export type CreateStringSet = <T extends {} | undefined>({
  locate,
  overrides,
}: StringSetOptions<T>) => StringSet<T>;
