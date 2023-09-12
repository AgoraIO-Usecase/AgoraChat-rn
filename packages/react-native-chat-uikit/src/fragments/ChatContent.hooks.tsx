import * as React from 'react';
import { Text, View } from 'react-native';
import {
  ChatCustomMessageBody,
  ChatError,
  ChatFileMessageBody,
  ChatImageMessageBody,
  ChatLocationMessageBody,
  ChatMessage,
  ChatMessageChatType,
  ChatMessageDirection,
  ChatMessageStatus,
  ChatMessageType,
  ChatTextMessageBody,
  ChatVideoMessageBody,
  ChatVoiceMessageBody,
} from 'react-native-chat-sdk';

import type { ActionMenuItem } from '../components/ActionMenu';
import type { BottomSheetItem } from '../components/BottomSheet';
import { LocalIcon } from '../components/Icon';
import type {
  StringSetContextType,
  ThemeContextType,
  VoiceStateContextType,
} from '../contexts';
import { timestamp } from '../utils/generator';
import type {
  CustomMessageItemType,
  FileMessageItemType,
  ImageMessageItemType,
  LocationMessageItemType,
  MessageItemType,
  TextMessageItemType,
  VideoMessageItemType,
  VoiceMessageItemType,
} from './MessageBubbleList';
import type { MessageItemStateType } from './types';

export const convertToMessage = (params: {
  item: MessageItemType;
  chatId: string;
  chatType: ChatMessageChatType;
}) => {
  const { item, chatId, chatType } = params;
  let r;
  switch (item.type) {
    case ChatMessageType.TXT:
      {
        const txt = item as TextMessageItemType;
        r = ChatMessage.createTextMessage(chatId, txt.text, chatType);
      }
      break;
    case ChatMessageType.IMAGE:
      {
        const img = item as ImageMessageItemType;
        r = ChatMessage.createImageMessage(chatId, img.localPath!, chatType, {
          displayName: img.displayName,
          width: img.width ?? 0,
          height: img.height ?? 0,
          fileSize: img.fileSize ?? 0,
        } as any);
      }
      break;
    case ChatMessageType.VOICE:
      {
        const voice = item as VoiceMessageItemType;
        r = ChatMessage.createVoiceMessage(chatId, voice.localPath!, chatType, {
          duration: voice.duration,
          displayName: '',
        });
      }
      break;
    case ChatMessageType.CUSTOM:
      {
        const custom = item as CustomMessageItemType;
        r = ChatMessage.createCustomMessage(
          chatId,
          custom.SubComponentProps.eventType,
          chatType,
          {
            params: custom.SubComponentProps.data,
          }
        );
      }
      break;
    case ChatMessageType.FILE:
      {
        const file = item as FileMessageItemType;
        r = ChatMessage.createFileMessage(chatId, file.localPath, chatType, {
          displayName: file.displayName ?? 'file',
          fileSize: file.fileSize ?? 0,
        } as any);
      }
      break;
    case ChatMessageType.LOCATION:
      {
        const location = item as LocationMessageItemType;
        r = ChatMessage.createLocationMessage(
          chatId,
          location.latitude,
          location.longitude,
          chatType,
          {
            address: location.address,
          }
        );
      }
      break;
    case ChatMessageType.VIDEO:
      {
        const video = item as VideoMessageItemType;
        r = ChatMessage.createVideoMessage(chatId, video.localPath, chatType, {
          displayName: video.displayName ?? 'video',
          thumbnailLocalPath: video.thumbnailLocalPath ?? '',
          duration: video.duration,
          width: video.width ?? 0,
          height: video.height ?? 0,
        });
      }
      break;
    default:
      break;
  }
  if (r === undefined) {
    throw new ChatError({ code: 1, description: 'not support message type' });
  }
  r.attributes = item.ext;
  return r;
};

