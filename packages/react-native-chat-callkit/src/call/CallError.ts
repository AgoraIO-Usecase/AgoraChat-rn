import type { ErrorCodeType } from 'react-native-agora';

import { CallErrorCode, CallErrorType } from '../enums';

/**
 * Error message object. Including error code, error type, error description information. Can be formatted as a string.
 */
export class CallError {
  private _code: CallErrorCode | ErrorCodeType;
  private _desc: string;
  private _type: CallErrorType;
  constructor(params: {
    code: CallErrorCode | ErrorCodeType;
    description?: string;
    type?: CallErrorType;
  }) {
    this._code = params.code;
    this._desc = params.description ?? '';
    this._type = params.type ?? CallErrorType.Others;
  }
  public toString(): string {
    return JSON.stringify(this);
  }
  public get code() {
    return this._code;
  }
  public get desc() {
    return this._desc;
  }
  public get type() {
    return this._type;
  }
}
