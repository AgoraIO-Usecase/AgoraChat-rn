import * as React from 'react';
import { View } from 'react-native';
import type { VideoViewSetupMode } from 'react-native-agora';

import { calllog } from '../call/CallConst';
import type { CallError } from '../call/CallError';
import type { CallManagerImpl } from '../call/CallManagerImpl';
import type { CallViewListener } from '../call/CallViewListener';
import type { CallEndReason, CallType } from '../enums';
import {
  type BottomMenuButtonType,
  BottomMenuButton,
} from './components/BottomMenuButton';

const BottomBarHeight = 60;

export type BottomButtonType =
  | 'inviter-video'
  | 'inviter-audio'
  | 'inviter-timeout'
  | 'invitee-video-init'
  | 'invitee-video-loading'
  | 'invitee-video-calling'
  | 'invitee-audio-init'
  | 'invitee-audio-loading'
  | 'invitee-audio-calling';

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
  bottomButtonType?: BottomButtonType;
  muteVideo?: boolean;
  callType: 'audio' | 'video';
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
  isInSpeaker: boolean;
  muteMicrophone: boolean;
  muteCamera: boolean;
  bottomButtonType: BottomButtonType;
  muteVideo: boolean;
};
export abstract class BasicCall<
    Props extends BasicCallProps,
    State extends BasicCallState
  >
  extends React.Component<Props, State>
  implements CallViewListener
{
  constructor(props: Props) {
    super(props);
    this.setState({
      channelId: 'magic',
    });
  }
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

  protected abstract onClickHangUp: () => void;
  protected abstract onClickSpeaker: () => void;
  protected abstract onClickMicrophone: () => void;
  protected abstract onClickVideo: () => void;
  protected abstract onClickRecall: () => void;
  protected abstract onClickClose: () => void;
  protected abstract onClickAccept: () => void;

  //////////////////////////////////////////////////////////////////////////////
  //// Render //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  protected renderBody(): React.ReactNode {
    throw new Error('Requires subclass implementation.');
  }

  // eslint-disable-next-line react/sort-comp
  render(): React.ReactNode {
    return this.renderBody();
  }

  protected renderBottomMenu(): React.ReactNode {
    const { bottomButtonType, isInSpeaker, muteMicrophone, muteVideo } =
      this.state;
    calllog.log('test:renderBottomMenu', bottomButtonType);
    const disabled = true;
    let ret = <></>;
    const speaker = (): BottomMenuButtonType => {
      return isInSpeaker ? 'mute-speaker' : 'speaker';
    };
    const microphone = (): BottomMenuButtonType => {
      return muteMicrophone ? 'mute-microphone' : 'microphone';
    };
    const video = (): BottomMenuButtonType => {
      return muteVideo ? 'mute-video' : 'video';
    };
    const Container = (props: React.PropsWithChildren<{}>) => {
      const { children } = props;
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            position: 'absolute',
            bottom: BottomBarHeight,
            width: '100%',
          }}
        >
          {children}
        </View>
      );
    };
    switch (bottomButtonType) {
      case 'inviter-audio':
        ret = (
          <Container>
            <BottomMenuButton name={speaker()} onPress={this.onClickSpeaker} />
            <BottomMenuButton
              name={microphone()}
              onPress={this.onClickMicrophone}
            />
            <BottomMenuButton name="hangup" onPress={this.onClickHangUp} />
          </Container>
        );
        break;
      case 'inviter-video':
        ret = (
          <Container>
            <BottomMenuButton name={video()} onPress={this.onClickVideo} />
            <BottomMenuButton
              name={microphone()}
              onPress={this.onClickMicrophone}
            />
            <BottomMenuButton name="hangup" onPress={this.onClickHangUp} />
          </Container>
        );
        break;
      case 'inviter-timeout':
        ret = (
          <Container>
            <BottomMenuButton name="recall" onPress={this.onClickRecall} />
            <BottomMenuButton name="close" onPress={this.onClickClose} />
          </Container>
        );
        break;
      case 'invitee-video-init':
        ret = (
          <Container>
            <BottomMenuButton name={video()} onPress={this.onClickVideo} />
            <BottomMenuButton name="hangup" onPress={this.onClickHangUp} />
            <BottomMenuButton name="accept" onPress={this.onClickAccept} />
          </Container>
        );
        break;
      case 'invitee-video-loading':
        ret = (
          <Container>
            <BottomMenuButton name={video()} onPress={this.onClickVideo} />
            <BottomMenuButton name="hangup" onPress={this.onClickHangUp} />
            <BottomMenuButton name="accepting" disabled={disabled} />
          </Container>
        );
        break;
      case 'invitee-video-calling':
        ret = (
          <Container>
            <BottomMenuButton name={video()} onPress={this.onClickVideo} />
            <BottomMenuButton
              name={microphone()}
              onPress={this.onClickMicrophone}
            />
            <BottomMenuButton name="hangup" onPress={this.onClickHangUp} />
          </Container>
        );
        break;
      case 'invitee-audio-init':
        ret = (
          <Container>
            <BottomMenuButton name="hangup" onPress={this.onClickHangUp} />
            <BottomMenuButton name="accept" onPress={this.onClickAccept} />
          </Container>
        );
        break;
      case 'invitee-audio-loading':
        ret = (
          <Container>
            <BottomMenuButton name="hangup" onPress={this.onClickHangUp} />
            <BottomMenuButton name="accepting" disabled={disabled} />
          </Container>
        );
        break;
      case 'invitee-audio-calling':
        ret = (
          <Container>
            <BottomMenuButton
              name={microphone()}
              onPress={this.onClickMicrophone}
            />
            <BottomMenuButton name="hangup" onPress={this.onClickHangUp} />
          </Container>
        );
        break;

      default:
        break;
    }
    return ret;
  }

  //////////////////////////////////////////////////////////////////////////////
  //// CallViewListener ////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

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

  onRemoteUserMuteVideo(params: {
    channelId: string;
    userId: string;
    userChannelId: number;
    muted: boolean;
  }): void {
    calllog.log('BasicCall:onRemoteUserMuteVideo:', params);
    throw new Error('Requires subclass implementation.');
  }

  onRemoteUserMuteAudio(params: {
    channelId: string;
    userId: string;
    userChannelId: number;
    muted: boolean;
  }): void {
    calllog.log('BasicCall:onRemoteUserMuteAudio:', params);
    throw new Error('Requires subclass implementation.');
  }
}
