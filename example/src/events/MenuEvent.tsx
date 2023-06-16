import type {
  ChatConversationType,
  ChatMessageType,
} from 'react-native-chat-sdk';
import type {
  DialogContextType,
  ExtraDataType,
  MessageItemStateType,
} from 'react-native-chat-uikit';

import type { MenuActionEventType } from './Events';
import { sendEvent, type sendEventProps } from './sendEvent';
import type { BizEventType } from './types';

const sendEventFromMenu = (
  params: Omit<sendEventProps, 'senderId' | 'timestamp'>
) => {
  sendEvent({
    ...params,
    senderId: 'MenuEvent',
  } as sendEventProps);
};

export function handleMenuEvent(params: {
  menu: Pick<DialogContextType, 'openMenu'>;
  event: any;
  extra: ExtraDataType;
}): boolean {
  const menuEvent = params.event as {
    eventBizType: BizEventType;
    action: MenuActionEventType;
    senderId: string;
    params: any;
    timestamp: number;
    key: string;
  };
  console.log(
    'test:handleMenuEvent:',
    menuEvent.eventBizType,
    menuEvent.action,
    menuEvent.senderId,
    menuEvent.timestamp,
    menuEvent.key
  );
  let ret = true;
  switch (menuEvent.action) {
    case 'long_press_message_bubble':
      {
        const data = menuEvent.params as {
          sender: string;
          timestamp: number;
          isSender?: boolean;
          key: string;
          msgId: string;
          type: ChatMessageType;
          state?: MessageItemStateType;
          convId: string;
          convType: ChatConversationType;
        };
        const list = [];
        list.push({
          title: 'delete message',
          onPress: () => {
            sendEventFromMenu({
              eventType: 'DataEvent',
              eventBizType: 'chat',
              action: 'delete_local_message',
              params: {
                convId: data.convId,
                convType: data.convType,
                msgId: data.msgId,
                key: data.key,
              },
            });
          },
        });
        if (data.state === 'arrived') {
          list.push({
            title: 'recall message',
            onPress: () => {
              sendEventFromMenu({
                eventType: 'DataEvent',
                eventBizType: 'chat',
                action: 'recall_message',
                params: {
                  msgId: data.msgId,
                  key: data.key,
                },
              });
            },
          });
        }
        if (data.state === 'failed') {
          list.push({
            title: 'resend message',
            onPress: () => {
              sendEventFromMenu({
                eventType: 'DataEvent',
                eventBizType: 'chat',
                action: 'resend_message',
                params: {
                  msgId: data.msgId,
                  key: data.key,
                },
              });
            },
          });
        }
        params.menu.openMenu({
          menuItems: list,
        });
      }

      break;

    default:
      break;
  }
  return ret;
}
