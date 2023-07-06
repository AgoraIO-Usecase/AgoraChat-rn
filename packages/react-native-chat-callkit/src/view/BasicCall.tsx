import { BlurView } from '@react-native-community/blur';
import * as React from 'react';
import { StatusBar, View } from 'react-native';
import type { VideoViewSetupMode } from 'react-native-agora';

import { calllog } from '../call/CallConst';
import type { CallError } from '../call/CallError';
import type { CallManagerImpl } from '../call/CallManagerImpl';
import type { CallUser } from '../call/CallUser';
import type { CallViewListener } from '../call/CallViewListener';
import { CallEndReason, CallState, CallType } from '../enums';
import {
  BottomMenuButton,
  type BottomMenuButtonType,
} from './components/BottomMenuButton';
import Image from './components/Image';
import { IconSize, localLocalIcon } from './components/LocalIcon';

export const StateBarHeight = StatusBar.currentHeight ?? 44;
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
  inviterId: string;
  inviterName?: string;
  inviterAvatar?: string;
  currentId: string;
  currentName?: string;
  currentAvatar?: string;
  timeout?: number;
  bottomButtonType?: BottomButtonType;
  muteVideo?: boolean;
  callType: 'audio' | 'video';
  isInviter: boolean;
  callState?: CallState;
  isMinimize?: boolean;
  isTest?: boolean;
  onHangUp?: () => void;
  onCancel?: () => void;
  onRefuse?: () => void;
  onClose: (elapsed: number, reason?: CallEndReason) => void;
  onError?: (error: CallError) => void;
  onInitialized?: () => void;
  onSelfJoined?: () => void;
};
export type BasicCallState = {
  joinChannelSuccess: boolean;
  selfUid: number;
  setupMode: VideoViewSetupMode;
  isInSpeaker: boolean;
  muteMicrophone: boolean;
  bottomButtonType: BottomButtonType;
  muteVideo: boolean;
  callState: CallState;
  isMinimize: boolean;
  elapsed: number; // ms unit
  reason?: CallEndReason;
  error?: CallError;
  selfInfo?: CallUser;
};
export abstract class BasicCall<
    Props extends BasicCallProps,
    State extends BasicCallState
  >
  extends React.Component<Props, State>
  implements CallViewListener
{
  protected _inviteeTimer?: NodeJS.Timeout;
  protected _startPreview: boolean;
  protected channelId: string;
  protected callId: string;

  constructor(props: Props) {
    super(props);
    this._startPreview = true;
    this.channelId = '';
    this.callId = '';
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

  protected async getUserInfoAsync(
    userId: string
  ): Promise<CallUser | undefined> {
    return new Promise(
      (
        resolve: (value: CallUser | undefined) => void,
        reject: (reason?: any) => void
      ) => {
        if (this.manager?.requestUserInfo) {
          this.manager?.requestUserInfo?.({
            userId: userId,
            onResult: ({ user, error }) => {
              if (error === undefined) {
                resolve(user);
              } else {
                reject(error);
              }
            },
          });
        } else {
          resolve(undefined);
        }
      }
    );
  }

  onClickHangUp = () => {
    const { isInviter, onHangUp, onCancel, onRefuse } = this.props;
    const { callState } = this.state;
    const callId = this.manager?.getCurrentCallId();
    if (callId === undefined) {
      calllog.warn('BasicCall:onClickHangUp:hangUpCall:', 'call id is empty.');
      return;
    }
    this.callId = callId;
    if (isInviter === true) {
      if (callState === CallState.Calling) {
        this.manager?.hangUpCall({
          callId: callId,
          onResult: (params: {
            callId?: string | undefined;
            error?: CallError | undefined;
          }) => {
            calllog.log('BasicCall:onClickHangUp:hangUpCall:', params);
          },
        });
        onHangUp?.();
      } else {
        this.manager?.cancelCall({
          callId: callId,
          onResult: (params: {
            callId?: string | undefined;
            error?: CallError | undefined;
          }) => {
            calllog.log('BasicCall:onClickHangUp:cancelCall:', params);
          },
        });
        onCancel?.();
      }
    } else {
      clearTimeout(this._inviteeTimer);
      this._inviteeTimer = undefined;
      if (callState === CallState.Calling) {
        this.manager?.hangUpCall({
          callId: callId,
          onResult: (params: {
            callId?: string | undefined;
            error?: CallError | undefined;
          }) => {
            calllog.log('BasicCall:onClickHangUp:hangUpCall:', params);
          },
        });
        onHangUp?.();
      } else {
        this.manager?.refuseCall({
          callId: callId,
          onResult: (params: {
            callId?: string | undefined;
            error?: CallError | undefined;
          }) => {
            calllog.log('BasicCall:onClickHangUp:refuseCall:', params);
          },
        });
        onRefuse?.();
      }
    }
  };
  onClickSpeaker = () => {
    const isIn = this.state.isInSpeaker;
    calllog.log('BasicCall:onClickSpeaker:', isIn);
    this.setState({ isInSpeaker: !isIn });
    this.manager?.setEnableSpeakerphone(!isIn);
  };
  onClickMicrophone = () => {
    const mute = this.state.muteMicrophone;
    calllog.log('BasicCall:onClickMicrophone:', mute);
    this.setState({ muteMicrophone: !mute });
    this.manager?.enableLocalAudio(mute);
  };
  onClickVideo = () => {
    const mute = this.state.muteVideo;
    calllog.log('BasicCall:onClickVideo:');
    this.setState({ muteVideo: !mute });
    this.manager?.enableLocalVideo(mute);
  };
  onClickRecall = () => {};
  onClickClose = () => {
    this.setState({ callState: CallState.Idle });
    const { onClose, onError } = this.props;
    const { elapsed, reason, error } = this.state;
    if (error) {
      onError?.(error);
    } else {
      onClose(this.manager?.elapsed ?? elapsed, reason);
    }
  };
  onClickAccept = () => {
    clearTimeout(this._inviteeTimer);
    this._inviteeTimer = undefined;
    if (this.props.callType === 'audio') {
      this.setState({ bottomButtonType: 'invitee-audio-loading' });
    } else {
      this.setState({ bottomButtonType: 'invitee-video-loading' });
    }
    const callId = this.manager?.getCurrentCallId();
    if (callId) {
      this.callId = callId;
      this.manager?.acceptCall({
        callId: callId,
        onResult: (params: {
          callId?: string | undefined;
          error?: CallError | undefined;
        }) => {
          calllog.log('BasicCall:onClickAccept:acceptCall:', params);
        },
      });
    }
  };
  switchCamera = () => {
    calllog.log('BasicCall:switchCamera:');
    this.manager?.switchCamera();
  };

  //////////////////////////////////////////////////////////////////////////////
  //// Render //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  protected renderBody(): React.ReactNode {
    throw new Error('Requires subclass implementation.');
  }

  render(): React.ReactNode {
    return this.renderBody();
  }

  protected renderBackground(): React.ReactNode {
    return (
      <View style={{ flex: 1 }}>
        <Image
          resizeMode="contain"
          source={localLocalIcon('bg', IconSize.ICON_MAX)}
          style={{}}
        />
        <BlurView
          style={{
            position: 'absolute',
            flex: 1,
            height: '100%',
            width: '100%',
          }}
          blurType="light" // Values = dark, light, xlight .
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        />
      </View>
    );
  }

  protected renderBottomMenu(): React.ReactNode {
    const { bottomButtonType, isInSpeaker, muteMicrophone, muteVideo } =
      this.state;
    const params = {
      bottomButtonType,
      isInSpeaker,
      muteMicrophone,
      muteVideo,
      onClickSpeaker: this.onClickSpeaker,
      onClickHangUp: this.onClickHangUp,
      onClickVideo: this.onClickVideo,
      onClickRecall: this.onClickRecall,
      onClickAccept: this.onClickAccept,
      onClickClose: this.onClickClose,
      onClickMicrophone: this.onClickMicrophone,
    };
    return <RenderBottomMenuMemo {...params} />;
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
    this.manager?.leaveChannel();
    this.setState({ reason: params.endReason, elapsed: params.elapsed });
    this.onClickClose();
  }

  onCallOccurError(params: { channelId: string; error: CallError }): void {
    calllog.log('BasicCall:onCallOccurError:', params);
    this.manager?.leaveChannel();
    this.setState({ error: params.error, elapsed: 0 });
    this.onClickClose();
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
  onRemoveRemoteUser(params: {
    channelId: string;
    userChannelId?: number;
    userId: string;
    reason?: CallEndReason;
  }): void {
    calllog.log('BasicCall:onRemoveRemoteUser:', params);
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

  onAudioVolumeIndication(_params: {
    channelId: string;
    speakerNumber: number;
    speakers: {
      userId: string;
      userChannelId: number;
      totalVolume: number;
    }[];
  }): void {
    // calllog.log('BasicCall:onAudioVolumeIndication:', params);
  }

  onLocalVideoStateChanged(params: {
    channelId: string;
    userId: string;
    userChannelId: number;
    muted: boolean;
  }): void {
    calllog.log('BasicCall:onLocalVideoStateChanged:', params);
  }

  onLocalAudioStateChanged(params: {
    channelId: string;
    userId: string;
    userChannelId: number;
    muted: boolean;
  }): void {
    calllog.log('BasicCall:onLocalAudioStateChanged:', params);
  }
}
type RenderBottomMenuProps = {
  isInSpeaker: boolean;
  muteMicrophone: boolean;
  bottomButtonType: BottomButtonType;
  muteVideo: boolean;
  onClickSpeaker: () => void;
  onClickHangUp: () => void;
  onClickVideo: () => void;
  onClickRecall: () => void;
  onClickAccept: () => void;
  onClickClose: () => void;
  onClickMicrophone: () => void;
};
function RenderBottomMenu(props: RenderBottomMenuProps): JSX.Element {
  const {
    bottomButtonType,
    isInSpeaker,
    muteMicrophone,
    muteVideo,
    onClickSpeaker,
    onClickHangUp,
    onClickVideo,
    onClickRecall,
    onClickAccept,
    onClickClose,
    onClickMicrophone,
  } = props;
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
  // eslint-disable-next-line react/no-unstable-nested-components
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
          <BottomMenuButton name={speaker()} onPress={onClickSpeaker} />
          <BottomMenuButton name={microphone()} onPress={onClickMicrophone} />
          <BottomMenuButton name="hangup" onPress={onClickHangUp} />
        </Container>
      );
      break;
    case 'inviter-video':
      ret = (
        <Container>
          <BottomMenuButton name={video()} onPress={onClickVideo} />
          <BottomMenuButton name={microphone()} onPress={onClickMicrophone} />
          <BottomMenuButton name="hangup" onPress={onClickHangUp} />
        </Container>
      );
      break;
    case 'inviter-timeout':
      ret = (
        <Container>
          <BottomMenuButton name="recall" onPress={onClickRecall} />
          <BottomMenuButton name="close" onPress={onClickClose as any} />
        </Container>
      );
      break;
    case 'invitee-video-init':
      ret = (
        <Container>
          <BottomMenuButton name={video()} onPress={onClickVideo} />
          <BottomMenuButton name="hangup" onPress={onClickHangUp} />
          <BottomMenuButton name="accept" onPress={onClickAccept} />
        </Container>
      );
      break;
    case 'invitee-video-loading':
      ret = (
        <Container>
          <BottomMenuButton name={video()} onPress={onClickVideo} />
          <BottomMenuButton name="hangup" onPress={onClickHangUp} />
          <BottomMenuButton name="accepting" disabled={disabled} />
        </Container>
      );
      break;
    case 'invitee-video-calling':
      ret = (
        <Container>
          <BottomMenuButton name={video()} onPress={onClickVideo} />
          <BottomMenuButton name={microphone()} onPress={onClickMicrophone} />
          <BottomMenuButton name="hangup" onPress={onClickHangUp} />
        </Container>
      );
      break;
    case 'invitee-audio-init':
      ret = (
        <Container>
          <BottomMenuButton name="hangup" onPress={onClickHangUp} />
          <BottomMenuButton name="accept" onPress={onClickAccept} />
        </Container>
      );
      break;
    case 'invitee-audio-loading':
      ret = (
        <Container>
          <BottomMenuButton name="hangup" onPress={onClickHangUp} />
          <BottomMenuButton name="accepting" disabled={disabled} />
        </Container>
      );
      break;
    case 'invitee-audio-calling':
      ret = (
        <Container>
          <BottomMenuButton name={speaker()} onPress={onClickSpeaker} />
          <BottomMenuButton name={microphone()} onPress={onClickMicrophone} />
          <BottomMenuButton name="hangup" onPress={onClickHangUp} />
        </Container>
      );
      break;

    default:
      break;
  }
  return ret;
}

const RenderBottomMenuMemo = React.memo(RenderBottomMenu);
