/**
 * Decorative information about the call partner.
 */
export interface CallUser {
  /**
   * Call user ID.
   */
  userId: string;
  /**
   * Call user nick name.
   */
  userName?: string;
  /**
   * Call user avatar url
   */
  userAvatarUrl?: string;
}
