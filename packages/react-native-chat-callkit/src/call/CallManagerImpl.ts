import {
  AudioVolumeInfo,
  ChannelProfileType,
  createAgoraRtcEngine,
  ErrorCodeType,
  IRtcEngine,
  IRtcEngineEventHandler,
  LocalVideoStreamError,
  LocalVideoStreamState,
  RemoteAudioStats,
  RtcConnection,
  RtcStats,
  UserOfflineReasonType,
  VideoSourceType,
} from 'react-native-agora';
import { ChatClient } from 'react-native-chat-sdk';

import {
  CallEndReason,
  CallErrorCode,
  CallErrorType,
  CallType,
} from '../enums';
import { timestamp, uuid } from '../utils/utils';
import { calllog } from './CallConst';
import * as K from './CallConst';
import { CallError } from './CallError';
import type { CallListener } from './CallListener';
import type { CallManager } from './CallManager';
import type { CallOption } from './CallOption';
import type {
  CallInvitee,
  CallObject,
  CallRelationship,
} from './CallRelationship';
import {
  CallSignallingHandler,
  CallSignallingListener,
} from './CallSignallingHandler';
import { CallTimeoutHandler, CallTimeoutListener } from './CallTimeoutHandler';
import { CallSignalingState } from './CallTypes';
import type { CallUser } from './CallUser';

