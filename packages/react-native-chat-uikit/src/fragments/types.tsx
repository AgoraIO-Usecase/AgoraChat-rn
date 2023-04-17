export type { ChatFragmentProps, ChatFragmentRef } from './Chat';
export type {
  ItemDataType as ConversationItemDataType,
  ConversationListFragmentProps,
  ConversationListFragmentRef,
} from './ConversationList';
export type {
  CustomMessageItemType,
  FileMessageItemType,
  ImageMessageItemType,
  LocationMessageItemType,
  MessageBubbleListProps,
  MessageBubbleListRef,
  MessageItemType,
  TextMessageItemType,
  VideoMessageItemType,
  VoiceMessageItemType,
} from './MessageBubbleList';

export type MessageItemStateType =
  | 'unread'
  | 'read'
  | 'arrived'
  | 'played'
  | 'sending'
  | 'failed'
  | 'receiving'
  | 'recalled';
