import React from 'react';

import type { ChatSdk, ProviderProps } from '../types';

type Props = ProviderProps<{
  sdk: ChatSdk;
}>;

const ChatSdkContext = React.createContext<ChatSdk | undefined>(undefined);

export function ChatSdkContextProvider({ sdk, children }: Props) {
  return (
    <ChatSdkContext.Provider value={sdk}>{children}</ChatSdkContext.Provider>
  );
}

export function useChatSdk() {
  const sdk = React.useContext(ChatSdkContext);
  if (!sdk) throw Error('IMSDKContext is not provided');
  return sdk;
}
