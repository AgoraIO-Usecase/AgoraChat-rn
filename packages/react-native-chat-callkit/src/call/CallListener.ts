import type { CallError } from './CallError';

/**
 * The call notification
 */
export interface CallListener {
  /**
   * Notification that the current call has ended.
   *
   * It may be necessary to stop the ringer and close the call page.
   */
  onCallEnded?: () => void;
  /**
   * Receive a notification for an invitation to join.
   *
   * The invitee needs to start ringing, display the interface, and the user can click the answer or decline button.
   */
  onCallReceived?: () => void;
  /**
   * Notification that an error occurred.
   */
  onCallOccurError?: (params: { channelId?: string; error: CallError }) => void;
  /**
   * Notifications when other invitees join.
   */
  onRemoteUserJoined?: () => void;
  /**
   * Notifications when you join a channel.
   */
  onSelfJoined?: () => void;
}
