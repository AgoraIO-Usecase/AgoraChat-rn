import type { CallType } from '../enums';
import type { CallSignalingState } from './CallTypes';

/**
 * Information about the invitees.
 */
export interface CallInvitee {
  /**
   * The ID of the invitee. Confirm when you receive the invitation notification.
   */
  userId: string;
  /**
   * The invitee's deviceToken. Confirm when you receive the invitation notification.
   */
  userDeviceToken?: string;
  /**
   * Determined when the invitee joins the chat channel.
   */
  userChannelId?: number;
  /**
   * Whether the invitee has already joined. Not added by default.
   */
  userHadJoined: boolean;
}

/**
 * call object.
 */
export interface CallObject {
  /**
   * The unique identifier of the call object. Usually uuid.
   */
  callId: string;
  /**
   * The type of this call: audio, video, or multi-person audio and video.
   */
  callType: CallType;
  /**
   * own role in the call. Either the inviter or the invitee.
   */
  isInviter: boolean;
  /**
   * Information about the inviter.
   */
  inviter: CallInvitee;
  /**
   * If it is an inviter, save the information of all invitees. If you are an invitee, you should save all the invitee information as much as possible, in case the inviter drops offline and cannot be invited to join again. It may not be comprehensive if you save through the notification that you have joined the chat channel, you can only save the people who have already joined.
   */
  invitees: Map<string, CallInvitee>;
  /**
   * Chat channel ID.
   */
  channelId: string;
  /**
   * Current user agora RTC token.
   *
   * Passed in as inviter when starting a call, and as invitee when clicking to accept the call.
   *
   * It can only be obtained through the interface of agora. It needs to be implemented by the user.
   */
  userRTCToken?: string;
  /**
   * The user's numeric ID in the chat channel.
   *
   * After joining the chat channel, you can get the ID.
   */
  userChannelId?: number;
  /**
   * Extended fields can hold more additional information. For example: save the group ID.
   */
  ext?: any;
  /**
   * Whether to convert audio to video.
   */
  videoToAudio?: boolean;
  /**
   * Creation timestamp.
   */
  timestamp?: number;
  /**
   * The state in the call flow.
   */
  state: CallSignalingState;
}

/**
 * Call object relationship management.
 */
export interface CallRelationship {
  /**
   * The current call object. Created at invite time as inviter. As the invitee, select the current call partner from the candidates after receiving the confirmation message.
   */
  currentCall?: CallObject;
  /**
   * As an invitee, after receiving the invitation notification, save the caller here. Remove call object after receiving cancellation notification. After receiving the confirmation message, move the call object to the current call object.
   *
   * key is callId.
   *
   * **Notes** Only invitees will receive these notifications.
   */
  receiveCallList: Map<string, CallObject>;
}
