import type {
  ExtraDataType,
  VoiceStateContextType,
} from 'react-native-chat-uikit';

import type { StateActionEventType } from './Events';
import type { BizEventType } from './types';

export function handleVoiceStateEvent(params: {
  voiceState: VoiceStateContextType;
  event: any;
  extra: ExtraDataType;
}): boolean {
  const stateEvent = params.event as {
    eventBizType: BizEventType;
    action: StateActionEventType;
    senderId: string;
    params: any;
    timestamp: number;
    key: string;
  };
  console.log(
    'test:handleVoiceStateEvent:',
    stateEvent.eventBizType,
    stateEvent.action,
    stateEvent.senderId,
    stateEvent.timestamp,
    stateEvent.key
  );
  let ret = true;
  switch (stateEvent.action) {
    default:
      ret = false;
      break;
  }
  return ret;
}
