import * as React from 'react';
import { CallType, SingleCall } from 'react-native-chat-callkit';
import type {
  ExtraDataType,
  VoiceStateContextType,
} from 'react-native-chat-uikit';

import type { StateActionEventType } from './Events';
import { sendEvent, sendEventProps } from './sendEvent';
import type { BizEventType } from './types';

export const sendEventFromState = (
  params: Omit<sendEventProps, 'senderId' | 'timestamp'>
) => {
  sendEvent({
    ...params,
    senderId: 'VoiceStateEvent',
  } as sendEventProps);
};

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
    case 'show_single_call':
      {
        console.log('test:stateEvent.params', stateEvent.params);
        const {
          inviterId,
          isInviter,
          callType,
          currentId,
          inviteeIds,
          appKey,
          agoraAppId,
        } = stateEvent.params as {
          appKey: string;
          agoraAppId: string;
          isInviter: boolean;
          inviterId: string;
          currentId: string;
          inviteeIds: string[];
          callType: CallType;
        };
        params.voiceState.showState({
          children: (
            <SingleCall
              appKey={appKey}
              agoraAppId={agoraAppId}
              inviterId={inviterId}
              inviterName={inviterId}
              currentId={currentId}
              currentName={currentId}
              inviteeId={inviteeIds[0] ?? ''}
              elapsed={0}
              isInviter={isInviter}
              callType={callType === CallType.Audio1v1 ? 'audio' : 'video'}
              onClose={() => {
                console.log('test:stateEvent.onClose');
                sendEventFromState({
                  eventType: 'VoiceStateEvent',
                  eventBizType: 'others',
                  action: 'hide_single_call',
                  params: {},
                });
              }}
              onHangUp={() => {
                console.log('test:stateEvent.onHangUp');
                sendEventFromState({
                  eventType: 'VoiceStateEvent',
                  eventBizType: 'others',
                  action: 'hide_single_call',
                  params: {},
                });
              }}
              onCancel={() => {
                console.log('test:stateEvent.onCancel');
                sendEventFromState({
                  eventType: 'VoiceStateEvent',
                  eventBizType: 'others',
                  action: 'hide_single_call',
                  params: {},
                });
              }}
              onRefuse={() => {
                console.log('test:stateEvent.onRefuse');
                sendEventFromState({
                  eventType: 'VoiceStateEvent',
                  eventBizType: 'others',
                  action: 'hide_single_call',
                  params: {},
                });
              }}
              onError={() => {
                console.log('test:stateEvent.onError');
                sendEventFromState({
                  eventType: 'VoiceStateEvent',
                  eventBizType: 'others',
                  action: 'hide_single_call',
                  params: {},
                });
              }}
              requestRTCToken={function (params: {
                appKey: string;
                channelId: string;
                userId: string;
                onResult: (params: { data: any; error?: any }) => void;
              }): void {
                console.log('test:requestRTCToken:', params);
              }}
              requestUserMap={function (params: {
                appKey: string;
                channelId: string;
                userId: string;
                onResult: (params: { data: any; error?: any }) => void;
              }): void {
                console.log('test:requestUserMap:', params);
              }}
            />
          ),
          pointerEvents: 'box-none',
        });
      }
      break;
    case 'hide_single_call':
      params.voiceState.hideState();
      break;
    default:
      ret = false;
      break;
  }
  return ret;
}