export class CallManagerImpl
  implements
    CallManager,
    IRtcEngineEventHandler,
    CallSignallingListener,
    CallTimeoutListener
{
  private _client?: ChatClient;
  private _option: CallOption;
  private _listener?: CallListener;
  private _engine: IRtcEngine;
  private _ship: CallRelationship;
  private _handler: CallSignallingHandler;
  private _timer: CallTimeoutHandler;
  private _userId: string;
  private _deviceToken: string;
  private _users: Map<string, CallUser>;

  constructor() {
    calllog.log('CallManagerImpl:constructor:');
    this._option = {} as CallOption;
    this._users = new Map();
    this._ship = {
      receiveCallList: new Map(),
    } as CallRelationship;
    this._handler = new CallSignallingHandler({ listener: this });
    ChatClient.getInstance().chatManager.addMessageListener(this._handler);
    this._timer = new CallTimeoutHandler({
      listener: this,
      timeout: K.KeyTimeout,
    });
    this._engine = createAgoraRtcEngine();
    this._userId = ''; // TODO: Initialization is required.
    this._deviceToken = ''; // TODO: Get the sdk yourself.
  }

  protected destructor(): void {
    calllog.log('CallManagerImpl:destructor:');
    // TODO: reserve.
    this._reset();
    ChatClient.getInstance().chatManager.removeMessageListener(this._handler);
    this.handler.destructor();
    this.timer.destructor();
    this.engine.release();
  }

  public init(params: {
    client: ChatClient;
    userId: string;
    userDeviceToken: string;
    userNickName: string;
    userRTCToken: string;
    option: CallOption;
    listener?: CallListener;
    enableLog?: boolean;
    userAvatarUrl?: string;
  }): void {
    calllog.enableLog = params.enableLog ?? false;
    calllog.log('CallManagerImpl:init:', params);
    this._client = params.client;
    this._userId = params.userId;
    this._deviceToken = params.userDeviceToken; // TODO:
    this._setUser({
      userId: params.userId,
      userNickName: params.userNickName,
      userAvatarUrl: params.userAvatarUrl ?? '', // TODO:
    });
    this._option = {
      agoraAppId: params.option.agoraAppId,
      callTimeout: params.option.callTimeout ?? K.KeyTimeout,
      ringFilePath: params.option.ringFilePath ?? '', // TODO:
    };
    this._listener = params.listener;
    if (params.option.callTimeout) {
      this._timer.setTimeoutNumber(params.option.callTimeout);
    }
    this._engine.initialize({
      appId: this._option.agoraAppId,
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    });
  }
  public unInit(): void {
    this._reset();
  }
  protected get option() {
    return this._option;
  }
  protected get listener() {
    return this._listener;
  }
  protected get ship() {
    return this._ship;
  }
  protected get userId() {
    return this._userId;
  }
  protected get deviceToken() {
    return this._deviceToken;
  }
  protected get handler() {
    return this._handler;
  }
  protected get users() {
    return this._users;
  }
  protected get timer() {
    return this._timer;
  }
  protected get engine() {
    return this._engine;
  }
  protected get client() {
    return this._client;
  }

  public createChannelId(): string {
    return uuid();
  }

  /**
   * An invitation to start a 1v1 audio call. The result of this operation is returned by `onResult`, if it is successful, it returns `callId`, otherwise it returns `error`.
   *
   * @param params -
   * - inviteeId: Invitee ID.
   * - channelId: The unique identifier of the call channel. It is recommended to create via {@link createChannelId}. This property is highly recommended for preservation.
   * - rtcToken: The token obtained through the `appserver` request using `channelId`.
   * - extension: any.
   * - onResult: Returns `callId` on success, `error` on failure. The `callId` property is highly recommended for preservation.
   */
  public startSingleAudioCall(params: {
    inviteeId: string;
    channelId: string;
    rtcToken: string;
    extension?: any;
    onResult: (params: { callId?: string; error?: any }) => void;
  }): void {
    calllog.log('CallManagerImpl:startSingleAudioCall:', params);
    this._startCall({
      ...params,
      callType: CallType.Audio1v1,
      inviteeIds: [params.inviteeId],
    });
  }

  /**
   * An invitation to start a 1v1 video call. The result of this operation is returned by `onResult`, if it is successful, it returns `callId`, otherwise it returns `error`.
   *
   * If the network is not good, you can try to switch to audio mode. {@link videoToAudio}
   *
   * @param params -
   * - inviteeId: Invitee ID.
   * - channelId: The unique identifier of the call channel. It is recommended to create via {@link createChannelId}. This property is highly recommended for preservation.
   * - rtcToken: The token obtained through the `appserver` request using `channelId`.
   * - extension: any.
   * - onResult: Returns `callId` on success, `error` on failure. The `callId` property is highly recommended for preservation.
   */
  public startSingleVideoCall(params: {
    inviteeId: string;
    channelId: string;
    rtcToken: string;
    extension?: any;
    onResult: (params: { callId?: string; error?: any }) => void;
  }): void {
    calllog.log('CallManagerImpl:startSingleVideoCall:', params);
    this._startCall({
      ...params,
      callType: CallType.Video1v1,
      inviteeIds: [params.inviteeId],
    });
  }

  /**
   * An invitation to start a multi audio/video call. The result of this operation is returned by `onResult`, if it is successful, it returns `callId`, otherwise it returns `error`.
   *
   * If the network is not good, you can try to switch to audio mode. {@link videoToAudio}
   *
   * During the call, you can invite the dropped person or others again.
   *
   * @param params -
   * - inviteeIds: Invitee ID list.
   * - channelId: The unique identifier of the call channel. It is recommended to create via {@link createChannelId}. This property is highly recommended for preservation.
   * - rtcToken: The token obtained through the `appserver` request using `channelId`.
   * - extension: any.
   * - onResult: Returns `callId` on success, `error` on failure. The `callId` property is highly recommended for preservation.
   */
  public startMultiCall(params: {
    inviteeIds: string[];
    channelId: string;
    rtcToken: string;
    extension?: any;
    onResult: (params: { callId?: string; error?: any }) => void;
  }): void {
    calllog.log('CallManagerImpl:startMultiCall:', params);
    this._startCall({
      ...params,
      callType: CallType.Multi,
    });
  }

  setUserMap(params: {
    channelId: string;
    userId: string;
    userChannelId: number;
  }): void {
    calllog.log('CallManagerImpl:setUser:', params);
    const call = this._getCallByChannelId(params.channelId);
    if (call) {
      if (call.isInviter) {
        call.inviter.userChannelId = params.userChannelId;
        call.inviter.userHadJoined = true; // TODO:
      } else {
        const invitee = call.invitees.get(params.userId);
        if (invitee) {
          invitee.userChannelId = params.userChannelId;
        }
      }
    }
  }

  /**
   * Hung up the current call.
   *
   * You can hang up the call during the call, or the inviter initiates the invitation and has not been answered.
   *
   * @param params -
   * - callId: The ID obtained by {@link CallListener.onCallReceived}.
   * - onResult: Returns `callId` on success, `error` on failure.
   */
  public hangUpCall(params: {
    callId: string;
    onResult: (params: { callId?: string; error?: any }) => void;
  }): void {
    calllog.log('CallManagerImpl:hangUpCall:', params);
    const call = this._getCall(params.callId);
    if (call) {
      if (call.isInviter === true) {
        if (
          call.state === CallSignalingState.Idle ||
          call.state === CallSignalingState.Joined
        ) {
          this._hangUpCall(params.callId);
        } else if (
          call.state === CallSignalingState.InviterInviting ||
          call.state === CallSignalingState.InviterInviteConfirming ||
          call.state === CallSignalingState.InviterJoining
        ) {
          this._cancelCall(params.callId);
        }
      } else {
        if (call.state === CallSignalingState.Joined) {
          this._hangUpCall(params.callId);
        }
      }
    }
  }

  /**
   * Cancel the current call.
   *
   * Can only be used by the inviter.
   *
   * Only used if the invitee does not answer or declines.
   *
   * @param params -
   * - callId: The ID obtained by {@link startSingleAudioCall} {@link startSingleVideoCall} {@link startMultiCall}.
   * - onResult: Returns `callId` on success, `error` on failure.
   */
  public cancelCall(params: {
    callId: string;
    onResult: (params: { callId?: string; error?: any }) => void;
  }): void {
    calllog.log('CallManagerImpl:cancelCall:', params);
    this._cancelCall(params.callId);
  }

  /**
   * decline the current call. Can only be used by the invitee.
   *
   * @param params -
   * - callId: The ID obtained by {@link CallListener.onCallReceived}.
   * - onResult: Returns `callId` on success, `error` on failure.
   */
  public declineCall(params: {
    callId: string;
    extension?: any;
    onResult: (params: { callId?: string; error?: any }) => void;
  }): void {
    calllog.log('CallManagerImpl:declineCall:', params);
    const call = this._getCall(params.callId);
    if (call) {
      if (call.isInviter === false) {
        const invitee = call.invitees.get(this.userId);
        if (invitee) {
          this._changeState({
            callId: params.callId,
            new: CallSignalingState.InviteeInviteConfirming,
          });
          this.handler.sendInviteReply({
            callId: call.callId,
            inviterId: call.inviter.userId,
            inviteeDeviceToken: invitee.userDeviceToken ?? '',
            inviterDeviceToken: call.inviter.userDeviceToken ?? '',
            reply: 'refuse',
            onResult: ({ callId, error }) => {
              calllog.log(
                'CallManagerImpl:declineCall:sendInviteReply:',
                params
              );
              if (error) {
                this.timer.stopTiming({ callId, userId: call.inviter.userId });
                this._answerTimeout({ callId, userId: call.inviter.userId });
              }
            },
          });
          this.timer.startAnswerTiming({
            callId: params.callId,
            userId: call.inviter.userId,
          });
        }
      }
    }
  }

  /**
   * Accept the current call. Can only be used by the invitee.
   *
   * @param params -
   * - callId: The ID obtained by {@link CallListener.onCallReceived}.
   * - onResult: Returns `callId` on success, `error` on failure.
   */
  public acceptCall(params: {
    callId: string;
    rtcToken: string;
    extension?: any;
    onResult: (params: { callId?: string; error?: any }) => void;
  }): void {
    calllog.log('CallManagerImpl:acceptCall:', params);
    const call = this._getCall(params.callId);
    if (call) {
      if (call.isInviter === false) {
        const invitee = call.invitees.get(this.userId);
        if (invitee) {
          this._changeState({
            callId: params.callId,
            new: CallSignalingState.InviteeInviteConfirming,
          });
          this.handler.sendInviteReply({
            callId: call.callId,
            inviterId: call.inviter.userId,
            inviteeDeviceToken: invitee.userDeviceToken ?? '',
            inviterDeviceToken: call.inviter.userDeviceToken ?? '',
            reply: 'accept',
            onResult: ({ callId, error }) => {
              calllog.log(
                'CallManagerImpl:declineCall:sendInviteReply:',
                params
              );
              if (error) {
                this.timer.stopTiming({ callId, userId: call.inviter.userId });
                this._answerTimeout({ callId, userId: call.inviter.userId });
              }
            },
          });
          this.timer.startAnswerTiming({
            callId: params.callId,
            userId: call.inviter.userId,
          });
        }
      }
    }
  }

  /**
   * Whether to turn off the call audio.
   *
   * @param isMute true or false.
   */
  public setAudioMute(isMute: boolean): void {
    calllog.log('CallManagerImpl:setAudioMute:', isMute);
  }

  /**
   * Whether to turn off the call video.
   *
   * @param isMute true or false.
   */
  public setVideoMute(isMute: boolean): void {
    calllog.log('CallManagerImpl:setVideoMute:', isMute);
  }

  /**
   * Whether to turn off the call speak.
   *
   * @param isMute true or false.
   */
  public setSpeakMute(isMute: boolean): void {
    calllog.log('CallManagerImpl:setSpeakMute:', isMute);
  }

  /**
   * Get user information.
   *
   * @param userId The use ID.
   */
  public getUserInfo(userId: string): CallUser | undefined {
    calllog.log('CallManagerImpl:getUserInfo:', userId);
    return this.users.get(userId);
  }

  /**
   * Video calls are converted to voice calls.
   *
   * @param params -
   * - callId: The call ID.
   * - onResult: Returns `callId` on success, `error` on failure.
   */
  public videoToAudio(params: {
    callId: string;
    onResult: (params: { callId?: string; error?: any }) => void;
  }): void {
    calllog.log('CallManagerImpl:videoToAudio:', params);
  }

  /**
   * Set the user information of the call.
   *
   * @param user: The user information.
   */
  public setUsers(user: CallUser): void {
    calllog.log('CallManagerImpl:setUsers:', user);
    this._setUser(user);
  }

  protected setRTCToken(): void {}

  //////////////////////////////////////////////////////////////////////////////
  //// Private Methods /////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  private _reset(): void {
    calllog.log('CallManagerImpl:_reset:');
    this._clearShip();
    this.timer.stopAllTiming();
    this._clearUser();
  }

  private _clearShip(): void {
    this.ship.currentCall = undefined;
    this.ship.receiveCallList.clear();
  }

  private _isBusy(): boolean {
    if (this.ship.currentCall) {
      if (this.ship.currentCall.state !== CallSignalingState.Idle) {
        return true;
      }
    } else if (this.ship.receiveCallList) {
      if (this.ship.receiveCallList.size > 0) {
        return true;
      }
    }
    return false;
  }

  private _changeState(params: {
    callId: string;
    new: CallSignalingState;
  }): void {
    calllog.log('CallManagerImpl:_changeState:', params);
    const call = this._getCall(params.callId);
    if (call) {
      call.state = params.new;
    }
  }

  private _cancelCall(callId: string): void {
    calllog.log('CallManagerImpl:_cancelCall:', callId);
    const call = this.ship.currentCall;
    if (call && call.isInviter === true) {
      for (const key in call.invitees) {
        const invitee = call.invitees.get(key)!;
        this.handler.sendInviteCancel({
          callId: call.callId,
          inviteeId: invitee?.userId,
          inviterDeviceToken: call.inviter.userDeviceToken!,
          onResult: ({ callId, error }) => {
            console.log(
              'CallManagerImpl:_cancelCall:sendInviteCancel:',
              callId,
              error
            );
            // TODO: Ignore the result.
          },
        });
      }
      this.onCallEndedInternal({
        channelId: call.channelId,
        callType: call.callType,
        endReason: CallEndReason.Cancel,
      });
      this._reset();
    }
  }

  private _hangUpCall(callId: string): void {
    calllog.log('CallManagerImpl:_hangUpCall:', callId);
    const call = this.ship.currentCall;
    if (call) {
      if (call.state === CallSignalingState.Joined) {
        this.onCallEndedInternal({
          channelId: call.channelId,
          callType: call.callType,
          endReason: CallEndReason.HungUp,
        });
        this._reset();
      }
    }
  }

  private _createInviterCall(params: {
    callType: CallType;
    channelId: string;
    rtcToken: string;
    inviteeIds: string[];
    timestamp?: number;
    ext?: any;
  }): CallObject {
    if (this.ship.currentCall) {
      throw new CallError({
        code: CallErrorCode.ExceptionState,
        description: 'The `Call` object has been created.',
      });
    }
    const call = {
      ...params,
      callId: uuid(),
      invitees: new Map(),
      userRTCToken: params.rtcToken,
      isInviter: true,
      inviter: {
        userId: this.userId,
        userDeviceToken: this.deviceToken,
        userHadJoined: false,
      },
      timestamp: params.timestamp ?? timestamp(),
      ext: params.ext,
      state: CallSignalingState.Idle,
    };
    this.ship.currentCall = call;
    this._addInvitee(
      call.callId,
      params.inviteeIds.map((id) => {
        return {
          userId: id,
          userHadJoined: false,
        } as CallInvitee;
      })
    );
    return call;
  }

  private _createInviteeCall(params: {
    callId: string;
    callType: CallType;
    channelId: string;
    inviter: {
      userId: string;
      userDeviceToken?: string;
    };
    timestamp?: number;
    ext?: any;
  }): CallObject {
    if (this.ship.currentCall) {
      throw new CallError({
        code: CallErrorCode.ExceptionState,
        description: 'The `Call` object has been created.',
      });
    }
    if (this.ship.receiveCallList.get(params.callId)) {
      throw new CallError({
        code: CallErrorCode.ExceptionState,
        description: 'The `Call` object has been created.',
      });
    }
    const call = {
      ...params,
      isInviter: false,
      invitees: new Map(),
      inviter: {
        userId: params.inviter.userId,
        userDeviceToken: params.inviter.userDeviceToken,
        userHadJoined: false,
      },
      timestamp: params.timestamp,
      ext: params.ext,
      state: CallSignalingState.Idle,
    };
    this.ship.receiveCallList.set(call.callId, call);
    this._addInvitee(call.callId, [
      {
        userId: this._userId,
        userDeviceToken: this._deviceToken,
        userHadJoined: false,
      } as CallInvitee,
    ]);
    return call;
  }

  private _getCall(callId: string): CallObject | undefined {
    if (this.ship.currentCall?.callId === callId) {
      return this.ship.currentCall;
    } else {
      return this.ship.receiveCallList.get(callId);
    }
  }

  private _removeCall(callId: string): void {
    if (this.ship.currentCall?.callId === callId) {
      this.ship.currentCall = undefined;
    } else {
      this.ship.receiveCallList.delete(callId);
    }
  }

  private _getCallByChannelId(channelId: string): CallObject | undefined {
    if (this.ship.currentCall?.channelId === channelId) {
      return this.ship.currentCall;
    } else {
      for (const key in this.ship.receiveCallList) {
        const call = this.ship.receiveCallList.get(key);
        if (call?.channelId === channelId) {
          return call;
        }
      }
    }
    return undefined;
  }

  private _addInvitee(callId: string, invitees: CallInvitee[]): void {
    const call = this._getCall(callId);
    if (call) {
      for (const invitee of invitees) {
        call.invitees.set(invitee.userId, invitee);
      }
    }
  }

  private _startCall(params: {
    inviteeIds: string[];
    callType: CallType;
    channelId: string;
    rtcToken: string;
    extension?: any;
    onResult: (params: { callId?: string; error?: any }) => void;
  }): void {
    calllog.log('CallManagerImpl:_startCall:', params);
    if (params.inviteeIds.length === 0) {
      params.onResult({
        callId: undefined,
        error: new CallError({
          code: CallErrorCode.InvalidParams,
          description: 'Please add invitees.',
        }),
      });
      return;
    }

    let call: CallObject | undefined;
    call = this._getCallByChannelId(params.channelId); // !!! _getCallByChannelId
    if (call) {
      calllog.log(
        'CallManagerImpl:_startCall:re:',
        call.isInviter,
        call.inviter.userId
      );
      if (call.isInviter === false) {
        if (
          call.state !== CallSignalingState.Idle &&
          call.state !== CallSignalingState.Joined
        ) {
          params.onResult({
            callId: call.callId,
            error: new CallError({
              code: CallErrorCode.ExceptionState,
              description:
                'Invitees can invite others only when they are in a call.',
              type: CallErrorType.Signaling,
            }),
          });
          return;
        }
        this.ship.currentCall = undefined; // TODO: reset
        call = this._createInviterCall({
          callType: params.callType,
          channelId: params.channelId,
          inviteeIds: params.inviteeIds,
          rtcToken: params.rtcToken,
        });
      } else {
        if (
          call.state !== CallSignalingState.Idle &&
          call.state !== CallSignalingState.Joined
        ) {
          params.onResult({
            callId: call.callId,
            error: new CallError({
              code: CallErrorCode.ExceptionState,
              description:
                'The inviter can only invite again after joining the channel.',
              type: CallErrorType.Signaling,
            }),
          });
          return;
        }
      }
      this._changeState({
        callId: call.callId,
        new: CallSignalingState.InviterInviting,
      });
      const toAdd = [] as string[];
      for (const id of params.inviteeIds) {
        const invitee = call.invitees.get(id);
        if (invitee === undefined || invitee.userHadJoined === false) {
          toAdd.push(id);
        }
      }
      if (toAdd.length > 0) {
        this._addInvitee(
          call.callId,
          toAdd.map((id) => {
            return {
              userId: id,
              userHadJoined: false,
            } as CallInvitee;
          })
        );
      } else {
        params.onResult({
          callId: call.callId,
          error: new CallError({
            code: CallErrorCode.ExceptionState,
            description:
              'Please do not select people who have already joined the channel.',
            type: CallErrorType.Signaling,
          }),
        });
        return;
      }

      for (const id of toAdd) {
        // this.client?.isConnected().then().catch(); // TODO: Solve network problems. Otherwise, timeout is required.
        this.handler.sendInvite({
          inviteeId: id,
          channelId: call.channelId,
          callType: call.callType,
          inviterDeviceToken: this.deviceToken, // !!! It may not be consistent.
          callId: call.callId,
          ext: params.extension,
          onResult: ({ callId, error }) => {
            console.log('CallManagerImpl:sendInvite:', callId);
            if (error) {
              // TODO: Could be a network problem. Could be on a blacklist.
              this.timer.stopTiming({ callId, userId: id });
              const call = this._getCall(callId);
              if (call) {
                if (call.callType !== CallType.Multi) {
                  this._reset();
                  this.onCallEndedInternal({
                    channelId: call.channelId,
                    callType: call.callType,
                    endReason: CallEndReason.NoResponse,
                  });
                } else {
                  // TODO: Remove the invitee.
                }
              }
            }
          },
        });
        this.timer.startInviteTiming({ callId: call.callId, userId: id });
      }
    } else {
      // The case of a brand new invitation.
      call = this._createInviterCall({
        callType: params.callType,
        channelId: params.channelId,
        inviteeIds: params.inviteeIds,
        rtcToken: params.rtcToken,
      });
      this._changeState({
        callId: call.callId,
        new: CallSignalingState.InviterInviting,
      });

      for (const id of params.inviteeIds) {
        // this.client?.isConnected().then().catch(); // TODO: Solve network problems. Otherwise, timeout is required.
        this.handler.sendInvite({
          inviteeId: id,
          channelId: call.channelId,
          callType: call.callType,
          inviterDeviceToken: this.deviceToken, // !!! It may not be consistent.
          callId: call.callId,
          ext: params.extension,
          onResult: ({ callId, error }) => {
            console.log('CallManagerImpl:sendInvite:', callId);
            if (error) {
              // TODO: Could be a network problem. Could be on a blacklist.
              this.timer.stopTiming({ callId, userId: id });
              const call = this._getCall(callId);
              if (call) {
                if (call.callType !== CallType.Multi) {
                  this._reset();
                  this.onCallEndedInternal({
                    channelId: call.channelId,
                    callType: call.callType,
                    endReason: CallEndReason.NoResponse,
                  });
                } else {
                  // TODO: Remove the invitee.
                }
              }
            }
          },
        });
        this.timer.startInviteTiming({ callId: call.callId, userId: id });
      }
    }
  }

  private _inviteTimeout(params: { callId: string; userId: string }): void {
    calllog.log('CallManagerImpl:_inviteTimeout', params);
    const call = this._getCall(params.callId);
    if (call) {
      this.handler.sendInviteCancel({
        ...params,
        inviteeId: params.userId,
        inviterDeviceToken: call.inviter.userDeviceToken!,
        onResult: ({ callId, error }) => {
          console.log(
            'CallManagerImpl:_inviteTimeout:sendInviteCancel:',
            callId,
            error
          );
          // TODO: Ignore the result.
        },
      });
      if (call.callType !== CallType.Multi) {
        // TODO: End the call and notify the user.
        this._reset();
        this.onCallEndedInternal({
          channelId: call.channelId,
          callType: call.callType,
          endReason: CallEndReason.RemoteNoResponse,
        });
      } else {
        // TODO: Remove the invitee.
      }
    }
  }

  private _alertTimeout(params: { callId: string; userId: string }): void {
    calllog.log('CallManagerImpl:_alertTimeout', params);
    const call = this._getCall(params.callId);
    if (call) {
      this._removeCall(params.callId);
    }
  }

  private _answerTimeout(params: { callId: string; userId: string }): void {
    calllog.log('CallManagerImpl:_answerTimeout', params);
    const call = this._getCall(params.callId);
    if (call) {
      this._removeCall(params.callId);
      this.onCallEndedInternal({
        channelId: call.channelId,
        callType: call.callType,
        endReason: CallEndReason.RemoteNoResponse,
      });
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  //// CallListener ////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  protected onCallEndedInternal(params: {
    channelId: string;
    callType: CallType;
    endReason: CallEndReason;
  }): void {
    calllog.log('CallManagerImpl:onCallEndedInternal', params);
    // TODO:
    this.listener?.onCallEnded?.({ ...params, elapsed: 0 });
  }

  //////////////////////////////////////////////////////////////////////////////
  //// Users ///////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  private _setUser(user: CallUser): void {
    this.users.set(user.userId, user);
  }

  private _clearUser(): void {
    this.users.clear();
  }

  //////////////////////////////////////////////////////////////////////////////
  //// CallTimeoutListener /////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  onInviteTimeout(params: { callId: string; userId: string }): void {
    calllog.log('CallManagerImpl:onInviteTimeout:', params);
    this._inviteTimeout(params);
  }
  onAlertTimeout(params: { callId: string; userId: string }): void {
    calllog.log('CallManagerImpl:onAlertTimeout:', params);
    this._alertTimeout(params);
  }
  onConfirmTimeout(params: { callId: string; userId: string }): void {
    calllog.log('CallManagerImpl:onConfirmTimeout:', params);
  }
  onAnswerTimeout(params: { callId: string; userId: string }): void {
    calllog.log('CallManagerImpl:onAnswerTimeout:', params);
    this._answerTimeout(params);
  }

  //////////////////////////////////////////////////////////////////////////////
  //// CallSignallingListener //////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  onInvite(params: {
    callId: string;
    callType: CallType;
    inviterId: string;
    inviterDeviceToken: string;
    channelId: string;
    ts: number;
    ext?: any;
  }): void {
    calllog.log('CallManagerImpl:onInvite:', params);
    if (this._isBusy()) {
      calllog.log('CallManagerImpl:onInvite:', this._isBusy());
      this.handler.sendInviteReply({
        callId: params.callId,
        inviterId: params.inviterId,
        inviteeDeviceToken: this.deviceToken,
        inviterDeviceToken: params.inviterDeviceToken,
        reply: 'busy',
        onResult: (params: { callId: string; error?: any }) => {
          calllog.log('CallManagerImpl:declineCall:sendInviteReply:', params);
          // TODO: ignore.
        },
      });
      return;
    }
    const call = this._createInviteeCall({
      callId: params.callId,
      callType: params.callType,
      channelId: params.channelId,
      inviter: {
        userId: params.inviterId,
        userDeviceToken: params.inviterDeviceToken,
      },
      timestamp: params.ts,
      ext: params.ext,
    });
    const invitee = call.invitees.get(this.userId);
    if (invitee) {
      this._changeState({
        callId: params.callId,
        new: CallSignalingState.InviteeAlerting,
      });
      this.handler.sendAlert({
        callId: call.callId,
        inviterId: call.inviter.userId,
        inviterDeviceToken: call.inviter.userDeviceToken!,
        inviteeDeviceToken: invitee.userDeviceToken!,
        onResult: ({ callId, error }) => {
          calllog.log('CallManagerImpl:onInvite:sendAlert:', callId, error);
          if (error) {
            this.timer.stopTiming({
              callId: call.callId,
              userId: call.inviter.userId,
            });
            this._alertTimeout({
              callId: params.callId,
              userId: call.inviter.userId,
            });
          }
        },
      });
      this.timer.startAlertTiming({
        callId: call.callId,
        userId: call.inviter.userId,
      });
    }
  }
  onAlert(params: {
    callId: string;
    callType: CallType;
    inviteeId: string;
    inviterDeviceToken: string;
    inviteeDeviceToken: string;
    channelId: string;
    ts: number;
  }): void {
    calllog.log('CallManagerImpl:onAlert:', params);
    const call = this._getCall(params.callId);
    if (call && call.inviter.userDeviceToken === params.inviterDeviceToken) {
      const invitee = call.invitees.get(params.inviteeId);
      if (invitee) {
        this._changeState({
          callId: params.callId,
          new: CallSignalingState.InviterInviteConfirming,
        });
        const inviteTimer = this.timer.hasTiming({
          callId: params.callId,
          userId: params.inviteeId,
        });
        this.handler.sendAlertConfirm({
          callId: params.callId,
          inviteeId: params.inviteeId,
          inviterDeviceToken: params.inviterDeviceToken,
          inviteeDeviceToken: params.inviteeDeviceToken,
          isValid: inviteTimer === true,
          onResult: ({ callId, error }) => {
            calllog.log('CallManagerImpl:onAlert:', params);
            if (error) {
              this.timer.stopTiming({ callId, userId: params.inviteeId });
              const call = this._getCall(callId);
              if (call) {
                if (call.callType !== CallType.Multi) {
                  this._reset();
                  this.onCallEndedInternal({
                    channelId: call.channelId,
                    callType: call.callType,
                    endReason: CallEndReason.NoResponse,
                  });
                } else {
                  // TODO: Remove the invitee.
                }
              }
            }
          },
        });
      }
    }
  }
  onAlertConfirm(params: {
    callId: string;
    callType: CallType;
    isValid: boolean;
    inviterId: string;
    inviterDeviceToken: string;
    inviteeDeviceToken: string;
    channelId: string;
    ts: number;
  }): void {
    calllog.log('CallManagerImpl:onAlertConfirm:', params);
    const call = this._getCall(params.callId);
    if (call && call.inviter.userDeviceToken === params.inviterDeviceToken) {
      const invitee = call.invitees.get(this.userId);
      if (invitee && invitee.userDeviceToken === params.inviteeDeviceToken) {
        this.timer.stopTiming({
          callId: params.callId,
          userId: params.inviterId,
        });
        if (params.isValid === true) {
          const call = this.ship.receiveCallList.get(params.callId);
          if (call) {
            this._removeCall(params.callId);
            this.ship.currentCall = call;
            // TODO: As the invitee, start playing music and display the interface in establishing the connection.
            this.listener?.onCallReceived?.({
              channelId: call.channelId,
              inviterId: call.inviter.userId,
              callType: call.callType,
              extension: call.ext,
            });
          }
        }
      }
    }
  }
  onInviteCancel(params: {
    callId: string;
    callType: CallType;
    inviterId: string;
    inviterDeviceToken: string;
    channelId: string;
    ts: number;
  }): void {
    calllog.log('CallManagerImpl:onInviteCancel:', params);
    const call = this._getCall(params.callId);
    if (call && call.inviter.userDeviceToken === params.inviterDeviceToken) {
      const invitee = call.invitees.get(this.userId);
      if (invitee) {
        if (
          call.state === CallSignalingState.InviteeAlerting ||
          call.state === CallSignalingState.InviteeInviteConfirming ||
          call.state === CallSignalingState.InviteeJoining
        ) {
          this.timer.stopTiming({
            callId: params.callId,
            userId: params.inviterId,
          });
          this._changeState({
            callId: params.callId,
            new: CallSignalingState.Idle,
          });
          this._removeCall(params.callId);
          if (
            call.state === CallSignalingState.InviteeInviteConfirming ||
            call.state === CallSignalingState.InviteeJoining
          ) {
            // TODO: The call is not connected yet.
            this.onCallEndedInternal({
              channelId: call.channelId,
              callType: call.callType,
              endReason: CallEndReason.RemoteCancel,
            });
          }
        }
      }
    }
  }
  onInviteReply(params: {
    callId: string;
    callType: CallType;
    inviteeId: string;
    reply:
      | typeof K.KeyBusyResult
      | typeof K.KeyAcceptResult
      | typeof K.KeyRefuseResult;
    inviteeDeviceToken: string;
    inviterDeviceToken: string;
    channelId: string;
    ts: number;
  }): void {
    calllog.log('CallManagerImpl:onInviteReply:', params);
    const call = this._getCall(params.callId);
    if (call && call.inviter.userDeviceToken === params.inviterDeviceToken) {
      const invitee = call.invitees.get(params.inviteeId);
      if (invitee) {
        if (invitee.userDeviceToken === undefined) {
          invitee.userDeviceToken = params.inviteeDeviceToken;
          this.timer.stopTiming({
            callId: params.callId,
            userId: params.inviteeId,
          });
          if (params.callType !== CallType.Multi) {
            if (params.reply === 'accept') {
              this._changeState({
                callId: params.callId,
                new: CallSignalingState.InviterJoining,
              });
              // TODO: to add channel
            } else {
              this.onCallEndedInternal({
                channelId: call.channelId,
                callType: call.callType,
                endReason: CallEndReason.RemoteRefuse,
              });
            }
          } else {
            if (params.reply === 'accept') {
              this._changeState({
                callId: params.callId,
                new: CallSignalingState.InviterJoining,
              });
            } else {
              // TODO: remove from ui
            }
          }
        }
        if (params.reply === 'accept' || params.reply === 'refuse') {
          this.handler.sendInviteReplyConfirm({
            callId: params.callId,
            inviteeId: params.inviteeId,
            inviteeDeviceToken: invitee.userDeviceToken,
            inviterDeviceToken: params.inviterDeviceToken,
            reply: params.reply,
            onResult: ({ callId, error }) => {
              calllog.log(
                'CallManagerImpl:onInviteReply:sendInviteReplyConfirm:',
                params
              );
              if (error) {
                const call = this._getCall(callId);
                if (call) {
                  if (call.callType !== CallType.Multi) {
                    this._reset();
                    this.onCallEndedInternal({
                      channelId: call.channelId,
                      callType: call.callType,
                      endReason: CallEndReason.NoResponse,
                    });
                  } else {
                    // TODO: Remove the invitee.
                  }
                }
              }
            },
          });
        }
      }
    }
  }
  onInviteReplyConfirm(params: {
    callId: string;
    callType: CallType;
    inviterId: string;
    reply:
      | typeof K.KeyBusyResult
      | typeof K.KeyAcceptResult
      | typeof K.KeyRefuseResult;
    inviterDeviceToken: string;
    inviteeDeviceToken: string;
    channelId: string;
    ts: number;
  }): void {
    calllog.log('CallManagerImpl:onInviteReply:onInviteReplyConfirm:', params);
    const call = this._getCall(params.callId);
    if (call && call.inviter.userDeviceToken === params.inviterDeviceToken) {
      const invitee = call.invitees.get(this.userId);
      if (invitee) {
        this.timer.stopTiming({
          callId: params.callId,
          userId: params.inviterId,
        });
        if (invitee.userDeviceToken === params.inviteeDeviceToken) {
          if (params.reply === 'accept') {
            this._changeState({
              callId: params.callId,
              new: CallSignalingState.InviteeJoining,
            });
            // TODO: add channel
          } else {
            this.onCallEndedInternal({
              channelId: call.channelId,
              callType: call.callType,
              endReason:
                params.reply === 'busy'
                  ? CallEndReason.RemoteBusy
                  : CallEndReason.RemoteRefuse,
            });
          }
        } else {
          this._removeCall(params.callId);
          this.onCallEndedInternal({
            channelId: call.channelId,
            callType: call.callType,
            endReason: CallEndReason.HandleOnOtherDevice,
          });
        }
      }
    }
  }
  onVideoToAudio(): void {}

  //////////////////////////////////////////////////////////////////////////////
  //// IRtcEngineEventHandler //////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  public onError(err: ErrorCodeType, msg: string) {
    calllog.log('CallManagerImpl:onError:', err, msg);
    if (err !== ErrorCodeType.ErrOk && this.ship.currentCall) {
      this.listener?.onCallOccurError?.({
        channelId: this.ship.currentCall.channelId,
        error: new CallError({
          code: err,
          description: msg,
          type: CallErrorType.RTC,
        }),
      });
    }
  }

  public onJoinChannelSuccess(connection: RtcConnection, elapsed: number) {
    calllog.log('CallManagerImpl:onJoinChannelSuccess:', connection, elapsed);
    if (connection.channelId && connection.localUid) {
      const call = this._getCallByChannelId(connection.channelId);
      if (call) {
        if (call.isInviter === true) {
          call.inviter.userChannelId = connection.localUid;
        } else {
          if (call.callType !== CallType.Multi) {
            const invitee = call.invitees.get(this.userId);
            if (invitee) {
              invitee.userChannelId = connection.localUid;
            }
          }
        }
      }
      this.listener?.onSelfJoined?.({
        channelId: connection.channelId,
        userChannelId: connection.localUid,
      });
    }
  }

  public onLeaveChannel(connection: RtcConnection, stats: RtcStats) {
    calllog.log('CallManagerImpl:onLeaveChannel:', connection, stats);
    if (connection.channelId && connection.localUid) {
      const call = this._getCallByChannelId(connection.channelId);
      if (call) {
        // TODO:
      }
    }
  }

  public onUserJoined(
    connection: RtcConnection,
    remoteUid: number,
    elapsed: number
  ) {
    calllog.log(
      'CallManagerImpl:onUserJoined:',
      connection,
      remoteUid,
      elapsed
    );
    if (connection.channelId && connection.localUid) {
      this.listener?.onRemoteUserJoined?.({
        channelId: connection.channelId,
        userChannelId: connection.localUid,
      });
    }
  }

  public onUserOffline(
    connection: RtcConnection,
    remoteUid: number,
    reason: UserOfflineReasonType
  ) {
    calllog.log(
      'CallManagerImpl:onUserOffline:',
      connection,
      remoteUid,
      reason
    );
    if (connection.channelId) {
      const call = this._getCallByChannelId(connection.channelId);
      if (call) {
        if (call.callType !== CallType.Multi) {
          // TODO:
        } else {
          // TODO:
        }
      }
    }
  }

  public onVideoDeviceStateChanged(
    deviceId: string,
    deviceType: number,
    deviceState: number
  ) {
    calllog.log(
      'CallManagerImpl:onVideoDeviceStateChanged:',
      deviceId,
      deviceType,
      deviceState
    );
    const call = this.ship.currentCall;
    if (call) {
      call.videoToAudio = true;
    }
  }

  public onLocalVideoStateChanged(
    source: VideoSourceType,
    state: LocalVideoStreamState,
    error: LocalVideoStreamError
  ) {
    calllog.log(
      'CallManagerImpl:onLocalVideoStateChanged:',
      source,
      state,
      error
    );
    const call = this.ship.currentCall;
    if (call) {
      call.videoToAudio = true;
    }
  }

  public onRemoteAudioStats(
    connection: RtcConnection,
    stats: RemoteAudioStats
  ): void {
    calllog.log('CallManagerImpl:onRemoteAudioStats:', connection, stats);
  }

  public onTokenPrivilegeWillExpire(
    connection: RtcConnection,
    token: string
  ): void {
    calllog.log(
      'CallManagerImpl:onTokenPrivilegeWillExpire:',
      connection,
      token
    );
  }

  public onRequestToken(connection: RtcConnection): void {
    calllog.log('CallManagerImpl:onTokenPrivilegeWillExpire:', connection);
  }

  public onUserMuteVideo(
    connection: RtcConnection,
    remoteUid: number,
    muted: boolean
  ): void {
    calllog.log(
      'CallManagerImpl:onUserMuteVideo:',
      connection,
      remoteUid,
      muted
    );
  }

  public onUserMuteAudio(
    connection: RtcConnection,
    remoteUid: number,
    muted: boolean
  ): void {
    calllog.log(
      'CallManagerImpl:onUserMuteAudio:',
      connection,
      remoteUid,
      muted
    );
  }

  public onAudioVolumeIndication?(
    connection: RtcConnection,
    speakers: AudioVolumeInfo[],
    speakerNumber: number,
    totalVolume: number
  ): void {
    calllog.log(
      'CallManagerImpl:onAudioVolumeIndication:',
      connection,
      speakers.length,
      speakerNumber,
      totalVolume
    );
    if (connection.channelId) {
      const call = this._getCallByChannelId(connection.channelId);
      if (call) {
        for (const speaker of speakers) {
          if (speaker.volume && speaker.volume > 5) {
            // TODO:
          } else {
            // TODO:
          }
        }
      }
    }
  }
}

let gCallManager: CallManager;
export function createManagerImpl(): CallManager {
  if (gCallManager === undefined) {
    gCallManager = new CallManagerImpl();
  }
  return gCallManager;
}
