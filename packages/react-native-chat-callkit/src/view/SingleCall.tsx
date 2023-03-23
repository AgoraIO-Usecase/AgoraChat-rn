import * as React from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { ChatClient } from 'react-native-chat-sdk';

import type { CallOption } from '../call';
import { calllog } from '../call/CallConst';
import { createManagerImpl } from '../call/CallManagerImpl';
import { CallState } from '../enums';
import { BasicCall, BasicCallProps, BasicCallState } from './BasicCall';
import { Avatar } from './components/Avatar';
import { BottomMenuButton } from './components/BottomMenuButton';
import { Elapsed } from './components/Elapsed';
import { IconButton } from './components/IconButton';
import { MiniButton } from './components/MiniButton';

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
  callState?: CallState;
  callType: 'video' | 'audio';
  bottomButtonType?: BottomButtonType;
  muteVideo?: boolean;
  onHangUp?: () => void;
  onCancel?: () => void;
  onRefuse?: () => void;
  onClose?: () => void;
  onError?: () => void;
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
    };
  }

  protected init(): void {
    this.manager = createManagerImpl();
    this.manager?.init({
      client: ChatClient.getInstance(),
      userId: this.props.currentId,
      userNickName: this.props.currentName,
      userAvatarUrl: this.props.currentUrl,
      option: {
        agoraAppId: '', // TODO:
        callTimeout: 30000, // TODO;
        ringFilePath: '', // TODO:
      } as CallOption,
      enableLog: true,
      listener: this,
    });
  }
  protected unInit(): void {
    this.manager?.unInit();
  }

  onClickHangUp = () => {
    const { isInviter, onHangUp, onCancel, onRefuse } = this.props;
    const { callState } = this.state;
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
  onClickAccept = () => {};

  protected renderSafeArea(): React.ReactNode {
    return (
      <View
        style={{
          height: 44,
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
    switch (bottomButtonType) {
      case 'inviter-audio':
        ret = (
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
          >
            <BottomMenuButton name="speaker" onPress={this.onClickSpeaker} />
            <BottomMenuButton
              name="microphone"
              onPress={this.onClickMicrophone}
            />
            <BottomMenuButton name="hangup" onPress={this.onClickHangUp} />
          </View>
        );
        break;
      case 'inviter-video':
        ret = (
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
          >
            <BottomMenuButton name="video" onPress={this.onClickVideo} />
            <BottomMenuButton
              name="microphone"
              onPress={this.onClickMicrophone}
            />
            <BottomMenuButton name="hangup" onPress={this.onClickHangUp} />
          </View>
        );
        break;
      case 'inviter-timeout':
        ret = (
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
          >
            <BottomMenuButton name="recall" onPress={this.onClickRecall} />
            <BottomMenuButton name="close" onPress={this.onClickClose} />
          </View>
        );
        break;
      case 'invitee-video-init':
        ret = (
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
          >
            <BottomMenuButton name="video" onPress={this.onClickVideo} />
            <BottomMenuButton name="hangup" onPress={this.onClickHangUp} />
            <BottomMenuButton name="accept" onPress={this.onClickAccept} />
          </View>
        );
        break;
      case 'invitee-video-loading':
        ret = (
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
          >
            <BottomMenuButton name="video" onPress={this.onClickVideo} />
            <BottomMenuButton name="hangup" onPress={this.onClickHangUp} />
            <BottomMenuButton name="accepting" disabled={disabled} />
          </View>
        );
        break;
      case 'invitee-video-calling':
        ret = (
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
          >
            <BottomMenuButton name="video" onPress={this.onClickVideo} />
            <BottomMenuButton
              name="microphone"
              onPress={this.onClickMicrophone}
            />
            <BottomMenuButton name="hangup" onPress={this.onClickHangUp} />
          </View>
        );
        break;
      case 'invitee-audio-init':
        ret = (
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
          >
            <BottomMenuButton name="hangup" onPress={this.onClickHangUp} />
            <BottomMenuButton name="accept" onPress={this.onClickAccept} />
          </View>
        );
        break;
      case 'invitee-audio-loading':
        ret = (
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
          >
            <BottomMenuButton name="hangup" onPress={this.onClickHangUp} />
            <BottomMenuButton name="accepting" disabled={disabled} />
          </View>
        );
        break;
      case 'invitee-audio-calling':
        ret = (
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
          >
            <BottomMenuButton
              name="microphone"
              onPress={this.onClickMicrophone}
            />
            <BottomMenuButton name="hangup" onPress={this.onClickHangUp} />
          </View>
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
          // backgroundColor: 'red',
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
            // backgroundColor: 'red',
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
                justifyContent: 'flex-end',
                // backgroundColor: 'green',
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
            backgroundColor: 'white',
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
    return <View style={{ flex: 1, alignItems: 'center' }}>{content}</View>;
  }
  protected renderBody(): React.ReactNode {
    const { width: screenWidth, height: screenHeight } =
      Dimensions.get('screen');
    calllog.log('test:1:', screenWidth, screenHeight);
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
        {this.renderSafeArea()}
        {this.renderTopBar()}
        {this.renderContent()}
        {/* <View style={{ flex: 1 }} /> */}
        {this.renderBottomMenu()}
        {this.renderSafeArea()}
      </View>
    );
  }
}
