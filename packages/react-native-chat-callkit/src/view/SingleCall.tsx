import * as React from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';

import type { CallError } from '../call';
import { calllog } from '../call/CallConst';
import { createManagerImpl } from '../call/CallManagerImpl';
import { CallEndReason, CallState, CallType } from '../enums';
import { BasicCall, BasicCallProps, BasicCallState } from './BasicCall';
import { Avatar } from './components/Avatar';
import { BottomMenuButton } from './components/BottomMenuButton';
import { Elapsed } from './components/Elapsed';
import { IconButton } from './components/IconButton';
import { MiniButton } from './components/MiniButton';

const StateBarHeight = 44;
const BottomBarHeight = 60;

type BottomButtonType =
  | 'inviter-video'
  | 'inviter-audio'
  | 'inviter-timeout'
  | 'invitee-video-init'
  | 'invitee-video-loading'
  | 'invitee-video-calling'
  | 'invitee-audio-init'
  | 'invitee-audio-loading'
  | 'invitee-audio-calling';

export type SingleCallProps = BasicCallProps & {
  isMinimize?: boolean;
  elapsed: number; // second unit
  isInviter: boolean;
  inviteeId: string;
  callState?: CallState;
  callType: 'video' | 'audio';
  bottomButtonType?: BottomButtonType;
  muteVideo?: boolean;
  onHangUp?: () => void;
  onCancel?: () => void;
  onRefuse?: () => void;
  onClose?: () => void;
  onError?: () => void;
  isTest?: boolean;
};
export type SingleCallState = BasicCallState & {
  isMinimize: boolean;
  callState: CallState;
  callType: 'video' | 'audio';
  bottomButtonType: BottomButtonType;
  muteVideo: boolean;
};

export class SingleCall extends BasicCall<SingleCallProps, SingleCallState> {
  constructor(props: SingleCallProps) {
    super(props);
    this.state = {
      isMinimize: props.isMinimize ?? false,
      callState: props.callState ?? CallState.Connecting,
      callType: props.callType,
      bottomButtonType:
        props.bottomButtonType ??
        (props.isInviter
          ? props.callType === 'audio'
            ? 'inviter-audio'
            : 'inviter-video'
          : props.callType === 'audio'
          ? 'invitee-audio-loading'
          : 'invitee-video-loading'),
      muteVideo: props.muteVideo ?? false,
      channelId: '',
      callId: '',
    };
  }

  protected init(): void {
    if (this.props.isTest === true) {
      return;
    }
    this.manager = createManagerImpl();
    // this.manager?.init({
    //   option: {
    //     agoraAppId: this.props.appKey,
    //     callTimeout: this.props.timeout ?? 30000,
    //     ringFilePath: '', // TODO:
    //   } as CallOption,
    //   enableLog: true,
    //   requestRTCToken: this.props.requestRTCToken,
    //   requestUserMap: this.props.requestUserMap,
    //   listener: this,
    //   onResult: () => {
    //     console.log('test:init:onResult:');
    //     if (this.props.isInviter === true) {
    //       if (this.state.callState === CallState.Connecting) {
    //         this.startCall();
    //       }
    //     }
    //   },
    // });
    // this.manager?.clear();
    this.manager?.setCurrentUser({
      userId: this.props.currentId,
      userNickName: this.props.currentName,
      userAvatarUrl: this.props.currentUrl,
    });
    this.manager?.addViewListener(this);
    if (this.props.isInviter === true) {
      if (this.state.callState === CallState.Connecting) {
        this.startCall();
      }
    }
  }
  protected unInit(): void {
    if (this.props.isTest === true) {
      return;
    }
    this.manager?.removeViewListener(this);
    this.manager?.clear();
    // this.manager?.unInit();
  }

