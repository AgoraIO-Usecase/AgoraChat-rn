import type { DialogContextType, ExtraDataType } from 'react-native-chat-uikit';

import type { AlertActionEventType } from './Events';
import { sendEvent, sendEventProps } from './sendEvent';
import type { BizEventType } from './types';

export const sendEventFromAlert = (
  params: Omit<sendEventProps, 'senderId' | 'timestamp'>
) => {
  sendEvent({
    ...params,
    senderId: 'AlertEvent',
  } as sendEventProps);
};

export function handleAlertEvent(params: {
  alert: Pick<DialogContextType, 'openAlert'>;
  event: any;
  extra: ExtraDataType;
}): boolean {
  const alertEvent = params.event as {
    eventBizType: BizEventType;
    action: AlertActionEventType;
    senderId: string;
    params: any;
    timestamp: number;
    key: string;
  };
  console.log(
    'test:handleAlertEvent:',
    alertEvent.eventBizType,
    alertEvent.action,
    alertEvent.senderId,
    alertEvent.timestamp,
    alertEvent.key
  );
  let ret = true;
  switch (alertEvent.action) {
    default:
      ret = false;
      break;
  }
  return ret;
}
