import * as React from 'react';
import type { VideoViewSetupMode } from 'react-native-agora';

import { calllog } from '../call/CallConst';
import type { CallError } from '../call/CallError';
import type { CallManagerImpl } from '../call/CallManagerImpl';
import type { CallViewListener } from '../call/CallViewListener';
import type { CallEndReason, CallType } from '../enums';

export type BasicCallProps = {
  appKey: string;
  agoraAppId: string;
  inviterId: string;
  inviterName: string;
  inviterUrl?: string;
  currentId: string;
  currentName: string;
  currentUrl?: string;
  timeout?: number;
  requestRTCToken: (params: {
    appKey: string;
    channelId: string;
    userId: string;
    onResult: (params: { data: any; error?: any }) => void;
  }) => void;
  requestUserMap: (params: {
    appKey: string;
    channelId: string;
    userId: string;
    onResult: (params: { data: any; error?: any }) => void;
  }) => void;
};
export type BasicCallState = {
  channelId: string;
  callId: string;
  joinChannelSuccess: boolean;
  startPreview: boolean;
  selfUid: number;
  setupMode: VideoViewSetupMode;
};
export abstract class BasicCall<Props = BasicCallProps, State = BasicCallState>
  extends React.Component<Props, State>
  implements CallViewListener
{
  componentDidMount(): void {
    calllog.log('BasicCall:componentDidMount:');
    this.init();
  }
  componentWillUnmount(): void {
    calllog.log('BasicCall:componentWillUnmount:');
    this.unInit();
  }

  protected manager?: CallManagerImpl;

  protected abstract init(): void;
  protected abstract unInit(): void;

  protected renderBody(): React.ReactNode {
    throw new Error('Requires subclass implementation.');
  }

  // eslint-disable-next-line react/sort-comp
  render(): React.ReactNode {
    return this.renderBody();
  }

  onCallEnded(params: {
    channelId: string;
    callType: CallType;
    endReason: CallEndReason;
    elapsed: number;
  }): void {
    calllog.log('BasicCall:onCallEnded:', params);
    throw new Error('Requires subclass implementation.');
  }

  onCallOccurError(params: { channelId: string; error: CallError }): void {
    calllog.log('BasicCall:onCallOccurError:', params);
    throw new Error('Requires subclass implementation.');
  }

  onRemoteUserJoined(params: {
    channelId: string;
    userChannelId: number;
    userId: string;
  }): void {
    calllog.log('BasicCall:onRemoteUserJoined:', params);
    throw new Error('Requires subclass implementation.');
  }

  onSelfJoined(params: {
    channelId: string;
    userChannelId: number;
    userId: string;
    elapsed: number;
  }): void {
    calllog.log('BasicCall:onSelfJoined:', params);
    throw new Error('Requires subclass implementation.');
  }

  onRequestJoin(params: {
    channelId: string;
    userId: string;
    userChannelId: number;
    userRTCToken: string;
  }): void {
    calllog.log('BasicCall:onRequestJoin:', params);
    throw new Error('Requires subclass implementation.');
  }
  onRemoteUserOffline(params: {
    channelId: string;
    userChannelId: number;
    userId: string;
  }): void {
    calllog.log('BasicCall:onRemoteUserOffline:', params);
    throw new Error('Requires subclass implementation.');
  }
  onSelfLeave(params: {
    channelId: string;
    userChannelId: number;
    userId: string;
  }): void {
    calllog.log('BasicCall:onSelfLeave:', params);
    throw new Error('Requires subclass implementation.');
  }
}
