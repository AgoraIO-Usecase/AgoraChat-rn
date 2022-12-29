import React from 'react';
import type { ChatClient } from 'react-native-chat-sdk';

import type { ChatSdkContextType } from './types';

export class UIKitChatSdkContext implements ChatSdkContextType {
  client: ChatClient;
  constructor(client: ChatClient) {
    this.client = client;
  }
}

type ImSdkContextProps = React.PropsWithChildren<{ sdk: ChatSdkContextType }>;

const ChatSdkContext = React.createContext<ChatSdkContextType | undefined>(
  undefined
);
ChatSdkContext.displayName = 'UIKitChatSdkContext';

export function ChatSdkContextProvider({ sdk, children }: ImSdkContextProps) {
  return (
    <ChatSdkContext.Provider value={sdk}>{children}</ChatSdkContext.Provider>
  );
}

export function useChatSdkContext(): ChatSdkContextType {
  const sdk = React.useContext(ChatSdkContext);
  if (!sdk) throw Error(`${ChatSdkContext.displayName} is not provided`);
  return sdk;
}
