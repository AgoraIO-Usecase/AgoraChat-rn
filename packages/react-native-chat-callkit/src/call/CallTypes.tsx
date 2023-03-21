export enum CallState {
  /**
   * Idle state.
   */
  Idle = 0,
  /**
   * Already joined the channel.
   */
  Joined,
  /**
   * After sending the invitation, before receiving the alert.
   */
  InviterInviting = 100,
  /**
   * After sending confirm, before receiving answer.
   */
  InviterInviteConfirming,
  /**
   * After receiving the answer, join the audio and video chat. And the result of whether to join is sent to the invitee.
   */
  InviterJoining,
  /**
   * After sending alert, before receiving confirm.
   */
  InviteeAlerting = 200,
  /**
   * After sending the answer, before receiving the result.
   */
  InviteeInviteConfirming,
  /**
   * After receiving the result of allowing to join, join the chat.
   */
  InviteeJoining,
}
