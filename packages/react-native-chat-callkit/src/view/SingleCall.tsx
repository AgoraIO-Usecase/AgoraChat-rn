import * as React from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { RtcSurfaceView, VideoViewSetupMode } from 'react-native-agora';

import type { CallError } from '../call';
import { calllog, KeyTimeout } from '../call/CallConst';
import { createManagerImpl } from '../call/CallManagerImpl';
import { CallEndReason, CallState, CallType } from '../enums';
import {
  BasicCall,
  BasicCallProps,
  BasicCallState,
  BottomButtonType,
} from './BasicCall';
import { Avatar } from './components/Avatar';
import Draggable from './components/Draggable';
import { Elapsed } from './components/Elapsed';
import { IconButton } from './components/IconButton';
import { MiniButton } from './components/MiniButton';

const StateBarHeight = 44;

export type SingleCallProps = BasicCallProps & {
  inviteeId: string;
};
export type SingleCallState = BasicCallState & {
  peerJoinChannelSuccess: boolean;
  peerUid: number;
  isSwitchVideo: boolean;
};

export class SingleCall extends BasicCall<SingleCallProps, SingleCallState> {
  constructor(props: SingleCallProps) {
    super(props);
    this.state = {
      isMinimize: props.isMinimize ?? false,
      callState: props.callState ?? CallState.Connecting,
      bottomButtonType:
        props.bottomButtonType ??
        (props.isInviter
          ? props.callType === 'audio'
            ? 'inviter-audio'
            : 'inviter-video'
          : props.callType === 'audio'
          ? 'invitee-audio-init'
          : 'invitee-video-init'),
      muteVideo: props.muteVideo ?? false,
      channelId: '',
      callId: '',
      startPreview: false,
      joinChannelSuccess: false,
      peerJoinChannelSuccess: false,
      elapsed: props.elapsed ?? 0,
      selfUid: 0,
      peerUid: 1,
      setupMode: VideoViewSetupMode.VideoViewSetupAdd,
      isSwitchVideo: false,
      muteCamera: false,
      muteMicrophone: false,
      isInSpeaker: true,
    };
  }

  protected init(): void {
    if (this.props.isTest === true) {
      return;
    }
    this.manager = createManagerImpl();
    this.manager?.setCurrentUser({
      userId: this.props.currentId,
      userNickName: this.props.currentName,
      userAvatarUrl: this.props.currentUrl,
    });

    this.manager?.initRTC();

    if (this.props.callType === 'audio') {
      this.manager?.enableAudio();
    } else {
      this.manager?.enableVideo();
      this.manager?.startPreview();
      this.setState({ startPreview: true });
    }

    this.manager?.addViewListener(this);
    if (this.props.isInviter === true) {
      if (this.state.callState === CallState.Connecting) {
        this.startCall();
      }
    } else {
      this._inviteeTimer = setTimeout(() => {
        this.onClickClose();
      }, this.props.timeout ?? KeyTimeout);
    }
  }
  protected unInit(): void {
    if (this.props.isTest === true) {
      return;
    }
    if (this.props.callType === 'audio') {
      // this.manager?.disableAudio();
    } else {
      // this.manager?.disableVideo();
      // this.manager?.stopPreview();
      this.setState({
        startPreview: false,
        joinChannelSuccess: false,
        peerJoinChannelSuccess: false,
      });
    }

    this.manager?.unInitRTC();

    this.manager?.removeViewListener(this);
    this.manager?.clear();
  }

  private startCall() {
    if (this.manager) {
      const channelId = this.manager.createChannelId();
      this.setState({ channelId });
      switch (this.props.callType) {
        case 'audio':
          this.manager.startSingleAudioCall({
            inviteeId: this.props.inviteeId,
            channelId: channelId,
            onResult: (params) => {
              calllog.log('SingleCall:startSingleAudioCall:', params);
              if (params.error) {
                throw params.error;
              }
              if (params.callId) {
                this.setState({ callId: params.callId });
              }
            },
          });
          break;
        case 'video':
          this.manager.startSingleVideoCall({
            inviteeId: this.props.inviteeId,
            channelId: channelId,
            onResult: (params) => {
              calllog.log('SingleCall:startSingleVideoCall:', params);
              if (params.error) {
                throw params.error;
              }
              if (params.callId) {
                this.setState({ callId: params.callId });
              }
            },
          });
          break;
        default:
          break;
      }
    }
  }

