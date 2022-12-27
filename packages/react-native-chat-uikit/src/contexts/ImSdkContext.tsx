import React from 'react';
import type { ChatClient } from 'react-native-chat-sdk';

import type { ChatSdkContextType } from '../types';

export class UIKitChatSdkContext implements ChatSdkContextType {
  client: ChatClient;
  constructor(client: ChatClient) {
    this.client = client;
  }
}

type ImSdkProps = React.PropsWithChildren<{ sdk: ChatSdkContextType }>;

const ChatSdkContext = React.createContext<ChatSdkContextType | undefined>(
  undefined
);
ChatSdkContext.displayName = 'ChatSdkContext';

export function ChatSdkContextProvider({ sdk, children }: ImSdkProps) {
  return (
    <ChatSdkContext.Provider value={sdk}>{children}</ChatSdkContext.Provider>
  );
}

export function useChatSdkContext(): ChatSdkContextType {
  const sdk = React.useContext(ChatSdkContext);
  if (!sdk) throw Error('IMSDKContext is not provided');
  return sdk;
}
