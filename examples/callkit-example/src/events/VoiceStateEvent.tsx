import * as React from 'react';
import {
  CallType,
  formatElapsed,
  MultiCall,
  SingleCall,
} from 'react-native-chat-callkit';
import type {
  ExtraDataType,
  VoiceStateContextType,
} from 'react-native-chat-uikit';

import { ContactList } from '../components/SelectList';
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
              onClose={(elapsed, reason) => {
                console.log('test:stateEvent.onClose', elapsed, reason);
                sendEventFromState({
                  eventType: 'VoiceStateEvent',
                  eventBizType: 'others',
                  action: 'hide_call',
                  params: {},
                });
                sendEventFromState({
                  eventType: 'ToastEvent',
                  eventBizType: 'others',
                  action: 'toast_',
                  params: `Call End: ${elapsed}`,
                });
              }}
              onHangUp={() => {
                console.log('test:stateEvent.onHangUp');
                sendEventFromState({
                  eventType: 'VoiceStateEvent',
                  eventBizType: 'others',
                  action: 'hide_call',
                  params: {},
                });
              }}
              onCancel={() => {
                console.log('test:stateEvent.onCancel');
                sendEventFromState({
                  eventType: 'VoiceStateEvent',
                  eventBizType: 'others',
                  action: 'hide_call',
                  params: {},
                });
              }}
              onRefuse={() => {
                console.log('test:stateEvent.onRefuse');
                sendEventFromState({
                  eventType: 'VoiceStateEvent',
                  eventBizType: 'others',
                  action: 'hide_call',
                  params: {},
                });
              }}
              onError={(error) => {
                console.log('test:stateEvent.onError', error);
                sendEventFromState({
                  eventType: 'VoiceStateEvent',
                  eventBizType: 'others',
                  action: 'hide_call',
                  params: {},
                });
                sendEventFromState({
                  eventType: 'ToastEvent',
                  eventBizType: 'others',
                  action: 'toast_',
                  params: JSON.stringify(error),
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
    case 'show_multi_call':
      {
        console.log('test:stateEvent.params:multi:', stateEvent.params);
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
            <MultiCall
              appKey={appKey}
              agoraAppId={agoraAppId}
              inviterId={inviterId}
              inviterName={inviterId}
              currentId={currentId}
              currentName={currentId}
              callType={callType === CallType.AudioMulti ? 'audio' : 'video'}
              elapsed={0}
              isInviter={isInviter}
              inviteeIds={inviteeIds}
              inviteeList={{ InviteeList: ContactList }}
              onClose={(elapsed, reason) => {
                console.log('test:stateEvent.onClose', elapsed, reason);
                sendEventFromState({
                  eventType: 'VoiceStateEvent',
                  eventBizType: 'others',
                  action: 'hide_call',
                  params: {},
                });
                sendEventFromState({
                  eventType: 'ToastEvent',
                  eventBizType: 'others',
                  action: 'toast_',
                  params: `Call End: ${formatElapsed(elapsed)}`,
                });
              }}
              onHangUp={() => {
                console.log('test:stateEvent.onHangUp');
                sendEventFromState({
                  eventType: 'VoiceStateEvent',
                  eventBizType: 'others',
                  action: 'hide_call',
                  params: {},
                });
              }}
              onCancel={() => {
                console.log('test:stateEvent.onCancel');
                sendEventFromState({
                  eventType: 'VoiceStateEvent',
                  eventBizType: 'others',
                  action: 'hide_call',
                  params: {},
                });
              }}
              onRefuse={() => {
                console.log('test:stateEvent.onRefuse');
                sendEventFromState({
                  eventType: 'VoiceStateEvent',
                  eventBizType: 'others',
                  action: 'hide_call',
                  params: {},
                });
              }}
              onError={(error) => {
                console.log('test:stateEvent.onError', error);
                sendEventFromState({
                  eventType: 'VoiceStateEvent',
                  eventBizType: 'others',
                  action: 'hide_call',
                  params: {},
                });
                sendEventFromState({
                  eventType: 'ToastEvent',
                  eventBizType: 'others',
                  action: 'toast_',
                  params: JSON.stringify(error),
                });
              }}
            />
          ),
          pointerEvents: 'box-none',
        });
      }
      break;
    case 'hide_call':
      params.voiceState.hideState();
      break;
    default:
      ret = false;
      break;
  }
  return ret;
}
