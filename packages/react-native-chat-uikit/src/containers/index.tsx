import * as React from 'react';
import { Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { HeaderStyleProvider } from '../contexts/HeaderContext';
import { I18nContextProvider } from '../contexts/I18nContext';
import { ChatSdkContextProvider } from '../contexts/ImSdkContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import type {
  ClipboardService,
  MediaService,
  NotificationService,
  PermissionService,
} from '../services';
import type {
  ChatSdkContextType,
  HeaderContextType,
  StringSetContextType,
  ThemeContextType,
} from '../types';

export type ContainerProps = React.PropsWithChildren<{
  option: {
    appKey: string;
    autoLogin: boolean;
  };
  localization?: StringSetContextType | undefined;
  theme?: ThemeContextType | undefined;
  sdk?: ChatSdkContextType | undefined;
  header?: HeaderContextType | undefined;
  services?: {
    clipboard?: ClipboardService | undefined;
    media?: MediaService | undefined;
    notification?: NotificationService | undefined;
    permission?: PermissionService | undefined;
  };
}>;

export function Container({
  option,
  localization,
  theme,
  sdk,
  header,
  services,
  children,
}: ContainerProps): JSX.Element {
  console.log(option, localization, theme, sdk, header, services);

  if (theme === undefined) {
    throw new Error('theme is undefined.');
  }

  if (localization === undefined) {
    throw new Error('localization is undefined.');
  }

  if (sdk === undefined) {
    throw new Error('sdk is undefined.');
  }

  if (header === undefined) {
    throw new Error('header is undefined.');
  }

  if (services === undefined) {
    throw new Error('services is undefined.');
  }

  if (services?.clipboard === undefined) {
    throw new Error('clipboard is undefined.');
  }

  if (services?.media === undefined) {
    throw new Error('media is undefined.');
  }

  if (services?.notification === undefined) {
    throw new Error('notification is undefined.');
  }

  if (services?.permission === undefined) {
    throw new Error('permission is undefined.');
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={theme}>
        <I18nContextProvider i18n={localization}>
          <HeaderStyleProvider
            defaultStatusBarTranslucent={header.defaultStatusBarTranslucent}
            defaultTitleAlign={header.defaultTitleAlign}
          >
            <ChatSdkContextProvider sdk={sdk}>
              {children ? (
                children
              ) : (
                <SafeAreaView edges={['right', 'bottom', 'left']}>
                  <Text style={{ backgroundColor: theme.colors.error }}>
                    children node is empty.
                  </Text>
                </SafeAreaView>
              )}
            </ChatSdkContextProvider>
          </HeaderStyleProvider>
        </I18nContextProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
