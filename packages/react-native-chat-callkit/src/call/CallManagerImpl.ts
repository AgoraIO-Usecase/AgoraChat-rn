import {
  AudioVolumeInfo,
  ChannelProfileType,
  ClientRoleType,
  ConnectionChangedReasonType,
  ConnectionStateType,
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
import { CallDevice } from './CallDevice';
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
import type { CallViewListener } from './CallViewListener';

export class CallManagerImpl
  implements
    CallManager,
    IRtcEngineEventHandler,
    CallSignallingListener,
    CallTimeoutListener
{
  private _isInit: boolean;
  private _client?: ChatClient;
  private _option: CallOption;
  private _listener?: CallViewListener;
  private _engine?: IRtcEngine;
  private _ship: CallRelationship;
  private _sig: CallSignallingHandler;
  private _timer: CallTimeoutHandler;
  private _userId: string;
  private _deviceToken: string;
  private _users: Map<string, CallUser>;
  private _device: CallDevice;
  private _userListener?: CallListener;
  private _requestRTCToken?: (params: {
    appKey: string;
    channelId: string;
    userId: string;
    onResult: (params: { data?: any; error?: any }) => void;
  }) => void;
  private _requestUserMap?: (params: {
    appKey: string;
    channelId: string;
    userId: string;
    onResult: (params: { data?: any; error?: any }) => void;
  }) => void;
  private _requestCurrentUser?: (params: {
    onResult: (params: { user: CallUser; error?: any }) => void;
  }) => void;

  constructor() {
    calllog.log('CallManagerImpl:constructor:');
    this._option = {} as CallOption;
    this._users = new Map();
    this._ship = {
      receiveCallList: new Map(),
    } as CallRelationship;
    this._userId = '';
    this._deviceToken = 'magic';
    this._timer = new CallTimeoutHandler();
    this._sig = new CallSignallingHandler();
    this._device = new CallDevice();
    this._isInit = false;
  }

  protected destructor(): void {
    calllog.log('CallManagerImpl:destructor:');
    // TODO: reserve.
  }

  public init(params: {
    option: CallOption;
    listener?: CallViewListener;
    enableLog?: boolean;
    requestRTCToken: (params: {
      appKey: string;
      channelId: string;
      userId: string;
      onResult: (params: { data?: any; error?: any }) => void;
    }) => void;
    requestUserMap: (params: {
      appKey: string;
      channelId: string;
      userId: string;
      onResult: (params: { data?: any; error?: any }) => void;
    }) => void;
    requestCurrentUser: (params: {
      onResult: (params: { user: CallUser; error?: any }) => void;
    }) => void;
    onResult?: (params?: { error?: CallError }) => void;
  }): void {
    if (this._isInit === true) {
      params.onResult?.({
        error: new CallError({
          code: CallErrorCode.Initialized,
          description: 'Already initialized.',
        }),
      });
      return;
    } else {
      this._isInit = true;
    }
    let i1 = false;
    let i2 = false;
    calllog.enableLog = params.enableLog ?? false;
    calllog.log(
      'CallManagerImpl:init:',
      params.listener !== undefined,
      params.option,
      params.enableLog
    );
    this._option = {
      appKey: params.option.appKey,
      agoraAppId: params.option.agoraAppId,
      callTimeout: params.option.callTimeout ?? K.KeyTimeout,
      ringFilePath: params.option.ringFilePath ?? '', // TODO:
    };
    this._listener = params.listener;
    this._requestRTCToken = params.requestRTCToken;
    this._requestUserMap = params.requestUserMap;
    this._requestCurrentUser = params.requestCurrentUser;
    this._device.init((dt) => {
      this._deviceToken = dt;
      i2 = true;
      if (i1 && i2) {
        params.onResult?.();
      }
    });
    this.initListener();
    i1 = true;
    if (i1 && i2) {
      params.onResult?.();
    }
  }
  public unInit(): void {
    calllog.log('CallManagerImpl:unInit:');
    if (this._isInit === false) {
      return;
    } else {
      this._isInit = false;
    }
    this._clear();
    this._userId = '';
    this._listener = undefined;
    this._requestUserMap = undefined;
    this._requestRTCToken = undefined;
    this.unInitListener();
  }

  private initListener(): void {
    this._timer.init({
      listener: this,
      timeout: this._option.callTimeout ?? K.KeyTimeout,
    });
    this._client = ChatClient.getInstance();
    this.client?.chatManager.addMessageListener(this._sig);
    this._sig.init({ listener: this });
  }
  private unInitListener(): void {
    this._timer.unInit();
    this.client?.chatManager.removeMessageListener(this._sig);
    this._sig.unInit();
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
  public get userId() {
    return this._userId;
  }
  protected get deviceToken() {
    return this._deviceToken;
  }
  protected get signalling() {
    return this._sig;
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
  protected get userListener() {
    return this._userListener;
  }

  public get requestRTCToken() {
    return this._requestRTCToken;
  }

  public get requestUserMap() {
    return this._requestUserMap;
  }

  public get requestCurrentUser() {
    return this._requestCurrentUser;
  }

  public createChannelId(): string {
    return uuid();
  }

  public addListener(listener: CallListener): void {
    calllog.log('CallManagerImpl:addListener:');
    this._userListener = listener;
  }
  public removeListener(_: CallListener): void {
    calllog.log('CallManagerImpl:removeListener:');
    this._userListener = undefined;
  }

  public addViewListener(listener: CallViewListener): void {
    this._listener = listener;
  }
  public removeViewListener(_: CallViewListener): void {
    this._listener = undefined;
  }

  public initRTC(): void {
    calllog.log('CallManagerImpl:initRTC:', this.option.agoraAppId);
    this._engine = createAgoraRtcEngine();
    const ret1 = this._engine.initialize({
      appId: this.option.agoraAppId,
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    });
    const ret2 = this._engine.registerEventHandler(this);
    calllog.log('CallManagerImpl:initRTC:', ret1, ret2);
  }
  public unInitRTC(): void {
    calllog.log('CallManagerImpl:unInitRTC:');
    this._engine?.unregisterEventHandler(this);
    this._engine?.release();
  }

  public setCurrentUser(currentUser: CallUser): void {
    calllog.log('CallManagerImpl:setCurrentUser:', currentUser);
    this._userId = currentUser.userId;
    this._setUser(currentUser);
  }

  public clear(): void {
    this._clear();
  }

  public getCurrentCallId(): string | undefined {
    return this.ship.currentCall?.callId;
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
    extension?: any;
    onResult: (params: { callId?: string; error?: CallError }) => void;
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
    extension?: any;
    onResult: (params: { callId?: string; error?: CallError }) => void;
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
  public startMultiVideoCall(params: {
    inviteeIds: string[];
    channelId: string;
    extension?: any;
    onResult: (params: { callId?: string; error?: CallError }) => void;
  }): void {
    calllog.log('CallManagerImpl:startMultiCall:', params);
    this._startCall({
      ...params,
      callType: CallType.VideoMulti,
    });
  }
  public startMultiAudioCall(params: {
    inviteeIds: string[];
    channelId: string;
    extension?: any;
    onResult: (params: { callId?: string; error?: CallError }) => void;
  }): void {
    calllog.log('CallManagerImpl:startMultiCall:', params);
    this._startCall({
      ...params,
      callType: CallType.AudioMulti,
    });
  }

  /**
   * Hung up the current call.
   *
   * You can hang up the call during the call, or the inviter initiates the invitation and has not been answered.
   *
   * @param params -
   * - callId: The ID obtained by {@link CallViewListener.onCallReceived}.
   * - onResult: Returns `callId` on success, `error` on failure.
   */
  public hangUpCall(params: {
    callId: string;
    onResult: (params: { callId?: string; error?: CallError }) => void;
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
    onResult: (params: { callId?: string; error?: CallError }) => void;
  }): void {
    calllog.log('CallManagerImpl:cancelCall:', params);
    this._cancelCall(params.callId);
  }

  /**
   * decline the current call. Can only be used by the invitee.
   *
   * @param params -
   * - callId: The ID obtained by {@link CallViewListener.onCallReceived}.
   * - onResult: Returns `callId` on success, `error` on failure.
   */
  public refuseCall(params: {
    callId: string;
    extension?: any;
    onResult: (params: { callId?: string; error?: CallError }) => void;
  }): void {
    calllog.log('CallManagerImpl:refuseCall:', params);
    const call = this._getCall(params.callId);
    if (call) {
      if (call.isInviter === false) {
        const invitee = call.invitees.get(this.userId);
        if (invitee) {
          this._changeState({
            callId: params.callId,
            new: CallSignalingState.InviteeInviteConfirming,
          });
          this.signalling.sendInviteReply({
            callId: call.callId,
            inviterId: call.inviter.userId,
            inviteeDeviceToken: invitee.userDeviceToken ?? '',
            inviterDeviceToken: call.inviter.userDeviceToken ?? '',
            reply: 'refuse',
            onResult: ({ callId, error }) => {
              calllog.log(
                'CallManagerImpl:refuseCall:sendInviteReply:',
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
   * - callId: The ID obtained by {@link CallViewListener.onCallReceived}.
   * - onResult: Returns `callId` on success, `error` on failure.
   */
  public acceptCall(params: {
    callId: string;
    extension?: any;
    onResult: (params: { callId?: string; error?: CallError }) => void;
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
          this.signalling.sendInviteReply({
            callId: call.callId,
            inviterId: call.inviter.userId,
            inviteeDeviceToken: invitee.userDeviceToken ?? '',
            inviterDeviceToken: call.inviter.userDeviceToken ?? '',
            reply: 'accept',
            onResult: ({ callId, error }) => {
              calllog.log(
                'CallManagerImpl:refuseCall:sendInviteReply:',
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
    onResult: (params: { callId?: string; error?: CallError }) => void;
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

  /**
   * Set agora information for the current user.
   *
   * @param params -
   * - channelId: The unique identifier of the call channel. It is recommended to create via {@link createChannelId}. This property is highly recommended for preservation.
   * - userId: The current user ID.
   * - userChannelId: The channel ID of user.
   * - userRTCToken: The channel token of user.
   */
  public setRTCToken(params: {
    channelId: string;
    userId: string;
    userChannelId: number;
    userRTCToken: string;
  }): void {
    calllog.log('CallManagerImpl:setRTCToken:', params);
    if (this.userId === params.userId) {
      const call = this._getCallByChannelId(params.channelId);
      if (call) {
        call.userRTCToken = params.userRTCToken;
        call.userChannelId = params.userChannelId;
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  //// Private Methods /////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  private _clear(): void {
    calllog.log('CallManagerImpl:_clear:');
    this._clearShip();
    this.timer.clear();
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
      for (const key of call.invitees) {
        const invitee = key[1]!;
        this.signalling.sendInviteCancel({
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
      this._onCallEnded({
        channelId: call.channelId,
        callType: call.callType,
        endReason: CallEndReason.Cancel,
      });
      this._clear();
    }
  }

  private _hangUpCall(callId: string): void {
    calllog.log('CallManagerImpl:_hangUpCall:', callId);
    const call = this.ship.currentCall;
    if (call) {
      if (call.state === CallSignalingState.Joined) {
        this._onCallEnded({
          channelId: call.channelId,
          callType: call.callType,
          endReason: CallEndReason.HungUp,
        });
        this._clear();
      }
    }
  }

  private _createInviterCall(params: {
    callType: CallType;
    channelId: string;
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
        userId: this.userId,
        userDeviceToken: this.deviceToken,
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
      for (const key of this.ship.receiveCallList) {
        const call = key[1];
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
    extension?: any;
    onResult: (params: { callId?: string; error?: CallError }) => void;
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
    if (
      params.callType !== CallType.VideoMulti &&
      params.callType !== CallType.AudioMulti
    ) {
      const inviteeId = params.inviteeIds[0];
      if (inviteeId === undefined || inviteeId.trim().length === 0) {
        params.onResult({
          callId: undefined,
          error: new CallError({
            code: CallErrorCode.InvalidParams,
            description: 'Please add invitees.',
          }),
        });
        return;
      }
    }

    let call: CallObject | undefined;
    call = this._getCallByChannelId(params.channelId); // !!! _getCallByChannelId
    if (call) {
      // TODO: Only multiple people can enter here
      // TODO: Is it the inviter
      // TODO: If it is an inviter: the status remains unchanged (whether you have joined the channel or not), send the invitation and start timing separately, and update the list of invitees
      // TODO: If it is an invitee: it can only be idle or joined. If it is impossible before the bell rings, it can only be continued after the bell rings, and then click Accept. The status is unchanged. Send invitations and start timing separately, update invitee list, move yourself from invitee to inviter. There may be multiple invitees. Multiple invitees are no problem.

      calllog.log(
        'CallManagerImpl:_startCall:re:',
        call.isInviter,
        call.inviter.userId
      );
      if (
        call.callType !== CallType.AudioMulti &&
        call.callType !== CallType.VideoMulti
      ) {
        params.onResult({
          callId: call.callId,
          error: new CallError({
            code: CallErrorCode.ExceptionState,
            description: 'Individual calls cannot be invited again.',
          }),
        });
        return;
      }

      const addedIds = [] as string[];
      for (const id of params.inviteeIds) {
        if (call.invitees.get(id) === undefined) {
          addedIds.push(id);
        }
      }
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
                'Invitees need to be connected to invite again.A solo call cannot be invited again.',
            }),
          });
          return;
        }

        const invitee = call.invitees.get(this.userId);
        if (invitee === undefined) {
          params.onResult({
            callId: call.callId,
            error: new CallError({
              code: CallErrorCode.ExceptionState,
              description: 'No invitees found.',
            }),
          });
          return;
        }
        call.inviter = invitee;
        call.invitees.delete(this.userId);
        call.isInviter = true;
      }

      this._addInvitee(
        call.callId,
        addedIds.map((id) => {
          return {
            userId: id,
            userHadJoined: false,
          } as CallInvitee;
        })
      );

      for (const id of addedIds) {
        // this.client?.isConnected().then().catch(); // TODO: Solve network problems. Otherwise, timeout is required.
        this.signalling.sendInvite({
          inviteeId: id,
          channelId: call.channelId,
          callType: call.callType,
          inviterDeviceToken: this.deviceToken, // !!! It may not be consistent.
          callId: call.callId,
          ext: params.extension,
          onResult: ({ callId, error }) => {
            console.log('CallManagerImpl:sendInvite:', callId);
            if (error) {
              this.timer.stopTiming({ callId, userId: id });
              const call = this._getCall(callId);
              if (call) {
                if (
                  params.callType !== CallType.VideoMulti &&
                  params.callType !== CallType.AudioMulti
                ) {
                  calllog.warn(
                    'CallManagerImpl:sendInvite:sendInvite:Impossible to get in here.'
                  );
                  this._clear();
                  this._onCallEnded({
                    channelId: call.channelId,
                    callType: call.callType,
                    endReason: CallEndReason.NoResponse,
                  });
                } else {
                  this._onRemoveRemoteUser({
                    channelId: call.channelId,
                    userId: id,
                    reason: CallEndReason.NoResponse,
                  });
                }
              }
            }
          },
        });
        this.timer.startInviteTiming({ callId: call.callId, userId: id });

        params.onResult({
          callId: call.callId,
        });
      }
    } else {
      // The case of a brand new invitation.
      call = this._createInviterCall({
        callType: params.callType,
        channelId: params.channelId,
        inviteeIds: params.inviteeIds,
      });
      this._changeState({
        callId: call.callId,
        new: CallSignalingState.InviterInviting,
      });

      if (
        params.callType === CallType.VideoMulti ||
        params.callType === CallType.AudioMulti
      ) {
        this._onRequestJoin({ callId: call.callId });
      }

      for (const id of params.inviteeIds) {
        // this.client?.isConnected().then().catch(); // TODO: Solve network problems. Otherwise, timeout is required.
        this.signalling.sendInvite({
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
                if (
                  params.callType !== CallType.VideoMulti &&
                  params.callType !== CallType.AudioMulti
                ) {
                  this._clear();
                  this._onCallEnded({
                    channelId: call.channelId,
                    callType: call.callType,
                    endReason: CallEndReason.NoResponse,
                  });
                } else {
                  this._onRemoveRemoteUser({
                    channelId: call.channelId,
                    userId: id,
                    reason: CallEndReason.NoResponse,
                  });
                }
              }
            }
          },
        });
        this.timer.startInviteTiming({ callId: call.callId, userId: id });
      }

      params.onResult({
        callId: call.callId,
      });
    }
  }

  private _inviteTimeout(params: { callId: string; userId: string }): void {
    calllog.log('CallManagerImpl:_inviteTimeout', params);
    const call = this._getCall(params.callId);
    if (call) {
      this.signalling.sendInviteCancel({
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
      if (
        call.callType !== CallType.VideoMulti &&
        call.callType !== CallType.AudioMulti
      ) {
        this._clear();
        this._onCallEnded({
          channelId: call.channelId,
          callType: call.callType,
          endReason: CallEndReason.RemoteNoResponse,
        });
      } else {
        this._onRemoveRemoteUser({
          channelId: call.channelId,
          userId: params.userId,
          reason: CallEndReason.NoResponse,
        });
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
      this._onCallEnded({
        channelId: call.channelId,
        callType: call.callType,
        endReason: CallEndReason.RemoteNoResponse,
      });
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  //// CallViewListener ////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  protected _onRemoveRemoteUser(params: {
    channelId: string;
    userChannelId?: number;
    userId: string;
    reason?: CallEndReason;
  }): void {
    calllog.log('CallManagerImpl:_onRemoveRemoteUser', params);
    this.listener?.onRemoveRemoteUser?.(params);
  }

  protected _onCallEnded(params: {
    channelId: string;
    callType: CallType;
    endReason: CallEndReason;
  }): void {
    calllog.log('CallManagerImpl:_onCallEnded', params);
    this.listener?.onCallEnded?.({ ...params, elapsed: 0 });
  }

  protected _onCallOccurError(params: {
    channelId: string;
    error: CallError;
  }): void {
    calllog.log('CallManagerImpl:_onCallOccurError', params);
    this.listener?.onCallOccurError?.(params);
  }

  protected _onRequestJoin(params: { callId: string }): void {
    calllog.log('CallManagerImpl:onRequestJoin', params);
    const call = this._getCall(params.callId);
    if (call) {
      this._changeState({
        callId: call.callId,
        new: CallSignalingState.InviterJoining,
      });
      this.requestRTCToken?.({
        appKey: this.option.appKey,
        channelId: call.channelId,
        userId: this.userId,
        onResult: (p: { data?: any; error?: any }) => {
          calllog.log('CallManagerImpl:onRequestJoin:requestRTCToken:', p);
          if (p.error === undefined) {
            const uid = p.data.uid as number;
            if (call.isInviter) {
              call.inviter.userChannelId = uid;
            } else {
              const invitee = call.invitees.get(this.userId);
              if (invitee) {
                invitee.userChannelId = uid;
              }
            }
            this.listener?.onRequestJoin?.({
              channelId: call.channelId,
              userId: this.userId,
              userChannelId: uid,
              userRTCToken: p.data.token,
            });
          } else {
            this._onCallEnded({
              channelId: call.channelId,
              callType: call.callType,
              endReason: CallEndReason.NoResponse,
            });
          }
        },
      });
    }
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
      this.signalling.sendInviteReply({
        callId: params.callId,
        inviterId: params.inviterId,
        inviteeDeviceToken: this.deviceToken,
        inviterDeviceToken: params.inviterDeviceToken,
        reply: 'busy',
        onResult: (params: { callId: string; error?: CallError }) => {
          calllog.log('CallManagerImpl:refuseCall:sendInviteReply:', params);
          // TODO: ignore.
        },
      });
      return;
    }
    const onInviteInternal = () => {
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
        this.signalling.sendAlert({
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
    };
    if (this.userId.length === 0) {
      this.requestCurrentUser?.({
        onResult: ({ user, error }) => {
          calllog.log('CallManagerImpl:onInvite:', user, error);
          if (error === undefined) {
            this._userId = user.userId;
            this._setUser(user);
            onInviteInternal();
          } else {
            throw new CallError({
              code: CallErrorCode.ExceptionState,
              description: 'The current logged-in user cannot be obtained.',
            });
          }
        },
      });
    } else {
      onInviteInternal();
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
        if (
          call.callType !== CallType.VideoMulti &&
          call.callType !== CallType.AudioMulti
        ) {
          this._changeState({
            callId: params.callId,
            new: CallSignalingState.InviterInviteConfirming,
          });
        }

        const inviteTimer = this.timer.hasTiming({
          callId: params.callId,
          userId: params.inviteeId,
        });
        this.signalling.sendAlertConfirm({
          callId: params.callId,
          inviteeId: params.inviteeId,
          inviterDeviceToken: params.inviterDeviceToken,
          inviteeDeviceToken: params.inviteeDeviceToken,
          isValid: inviteTimer === true,
          onResult: ({ callId, error }) => {
            calllog.log(
              'CallManagerImpl:onAlert:sendAlertConfirm:',
              callId,
              error
            );
            if (error) {
              this.timer.stopTiming({ callId, userId: params.inviteeId });
              const call = this._getCall(callId);
              if (call) {
                if (
                  call.callType !== CallType.VideoMulti &&
                  call.callType !== CallType.AudioMulti
                ) {
                  this._clear();
                  this._onCallEnded({
                    channelId: call.channelId,
                    callType: call.callType,
                    endReason: CallEndReason.NoResponse,
                  });
                } else {
                  this._onRemoveRemoteUser({
                    channelId: call.channelId,
                    userId: params.inviteeId,
                    reason: CallEndReason.NoResponse,
                  });
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
            this.userListener?.onCallReceived?.({
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
          this._onCallEnded({
            channelId: call.channelId,
            callType: call.callType,
            endReason: CallEndReason.RemoteCancel,
          });
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
          if (
            call.callType !== CallType.VideoMulti &&
            call.callType !== CallType.AudioMulti
          ) {
            if (params.reply === 'accept') {
              this._onRequestJoin({ callId: call.callId });
            } else {
              this._onCallEnded({
                channelId: call.channelId,
                callType: call.callType,
                endReason: CallEndReason.RemoteRefuse,
              });
            }
          } else {
            if (params.reply !== 'accept') {
              this._onRemoveRemoteUser({
                channelId: call.channelId,
                userId: params.inviteeId,
                reason: CallEndReason.NoResponse,
              });
            }
          }
        }
        if (params.reply === 'accept' || params.reply === 'refuse') {
          this.signalling.sendInviteReplyConfirm({
            callId: params.callId,
            inviteeId: params.inviteeId,
            inviteeDeviceToken: invitee.userDeviceToken,
            inviterDeviceToken: params.inviterDeviceToken,
            reply: params.reply,
            onResult: ({ callId, error }) => {
              calllog.log(
                'CallManagerImpl:onInviteReply:sendInviteReplyConfirm:',
                callId,
                error
              );
              if (error) {
                const call = this._getCall(callId);
                if (call) {
                  if (
                    call.callType !== CallType.VideoMulti &&
                    call.callType !== CallType.AudioMulti
                  ) {
                    this._clear();
                    this._onCallEnded({
                      channelId: call.channelId,
                      callType: call.callType,
                      endReason: CallEndReason.NoResponse,
                    });
                  } else {
                    this._onRemoveRemoteUser({
                      channelId: call.channelId,
                      userId: params.inviteeId,
                      reason: CallEndReason.NoResponse,
                    });
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
    calllog.log('CallManagerImpl:onInviteReplyConfirm:', params);
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
            this._onRequestJoin({ callId: call.callId });
          } else {
            this._onCallEnded({
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
          this._onCallEnded({
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
  //// IRtcEngine //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  public joinChannel(params: {
    userRTCToken: string;
    userChannelId: number;
    channelId: string;
  }): void {
    const ret = this.engine?.joinChannel(
      params.userRTCToken,
      params.channelId,
      params.userChannelId,
      {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      }
    );
    calllog.log('CallManagerImpl:joinChannel:ret:', params, ret);
  }
  public leaveChannel(): void {
    const ret = this.engine?.leaveChannel();
    calllog.log('CallManagerImpl:leaveChannel:', ret);
  }

  public enableVideo(): void {
    const ret = this.engine?.enableVideo();
    calllog.log('CallManagerImpl:enableVideo:', ret);
  }
  public disableVideo(): void {
    const ret = this.engine?.disableVideo();
    calllog.log('CallManagerImpl:disableVideo:', ret);
  }

  public enableAudio(): void {
    const ret = this.engine?.enableAudio();
    calllog.log('CallManagerImpl:enableAudio:', ret);
  }
  public disableAudio(): void {
    const ret = this.engine?.disableAudio();
    calllog.log('CallManagerImpl:disableAudio:', ret);
  }

  public startPreview(): void {
    const ret = this.engine?.startPreview();
    calllog.log('CallManagerImpl:startPreview:', ret);
  }
  public stopPreview(): void {
    const ret = this.engine?.stopPreview();
    calllog.log('CallManagerImpl:stopPreview:', ret);
  }

  public switchCamera(): void {
    const ret = this.engine?.switchCamera();
    calllog.log('CallManagerImpl:switchCamera:', ret);
  }

  public enableLocalVideo(enabled: boolean): void {
    const ret = this.engine?.enableLocalVideo(enabled);
    calllog.log('CallManagerImpl:enableLocalVideo:', enabled, ret);
  }
  public muteLocalVideoStream(mute: boolean): void {
    const ret = this.engine?.muteLocalVideoStream(mute);
    calllog.log('CallManagerImpl:muteLocalVideoStream:', mute, ret);
  }
  public muteRemoteVideoStream(params: {
    userChannelId: number;
    mute: boolean;
  }): void {
    const ret = this.engine?.muteRemoteVideoStream(
      params.userChannelId,
      params.mute
    );
    calllog.log('CallManagerImpl:muteRemoteVideoStream:', params, ret);
  }
  public muteAllRemoteVideoStreams(mute: boolean): void {
    const ret = this.engine?.muteAllRemoteVideoStreams(mute);
    calllog.log('CallManagerImpl:muteAllRemoteVideoStreams:', mute, ret);
  }

  public enableLocalAudio(enabled: boolean): void {
    const ret = this.engine?.enableLocalAudio(enabled);
    calllog.log('CallManagerImpl:enableLocalAudio:', enabled, ret);
  }
  public muteLocalAudioStream(mute: boolean): void {
    const ret = this.engine?.muteLocalAudioStream(mute);
    calllog.log('CallManagerImpl:muteLocalAudioStream:', mute, ret);
  }
  public muteRemoteAudioStream(params: {
    userChannelId: number;
    mute: boolean;
  }): void {
    const ret = this.engine?.muteRemoteAudioStream(
      params.userChannelId,
      params.mute
    );
    calllog.log('CallManagerImpl:muteRemoteAudioStream:', params, ret);
  }
  public muteAllRemoteAudioStreams(mute: boolean): void {
    const ret = this.engine?.muteAllRemoteAudioStreams(mute);
    calllog.log('CallManagerImpl:muteAllRemoteAudioStreams:', mute, ret);
  }
  public setEnableSpeakerphone(speakerOn: boolean): void {
    const ret = this.engine?.setEnableSpeakerphone(speakerOn);
    calllog.log('CallManagerImpl:setEnableSpeakerphone:', speakerOn, ret);
  }

  //////////////////////////////////////////////////////////////////////////////
  //// IRtcEngineEventHandler //////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  public onError(err: ErrorCodeType, msg: string) {
    calllog.log('CallManagerImpl:onError:', err, msg);
    if (err !== ErrorCodeType.ErrOk && this.ship.currentCall) {
      this._onCallOccurError({
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
        this._changeState({
          callId: call.callId,
          new: CallSignalingState.Joined,
        });
        if (call.isInviter === true) {
          call.inviter.userHadJoined = true;
          call.inviter.userChannelId = connection.localUid;
        } else {
          const invitee = call.invitees.get(this.userId);
          if (invitee) {
            invitee.userHadJoined = true;
            invitee.userChannelId = connection.localUid;
          }
        }
      }
      this.listener?.onSelfJoined?.({
        channelId: connection.channelId,
        userChannelId: connection.localUid,
        userId: this.userId,
        elapsed,
      });
    }
  }

  public onLeaveChannel(connection: RtcConnection, stats: RtcStats) {
    calllog.log('CallManagerImpl:onLeaveChannel:', connection, stats);
    if (connection.channelId && connection.localUid) {
      const call = this._getCallByChannelId(connection.channelId);
      if (call) {
        this._changeState({
          callId: call.callId,
          new: CallSignalingState.Idle,
        });
        let remoteUid;
        let remoteUserId;
        if (call.isInviter === true) {
          call.inviter.userHadJoined = false;
          call.inviter.userChannelId = undefined;
          remoteUid = call.inviter.userChannelId;
          remoteUserId = call.inviter.userId;
        } else {
          if (
            call.callType !== CallType.VideoMulti &&
            call.callType !== CallType.AudioMulti
          ) {
            const invitee = call.invitees.get(this.userId);
            if (invitee) {
              invitee.userHadJoined = false;
              invitee.userChannelId = undefined;
              remoteUid = invitee.userChannelId;
              remoteUserId = invitee.userId;
            }
          }
        }
        this.listener?.onSelfLeave?.({
          channelId: call.channelId,
          userChannelId: remoteUid ?? 0,
          userId: remoteUserId ?? '',
        });
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
      const call = this._getCallByChannelId(connection.channelId);
      if (call) {
        this.requestUserMap?.({
          appKey: this.option.appKey,
          channelId: call.channelId,
          userId: this.userId,
          onResult: (p: { data?: any; error?: any }) => {
            calllog.log('CallManagerImpl:onUserJoined:requestUserMap:', p);
            if (p.error === undefined) {
              let remoteUserId;
              Object.entries(p.data.result).forEach((value: [string, any]) => {
                if (call.inviter.userId === value[1]) {
                  call.inviter.userChannelId = parseInt(value[0]);
                  call.inviter.userHadJoined = true;
                } else {
                  const invitee = call.invitees.get(value[1]);
                  if (invitee) {
                    invitee.userChannelId = parseInt(value[0]);
                    invitee.userHadJoined = true;
                  }
                }
              });

              calllog.log(
                'CallManagerImpl:onUserJoined:requestUserMap:',
                call.inviter,
                call.invitees
              );

              if (call.inviter.userChannelId === remoteUid) {
                remoteUserId = call.inviter.userId;
              } else {
                for (const invitee of call.invitees) {
                  if (invitee[1].userChannelId === remoteUid) {
                    remoteUserId = invitee[0];
                    break;
                  }
                }
              }

              this.listener?.onRemoteUserJoined?.({
                channelId: call.channelId,
                userChannelId: remoteUid,
                userId: remoteUserId ?? '',
              });
            } else {
              this._onCallEnded({
                channelId: call.channelId,
                callType: call.callType,
                endReason: CallEndReason.NoResponse,
              });
            }
          },
        });
      }
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
        let userId;
        if (call.inviter.userChannelId === remoteUid) {
          call.inviter.userHadJoined = false;
          userId = call.inviter.userId;
        } else {
          for (const invitee of call.invitees) {
            if (invitee[1].userChannelId === remoteUid) {
              invitee[1].userHadJoined = false;
              userId = invitee[1].userId;
              break;
            }
          }
        }
        if (
          call.callType !== CallType.VideoMulti &&
          call.callType !== CallType.AudioMulti
        ) {
          this._onCallEnded({
            channelId: call.channelId,
            callType: call.callType,
            endReason: CallEndReason.RemoteNoResponse,
          });
        } else {
          this.listener?.onRemoteUserOffline?.({
            channelId: call.channelId,
            userChannelId: remoteUid ?? 0,
            userId: userId ?? '',
          });
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
    if (connection.channelId) {
      const call = this._getCallByChannelId(connection.channelId);
      if (call) {
        let remoteUserId = '';
        if (call.inviter.userChannelId === remoteUid) {
          remoteUserId = call.inviter.userId;
        } else {
          for (const value of call.invitees) {
            if (value[1].userChannelId === remoteUid) {
              remoteUserId = value[1].userId;
              break;
            }
          }
        }
        this.listener?.onRemoteUserMuteVideo?.({
          channelId: call.channelId,
          userId: remoteUserId,
          userChannelId: remoteUid,
          muted: muted,
        });
      }
    }
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
    if (connection.channelId) {
      const call = this._getCallByChannelId(connection.channelId);
      if (call) {
        let remoteUserId = '';
        if (call.inviter.userChannelId === remoteUid) {
          remoteUserId = call.inviter.userId;
        } else {
          for (const value of call.invitees) {
            if (value[1].userChannelId === remoteUid) {
              remoteUserId = value[1].userId;
              break;
            }
          }
        }
        this.listener?.onRemoteUserMuteAudio?.({
          channelId: call.channelId,
          userId: remoteUserId,
          userChannelId: remoteUid,
          muted: muted,
        });
      }
    }
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
        const ret = [] as {
          userId: string;
          userChannelId: number;
          totalVolume: number;
        }[];
        for (const speaker of speakers) {
          if (speaker.volume && speaker.volume > 3) {
            if (
              call.inviter.userChannelId &&
              call.inviter.userChannelId === speaker.uid
            ) {
              ret.push({
                userId: call.inviter.userId,
                userChannelId: call.inviter.userChannelId,
                totalVolume: speaker.volume,
              });
            } else {
              for (const kv of call.invitees) {
                const invitee = kv[1];
                if (
                  invitee.userChannelId &&
                  invitee.userChannelId === speaker.uid
                ) {
                  ret.push({
                    userId: invitee.userId,
                    userChannelId: invitee.userChannelId,
                    totalVolume: speaker.volume,
                  });
                }
              }
            }
          }
        }
        if (ret.length > 0) {
          this.listener?.onAudioVolumeIndication?.({
            channelId: call.channelId,
            speakerNumber: speakerNumber,
            speakers: ret,
          });
        }
      }
    }
  }

  onConnectionStateChanged(
    connection: RtcConnection,
    state: ConnectionStateType,
    reason: ConnectionChangedReasonType
  ): void {
    calllog.log(
      'CallManagerImpl:onConnectionStateChanged:',
      connection,
      state,
      reason
    );
  }
}

let gCallManager: CallManagerImpl;
export function createManagerImpl(): CallManagerImpl {
  if (gCallManager === undefined) {
    gCallManager = new CallManagerImpl();
  }
  return gCallManager;
}