export const convertFromMessage = (params: {
  msg: ChatMessage;
  state?: MessageItemStateType;
  customMessageBubble?: {
    CustomMessageRenderItemP: React.FunctionComponent<
      MessageItemType & { eventType: string; data: any }
    >;
  };
}): MessageItemType => {
  const { msg, state, customMessageBubble } = params;
  const convertFromMessageState = (msg: ChatMessage) => {
    let ret: MessageItemStateType | undefined;
    if (msg.status === ChatMessageStatus.SUCCESS) {
      ret = 'sended' as MessageItemStateType;
    } else if (msg.status === ChatMessageStatus.CREATE) {
      ret = 'sending' as MessageItemStateType;
    } else if (msg.status === ChatMessageStatus.FAIL) {
      ret = 'failed' as MessageItemStateType;
    } else if (msg.status === ChatMessageStatus.PROGRESS) {
      if (msg.direction === ChatMessageDirection.RECEIVE)
        ret = 'receiving' as MessageItemStateType;
      else ret = 'sending' as MessageItemStateType;
    } else {
      ret = 'failed' as MessageItemStateType;
    }
    if (msg.direction === ChatMessageDirection.RECEIVE) {
      ret = 'received';
    }
    if (ret === 'sending' || ret === 'receiving') {
      if (timestamp() > msg.localTime + 1000 * 60) {
        ret = 'failed';
      }
    }
    if (ret === 'sended') {
      if (msg.hasDeliverAck === true) {
        ret = 'arrived';
      }
      if (msg.hasReadAck === true) {
        ret = 'read';
      }
    }
    return ret;
  };
  const convertFromMessageBody = (params: {
    msg: ChatMessage;
    item: MessageItemType;
    customMessageBubble?: {
      CustomMessageRenderItemP: React.FunctionComponent<
        MessageItemType & { eventType: string; data: any }
      >;
    };
  }) => {
    const { msg, item, customMessageBubble } = params;
    const type = msg.body.type;
    switch (type) {
      case ChatMessageType.VOICE:
        {
          const body = msg.body as ChatVoiceMessageBody;
          const r = item as VoiceMessageItemType;
          r.localPath = body.localPath;
          r.remoteUrl = body.remotePath;
          r.fileSize = body.fileSize;
          r.fileStatus = body.fileStatus;
          r.duration = body.duration;
          r.displayName = body.displayName;
          r.type = ChatMessageType.VOICE;
        }
        break;
      case ChatMessageType.IMAGE:
        {
          const body = msg.body as ChatImageMessageBody;
          const r = item as ImageMessageItemType;
          r.localPath = body.localPath;
          r.remoteUrl = body.remotePath;
          r.fileSize = body.fileSize;
          r.fileStatus = body.fileStatus;
          r.displayName = body.displayName;
          r.localThumbPath = body.thumbnailLocalPath;
          r.remoteThumbPath = body.thumbnailRemotePath;
          r.type = ChatMessageType.IMAGE;
        }
        break;
      case ChatMessageType.TXT:
        {
          const body = msg.body as ChatTextMessageBody;
          const r = item as TextMessageItemType;
          r.text = body.content;
          r.type = ChatMessageType.TXT;
        }
        break;
      case ChatMessageType.CUSTOM:
        {
          const body = msg.body as ChatCustomMessageBody;
          const r = item as CustomMessageItemType;
          r.SubComponentProps = {
            eventType: body.event,
            data: body.params,
            ...item,
          } as MessageItemType & { eventType: string; data: any };
          r.SubComponent = customMessageBubble?.CustomMessageRenderItemP!; // !!! must
          r.type = ChatMessageType.CUSTOM;
        }
        break;
      case ChatMessageType.LOCATION:
        {
          const body = msg.body as ChatLocationMessageBody;
          const r = item as LocationMessageItemType;
          r.address = body.address;
          r.latitude = body.latitude;
          r.longitude = body.longitude;
          r.type = ChatMessageType.LOCATION;
        }
        break;
      case ChatMessageType.FILE:
        {
          const body = msg.body as ChatFileMessageBody;
          const r = item as FileMessageItemType;
          r.localPath = body.localPath;
          r.remoteUrl = body.remotePath;
          r.fileSize = body.fileSize;
          r.fileStatus = body.fileStatus;
          r.displayName = body.displayName;
          r.type = ChatMessageType.FILE;
        }
        break;
      case ChatMessageType.VIDEO:
        {
          const body = msg.body as ChatVideoMessageBody;
          const r = item as VideoMessageItemType;
          r.localPath = body.localPath;
          r.remoteUrl = body.remotePath;
          r.fileSize = body.fileSize;
          r.fileStatus = body.fileStatus;
          r.duration = body.duration;
          r.thumbnailLocalPath = body.thumbnailLocalPath;
          r.thumbnailRemoteUrl = body.thumbnailRemotePath;
          r.width = body.width;
          r.height = body.height;
          r.displayName = body.displayName;
          r.type = ChatMessageType.VIDEO;
        }
        break;
      default:
        throw new Error('This is impossible.');
    }
  };
  const r = {
    sender: msg.from,
    timestamp: msg.serverTime,
    isSender: msg.direction === ChatMessageDirection.RECEIVE ? false : true,
    key: msg.localMsgId,
    msgId: msg.msgId,
    state: state ?? convertFromMessageState(msg),
    ext: msg.attributes,
  } as MessageItemType;
  convertFromMessageBody({
    msg: msg,
    item: r,
    customMessageBubble: customMessageBubble,
  });
  return r;
};

