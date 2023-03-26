import type { CallOption, CallUser } from './call';

export interface CallkitSdkContextType {
  option: CallOption;
  enableLog?: boolean;
  requestRTCToken: (params: {
    appKey: string;
    channelId: string;
    userId: string;
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
