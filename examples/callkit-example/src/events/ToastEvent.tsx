import type { ExtraDataType, ToastContextType } from 'react-native-chat-uikit';

import type { ToastActionEventType } from './Events';
import type { BizEventType } from './types';

export function handleToastEvent(params: {
  toast: ToastContextType;
  event: any;
  extra: ExtraDataType;
}): boolean {
  const toastEvent = params.event as {
    eventBizType: BizEventType;
    action: ToastActionEventType;
    senderId: string;
    params: any;
    timestamp: number;
    key: string;
  };
  console.log(
    'test:handleToastEvent:',
    toastEvent.eventBizType,
    toastEvent.action,
    toastEvent.senderId,
    toastEvent.timestamp,
    toastEvent.key
  );
  let ret = true;
  switch (toastEvent.action) {
    default:
      ret = false;
      break;
  }
  return ret;
}
