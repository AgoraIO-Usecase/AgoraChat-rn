import type { CallOption, CallUser } from './call';

export interface CallkitSdkContextType {
  option: CallOption;
  enableLog?: boolean;
  /**
   * The default value is `agora`.
   */
  type?: 'easemob' | 'agora' | undefined;
  logHandler?: (message?: any, ...optionalParams: any[]) => void;
  requestRTCToken: (params: {
    appKey: string;
    channelId: string;
    userId: string;
    /**
     * This value must be set if `type` is `agora`.
     */
    userChannelId?: number;
    /**
     * The default value is `agora`.
     */
    type?: 'easemob' | 'agora' | undefined;
    onResult: (params: { data?: any; error?: any }) => void;
  }) => void;
  requestUserMap: (params: {
    appKey: string;
    channelId: string;
    userId: string;
    onResult: (params: { data?: any; error?: any }) => void;
  }) => void;
  requestCurrentUser: (params: {
    onResult: (params: { user: CallUser; error?: any }) => void;
  }) => void;
}

export type User = {
  userId: string;
  userChannelId?: number;
  userHadJoined: boolean;
  isSelf: boolean;
  userName?: string;
  userAvatar?: string;
  muteAudio?: boolean;
  muteVideo?: boolean;
  talking?: boolean;
};
