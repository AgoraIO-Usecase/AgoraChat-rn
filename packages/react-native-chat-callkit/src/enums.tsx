/**
 * Call enumeration type.
 */
export enum CallType {
  Audio1v1 = 0,
  Video1v1,
  VideoMulti,
  AudioMulti,
}

/**
 * An enumerated type of call state.
 */
export enum CallState {
  Idle = 0,
  Connecting,
  Calling,
}

/**
 * An enumeration type of the reason for the end of the call.
 */
export enum CallEndReason {
  HungUp = 0,
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
  RTC = 0,
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
   * Already initialized.
   */
  Initialized,
  /**
   * other situations.
   */
  Others,
}
