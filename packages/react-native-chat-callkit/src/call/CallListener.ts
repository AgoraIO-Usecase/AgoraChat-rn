import type { CallType } from '../enums';

/**
 * The call notification
 */
export interface CallListener {
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
}
