import * as React from 'react';
import type { TextInput as RNTextInput } from 'react-native';
import type { ChatConversationType, ChatMessage } from 'react-native-chat-sdk';

import {
  ChatSdkChatContextProvider,
  UIKitChatSdkChatContext,
} from '../contexts';
import { ChatContent, ChatContentRef } from './ChatContent';
import type {
  CustomMessageItemType,
  MessageBubbleListProps,
  MessageBubbleListRef,
  MessageItemType,
} from './MessageBubbleList';

export type BaseProps = {
  onFace?: (value?: 'face' | 'key') => void;
  inputRef?: React.RefObject<RNTextInput>;
};

// const sendEventFromChat = (
//   params: Omit<sendEventProps, 'senderId' | 'timestamp' | 'eventBizType'>
// ) => {
//   sendEvent({
//     ...params,
//     senderId: 'ChatFragment',
//     eventBizType: 'chat',
//   } as sendEventProps);
// };

/**
 * ChatFragment controller
 */
export type ChatFragmentRef = {
  /**
   * Insert a local message.
   *
   * Typical application: Add prompt messages.
   */
  insertMessage: (params: { msg: ChatMessage }) => void;
  /**
   * send image message
   */
  sendImageMessage: (
    params: {
      name: string;
      localPath: string;
      fileSize: number;
      imageType: string;
      width: number;
      height: number;
      onResult?: (params: any) => void;
    }[]
  ) => void;
  /**
   * send voice message
   */
  sendVoiceMessage: (params: {
    localPath: string;
    fileSize?: number;
    duration?: number;
    onResult?: (params: any) => void;
  }) => void;

  /**
   * send a text message.
   */
  sendTextMessage: (params: {
    content: string;
    onResult?: (params: any) => void;
  }) => void;

  /**
   * send a custom message.
   */
  sendCustomMessage: (params: {
    data: CustomMessageItemType;
    onResult?: (params: any) => void;
  }) => void;

  /**
   * send a file message.
   */
  sendFileMessage: (params: {
    localPath: string;
    fileSize?: number;
    displayName?: string;
    onResult?: (params: any) => void;
  }) => void;

  /**
   * send a video message.
   */
  sendVideoMessage: (params: {
    localPath: string;
    fileSize?: number;
    displayName?: string;
    duration: number;
    thumbnailLocalPath?: string;
    width?: number;
    height?: number;
    onResult?: (params: any) => void;
  }) => void;

  /**
   * send a location message.
   */
  sendLocationMessage: (params: {
    address: string;
    latitude: string;
    longitude: string;
    onResult?: (params: any) => void;
  }) => void;

  /**
   * load history messages.
   */
  loadHistoryMessage: (
    msgs: ChatMessage[],
    onResult?: (params: any) => void
  ) => void;

  /**
   * delete local message.
   */
  deleteLocalMessage: (params: {
    convId: string;
    convType: ChatConversationType;
    msgId: string;
    key: string;
    onResult?: (params: any) => void;
  }) => void;

  /**
   * Undo a message that has been successfully sent.
   */
  recallMessage: (params: {
    msgId: string;
    key: string;
    onResult?: (params: any) => void;
  }) => void;

  /**
   * Resend the message that failed to be sent.
   */
  resendMessage: (params: {
    msgId: string;
    key: string;
    onResult?: (params: any) => void;
  }) => void;

  /**
   * download message attachment.
   */
  downloadAttachment: (params: {
    msg: ChatMessage;
    onResult?: (params?: any) => void;
  }) => void;
};

/**
 * ChatFragment properties
 */