  private updateBottomButtons(): void {
    const { peerJoinChannelSuccess, joinChannelSuccess } = this.state;
    if (peerJoinChannelSuccess && joinChannelSuccess) {
      if (this.props.isInviter === false) {
        let s;
        if (this.props.callType === 'audio') {
          s = 'invitee-audio-calling' as BottomButtonType;
        } else {
          s = 'invitee-video-calling' as BottomButtonType;
        }
        this.setState({ bottomButtonType: s });
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  //// OnButton ////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  onSwitchVideo = () => {
    calllog.log(
      'SingleCall:onClickAccept:onSwitchVideo:',
      this.state.isSwitchVideo
    );
    this.setState({ isSwitchVideo: !this.state.isSwitchVideo });
  };

  //////////////////////////////////////////////////////////////////////////////
  //// CallViewListener ////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  onCallEnded(params: {
    channelId: string;
    callType: CallType;
    endReason: CallEndReason;
    elapsed: number;
  }): void {
    calllog.log('SingleCall:onCallEnded:', params);
    this.manager?.leaveChannel();
    this.onClickClose();
  }

  onCallOccurError(params: { channelId: string; error: CallError }): void {
    calllog.log('SingleCall:onCallOccurError:', params);
    this.manager?.leaveChannel();
    this.onClickClose();
  }

  onRequestJoin(params: {
    channelId: string;
    userId: string;
    userChannelId: number;
    userRTCToken: string;
  }): void {
    calllog.log('SingleCall:onRequestJoin:', params);
    this.manager?.joinChannel(params);
  }

  onRemoteUserJoined(params: {
    channelId: string;
    userChannelId: number;
    userId: string;
  }): void {
    calllog.log('SingleCall:onRemoteUserJoined:', params);
    this.setState({
      peerJoinChannelSuccess: true,
      peerUid: params.userChannelId,
    });
    this.updateBottomButtons();
  }

  onSelfJoined(params: {
    channelId: string;
    userChannelId: number;
    userId: string;
    elapsed: number;
  }): void {
    calllog.log('SingleCall:onSelfJoined:', params);
    this.setState({
      joinChannelSuccess: true,
      elapsed: params.elapsed,
      selfUid: params.userChannelId,
    });
    this.setState({ callState: CallState.Calling });
    this.updateBottomButtons();
  }

  onRemoteUserOffline(params: {
    channelId: string;
    userChannelId: number;
    userId: string;
  }): void {
    calllog.log('SingleCall:onRemoteUserOffline:', params);
    this.setState({ peerJoinChannelSuccess: false });
  }

  onRemoveRemoteUser(params: {
    channelId: string;
    userChannelId?: number;
    userId: string;
    reason?: CallEndReason;
  }): void {
    calllog.log('SingleCall:onRemoveRemoteUser:', params);
  }

  onSelfLeave(params: {
    channelId: string;
    userChannelId: number;
    userId: string;
  }): void {
    calllog.log('SingleCall:onSelfLeave:', params);
    this.setState({ joinChannelSuccess: false });
  }

  onRemoteUserMuteVideo(params: {
    channelId: string;
    userId: string;
    userChannelId: number;
    muted: boolean;
  }): void {
    calllog.log('SingleCall:onRemoteUserMuteVideo:', params);
  }

  onRemoteUserMuteAudio(params: {
    channelId: string;
    userId: string;
    userChannelId: number;
    muted: boolean;
  }): void {
    calllog.log('SingleCall:onRemoteUserMuteAudio:', params);
  }