export const openInputExtension = (params: {
  openSheet: (props: BottomSheetItem) => void;
  theme: ThemeContextType;
  onClicked: (
    action:
      | 'chat_open_camera'
      | 'chat_open_media_library'
      | 'chat_open_document'
  ) => void;
}) => {
  const { openSheet, theme } = params;
  openSheet({
    sheetItems: [
      {
        iconColor: theme.colors.primary,
        title: 'Camera',
        titleColor: 'black',
        onPress: () => {
          params.onClicked('chat_open_camera');
        },
      },
      {
        iconColor: theme.colors.primary,
        title: 'Album',
        titleColor: 'black',
        onPress: () => {
          params.onClicked('chat_open_media_library');
        },
      },
      {
        iconColor: theme.colors.primary,
        title: 'Files',
        titleColor: 'black',
        onPress: () => {
          params.onClicked('chat_open_document');
        },
      },
    ],
  });
};

export const showVoice = (params: {
  state: VoiceStateContextType;
  theme: ThemeContextType;
  i18n: StringSetContextType;
}) => {
  const { state, i18n } = params;
  const { chat } = i18n;
  state.showState({
    children: (
      <View
        style={{
          height: 100,
          width: 161,
          borderRadius: 16,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <LocalIcon name="mic" size={40} />
          <LocalIcon name="volume8" size={40} />
        </View>
        <Text style={{ color: 'white' }}>{chat.voiceState}</Text>
      </View>
    ),
    pointerEvents: 'box-none',
  });
};

export const onMessageContextMenu = (params: {
  openMenu: (props: ActionMenuItem) => void;
  data: MessageItemType;
  onClicked: (params: {
    data: MessageItemType;
    action: 'delete_local_message' | 'recall_message' | 'resend_message';
  }) => void;
}) => {
  const { openMenu, data, onClicked } = params;
  const list = [];
  list.push({
    title: 'delete message',
    onPress: () => {
      onClicked({ data, action: 'delete_local_message' });
    },
  });
  if (data.state === 'arrived') {
    list.push({
      title: 'recall message',
      onPress: () => {
        onClicked({ data, action: 'recall_message' });
      },
    });
  }
  if (data.state === 'failed') {
    list.push({
      title: 'resend message',
      onPress: () => {
        onClicked({ data, action: 'resend_message' });
      },
    });
  }
  openMenu({
    menuItems: list,
  });
};
