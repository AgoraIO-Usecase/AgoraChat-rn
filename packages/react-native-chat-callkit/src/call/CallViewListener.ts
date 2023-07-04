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
   * @params params
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
   * @params params
   * - channelId: Call channel ID.
   * - error: An error occurred during a call or signaling process. {@link CallError}
   */
  onCallOccurError?: (params: { channelId: string; error: CallError }) => void;
  /**
   * Notifications when other remote user join.
   *
   * **Note** Users need to obtain the mapping relationship between user id and channel user id through app server. And notify the Callkit SDK.
   *
   * @params params
   * - channelId: Call channel ID.
   * - userChannelId: The ID of the user who joined the channel.
   * - userId: the user ID.
   */
  onRemoteUserJoined?: (params: {
    channelId: string;
    userChannelId: number;
    userId: string;
  }) => void;
  /**
   * Notifications when other remote user leave.
   *
   * @params params
   * - channelId: Call channel ID.
   * - userChannelId: The ID of the user who joined the channel.
   * - userId: the user ID.
   */
  onRemoteUserOffline?: (params: {
    channelId: string;
    userChannelId: number;
    userId: string;
  }) => void;
  /**
   * Notifications when remove remote user for error.
   *
   * @params params
   * - channelId: Call channel ID.
   * - userChannelId: The ID of the user who joined the channel.
   * - userId: the user ID.
   * - reason: The reason why the user leaves.
   */
  onRemoveRemoteUser?: (params: {
    channelId: string;
    userChannelId?: number;
    userId: string;
    reason?: CallEndReason;
  }) => void;
  /**
   * Notifications when you join a channel.
   *
   * **Note** Users need to obtain the mapping relationship between user id and channel user id through app server. And notify the Callkit SDK.
   *
   * @params params
   * - channelId: Call channel ID.
   * - userChannelId: The ID of the user who joined the channel.
   * - userId: the user ID.
   * - elapsed: Time already spent. The unit is milliseconds.
   */
  onSelfJoined?: (params: {
    channelId: string;
    userChannelId: number;
    userId: string;
    elapsed: number;
  }) => void;
  /**
   * Notifications when you leave a channel.
   *
   * @params params
   * - channelId: Call channel ID.
   * - userChannelId: The ID of the user who joined the channel.
   * - userId: the user ID.
   */
  onSelfLeave?: (params: {
    channelId: string;
    userChannelId: number;
    userId: string;
  }) => void;

  /**
   * Callback notification for request to join a channel.
   *
   * @params params
   * - channelId: Call channel ID.
   * - userId: the user ID.
   * - userChannelId: the user channel ID.
   * - userRTCToken: the user channel token.
   */
  onRequestJoin?: (params: {
    channelId: string;
    userId: string;
    userChannelId: number;
    userRTCToken: string;
  }) => void;

  /**
   * Notification for remote user disable/enable video.
   *
   * @params params
   * - channelId: Call channel ID.
   * - userId: the user ID.
   * - userChannelId: the user channel ID.
   * - muted: Whether the remote user stops publishing the video stream:true: The remote user stops publishing the video stream.false: The remote user resumes publishing the video stream.
   */
  onRemoteUserMuteVideo?: (params: {
    channelId: string;
    userId: string;
    userChannelId: number;
    muted: boolean;
  }) => void;

  /**
   * Notification for remote user disable/enable audio.
   *
   * @params params
   * - channelId: Call channel ID.
   * - userId: the user ID.
   * - userChannelId: the user channel ID.
   * - muted: Whether the remote user stops publishing the audio stream:true: The remote user stops publishing the audio stream.false: The remote user resumes publishing the audio stream.
   */
  onRemoteUserMuteAudio?: (params: {
    channelId: string;
    userId: string;
    userChannelId: number;
    muted: boolean;
  }) => void;

  /**
   * Notification for local user disable/enable video.
   *
   * @params params
   * - channelId: Call channel ID.
   * - userId: the user ID.
   * - userChannelId: the user channel ID.
   * - muted: Whether the remote user stops publishing the video stream:true: The remote user stops publishing the video stream.false: The remote user resumes publishing the video stream.
   */
  onLocalVideoStateChanged?: (params: {
    channelId: string;
    userId: string;
    userChannelId: number;
    muted: boolean;
  }) => void;

  /**
   * Notification for local user disable/enable audio.
   *
   * @params params
   * - channelId: Call channel ID.
   * - userId: the user ID.
   * - userChannelId: the user channel ID.
   * - muted: Whether the remote user stops publishing the audio stream:true: The remote user stops publishing the audio stream.false: The remote user resumes publishing the audio stream.
   */
  onLocalAudioStateChanged?: (params: {
    channelId: string;
    userId: string;
    userChannelId: number;
    muted: boolean;
  }) => void;

  /**
   * Reports the volume information of users. By default, this callback is disabled. You can enable it by calling enableAudioVolumeIndication .
   *
   * @params params
   * - channelId: Call channel ID.
   * - speakerNumber: The total number of users.
   * - speakers:
   * - - userId: the user ID.
   * - - userChannelId: the user channel ID.
   * - - totalVolume: The volume of the speaker.
   */
  onAudioVolumeIndication?: (params: {
    channelId: string;
    speakerNumber: number;
    speakers: {
      userId: string;
      userChannelId: number;
      totalVolume: number;
    }[];
  }) => void;
}
