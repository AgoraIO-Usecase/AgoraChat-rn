import type { Locale } from 'date-fns';

import type { StringSetContextType } from '../contexts';

export type StringSetOptions = {
  locate: Locale;
  overrides?: StringSetContextType;
};

export type CreateStringSet = ({
  locate,
  overrides,
}: StringSetOptions) => StringSetContextType;
