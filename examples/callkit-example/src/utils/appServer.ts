import { ChatClient } from 'react-native-chat-sdk';

export class AppServerClient {
  private static _rtcTokenUrl: string = 'http://a1.easemob.com/token/rtcToken';
  private static _mapUrl: string = 'http://a1.easemob.com/channel/mapper';

  protected _(): void {}
  private static request(params: {
    url: string;
    kvs: any;
    onResult: (params: { data?: any; error?: any }) => void;
  }): void {
    ChatClient.getInstance()
      .getAccessToken()
      .then((accessToken) => {
        fetch(params.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...params.kvs,
            Authorization: `Bearer ${accessToken}`,
          }),
        })
          .then()
          .catch((error) => {
            params.onResult({ error });
          });
      })
      .catch((error) => {
        params.onResult({ error });
      });
  }
  public static getRtcToken(params: {
    userAccount: string;
    channelId: string;
    appKey: string;
    onResult: (params: { data?: any; error?: any }) => void;
  }): void {
    AppServerClient.request({
      url: AppServerClient._rtcTokenUrl,
      kvs: {
        userAccount: params.userAccount,
        channelName: params.channelId,
        appkey: params.appKey,
      },
      onResult: params.onResult,
    });
  }
  public static getRtcMap(params: {
    userAccount: string;
    channelId: string;
    appKey: string;
    onResult: (params: { data?: any; error?: any }) => void;
  }): void {
    AppServerClient.request({
      url: AppServerClient._mapUrl,
      kvs: {
        userAccount: params.userAccount,
        channelName: params.channelId,
        appkey: params.appKey,
      },
      onResult: params.onResult,
    });
  }
}
