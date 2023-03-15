import type { DialogContextType, ExtraDataType } from 'react-native-chat-uikit';

import type { SheetActionEventType } from './Events';
import { sendEvent, sendEventProps } from './sendEvent';
import type { BizEventType } from './types';

export const sendEventFromSheet = (
  params: Omit<sendEventProps, 'senderId' | 'timestamp'>
) => {
  sendEvent({
    ...params,
    senderId: 'SheetEvent',
  } as sendEventProps);
};

export function handleSheetEvent(params: {
  sheet: Pick<DialogContextType, 'openSheet'>;
  event: any;
  extra: ExtraDataType;
}): boolean {
  const sheetEvent = params.event as {
    eventBizType: BizEventType;
    action: SheetActionEventType;
    senderId: string;
    params: any;
    timestamp: number;
    key: string;
  };
  console.log(
    'test:handleSheetEvent:',
    sheetEvent.eventBizType,
    sheetEvent.action,
    sheetEvent.senderId,
    sheetEvent.timestamp,
    sheetEvent.key
  );
  let ret = true;
  switch (sheetEvent.action) {
    default:
      ret = false;
      break;
  }
  return ret;
}