  //////////////////////////////////////////////////////////////////////////////
  //// Render //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  protected renderSelfVideo(): React.ReactNode {
    const {
      isMinimize,
      setupMode,
      startPreview,
      joinChannelSuccess,
      callState,
      selfUid,
    } = this.state;
    calllog.log('SingleCall:renderSelfVideo:', selfUid);
    if (isMinimize === true) {
      return null;
    }
    if (this.props.callType === 'audio') {
      return null;
    }
    if (callState === CallState.Idle) {
      return null;
    }
    if (startPreview !== true && joinChannelSuccess !== true) {
      return null;
    }
    return (
      <RtcSurfaceView
        style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}
        canvas={{
          uid: 0,
          setupMode,
        }}
        key={selfUid}
      />
    );
  }

  protected renderPeerVideo(): React.ReactNode {
    const { peerUid, setupMode, peerJoinChannelSuccess, callState } =
      this.state;
    calllog.log('SingleCall:renderPeerVideo:', peerUid);
    if (this.props.callType === 'audio') {
      return null;
    }
    if (callState === CallState.Idle) {
      return null;
    }
    if (peerJoinChannelSuccess !== true) {
      return null;
    }
    return (
      <RtcSurfaceView
        style={{ flex: 1 }}
        canvas={{
          uid: peerUid,
          setupMode,
        }}
        key={peerUid}
      />
    );
  }

  protected renderMiniVideo(): React.ReactNode {
    calllog.log('SingleCall:renderMiniVideo:');
    if (this.props.callType === 'audio') {
      return null;
    }
    const { isSwitchVideo, isMinimize, callState } = this.state;
    let ret = null;
    if (callState === CallState.Calling) {
      if (isMinimize === true) {
        ret = this.renderPeerVideo();
      } else {
        if (isSwitchVideo === true) {
          ret = this.renderPeerVideo();
        } else {
          ret = this.renderSelfVideo();
        }
      }
    } else {
      if (isMinimize === true) {
        ret = this.renderPeerVideo();
      } else {
        if (isSwitchVideo === true) {
          ret = this.renderSelfVideo();
        } else {
          ret = this.renderPeerVideo();
        }
      }
    }
    return ret;
  }

  protected renderFullVideo(): React.ReactNode {
    calllog.log('SingleCall:renderFullVideo:');
    if (this.props.callType === 'audio') {
      return null;
    }
    const { isSwitchVideo, isMinimize, callState } = this.state;
    // let renderType = 0 as 0 | 1 | 2; // 0: no, 1: self, 2: peer
    let ret = null;
    if (callState === CallState.Calling) {
      if (isMinimize === false) {
        if (isSwitchVideo === true) {
          ret = this.renderSelfVideo();
        } else {
          ret = this.renderPeerVideo();
        }
      }
    } else {
      if (isMinimize === false) {
        if (isSwitchVideo === true) {
          ret = this.renderPeerVideo();
        } else {
          ret = this.renderSelfVideo();
        }
      }
    }
    return ret;
  }

  protected renderTopBar(): React.ReactNode {
    return (
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          top: StateBarHeight,
          // backgroundColor: 'red',
        }}
      >
        <View
          style={{
            marginLeft: 15,
          }}
        >
          <MiniButton
            iconName="chevron_left"
            color="white"
            backgroundColor="rgba(0, 0, 0, 0.0)"
            size={28}
            onPress={() => {
              this.setState({ isMinimize: true });
            }}
          />
        </View>
        <View style={{ flexGrow: 1 }} />
        <View
          style={{
            marginRight: 15,
          }}
        >
          <IconButton
            iconName="camera_spin"
            color="white"
            backgroundColor="rgba(255, 255, 255, 0.2)"
            size={28}
            containerSize={40}
            onPress={this.switchCamera}
          />
        </View>
      </View>
    );
  }
  protected renderAvatar(): React.ReactNode {
    const { elapsed, callType, isInviter } = this.props;
    const { callState } = this.state;
    return (
      <View
        style={{
          alignItems: 'center',
          // backgroundColor: 'red',
        }}
      >
        <View style={{ height: 60 }} />
        <Avatar uri="" size={100} radius={100} />
        <View style={{ marginVertical: 10 }}>
          <Text
            style={{
              fontSize: 24,
              lineHeight: 28.64,
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            Monika
          </Text>
        </View>
        {callState === CallState.Calling ? (
          <Elapsed timer={elapsed} />
        ) : (
          <Text
            style={{
              fontSize: 16,
              lineHeight: 22,
              fontWeight: '400',
              textAlign: 'center',
            }}
          >
            {isInviter === true
              ? 'Calling'
              : callType === 'audio'
              ? 'Audio Call'
              : 'Video Call'}
          </Text>
        )}
      </View>
    );
  }

  protected renderFloatAudio(): React.ReactNode {
    const { elapsed } = this.props;
    const { callState } = this.state;
    const content = 'Calling...';
    return (
      <View
        style={{
          width: 76,
          height: 76,
          // position: 'absolute',
          backgroundColor: 'grey',
          // right: 10,
          // top: 54,
          borderRadius: 12,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Avatar uri="" size={36} />
          {callState === CallState.Calling ? (
            <Elapsed timer={elapsed} />
          ) : (
            <Text
              style={{
                fontSize: 14,
                lineHeight: 18,
                fontWeight: '400',
                textAlign: 'center',
              }}
            >
              {content}
            </Text>
          )}
        </View>
      </View>
    );
  }

  protected renderFloatVideo(): React.ReactNode {
    const { elapsed } = this.props;
    const { callState, isMinimize, muteVideo } = this.state;
    const content = 'Calling...';
    calllog.log('renderFloatVideo:', isMinimize);
    if (isMinimize === true) {
      return (
        <View
          style={{
            width: callState === CallState.Calling ? 90 : 76,
            height: callState === CallState.Calling ? 160 : 76,
            // position: 'absolute',
            backgroundColor: 'grey',
            // right: 10,
            // top: 54,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {this.renderMiniVideo()}
          {callState === CallState.Calling ? (
            <View
              style={{
                flex: 1,
                marginBottom: 10,
                alignSelf: 'center',
                // backgroundColor: 'green',
                position: 'absolute',
                bottom: 7,
              }}
            >
              <Elapsed timer={elapsed} />
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Avatar uri="" size={36} />
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 18,
                  fontWeight: '400',
                  textAlign: 'center',
                }}
              >
                {content}
              </Text>
            </View>
          )}
        </View>
      );
    } else {
      if (this.state.peerJoinChannelSuccess === false) {
        return null;
      }
      return (
        <Pressable
          onPress={this.onSwitchVideo}
          style={{
            width: muteVideo === false ? 90 : 76,
            height: muteVideo === false ? 160 : 76,
            position: 'absolute',
            backgroundColor: 'grey',
            right: 10,
            top: 10,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {this.renderMiniVideo()}
          {muteVideo === false ? null : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#909090',
                borderRadius: 12,
              }}
            >
              <Avatar uri="" size={36} />
              <View
                style={{
                  position: 'absolute',
                  bottom: 7,
                  right: 7,
                  // backgroundColor: 'red',
                  width: 16,
                  height: 16,
                }}
              >
                <MiniButton
                  iconName="video_slash"
                  size={16}
                  color="white"
                  backgroundColor="rgba(0,0,0,0.0)"
                />
              </View>
            </View>
          )}
        </Pressable>
      );
    }
  }
  protected renderContent(): React.ReactNode {
    const { callType, isInviter } = this.props;
    const { callState } = this.state;
    let content = null;
    if (
      callType === 'audio' ||
      (isInviter === true && callState !== CallState.Calling)
    ) {
      content = this.renderAvatar();
    } else {
      content = this.renderFloatVideo();
    }
    return (
      <View
        style={{
          // flex: 1,
          alignItems: 'center',
          position: 'absolute',
          width: '100%',
          top: 100,
        }}
      >
        {content}
      </View>
    );
  }
  protected renderBody(): React.ReactNode {
    const { width: screenWidth, height: screenHeight } =
      Dimensions.get('window');
    const { callType } = this.props;
    const { isMinimize } = this.state;
    if (isMinimize) {
      let ret = undefined;
      if (callType === 'audio') {
        ret = this.renderFloatAudio();
      } else {
        ret = this.renderFloatVideo();
      }
      return (
        <Draggable
          x={Dimensions.get('window').width - (callType === 'audio' ? 86 : 100)}
          y={54}
          onShortPressRelease={() => {
            this.setState({ isMinimize: false });
          }}
        >
          {ret}
        </Draggable>
      );
    }
    return (
      <View
        style={{
          position: 'absolute',
          width: screenWidth,
          height: screenHeight,
          backgroundColor: 'rgb(199, 197, 208)',
        }}
      >
        {this.renderFullVideo()}
        {/* <View style={{ flex: 1, backgroundColor: 'blue' }} /> */}
        {this.renderTopBar()}
        {this.renderContent()}
        {this.renderBottomMenu()}
      </View>
    );
  }
}
