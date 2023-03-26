export interface CallOption {
  /**
   * appId.
   */
  appKey: string;
  /**
   * agora appId.
   */
  agoraAppId: string;
  /**
   * The default timeout value is 30 seconds.
   */
  callTimeout?: number;
  /**
   * The local address of the ringtone audio file.
   */
  ringFilePath?: string;
}
