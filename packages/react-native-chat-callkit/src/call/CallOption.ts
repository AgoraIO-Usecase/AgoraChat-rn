/**
 * A collection of call options.
 */
export interface CallOption {
  /**
   * appId.
   * It can be found in the project chat module information of the console. The chat module needs to be opened and activated.
   * {@link https://console.agora.io/project/foo/extension?id=Chat}
   */
  appKey: string;
  /**
   * agora appId.
   * It can be found in the basic information of the project in the console.
   * {@link https://console.agora.io/project/foo}
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
