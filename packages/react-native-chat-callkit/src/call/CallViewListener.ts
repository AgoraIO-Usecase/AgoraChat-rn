import type { CallEndReason, CallType } from '../enums';
import type { CallError } from './CallError';

/**
 * The call notification for ui
 */
export interface CallViewListener {
  /**
   * Notification that the current call has ended.
   *
   * It may be necessary to stop the ringer and close the call page.
   *
   * @param -
   * - channelId: Call channel ID.
   * - callType: call type. {@link CallType}
   * - endReason: The reason for the end of the call. {@link CallEndReason}
   * - elapsed: The time elapsed (ms) from the local user calling joinChannel until the SDK triggers this callback.
   */
  onCallEnded?: (params: {
    channelId: string;
    callType: CallType;
    endReason: CallEndReason;
    elapsed: number;
  }) => void;
  /**
   * Notification that an error occurred.
   *
   * @param -
   * - channelId: Call channel ID.
   * - error: An error occurred during a call or signaling process. {@link CallError}
   */
  onCallOccurError?: (params: { channelId: string; error: CallError }) => void;
  /**
   * Notifications when other invitees join.
   *
   * **Note** Users need to obtain the mapping relationship between user id and channel user id through app server. And notify the Callkit SDK.
   *
   * @param -
   * - channelId: Call channel ID.
   * - userChannelId: The ID of the user who joined the channel.
   */
  onRemoteUserJoined?: (params: {
    channelId: string;
    userChannelId: number;
  }) => void;
  /**
   * Notifications when you join a channel.
   *
   * **Note** Users need to obtain the mapping relationship between user id and channel user id through app server. And notify the Callkit SDK.
   *
   * @param -
   * - channelId: Call channel ID.
   * - userChannelId: The ID of the user who joined the channel.
   */
  onSelfJoined?: (params: { channelId: string; userChannelId: number }) => void;

  /**
   * The callback notification that requires token to join the channel.
   *
   * **Note** After the token is obtained, the operation of joining the channel starts automatically.
   *
   * @param -
   * - channelId: Call channel ID.
   * - appKey: The App ID.
   */
  onNeedRTCTokenForJoin?: (params: {
    appKey: string;
    channelId: string;
  }) => void;
}
