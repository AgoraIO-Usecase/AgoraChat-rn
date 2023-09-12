import React from 'react';
import type { ChatMessageChatType } from 'react-native-chat-sdk';

import type { ChatSdkChatContextType } from './types';

export class UIKitChatSdkChatContext implements ChatSdkChatContextType {
  chatId: string;
  chatType: ChatMessageChatType;
  setChat: (params: { chatId: string; chatType: ChatMessageChatType }) => void;
  getChat: () => { chatId: string; chatType: ChatMessageChatType };
  constructor(params: { chatId: string; chatType: ChatMessageChatType }) {
    this.chatId = params.chatId;
    this.chatType = params.chatType;
    this.setChat = (params: {
      chatId: string;
      chatType: ChatMessageChatType;
    }) => {
      this.chatId = params.chatId;
      this.chatType = params.chatType;
    };
    this.getChat = () => {
      return {
        chatId: this.chatId,
        chatType: this.chatType,
      };
    };
  }
}

type ImSdkChatContextProps = React.PropsWithChildren<{
  chat: ChatSdkChatContextType;
}>;

const ChatSdkChatContext = React.createContext<
  ChatSdkChatContextType | undefined
>(undefined);
ChatSdkChatContext.displayName = 'UIKitChatSdkChatContext';

export function ChatSdkChatContextProvider({
  chat,
  children,
}: ImSdkChatContextProps) {
  return (
    <ChatSdkChatContext.Provider value={chat}>
      {children}
    </ChatSdkChatContext.Provider>
  );
}

/**
 * Components packaged by chat sdk. Typical application scenarios: Encapsulate methods such as login and logout to facilitate the use of UI components.
 */
export function useChatSdkChatContext(): ChatSdkChatContextType {
  const chat = React.useContext(ChatSdkChatContext);
  if (!chat) throw Error(`${ChatSdkChatContext.displayName} is not provided`);
  return chat;
}
