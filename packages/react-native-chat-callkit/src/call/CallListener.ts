import type { CallEndReason, CallType } from '../enums';
import type { CallError } from './CallError';

/**
 * The call notification
 */
export interface CallListener {
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
   * Receive a notification for an invitation to join.
   *
   * The invitee needs to start ringing, display the interface, and the user can click the answer or decline button.
   *
   * @param -
   * - channelId: Call channel ID.
   * - inviterId: The inviter of the call.
   * - callType: call type. {@link CallType}
   * - extension: Extend the information.
   */
  onCallReceived: (params: {
    channelId: string;
    inviterId: string;
    callType: CallType;
    extension?: any;
  }) => void;
  /**
   * Notification that an error occurred.
   *
   * @param -
   * - channelId: Call channel ID.
   * - error: An error occurred during a call or signaling process. {@link CallError}
   */
  onCallOccurError?: (params: { channelId: string; error: CallError }) => void;
}
