import type { ChatClient } from 'react-native-chat-sdk';

import type { CallListener } from './CallListener';
import { createManagerImpl } from './CallManagerImpl';
import type { CallOption } from './CallOptions';

export interface CallManager {
  /**
   * Manager initialization.
   *
   * This is a must.
   *
   * @param params -
   * - client: chat sdk single instance.
   * - userId: user ID.
   * - userDeviceToken: local device token.
   * - userNickName: user nick name.
   * - userRTCToken: The token to join the chat channel. From app server or agora console.
   * - option: Basic configuration options.
   * - listener: Used to receive event notifications.
   * - enableLog: Whether to activate logging.
   * - userAvatarUrl: Current user avatar address. The default is the default avatar.
   */
  init(params: {
    client: ChatClient;
    userId: string;
    userDeviceToken: string;
    userNickName: string;
    userRTCToken: string;
    option: CallOption;
    listener?: CallListener;
    enableLog?: boolean;
    userAvatarUrl?: string;
  }): void;

  /**
   * To reset the object, call this method.
   */
  unInit(): void;

  /**
   * Create a chat channel ID.
   */
  createChannelId(): string;

  /**
   * An invitation to start a 1v1 audio call. The result of this operation is returned by `onResult`, if it is successful, it returns `callId`, otherwise it returns `error`.
   *
   * @param params -
   * - inviteeId: Invitee ID.
   * - channelId: The unique identifier of the call channel. It is recommended to create via {@link createChannelId}. This property is highly recommended for preservation.
   * - rtcToken: The token obtained through the `app server` request using `channelId`.
   * - extension: any.
   * - onResult: Returns `callId` on success, `error` on failure. The `callId` property is highly recommended for preservation.
   */
  startSingleAudioCall(params: {
    inviteeId: string;
    channelId: string;
    rtcToken: string;
    extension?: any;
    onResult: (params: { callId?: string; error?: any }) => void;
  }): void;

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
  startSingleVideoCall(params: {
    inviteeId: string;
    channelId: string;
    rtcToken: string;
    extension?: any;
    onResult: (params: { callId?: string; error?: any }) => void;
  }): void;

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
  startMultiCall(params: {
    inviteeIds: string[];
    channelId: string;
    rtcToken: string;
    extension?: any;
    onResult: (params: { callId?: string; error?: any }) => void;
  }): void;

  /**
   * Set the mapping relationship in user calls.
   *
   * General situation: When receiving a notification {@link CallListener.onSelfJoined} or {@link CallListener.onRemoteUserJoined}, add it.
   *
   * @param user: The user information.
   */
  setUserMap(params: {
    channelId: string;
    userId: string;
    userChannelId: number;
  }): void;
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
