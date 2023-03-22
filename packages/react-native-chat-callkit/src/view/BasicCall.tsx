import * as React from 'react';
import {
  ChannelProfileType,
  createAgoraRtcEngine,
  IRtcEngine,
} from 'react-native-agora';

import { calllog } from '../call/CallConst';

export abstract class BasicCall<Props, State> extends React.Component<
  Props,
  State
> {
  componentDidMount(): void {
    calllog.log('BasicCall:componentDidMount:');
    this.initRtcEngine();
  }
  componentWillUnmount(): void {
    calllog.log('BasicCall:componentWillUnmount:');
    this.releaseRtcEngine();
  }

  protected engine?: IRtcEngine;

  protected initRtcEngine(): void {
    calllog.log('BasicCall:initRtcEngine:');
    this.engine = createAgoraRtcEngine();
    this.engine?.initialize({
      appId: 'easemob#easeim',
      // Should use ChannelProfileLiveBroadcasting on most of cases
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    });
  }

  protected joinChannel() {}

  protected leaveChannel() {}

  protected releaseRtcEngine(): void {
    calllog.log('BasicCall:releaseRtcEngine:');
    this.engine?.release();
  }

  protected renderBody(): React.ReactNode {
    throw new Error('You need a subclass implementation.');
  }

  render(): React.ReactNode {
    return this.renderBody();
  }
}
