import React from 'react';
import { StatusBar, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import defaultHeaderHeight from '../utils/defaultHeaderHeight';
import type { HeaderContextType } from './types';

export const HeaderContext = React.createContext<HeaderContextType>({
  defaultHeight: defaultHeaderHeight(false),
  defaultStatusBarTranslucent: true,
  defaultTitleAlign: 'left',
  defaultTopInset: StatusBar.currentHeight ?? 0,
});
HeaderContext.displayName = 'UIKitHeaderContext';

type HeaderProps = React.PropsWithChildren<
  Pick<HeaderContextType, 'defaultStatusBarTranslucent' | 'defaultTitleAlign'>
>;

export const HeaderStyleProvider = ({
  children,
  defaultTitleAlign: titleAlign,
  defaultStatusBarTranslucent: statusBarTranslucent,
}: HeaderProps) => {
  const { top } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  return (
    <HeaderContext.Provider
      value={{
        defaultTitleAlign: titleAlign,
        defaultStatusBarTranslucent: statusBarTranslucent,
        defaultTopInset: statusBarTranslucent ? top : 0,
        defaultHeight: defaultHeaderHeight(width > height),
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

/**
 * header style data.
 */
export function useHeaderContext(): HeaderContextType {
  const header = React.useContext(HeaderContext);
  if (!header) throw Error(`${HeaderContext.displayName} is not provided`);
  return header;
}
