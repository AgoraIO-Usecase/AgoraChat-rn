import en from 'date-fns/locale/en-US';

import type {
  ExtensionStringSet,
  PartialDeep,
  StringSet,
  UIKitStringSet,
} from '../types';
import { messageTimestamp } from '../utils/format';
import type { CreateStringSet, StringSetOptions } from './StringSet.type';

/**
 * Create the translation mapping table.
 *
 * @param param0 params
 * @returns Returns the version of the specified language.
 */
export const createStringSet: CreateStringSet = <T extends {} | undefined>({
  locate,
  overrides,
}: StringSetOptions<T>): StringSet<T> => {
  let o = {};
  if (overrides) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { xxx: _, ttt: __, ...others } = overrides;
    o = { ...others };
  }
  const r = {
    xxx: {
      yyy: 'zs',
      zzz: (a) => messageTimestamp(a, locate),
      ...overrides?.xxx,
    },
    ...o,
  } as UIKitStringSet & ExtensionStringSet<T>;
  return r;
};

export function createStringSetFEn<T extends {} | undefined>(
  params?: PartialDeep<UIKitStringSet> & ExtensionStringSet<T>
): StringSet<T> {
  return createStringSet({ locate: en, overrides: params });
}

export const createStringSetEn = <T extends {} | undefined>(
  params?: PartialDeep<UIKitStringSet> & ExtensionStringSet<T>
): StringSet<T> => {
  return createStringSet({ locate: en, overrides: params });
};
