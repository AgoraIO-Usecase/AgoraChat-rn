import type { CallListener } from './CallListener';
import { createManagerImpl } from './CallManagerImpl';

export interface CallManager {
  addListener(listener: CallListener): void;
  removeListener(listener: CallListener): void;

  // /**
  //  * Manager initialization.
  //  *
  //  * This is a must.
  //  *
  //  * @param params -
  //  * - client: chat sdk single instance.
  //  * - userId: user ID.
  //  * - userNickName: user nick name.
  //  * - userRTCToken: The token to join the chat channel. From app server or agora console.
  //  * - option: Basic configuration options.
  //  * - listener: Used to receive event notifications.
  //  * - enableLog: Whether to activate logging.
  //  * - userAvatarUrl: Current user avatar address. The default is the default avatar.
  //  */
  // init(params: {
  //   client: ChatClient;
  //   userId: string;
  //   userNickName: string;
  //   option: CallOption;
  //   listener?: CallViewListener;
  //   enableLog?: boolean;
  //   userAvatarUrl?: string;
  // }): void;

  // /**
  //  * To reset the object, call this method.
  //  */
  // unInit(): void;

  // /**
  //  * Create a chat channel ID.
  //  */
  // createChannelId(): string;

  // /**
  //  * An invitation to start a 1v1 audio call. The result of this operation is returned by `onResult`, if it is successful, it returns `callId`, otherwise it returns `error`.
  //  *
  //  * @param params -
  //  * - inviteeId: Invitee ID.
  //  * - channelId: The unique identifier of the call channel. It is recommended to create via {@link createChannelId}. This property is highly recommended for preservation.
  //  * - rtcToken: The token obtained through the `app server` request using `channelId`.
  //  * - extension: any.
  //  * - onResult: Returns `callId` on success, `error` on failure. The `callId` property is highly recommended for preservation.
  //  */
  // startSingleAudioCall(params: {
  //   inviteeId: string;
  //   channelId: string;
  //   extension?: any;
  //   onResult: (params: { callId?: string; error?: any }) => void;
  // }): void;

  // /**
  //  * An invitation to start a 1v1 video call. The result of this operation is returned by `onResult`, if it is successful, it returns `callId`, otherwise it returns `error`.
  //  *
  //  * If the network is not good, you can try to switch to audio mode. {@link videoToAudio}
  //  *
  //  * @param params -
  //  * - inviteeId: Invitee ID.
  //  * - channelId: The unique identifier of the call channel. It is recommended to create via {@link createChannelId}. This property is highly recommended for preservation.
  //  * - rtcToken: The token obtained through the `appserver` request using `channelId`.
  //  * - extension: any.
  //  * - onResult: Returns `callId` on success, `error` on failure. The `callId` property is highly recommended for preservation.
  //  */
  // startSingleVideoCall(params: {
  //   inviteeId: string;
  //   channelId: string;
  //   extension?: any;
  //   onResult: (params: { callId?: string; error?: any }) => void;
  // }): void;

  // /**
  //  * An invitation to start a multi audio/video call. The result of this operation is returned by `onResult`, if it is successful, it returns `callId`, otherwise it returns `error`.
  //  *
  //  * If the network is not good, you can try to switch to audio mode. {@link videoToAudio}
  //  *
  //  * During the call, you can invite the dropped person or others again.
  //  *
  //  * @param params -
  //  * - inviteeIds: Invitee ID list.
  //  * - channelId: The unique identifier of the call channel. It is recommended to create via {@link createChannelId}. This property is highly recommended for preservation.
  //  * - rtcToken: The token obtained through the `appserver` request using `channelId`.
  //  * - extension: any.
  //  * - onResult: Returns `callId` on success, `error` on failure. The `callId` property is highly recommended for preservation.
  //  */
  // startMultiCall(params: {
  //   inviteeIds: string[];
  //   channelId: string;
  //   extension?: any;
  //   onResult: (params: { callId?: string; error?: any }) => void;
  // }): void;

  // /**
  //  * Set the mapping relationship in user calls.
  //  *
  //  * General situation: When receiving a notification {@link CallListener.onSelfJoined} or {@link CallListener.onRemoteUserJoined}, add it.
  //  *
  //  * @param user: The user information.
  //  */
  // setUserMap(params: {
  //   channelId: string;
  //   userId: string;
  //   userChannelId: number;
  // }): void;

  // /**
  //  * Hung up the current call.
  //  *
  //  * You can hang up the call during the call, or the inviter initiates the invitation and has not been answered.
  //  *
  //  * @param params -
  //  * - callId: The ID obtained by {@link CallListener.onCallReceived}.
  //  * - onResult: Returns `callId` on success, `error` on failure.
  //  */
  // hangUpCall(params: {
  //   callId: string;
  //   onResult: (params: { callId?: string; error?: any }) => void;
  // }): void;

  // /**
  //  * Cancel the current call.
  //  *
  //  * Can only be used by the inviter.
  //  *
  //  * Only used if the invitee does not answer or declines.
  //  *
  //  * @param params -
  //  * - callId: The ID obtained by {@link startSingleAudioCall} {@link startSingleVideoCall} {@link startMultiCall}.
  //  * - onResult: Returns `callId` on success, `error` on failure.
  //  */
  // cancelCall(params: {
  //   callId: string;
  //   onResult: (params: { callId?: string; error?: any }) => void;
  // }): void;

  // /**
  //  * decline the current call. Can only be used by the invitee.
  //  *
  //  * @param params -
  //  * - callId: The ID obtained by {@link CallListener.onCallReceived}.
  //  * - onResult: Returns `callId` on success, `error` on failure.
  //  */
  // refuseCall(params: {
  //   callId: string;
  //   extension?: any;
  //   onResult: (params: { callId?: string; error?: any }) => void;
  // }): void;

  // /**
  //  * Accept the current call. Can only be used by the invitee.
  //  *
  //  * @param params -
  //  * - callId: The ID obtained by {@link CallListener.onCallReceived}.
  //  * - onResult: Returns `callId` on success, `error` on failure.
  //  */
  // acceptCall(params: {
  //   callId: string;
  //   extension?: any;
  //   onResult: (params: { callId?: string; error?: any }) => void;
  // }): void;

  // /**
  //  * Whether to turn off the call audio.
  //  *
  //  * @param isMute true or false.
  //  */
  // setAudioMute(isMute: boolean): void;

  // /**
  //  * Whether to turn off the call video.
  //  *
  //  * @param isMute true or false.
  //  */
  // setVideoMute(isMute: boolean): void;

  // /**
  //  * Whether to turn off the call speak.
  //  *
  //  * @param isMute true or false.
  //  */
  // setSpeakMute(isMute: boolean): void;

  // /**
  //  * Get user information.
  //  *
  //  * @param userId The use ID.
  //  */
  // getUserInfo(userId: string): CallUser | undefined;

  // /**
  //  * Video calls are converted to voice calls.
  //  *
  //  * @param params -
  //  * - callId: The call ID.
  //  * - onResult: Returns `callId` on success, `error` on failure.
  //  */
  // videoToAudio(params: {
  //   callId: string;
  //   onResult: (params: { callId?: string; error?: any }) => void;
  // }): void;

  // /**
  //  * Set the user information of the call.
  //  *
  //  * @param user: The user information.
  //  */
  // setUsers(user: CallUser): void;
}

/**
 * Create a signaling manager.
 *
 * Please initialize before use, and reset resources please de-initialize. {@link CallManager.init} {@link CallManager.unInit}
 *
 * @returns
 */
export function createManager(): CallManager {
  return createManagerImpl();
}
