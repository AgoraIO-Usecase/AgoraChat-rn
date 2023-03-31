import * as React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { RtcSurfaceView, VideoViewSetupMode } from 'react-native-agora';

import type { CallError } from '../call';
import { calllog, KeyTimeout } from '../call/CallConst';
import { createManagerImpl } from '../call/CallManagerImpl';
import { CallEndReason, CallState, CallType } from '../enums';
import type { User } from '../types';
import {
  BasicCall,
  BasicCallProps,
  BasicCallState,
  BottomButtonType,
} from './BasicCall';
import { AudioTabs } from './components/AudioTabs';
import { Avatar } from './components/Avatar';
import Draggable from './components/Draggable';
import { Elapsed } from './components/Elapsed';
import { IconButton } from './components/IconButton';
import type { IconName } from './components/LocalIcon';
import { MiniButton } from './components/MiniButton';
import { VideoTabs } from './components/VideoTabs';

const StateBarHeight = 44;
const VideoMaxCount = 18;
const AudioMaxCount = 128;
const ContentBottom = 148;

export type InviteeListProps = {
  selectedIds: string[];
  maxCount: number;
  onClose: (addedIds: string[]) => void;
};

export type MultiCallProps = BasicCallProps & {
  isMinimize?: boolean;
  elapsed: number; // ms unit
  isInviter: boolean;
  inviteeIds: string[];
  callState?: CallState;
  inviteeList?: {
    InviteeList: (props: InviteeListProps) => JSX.Element;
    props?: InviteeListProps;
  };
  onHangUp?: () => void;
  onCancel?: () => void;
  onRefuse?: () => void;
  onClose?: () => void;
  onError?: () => void;
  isTest?: boolean;
};
export type MultiCallState = BasicCallState & {
  isMinimize: boolean;
  callState: CallState;
  callType: 'video' | 'audio';
  remoteUsersJoinChannelSuccess: Map<string, boolean>;
  elapsed: number; // ms unit
  remoteUsersUid: Map<string, number>;
  inviteeIds: string[];
  users: User[];
  isFullVideo: boolean;
  usersCount: number;
  showInvite: boolean;
  fullId?: string;
  fullChannelId?: number;
};

