import * as uikit from 'react-native-chat-uikit';

import type { AppStringSet } from '../I18n/AppCStringSet.en';

export function useAppI18nContext(): AppStringSet {
  const i18n = uikit.useI18nContext() as AppStringSet;
  if (!i18n) throw Error('StringSetContext is not provided');
  return i18n;
}
