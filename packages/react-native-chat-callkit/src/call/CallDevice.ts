import { Platform } from 'react-native';
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
        const sub = dt.substring(0, 31);
        const os = Platform.OS;
        this._deviceToken = `rn_${os}_${sub}`;
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
