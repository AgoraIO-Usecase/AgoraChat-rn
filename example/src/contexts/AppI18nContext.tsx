import * as uikit from 'react-native-chat-uikit';

import type { AppUIKitStringSet } from '../I18n/AppCStringSet.en';

export function useAppI18nContext(): AppUIKitStringSet {
  const i18n = uikit.useI18nContext() as AppUIKitStringSet;
  if (!i18n) throw Error('StringSetContext is not provided');
  return i18n;
}
