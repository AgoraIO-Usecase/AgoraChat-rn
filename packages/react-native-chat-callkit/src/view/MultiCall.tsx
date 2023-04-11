import * as React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { RtcSurfaceView, VideoViewSetupMode } from 'react-native-agora';

import { CallError } from '../call';
import { calllog, KeyTimeout } from '../call/CallConst';
import { createManagerImpl } from '../call/CallManagerImpl';
import { CallEndReason, CallErrorCode, CallState } from '../enums';
import type { User } from '../types';
import {
  BasicCall,
  BasicCallProps,
  BasicCallState,
  BottomButtonType,
  StateBarHeight,
} from './BasicCall';
import { AudioTabs } from './components/AudioTabs';
import { DefaultAvatar } from './components/Avatar';
import Draggable from './components/Draggable';
import { Elapsed } from './components/Elapsed';
import { IconButton } from './components/IconButton';
import type { IconName } from './components/LocalIcon';
import { MiniButton } from './components/MiniButton';
import { VideoTabs } from './components/VideoTabs';

const VideoMaxCount = 18;
const AudioMaxCount = 128;
const ContentBottom = 148;

export type InviteeListProps = {
  selectedIds: string[];
  maxCount: number;
  onClose: (addedIds: string[]) => void;
  onCancel: () => void;
};

export type MultiCallProps = BasicCallProps & {
  inviteeIds: string[];
  inviteeList?: {
    InviteeList: (props: InviteeListProps) => JSX.Element;
    props?: InviteeListProps;
  };
};
export type MultiCallState = BasicCallState & {
  remoteUsersJoinChannelSuccess: Map<string, boolean>;
  remoteUsersUid: Map<string, number>;
  inviteeIds: string[];
  users: User[];
  cache: Map<number, User>;
  isFullVideo: boolean;
  usersCount: number;
  showInvite: boolean;
  fullId?: string;
  fullChannelId?: number;
};

