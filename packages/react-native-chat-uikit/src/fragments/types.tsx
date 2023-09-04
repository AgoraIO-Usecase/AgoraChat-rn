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
  | 'read' // The message has been read (the peer has read the message)
  | 'arrived' // The message has been delivered (the peer has already received it)
  | 'played' // message played (audio played)
  | 'sending' // Sending (not yet reached the server)
  | 'sended' // Send completed (has arrived at the server)
  | 'failed' // Failed to send (did not reach the server)
  | 'receiving' // Receiving message (attachment type message)
  | 'received' // message received
  | 'recalled'; // message has been recalled
