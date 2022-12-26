import type { Locale } from 'date-fns';
import en from 'date-fns/locale/en-US';

import type { StringSetContextType } from '../types';
import { messageTimestamp } from '../utils/format';
import type { CreateStringSet, StringSetOptions } from './CStringSet.type';

export class UIKitStringSet implements StringSetContextType {
  xxx: { yyy: string; zzz: (a: Date) => string };
  ttt: { yyy: string };
  constructor(locate: Locale) {
    this.xxx = {
      yyy: 'zs',
      zzz: (a) => messageTimestamp(a, locate),
    };
    this.ttt = {
      yyy: 'ls',
    };
  }
}

/**
 * Create the translation mapping table.
 *
 * @param param0 params
 * @returns Returns the version of the specified language.
 */
export const createStringSet: CreateStringSet = ({
  locate,
  overrides,
}: StringSetOptions): StringSetContextType => {
  if (overrides) {
    return overrides;
  }
  return new UIKitStringSet(locate);
};

export function createStringSetFEn(
  params?: StringSetContextType
): StringSetContextType {
  return createStringSet({ locate: en, overrides: params });
}

export const createStringSetEn = (params?: StringSetContextType) => {
  return createStringSet({ locate: en, overrides: params });
};