export class MultiCall extends BasicCall<MultiCallProps, MultiCallState> {
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
      elapsed: 0,
      selfUid: 0,
      setupMode: VideoViewSetupMode.VideoViewSetupAdd,
      muteMicrophone: false,
      isInSpeaker: true,
      remoteUsersJoinChannelSuccess: new Map(),
      remoteUsersUid: new Map(),
      inviteeIds: props.inviteeIds,
      users: l,
      isFullVideo: false,
      usersCount: l.length,
      showInvite: false,
      cache: new Map(),
    };
  }

  protected init(): void {
    if (this.props.isTest === true) {
      // this.manager?.initRTC();

      // if (this.props.callType === 'audio') {
      //   this.manager?.enableAudio();
      // } else {
      //   this.manager?.enableVideo();
      //   this.manager?.startPreview();
      //   this.setState({ startPreview: true });
      // }
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
      this.manager?.enableAudioVolumeIndication();
    } else {
      this.manager?.enableVideo();
      this.manager?.startPreview();
      this.setState({ startPreview: true });
    }

    this.manager?.addViewListener(this);
    this.props?.onInitialized?.();
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
      // this.manager?.unInitRTC();
      return;
    }
    if (this.props.callType === 'audio') {
      // this.manager?.disableAudio();
    } else {
      // this.manager?.disableVideo();
      // this.manager?.stopPreview();
      // this.setState({
      //   startPreview: false,
      //   joinChannelSuccess: false,
      //   remoteUsersJoinChannelSuccess: new Map(),
      //   remoteUsersUid: new Map(),
      //   users: [],
      // });
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
      userChannelId?: number;
      userId: string;
      isSelf: boolean;
      userHadJoined?: boolean;
    }[];
    for (const id of addedIds) {
      list.push({
        userId: id,
        isSelf: false,
        userHadJoined: false,
      });
    }
    let channelId = this.state.channelId;
    if (this.state.channelId === '') {
      channelId = this.manager?.getCurrentChannelId() ?? '';
      if (channelId === '') {
        this.onCallOccurError({
          channelId: '',
          error: new CallError({
            code: CallErrorCode.ExceptionState,
            description: 'channelId not found.',
          }),
        });
      }
      this.setState({ channelId: channelId });
    }
    this.updateUsers(list);
    this.startCall(addedIds, channelId); // TODO:
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
                this.onCallOccurError({ channelId, error: params.error });
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
                this.onCallOccurError({ channelId, error: params.error });
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
    const { users, cache } = this.state;
    let isExisted = false;
    for (const user of users) {
      if (user.userId === params.userId) {
        user.userChannelId = params.userChannelId;
        user.userHadJoined = params.userHadJoined ?? true;
        user.isSelf = params.isSelf;
        isExisted = true;
        if (params.userChannelId) {
          const u = cache.get(params.userChannelId);
          if (u) {
            if (u.muteAudio) {
              user.muteAudio = u.muteAudio;
            }
            if (u.muteVideo) {
              user.muteVideo = u.muteVideo;
            }
            cache.delete(params.userChannelId);
          }
        }
        break;
      }
    }
    if (isExisted === false) {
      let muteAudio: boolean | undefined;
      let muteVideo: boolean | undefined;
      if (params.userChannelId) {
        const u = cache.get(params.userChannelId);
        if (u) {
          if (u.muteAudio) {
            muteAudio = u.muteAudio;
          }
          if (u.muteVideo) {
            muteVideo = u.muteVideo;
          }
          cache.delete(params.userChannelId);
        }
      }
      users.push({
        userId: params.userId,
        userChannelId: params.userChannelId,
        userHadJoined: params.userHadJoined ?? true,
        isSelf: params.isSelf,
        muteAudio,
        muteVideo,
      } as User);
      this.setState({ usersCount: users.length });
    }
    this.setState({
      users: [...users],
    });
    // this._videoTabRef?.current?.update(users);
  }

  private updateUsers(
    userList: {
      userChannelId?: number;
      userId: string;
      isSelf: boolean;
      userHadJoined?: boolean;
    }[]
  ): void {
    calllog.log('MultiCall:updateUsers:', userList.length);
    const { users, cache } = this.state;
    for (const userP of userList) {
      let isExisted = false;
      for (const user of users) {
        if (userP.userId === user.userId) {
          user.userChannelId = userP.userChannelId;
          user.userHadJoined = userP.userHadJoined ?? true;
          user.isSelf = userP.isSelf;
          isExisted = true;
          if (userP.userChannelId) {
            const u = cache.get(userP.userChannelId);
            if (u) {
              if (u.muteAudio) {
                user.muteAudio = u.muteAudio;
              }
              if (u.muteVideo) {
                user.muteVideo = u.muteVideo;
              }
              cache.delete(userP.userChannelId);
            }
          }
          break;
        }
      }
      if (isExisted === false) {
        let muteAudio: boolean | undefined;
        let muteVideo: boolean | undefined;
        if (userP.userChannelId) {
          const u = cache.get(userP.userChannelId);
          if (u) {
            if (u.muteAudio) {
              muteAudio = u.muteAudio;
            }
            if (u.muteVideo) {
              muteVideo = u.muteVideo;
            }
            cache.delete(userP.userChannelId);
          }
        }
        users.push({
          userId: userP.userId,
          userChannelId: userP.userChannelId,
          userHadJoined: userP.userHadJoined ?? true,
          isSelf: userP.isSelf,
          muteAudio,
          muteVideo,
        } as User);
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
    calllog.log('MultiCall:removeUser:', params);
    const { users, fullId, cache } = this.state;
    calllog.log('MultiCall:removeUser:users:', users);
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
    calllog.log('MultiCall:removeUser:users:', users, isExisted);
    if (isExisted) {
      this.setState({ usersCount: users.length });
      this.setState({ users: [...users] });
      // this._videoTabRef?.current?.update(users);
    }
    if (params.userChannelId) {
      cache.delete(params.userChannelId);
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  //// OnButton ////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  inviteUser = () => {
    calllog.log('MultiCall:inviteUser:');
    this.setState({ showInvite: true });
  };

  //////////////////////////////////////////////////////////////////////////////
  //// CallViewListener ////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

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
    this.props?.onSelfJoined?.();
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
    const { users, cache } = this.state;
    for (const user of users) {
      if (user.userId === params.userId) {
        user.muteVideo = params.muted;
        this.setState({ users: [...users] });
        break;
      }
    }
    if (params.userId === '') {
      const user = cache.get(params.userChannelId);
      if (user) {
        user.muteVideo = params.muted;
      } else {
        cache.set(params.userChannelId, {
          userId: params.userId,
          muteVideo: params.muted,
        } as User);
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
    const { users, cache } = this.state;
    for (const user of users) {
      if (user.userId === params.userId) {
        user.muteAudio = params.muted;
        this.setState({ users: [...users] });
        break;
      }
    }
    if (params.userId === '') {
      const user = cache.get(params.userChannelId);
      if (user) {
        user.muteAudio = params.muted;
      } else {
        cache.set(params.userChannelId, {
          userId: params.userId,
          muteAudio: params.muted,
        } as User);
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

  onLocalVideoStateChanged(params: {
    channelId: string;
    userId: string;
    userChannelId: number;
    muted: boolean;
  }): void {
    calllog.log('MultiCall:onLocalVideoStateChanged:', params);
    const { users, cache } = this.state;
    for (const user of users) {
      if (user.userId === params.userId) {
        user.muteVideo = params.muted;
        this.setState({ users: [...users] });
        break;
      }
    }
    if (params.userId === '') {
      const user = cache.get(params.userChannelId);
      if (user) {
        user.muteVideo = params.muted;
      } else {
        cache.set(params.userChannelId, {
          userId: params.userId,
          muteVideo: params.muted,
        } as User);
      }
    }
  }

  onLocalAudioStateChanged(params: {
    channelId: string;
    userId: string;
    userChannelId: number;
    muted: boolean;
  }): void {
    calllog.log('BasicCall:onLocalAudioStateChanged:', params);
    const { users, cache } = this.state;
    for (const user of users) {
      if (user.userId === params.userId) {
        user.muteAudio = params.muted;
        this.setState({ users: [...users] });
        break;
      }
    }
    if (params.userId === '') {
      const user = cache.get(params.userChannelId);
      if (user) {
        user.muteAudio = params.muted;
      } else {
        cache.set(params.userChannelId, {
          userId: params.userId,
          muteAudio: params.muted,
        } as User);
      }
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
          height: Dimensions.get('window').height,
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
          height: Dimensions.get('window').height,
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
          isTest={this.props.isTest}
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
    const { callType } = this.props;
    const { isFullVideo, usersCount } = this.state;
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
    const { callState } = this.state;
    const content = 'Calling...';
    return (
      <Draggable
        x={Dimensions.get('window').width - 86}
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
            <DefaultAvatar userId="" size={36} />
            {callState === CallState.Calling ? (
              <Elapsed timer={this.manager?.elapsed ?? 0} />
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
    if (this.props.callType === 'video') {
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
        <Elapsed timer={this.manager?.elapsed ?? 0} color="white" />
      </View>
    );
  }
  protected renderInviteeList(): React.ReactNode {
    const { showInvite, users } = this.state;
    const { inviteeList, callType } = this.props;
    const InviteeList = inviteeList?.InviteeList;
    const inviteeListProps = inviteeList?.props;
    calllog.log(
      'MultiCall:renderInviteeList:',
      showInvite,
      InviteeList === undefined
    );
    if (showInvite === false || InviteeList === undefined) {
      return null;
    }
    const getSelectedIds = () => {
      return users.map((user) => {
        return user.userId;
      });
    };
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
        <InviteeList
          {...inviteeListProps}
          selectedIds={getSelectedIds()}
          maxCount={callType === 'audio' ? AudioMaxCount : VideoMaxCount}
          onClose={(addedIds) => {
            calllog.log('added:', addedIds);
            this.setState({ showInvite: false });
            this.onInviteCall(addedIds);
          }}
          onCancel={() => {
            calllog.log('onCancel:');
            this.setState({ showInvite: false });
          }}
        />
      </View>
    );
  }
  protected renderBody(): React.ReactNode {
    const { width: screenWidth, height: screenHeight } =
      Dimensions.get('window');
    const { callType } = this.props;
    const { isMinimize } = this.state;
    if (isMinimize) {
      return this.renderFloat();
    }
    return (
      <View
        style={{
          position: 'absolute',
          width: screenWidth,
          height: screenHeight,
          backgroundColor: 'grey',
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
