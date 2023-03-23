import * as React from 'react';

import { calllog } from '../call/CallConst';
import type { CallError } from '../call/CallError';
import type { CallManagerImpl } from '../call/CallManagerImpl';
import type { CallViewListener } from '../call/CallViewListener';
import type { CallEndReason, CallType } from '../enums';

export type BasicCallProps = {
  inviterId: string;
  inviterName: string;
  inviterUrl?: string;
  currentId: string;
  currentName: string;
  currentUrl?: string;
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
export type BasicCallState = {};
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
  }

  onCallOccurError(params: { channelId: string; error: CallError }): void {
    calllog.log('BasicCall:onCallOccurError:', params);
  }

  onRemoteUserJoined(params: {
    channelId: string;
    userChannelId: number;
  }): void {
    calllog.log('BasicCall:onRemoteUserJoined:', params);
  }

  onSelfJoined(params: { channelId: string; userChannelId: number }): void {
    calllog.log('BasicCall:onSelfJoined:', params);
  }
}