export class MultiCall extends BasicCall<MultiCallProps, MultiCallState> {
  private _inviteeTimer?: NodeJS.Timeout;
  private _videoTabRef?: React.RefObject<VideoTabs>;
  constructor(props: MultiCallProps) {
    super(props);
    this._videoTabRef = React.createRef<VideoTabs>();
    const l = [] as User[];
    l.push({
      userId: props.inviterId,
      userHadJoined: false,
      isSelf: props.isInviter ? true : false,
    } as User);
    l.push(
      ...props.inviteeIds.map((userId) => {
        return {
          userId: userId,
          userHadJoined: false,
          isSelf: props.currentId === userId ? true : false,
        } as User;
      })
    );
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
          ? 'invitee-audio-init'
          : 'invitee-video-init'),
      muteVideo: props.muteVideo ?? false,
      channelId: '',
      callId: '',
      startPreview: false,
      joinChannelSuccess: false,
      elapsed: props.elapsed ?? 0,
      selfUid: 0,
      setupMode: VideoViewSetupMode.VideoViewSetupAdd,
      muteCamera: false,
      muteMicrophone: false,
      isInSpeaker: true,
      remoteUsersJoinChannelSuccess: new Map(),
      remoteUsersUid: new Map(),
      inviteeIds: props.inviteeIds,
      users: l,
      isFullVideo: false,
      usersCount: l.length,
      showInvite: false,
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
        const channelId = this.manager.createChannelId();
        this.setState({ channelId });
        this.startCall(this.props.inviteeIds, channelId);
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
        remoteUsersJoinChannelSuccess: new Map(),
        remoteUsersUid: new Map(),
        users: [],
      });
    }

    this.manager?.unInitRTC();

    this.manager?.removeViewListener(this);
    this.manager?.clear();
  }

  private onInviteCall(addedIds: string[]) {
    calllog.log('MultiCall:onInviteCall:', addedIds);
    if (addedIds.length === 0) {
      return;
    }
    const list = [] as {
      channelId: string;
      userChannelId?: number;
      userId: string;
      isSelf: boolean;
      userHadJoined?: boolean;
    }[];
    for (const id of addedIds) {
      list.push({
        channelId: this.state.channelId,
        userId: id,
        isSelf: false,
        userHadJoined: false,
      });
    }
    this.updateUsers(list);
    this.startCall(addedIds, this.state.channelId); // TODO:
  }

  private startCall(inviteeIds: string[], channelId: string) {
    if (this.manager) {
      switch (this.props.callType) {
        case 'audio':
          this.manager.startMultiAudioCall({
            inviteeIds: inviteeIds,
            channelId: channelId,
            onResult: (params) => {
              calllog.log('MultiCall:startMultiAudioCall:', params);
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
          this.manager.startMultiVideoCall({
            inviteeIds: inviteeIds,
            channelId: channelId,
            onResult: (params) => {
              calllog.log('MultiCall:startMultiVideoCall:', params);
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
    const { joinChannelSuccess } = this.state;
    if (joinChannelSuccess) {
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

  private updateUser(params: {
    channelId: string;
    userChannelId?: number;
    userId: string;
    isSelf: boolean;
    userHadJoined?: boolean;
  }): void {
    calllog.log('MultiCall:updateUser:', params);
    const { users } = this.state;
    let isExisted = false;
    for (const user of users) {
      if (user.userId === params.userId) {
        user.userChannelId = params.userChannelId;
        user.userHadJoined = params.userHadJoined ?? true;
        user.isSelf = params.isSelf;
        isExisted = true;
        break;
      }
    }
    if (isExisted === false) {
      users.push({
        userId: params.userId,
        userChannelId: params.userChannelId,
        userHadJoined: params.userHadJoined ?? true,
        isSelf: params.isSelf,
      });
      this.setState({ usersCount: users.length });
    }
    this.setState({
      users: [...users],
    });
    // this._videoTabRef?.current?.update(users);
  }

  private updateUsers(
    userList: {
      channelId: string;
      userChannelId?: number;
      userId: string;
      isSelf: boolean;
      userHadJoined?: boolean;
    }[]
  ): void {
    calllog.log('MultiCall:updateUsers:', userList.length);
    const { users } = this.state;
    for (const userP of userList) {
      let isExisted = false;
      for (const user of users) {
        if (userP.userId === user.userId) {
          user.userChannelId = userP.userChannelId;
          user.userHadJoined = userP.userHadJoined ?? true;
          user.isSelf = userP.isSelf;
          isExisted = true;
          break;
        }
      }
      if (isExisted === false) {
        users.push({
          userId: userP.userId,
          userChannelId: userP.userChannelId,
          userHadJoined: userP.userHadJoined ?? true,
          isSelf: userP.isSelf,
        });
      }
    }
    this.setState({ usersCount: users.length, users: [...users] });
    // this._videoTabRef?.current?.update(users);
  }

  private removeUser(params: {
    channelId: string;
    userChannelId?: number;
    userId: string;
  }): void {
    calllog.log('MultiCall:remoteUser:', params);
    const { users, fullId } = this.state;
    calllog.log('MultiCall:remoteUser:users:', users);
    let isExisted = false;
    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      if (fullId === params.userId) {
        this.setState({
          fullId: undefined,
          fullChannelId: undefined,
          isFullVideo: false,
        });
      }
      if (user?.userId === params.userId) {
        users.splice(index, 1);
        isExisted = true;
        break;
      }
    }
    calllog.log('MultiCall:remoteUser:users:', users, isExisted);
    if (isExisted) {
      this.setState({ usersCount: users.length });
      this.setState({ users: [...users] });
      // this._videoTabRef?.current?.update(users);
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  //// OnButton ////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  onClickHangUp = () => {
    const { isInviter, onHangUp, onCancel, onRefuse } = this.props;
    const { callState, callId } = this.state;
    if (isInviter === true) {
      if (callState === CallState.Calling) {
        this.manager?.hangUpCall({
          callId: callId,
          onResult: (params: {
            callId?: string | undefined;
            error?: CallError | undefined;
          }) => {
            calllog.log('MultiCall:onClickHangUp:hangUpCall:', params);
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
            calllog.log('MultiCall:onClickHangUp:cancelCall:', params);
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
            calllog.log('MultiCall:onClickHangUp:hangUpCall:', params);
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
            calllog.log('MultiCall:onClickHangUp:refuseCall:', params);
          },
        });
        onRefuse?.();
      }
    }
  };
  onClickSpeaker = () => {
    const isIn = this.state.isInSpeaker;
    calllog.log('MultiCall:onClickSpeaker:', isIn);
    this.setState({ isInSpeaker: !isIn });
    this.manager?.setEnableSpeakerphone(!isIn);
  };
  onClickMicrophone = () => {
    const mute = this.state.muteMicrophone;
    calllog.log('MultiCall:onClickMicrophone:', mute);
    this.setState({ muteMicrophone: !mute });
    this.manager?.enableLocalAudio(mute);
  };
  onClickVideo = () => {
    const mute = this.state.muteVideo;
    calllog.log('MultiCall:onClickVideo:');
    this.setState({ muteVideo: !mute });
    this.manager?.enableLocalVideo(mute);
  };
  onClickRecall = () => {};
  onClickClose = () => {
    this.setState({ callState: CallState.Idle });
    const { onClose } = this.props;
    onClose?.();
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
      this.setState({ callId });
      this.manager?.acceptCall({
        callId: callId,
        onResult: (params: {
          callId?: string | undefined;
          error?: CallError | undefined;
        }) => {
          calllog.log('MultiCall:onClickAccept:acceptCall:', params);
        },
      });
    }
  };
  switchCamera = () => {
    calllog.log('MultiCall:switchCamera:');
    this.manager?.switchCamera();
  };
  inviteUser = () => {
    calllog.log('MultiCall:inviteUser:');
    this.setState({ showInvite: true });
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
    calllog.log('MultiCall:onCallEnded:', params);
    this.onClickClose();
  }

  onCallOccurError(params: { channelId: string; error: CallError }): void {
    calllog.log('MultiCall:onCallOccurError:', params);
    this.onClickClose();
  }

  onRequestJoin(params: {
    channelId: string;
    userId: string;
    userChannelId: number;
    userRTCToken: string;
  }): void {
    calllog.log('MultiCall:onRequestJoin:', params);
    this.manager?.joinChannel(params);
  }

  onRemoteUserJoined(params: {
    channelId: string;
    userChannelId: number;
    userId: string;
  }): void {
    calllog.log('MultiCall:onRemoteUserJoined:', params);
    this.updateBottomButtons();
    this.updateUser({ ...params, isSelf: false });
  }

  onSelfJoined(params: {
    channelId: string;
    userChannelId: number;
    userId: string;
    elapsed: number;
  }): void {
    calllog.log('MultiCall:onSelfJoined:', params);
    this.setState({
      joinChannelSuccess: true,
      elapsed: params.elapsed,
      selfUid: params.userChannelId,
    });
    this.setState({ callState: CallState.Calling });
    this.updateBottomButtons();
    this.updateUser({ ...params, isSelf: true });
  }

  onRemoteUserOffline(params: {
    channelId: string;
    userChannelId: number;
    userId: string;
  }): void {
    calllog.log('MultiCall:onRemoteUserOffline:', params);
    this.removeUser(params);
  }

  onRemoveRemoteUser(params: {
    channelId: string;
    userChannelId?: number;
    userId: string;
    reason?: CallEndReason;
  }): void {
    calllog.log('MultiCall:onRemoveRemoteUser:', params);
    this.removeUser(params);
  }

  onSelfLeave(params: {
    channelId: string;
    userChannelId: number;
    userId: string;
  }): void {
    calllog.log('MultiCall:onSelfLeave:', params);
    this.setState({ joinChannelSuccess: false });
    this.removeUser(params);
  }

  onRemoteUserMuteVideo(params: {
    channelId: string;
    userId: string;
    userChannelId: number;
    muted: boolean;
  }): void {
    calllog.log('MultiCall:onRemoteUserMuteVideo:', params);
    const { users } = this.state;
    for (const user of users) {
      if (user.userId === params.userId) {
        user.muteVideo = params.muted;
        this.setState({ users: [...users] });
        break;
      }
    }
  }

  onRemoteUserMuteAudio(params: {
    channelId: string;
    userId: string;
    userChannelId: number;
    muted: boolean;
  }): void {
    calllog.log('MultiCall:onRemoteUserMuteAudio:', params);
    const { users } = this.state;
    for (const user of users) {
      if (user.userId === params.userId) {
        user.muteAudio = params.muted;
        this.setState({ users: [...users] });
        break;
      }
    }
  }

  onAudioVolumeIndication(params: {
    channelId: string;
    speakerNumber: number;
    speakers: {
      userId: string;
      userChannelId: number;
      totalVolume: number;
    }[];
  }): void {
    calllog.log('MultiCall:onAudioVolumeIndication:', params);
    const tmp = this.cloneUsers();
    for (const user of tmp) {
      for (const speaker of params.speakers) {
        if (user.userId === speaker.userId) {
          user.talking = speaker.totalVolume > 10;
        }
      }
    }
    if (this.compareUsers(tmp) === false) {
      this.setState({ users: tmp });
    }
  }

  private cloneUsers(): User[] {
    const { users } = this.state;
    const ret = [] as User[];
    for (const user of users) {
      ret.push({
        ...user,
      });
    }
    return ret;
  }

  private compareUsers(other: User[]): boolean {
    return JSON.stringify(other) === JSON.stringify(this.state.users);
  }

  //////////////////////////////////////////////////////////////////////////////
  //// Render //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  protected renderAudio(): React.ReactNode {
    calllog.log('MultiCall:renderAudio:');
    const { users } = this.state;
    return (
      <View
        style={{
          flex: 1,
          position: 'absolute',
          height: Dimensions.get('screen').height,
          width: '100%',
        }}
      >
        <View style={{ height: StateBarHeight + 44 }} />
        <AudioTabs users={users} />
        <View style={{ height: ContentBottom + 44 }} />
      </View>
    );
  }

  protected renderVideo(): React.ReactNode {
    const { isFullVideo, users, setupMode, fullId, fullChannelId } = this.state;
    calllog.log('MultiCall:renderVideo:', users);
    return (
      <View
        style={{
          flex: 1,
          position: 'absolute',
          height: Dimensions.get('screen').height,
          width: '100%',
        }}
      >
        {/* <View style={{ height: StateBarHeight }} /> */}
        <VideoTabs
          ref={this._videoTabRef}
          users={users}
          onPress={(params: {
            userId: string;
            userChannelId?: number | undefined;
          }) => {
            calllog.log('MultiCall:renderVideo:onPress:', params);
            this.setState({
              isFullVideo: true,
              fullId: params.userId,
              fullChannelId: params.userChannelId,
            });
          }}
          setupMode={setupMode}
        />
        {/* <View style={{ height: ContentBottom }} /> */}
        {isFullVideo === true && fullId && fullChannelId ? (
          <View
            style={{
              flex: 1,
              position: 'absolute',
              width: '100%',
              height: '100%',
              // backgroundColor: 'red',
            }}
          >
            <RtcSurfaceView
              style={{ flex: 1 }}
              canvas={{
                uid: fullId === this.props.currentId ? 0 : fullChannelId,
                setupMode: setupMode,
              }}
              key={fullChannelId}
            />
          </View>
        ) : null}
      </View>
    );
  }

  protected renderTopBar(): React.ReactNode {
    const { isFullVideo, callType, usersCount } = this.state;
    const inviteName = (): IconName => {
      if (callType === 'audio') {
        if (usersCount === AudioMaxCount) {
          return 'person_ban';
        } else {
          return 'person_add';
        }
      } else {
        if (usersCount === VideoMaxCount) {
          return 'person_ban';
        } else {
          return 'person_add';
        }
      }
    };
    return (
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          top: StateBarHeight,
          // backgroundColor: 'red',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            marginLeft: 15,
            flexDirection: 'row',
          }}
        >
          <MiniButton
            iconName={isFullVideo ? 'arrows_2_pointing' : 'chevron_left'}
            color="white"
            backgroundColor="rgba(0, 0, 0, 0.0)"
            size={28}
            onPress={() => {
              if (isFullVideo === false) {
                this.setState({ isMinimize: true });
              } else {
                this.setState({
                  isFullVideo: false,
                  fullId: undefined,
                  fullChannelId: undefined,
                });
              }
            }}
          />
          {isFullVideo ? null : (
            <View
              style={{
                // backgroundColor: 'red',
                paddingTop: 4,
              }}
            >
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 18,
                  lineHeight: 20,
                  color: 'white',
                }}
              >
                {callType === 'audio'
                  ? `Audio Call (${usersCount}/128)`
                  : `Video Call (${usersCount}/18)`}
              </Text>
            </View>
          )}
        </View>
        <View style={{ flexGrow: 1 }} />
        <View
          style={{
            marginRight: 15,
            flexDirection: 'row',
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
          <View style={{ width: 12 }} />
          <IconButton
            iconName={inviteName()}
            color="white"
            backgroundColor="rgba(255, 255, 255, 0.2)"
            size={28}
            containerSize={40}
            onPress={this.inviteUser}
          />
        </View>
      </View>
    );
  }

  protected renderFloat(): React.ReactNode {
    const { elapsed } = this.props;
    const { callState } = this.state;
    const content = 'Calling...';
    return (
      <Draggable
        x={Dimensions.get('screen').width - 86}
        y={54}
        onShortPressRelease={() => {
          this.setState({ isMinimize: false });
        }}
      >
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
      </Draggable>
    );
  }

  protected renderContent(): React.ReactNode {
    calllog.log('renderContent:');
    if (this.state.callType === 'video') {
      return null;
    }
    if (this.state.callState !== CallState.Calling) {
      return null;
    }
    return (
      <View
        style={{
          position: 'absolute',
          // backgroundColor: 'red',
          bottom: ContentBottom,
          width: '100%',
          alignItems: 'center',
        }}
      >
        <View style={{}}>
          <Text
            style={{
              fontWeight: '600',
              fontSize: 16,
              lineHeight: 22,
              color: 'white',
            }}
          >
            Ongoing Calling
          </Text>
        </View>
        <Elapsed timer={this.props.elapsed} color="white" />
      </View>
    );
  }
  protected renderInviteeList(): React.ReactNode {
    const { showInvite } = this.state;
    const { inviteeList, callType } = this.props;
    const InviteeList = inviteeList?.InviteeList;
    const inviteeListProps = inviteeList?.props;
    if (showInvite === false) {
      return null;
    }
    return (
      <View
        style={{
          flex: 1,
          // backgroundColor: 'blue',
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      >
        {InviteeList ? (
          <InviteeList
            {...inviteeListProps}
            selectedIds={['du005']}
            maxCount={callType === 'audio' ? AudioMaxCount : VideoMaxCount}
            onClose={(addedIds) => {
              calllog.log('added:', addedIds);
              this.setState({ showInvite: false });
              this.onInviteCall(addedIds);
            }}
          />
        ) : null}
      </View>
    );
  }
  protected renderBody(): React.ReactNode {
    const { width: screenWidth, height: screenHeight } =
      Dimensions.get('screen');
    const { isMinimize, callType } = this.state;
    if (isMinimize) {
      return this.renderFloat();
    }
    return (
      <View
        style={{
          position: 'absolute',
          width: screenWidth,
          height: screenHeight,
          backgroundColor: 'black',
        }}
      >
        {callType === 'audio' ? this.renderAudio() : this.renderVideo()}
        {this.renderTopBar()}
        {this.renderContent()}
        {this.renderBottomMenu()}
        {this.renderInviteeList()}
      </View>
    );
  }
}