  private startCall() {
    if (this.manager) {
      this.setState({ channelId: this.manager.createChannelId() });
      switch (this.props.callType) {
        case 'audio':
          this.manager.startSingleAudioCall({
            inviteeId: this.props.inviteeId,
            channelId: this.state.channelId,
            onResult: (params) => {
              calllog.log('SingleCall:startSingleAudioCall:', params);
              if (params.callId) {
                if (params.error) {
                  throw params.error;
                }
                this.setState({ callId: params.callId });
              }
            },
          });
          break;
        case 'video':
          this.manager.startSingleVideoCall({
            inviteeId: this.props.inviteeId,
            channelId: this.state.channelId,
            onResult: (params) => {
              calllog.log('SingleCall:startSingleAudioCall:', params);
              if (params.callId) {
                if (params.error) {
                  throw params.error;
                }
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

  //////////////////////////////////////////////////////////////////////////////
  //// OnButton ////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  onClickHangUp = () => {
    const { isInviter, onHangUp, onCancel, onRefuse } = this.props;
    const { callState } = this.state;
    this.manager?.hangUpCall({
      callId: this.state.callId,
      onResult: (params) => {
        calllog.log('SingleCall:onClickHangUp:', params);
      },
    });
    if (isInviter === true) {
      if (callState === CallState.Calling) {
        onHangUp?.();
      } else {
        onCancel?.();
      }
    } else {
      if (callState === CallState.Calling) {
        onHangUp?.();
      } else {
        onRefuse?.();
      }
    }
  };
  onClickSpeaker = () => {};
  onClickMicrophone = () => {};
  onClickVideo = () => {};
  onClickRecall = () => {};
  onClickClose = () => {
    const { onClose } = this.props;
    onClose?.();
  };
  onClickAccept = () => {
    this.startCall();
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
    this.onClickClose();
  }

  onCallOccurError(params: { channelId: string; error: CallError }): void {
    calllog.log('SingleCall:onCallOccurError:', params);
    this.onClickClose();
  }

  //////////////////////////////////////////////////////////////////////////////
  //// Render //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  protected renderSafeArea(): React.ReactNode {
    return (
      <View
        style={{
          height: StateBarHeight,
          // backgroundColor: 'green',
        }}
      />
    );
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
            onPress={() => {
              calllog.log('test:22343');
            }}
          />
        </View>
      </View>
    );
  }
  protected renderAvatar(): React.ReactNode {
    const { elapsed } = this.props;
    const { callType, callState } = this.state;
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
            {callType === 'audio' ? 'Audio Call' : 'Video Call'}
          </Text>
        )}
      </View>
    );
  }

  protected renderBottomMenu(): React.ReactNode {
    const { bottomButtonType } = this.state;
    calllog.log('test:renderBottomMenu', bottomButtonType);
    const disabled = true;
    let ret = <></>;
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
            <BottomMenuButton name="speaker" onPress={this.onClickSpeaker} />
            <BottomMenuButton
              name="microphone"
              onPress={this.onClickMicrophone}
            />
            <BottomMenuButton name="hangup" onPress={this.onClickHangUp} />
          </Container>
        );
        break;
      case 'inviter-video':
        ret = (
          <Container>
            <BottomMenuButton name="video" onPress={this.onClickVideo} />
            <BottomMenuButton
              name="microphone"
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
            <BottomMenuButton name="video" onPress={this.onClickVideo} />
            <BottomMenuButton name="hangup" onPress={this.onClickHangUp} />
            <BottomMenuButton name="accept" onPress={this.onClickAccept} />
          </Container>
        );
        break;
      case 'invitee-video-loading':
        ret = (
          <Container>
            <BottomMenuButton name="video" onPress={this.onClickVideo} />
            <BottomMenuButton name="hangup" onPress={this.onClickHangUp} />
            <BottomMenuButton name="accepting" disabled={disabled} />
          </Container>
        );
        break;
      case 'invitee-video-calling':
        ret = (
          <Container>
            <BottomMenuButton name="video" onPress={this.onClickVideo} />
            <BottomMenuButton
              name="microphone"
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
              name="microphone"
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
  protected renderFloatAudio(): React.ReactNode {
    const { elapsed } = this.props;
    const { callState } = this.state;
    const content = 'Calling...';
    return (
      <Pressable
        style={{
          width: 76,
          height: 76,
          position: 'absolute',
          backgroundColor: 'grey',
          right: 10,
          top: 54,
          borderRadius: 12,
        }}
        onPress={() => {
          this.setState({ isMinimize: false });
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
      </Pressable>
    );
  }
  protected renderFloatVideo(): React.ReactNode {
    const { elapsed } = this.props;
    const { callState, isMinimize, muteVideo } = this.state;
    const content = 'Calling...';
    if (isMinimize === true) {
      return (
        <Pressable
          onPress={() => {
            this.setState({ isMinimize: false });
          }}
          style={{
            width: callState === CallState.Calling ? 90 : 76,
            height: callState === CallState.Calling ? 160 : 76,
            position: 'absolute',
            backgroundColor: 'grey',
            right: 10,
            top: 54,
            borderRadius: 12,
          }}
        >
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
        </Pressable>
      );
    } else {
      return (
        <View
          style={{
            width: muteVideo === false ? 90 : 76,
            height: muteVideo === false ? 160 : 76,
            position: 'absolute',
            backgroundColor: 'grey',
            right: 10,
            top: 10,
            borderRadius: 12,
          }}
        >
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
        </View>
      );
    }
  }
  protected renderContent(): React.ReactNode {
    const { callType, callState } = this.state;
    let content = null;
    if (callState === CallState.Calling) {
      if (callType === 'audio') {
        content = this.renderAvatar();
      } else {
        content = this.renderFloatVideo();
      }
    } else {
      if (callType === 'audio') {
        content = this.renderAvatar();
      } else {
        content = this.renderFloatVideo();
      }
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
      Dimensions.get('screen');
    const { isMinimize, callType } = this.state;
    if (isMinimize) {
      if (callType === 'audio') {
        return this.renderFloatAudio();
      } else {
        return this.renderFloatVideo();
      }
    }
    return (
      <View
        style={{
          position: 'absolute',
          width: screenWidth,
          height: screenHeight,
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}
      >
        <View style={{ flex: 1, backgroundColor: 'blue' }} />
        {/* {this.renderSafeArea()} */}
        {this.renderTopBar()}
        {this.renderContent()}
        {this.renderBottomMenu()}
        {/* {this.renderSafeArea()} */}
      </View>
    );
  }
}
