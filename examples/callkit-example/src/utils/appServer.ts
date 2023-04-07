import { ChatClient } from 'react-native-chat-sdk';

export class AppServerClient {
  private static _rtcTokenUrl: string =
    'http://a1.easemob.com/token/rtcToken/v1';
  private static _mapUrl: string = 'http://a1.easemob.com/channel/mapper';

  protected _(): void {}
  private static async req(params: {
    method: 'GET' | 'POST';
    url: string;
    kvs: any;
    from: 'requestToken' | 'requestUserMap';
    onResult: (p: { data?: any; error?: any }) => void;
  }): Promise<void> {
    // console.log('AppServerClient:req:', params);
    try {
      const accessToken = await ChatClient.getInstance().getAccessToken();
      // console.log('AppServerClient:req:', accessToken);
      const json = params.kvs as {
        userAccount: string;
        channelName: string;
        appkey: string;
      };
      const url = `${params.url}?appkey=${encodeURIComponent(
        json.appkey
      )}&channelName=${encodeURIComponent(
        json.channelName
      )}&userAccount=${encodeURIComponent(json.userAccount)}`;
      // console.log('AppServerClient:req:', url);
      const response = await fetch(url, {
        method: params.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const value = await response.json();
      // console.log('AppServerClient:req:', value);
      if (value.code !== 'RES_0K') {
        params.onResult({ error: { code: value.code } });
      } else {
        if (params.from === 'requestToken') {
          params.onResult({
            data: {
              token: value.accessToken,
              uid: value.agoraUserId,
            },
          });
        } else if (params.from === 'requestUserMap') {
          params.onResult({
            data: {
              result: value.result,
            },
          });
        }
      }
    } catch (error) {
      params.onResult({ error });
    }
  }
  public static getRtcToken(params: {
    userAccount: string;
    channelId: string;
    appKey: string;
    onResult: (params: { data?: any; error?: any }) => void;
  }): void {
    AppServerClient.req({
      method: 'GET',
      url: AppServerClient._rtcTokenUrl,
      kvs: {
        userAccount: params.userAccount,
        channelName: params.channelId,
        appkey: params.appKey,
      },
      from: 'requestToken',
      onResult: params.onResult,
    });
  }
  public static getRtcMap(params: {
    userAccount: string;
    channelId: string;
    appKey: string;
    onResult: (params: { data?: any; error?: any }) => void;
  }): void {
    AppServerClient.req({
      method: 'GET',
      url: AppServerClient._mapUrl,
      kvs: {
        userAccount: params.userAccount,
        channelName: params.channelId,
        appkey: params.appKey,
      },
      from: 'requestUserMap',
      onResult: params.onResult,
    });
  }
}
