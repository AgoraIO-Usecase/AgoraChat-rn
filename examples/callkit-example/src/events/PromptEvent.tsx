import type { DialogContextType, ExtraDataType } from 'react-native-chat-uikit';

import type { PromptActionEventType } from './Events';
import { type sendEventProps, sendEvent } from './sendEvent';
import type { BizEventType } from './types';

export const sendEventFromPrompt = (
  params: Omit<sendEventProps, 'senderId' | 'timestamp'>
) => {
  sendEvent({
    ...params,
    senderId: 'SheetEvent',
  } as sendEventProps);
};

export function handlePromptEvent(params: {
  prompt: Pick<DialogContextType, 'openPrompt'>;
  event: any;
  extra: ExtraDataType;
}): boolean {
  const promptEvent = params.event as {
    eventBizType: BizEventType;
    action: PromptActionEventType;
    senderId: string;
    params: any;
    timestamp: number;
    key: string;
  };
  console.log(
    'test:handlePromptEvent:',
    promptEvent.eventBizType,
    promptEvent.action,
    promptEvent.senderId,
    promptEvent.timestamp,
    promptEvent.key
  );
  let ret = true;
  switch (promptEvent.action) {
    default:
      break;
  }
  return ret;
}