export type ChatFragmentProps = {
  /**
   * ChatFragment controller
   */
  propsRef?: React.RefObject<ChatFragmentRef>;
  /**
   * ChatFragment parameters
   */
  screenParams: {
    params: {
      chatId: string;
      chatType: number;
    };
  };
  /**
   * Message bubble list component
   */
  messageBubbleList?: {
    bubbleList: React.ForwardRefExoticComponent<
      MessageBubbleListProps & React.RefAttributes<MessageBubbleListRef>
    >;
    bubbleListProps: MessageBubbleListProps;
    bubbleListRef: React.RefObject<MessageBubbleListRef>;
  };
  /**
   * Message bubble item component for custom type message
   */
  customMessageBubble?: {
    messageRenderItem: React.FunctionComponent<
      MessageItemType & { eventType: string; data: any }
    >;
  };
  /**
   * Update message no reading callback notification.
   */
  onUpdateReadCount?: (unreadCount: number) => void;
  /**
   * Click the message bubble callback notification.
   */
  onClickMessageBubble?: (data: MessageItemType) => void;
  /**
   * Long press the message bubble callback notification.
   */
  onLongPressMessageBubble?: (data: MessageItemType) => void;
  /**
   * Click the input more button callback notification.
   */
  onClickInputMoreButton?: () => void;
  /**
   * Press down the input voice button callback notification.
   */
  onPressInInputVoiceButton?: () => void;
  /**
   * Press up the input voice button callback notification.
   */
  onPressOutInputVoiceButton?: () => void;
  /**
   * A callback notification before sending a message.
   */
  onSendMessage?: (message: ChatMessage) => void;
  /**
   * A callback notification after sending a message.
   */
  onSendMessageEnd?: (message: ChatMessage) => void;
  /**
   * A callback notification after a voice file is recorded.
   */
  onVoiceRecordEnd?: (params: { localPath: string; duration: number }) => void;
  /**
   * Try to solve the keyboard height problem.
   */
  keyboardVerticalOffset?: number;
};

export default function ChatFragment(props: ChatFragmentProps): JSX.Element {
  const {
    propsRef,
    screenParams,
    messageBubbleList,
    onUpdateReadCount,
    onClickMessageBubble,
    onLongPressMessageBubble,
    onClickInputMoreButton,
    onPressInInputVoiceButton,
    onPressOutInputVoiceButton,
    onSendMessage,
    onSendMessageEnd,
    onVoiceRecordEnd,
    keyboardVerticalOffset,
  } = props;
  const params = screenParams.params as {
    chatId: string;
    chatType: number;
  };

  const chatId = params.chatId;
  const chatType = params.chatType;
  const chatContentRef = React.useRef<ChatContentRef>({} as any);

  if (propsRef?.current) {
    propsRef.current.insertMessage = (params) => {
      chatContentRef?.current.insertMessage(params);
    };
    propsRef.current.sendImageMessage = (params) => {
      chatContentRef?.current.sendImageMessage(params);
    };
    propsRef.current.sendVoiceMessage = (params) => {
      chatContentRef?.current.sendVoiceMessage(params);
    };
    propsRef.current.sendCustomMessage = (params) => {
      chatContentRef?.current.sendCustomMessage(params);
    };
    propsRef.current.sendTextMessage = (params) => {
      chatContentRef?.current.sendTextMessage(params);
    };
    propsRef.current.sendVideoMessage = (params) => {
      chatContentRef?.current.sendVideoMessage(params);
    };
    propsRef.current.sendFileMessage = (params) => {
      chatContentRef?.current.sendFileMessage(params);
    };
    propsRef.current.sendLocationMessage = (params) => {
      chatContentRef?.current.sendLocationMessage(params);
    };
    propsRef.current.loadHistoryMessage = (params) => {
      chatContentRef?.current.loadHistoryMessage(params);
    };
    propsRef.current.deleteLocalMessage = (params) => {
      chatContentRef?.current.deleteLocalMessage(params);
    };
    propsRef.current.recallMessage = (params) => {
      chatContentRef?.current.recallMessage(params);
    };
    propsRef.current.resendMessage = (params) => {
      chatContentRef?.current.resendMessage(params);
    };
    propsRef.current.downloadAttachment = (params) => {
      chatContentRef?.current.downloadAttachment(params);
    };
  }

  return (
    <ChatSdkChatContextProvider
      chat={new UIKitChatSdkChatContext({ chatId, chatType })}
    >
      <ChatContent
        propsRef={chatContentRef}
        messageBubbleList={messageBubbleList}
        onUpdateReadCount={onUpdateReadCount}
        onClickMessageBubble={onClickMessageBubble}
        onLongPressMessageBubble={onLongPressMessageBubble}
        onClickInputMoreButton={onClickInputMoreButton}
        onPressInInputVoiceButton={onPressInInputVoiceButton}
        onPressOutInputVoiceButton={onPressOutInputVoiceButton}
        onSendMessage={onSendMessage}
        onSendMessageEnd={onSendMessageEnd}
        onVoiceRecordEnd={onVoiceRecordEnd}
        keyboardVerticalOffset={keyboardVerticalOffset}
      />
    </ChatSdkChatContextProvider>
  );
}
