import * as React from 'react';
import { Alert, Platform, ToastAndroid } from 'react-native';
import {
  CallType,
  CallUser,
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
          inviterName,
          inviterAvatar,
          invitees,
        } = stateEvent.params as {
          appKey: string;
          agoraAppId: string;
          isInviter: boolean;
          inviterId: string;
          currentId: string;
          inviteeIds: string[];
          callType: CallType;
          inviterName?: string;
          inviterAvatar?: string;
          invitees?: CallUser[];
        };
        params.voiceState.showState({
          children: (
            <SingleCall
              inviterId={inviterId}
              inviterName={inviterName}
              inviterAvatar={inviterAvatar}
              currentId={currentId}
              inviteeId={inviteeIds[0] ?? ''}
              inviteeName={invitees?.[0]?.userName}
              inviteeAvatar={invitees?.[0]?.userAvatarUrl}
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
                if (Platform.OS === 'android') {
                  if (reason) {
                    ToastAndroid.show(
                      `tip: reason: ${JSON.stringify(reason)}`,
                      ToastAndroid.SHORT
                    );
                  } else {
                    ToastAndroid.show(
                      `tip: Call End: ${formatElapsed(elapsed)}`,
                      ToastAndroid.SHORT
                    );
                  }
                } else {
                  if (reason) {
                    Alert.alert(`tip: reason: ${JSON.stringify(reason)}`);
                  } else {
                    Alert.alert(`tip: Call End: ${formatElapsed(elapsed)}`);
                  }
                }
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
                if (Platform.OS === 'android') {
                  ToastAndroid.show(`error: ${JSON.stringify(error)}`, 3);
                } else {
                  Alert.alert(`error: ${JSON.stringify(error)}`);
                }
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
          inviterName,
          inviterAvatar,
          invitees,
        } = stateEvent.params as {
          appKey: string;
          agoraAppId: string;
          isInviter: boolean;
          inviterId: string;
          currentId: string;
          inviteeIds: string[];
          callType: CallType;
          inviterName?: string;
          inviterAvatar?: string;
          invitees?: CallUser[];
        };
        params.voiceState.showState({
          children: (
            <MultiCall
              inviterId={inviterId}
              inviterName={inviterName}
              inviterAvatar={inviterAvatar}
              currentId={currentId}
              callType={callType === CallType.AudioMulti ? 'audio' : 'video'}
              isInviter={isInviter}
              inviteeIds={inviteeIds}
              inviteeList={{ InviteeList: ContactList }}
              invitees={invitees}
              onClose={(elapsed, reason) => {
                console.log('test:stateEvent.onClose', elapsed, reason);
                sendEventFromState({
                  eventType: 'VoiceStateEvent',
                  eventBizType: 'others',
                  action: 'hide_call',
                  params: {},
                });
                if (Platform.OS === 'android') {
                  if (reason) {
                    ToastAndroid.show(
                      `tip: reason: ${JSON.stringify(reason)}`,
                      ToastAndroid.SHORT
                    );
                  } else {
                    ToastAndroid.show(
                      `tip: Call End: ${formatElapsed(elapsed)}`,
                      ToastAndroid.SHORT
                    );
                  }
                } else {
                  if (reason) {
                    Alert.alert(`tip: reason: ${JSON.stringify(reason)}`);
                  } else {
                    Alert.alert(`tip: Call End: ${formatElapsed(elapsed)}`);
                  }
                }
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
                if (Platform.OS === 'android') {
                  ToastAndroid.show(`error: ${JSON.stringify(error)}`, 3);
                } else {
                  Alert.alert(`error: ${JSON.stringify(error)}`);
                }
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
