import * as React from 'react';

import type { StringSetContextType } from '../types';

const StringSetContext = React.createContext<StringSetContextType | undefined>(
  undefined
);
StringSetContext.displayName = 'StringSetContext';

type I18nProps = React.PropsWithChildren<{ i18n: StringSetContextType }>;

export function I18nContextProvider({ i18n, children }: I18nProps) {
  return (
    <StringSetContext.Provider value={i18n}>
      {children}
    </StringSetContext.Provider>
  );
}

export function useI18nContext(): StringSetContextType {
  const i18n = React.useContext(StringSetContext);
  if (!i18n) throw Error('StringSetContext is not provided');
  return i18n;
}
