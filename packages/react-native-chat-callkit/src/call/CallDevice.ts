import DeviceInfo from 'react-native-device-info';

import { calllog } from './CallConst';

export class CallDevice {
  _deviceToken: string;
  constructor() {
    this._deviceToken = '';
  }
  public init(result: (deviceToken: string) => void): void {
    DeviceInfo.getDeviceToken()
      .then((dt) => {
        this._deviceToken = dt;
        result(this._deviceToken);
      })
      .catch((error) => {
        calllog.warn('CallDevice:init:error:', error);
      });
  }
  public get deviceToken() {
    return this._deviceToken;
  }
}
