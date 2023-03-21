export enum CallType {
  Audio1v1,
  Video1v1,
  Multi,
}

export enum CallEndReason {
  HungUp,
  Cancel,
  RemoteCancel,
  RemoteRefuse,
  RemoteBusy,
  NoResponse,
  RemoteNoResponse,
  HandleOnOtherDevice,
}

export enum CallErrorType {
  /**
   * Real-Time Communications error type.
   */
  RTC,
  /**
   * The signaling error type.
   */
  Signaling,
  /**
   * others
   */
  Others,
}

export enum CallErrorCode {
  /**
   * Invalid input parameter.
   */
  InvalidParams = 10000,
  /**
   * An abnormal state caused by a logic error. Generally only occurs during the development and implementation phases.
   */
  ExceptionState,
  /**
   * A type of invalid parameter, high-frequency single column.
   */
  InvalidToken,
  /**
   * The business logic is abnormal. High frequency single row.
   */
  IsBusy,
  /**
   * The response timed out. For example: no reply from the other party.
   */
  Timeout,
  /**
   * Network Error. For example: Failed to send signaling.
   */
  NetworkError,
  /**
   * other situations.
   */
  Others,
}
