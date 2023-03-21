import { calllog } from './CallConst';

export type CallTimeoutState = 'invite' | 'alert' | 'confirm' | 'answer';

export interface CallTimeoutListener {
  /**
   * Invitation message response timeout notification.
   */
  onInviteTimeout(params: { callId: string; userId: string }): void;
  /**
   * alert message response timeout notification.
   */
  onAlertTimeout(params: { callId: string; userId: string }): void;
  /**
   * confirm message response timeout notification.
   */
  onConfirmTimeout(params: { callId: string; userId: string }): void;
  /**
   * answer message response timeout notification.
   */
  onAnswerTimeout(params: { callId: string; userId: string }): void;
}

export class CallTimeoutHandler {
  private _listener: CallTimeoutListener | undefined;
  private _timer: Map<string, NodeJS.Timeout>;
  private _timeout: number;
  constructor(params: { listener: CallTimeoutListener; timeout: number }) {
    this._listener = params.listener;
    this._timer = new Map();
    this._timeout = params.timeout;
    calllog.log(
      'CallTimeoutHandler:constructor:',
      this._listener,
      this._timeout,
      this._timer
    );
  }
  public destructor(): void {
    calllog.log('CallTimeoutHandler:destructor:', this._listener);
    this._listener = undefined;
    this.stopAllTiming();
  }
  protected key(params: { callId: string; userId: string }) {
    return `${params.callId}_${params.userId}`;
  }
  public setTimeoutNumber(timeout: number): void {
    this._timeout = timeout;
  }

  /**
   * After the inviter message is sent, the timer starts.
   *
   * @param params -
   * - callId: call id.
   * - userId: Could be an inviter or an invitee.
   * - callTimeoutState: call state.
   */
  public startInviteTiming(params: { callId: string; userId: string }): void {
    this.startTiming({ ...params, callTimeoutState: 'invite' });
  }
  /**
   * After the invitee sends an alert message, the timer starts.
   */
  public startAlertTiming(params: { callId: string; userId: string }): void {
    this.startTiming({ ...params, callTimeoutState: 'alert' });
  }
  /**
   * After the inviter sends a confirmation message, the timer will start.
   */
  public startConfirmTiming(params: { callId: string; userId: string }): void {
    this.startTiming({ ...params, callTimeoutState: 'confirm' });
  }
  /**
   * After the invitee sends a answer message, the timer will start.
   */
  public startAnswerTiming(params: { callId: string; userId: string }): void {
    this.startTiming({ ...params, callTimeoutState: 'answer' });
  }
  /**
   * Manually stop the timeout without triggering the callback notification.
   *
   * @param params -
   * - callId: call id.
   * - userId: Could be an inviter or an invitee.
   */
  public stopTiming(params: { callId: string; userId: string }): void {
    const timeoutId = this._timer.get(
      this.key({ callId: params.callId, userId: params.userId })
    );
    clearTimeout(timeoutId);
    this._timer.delete(
      this.key({ callId: params.callId, userId: params.userId })
    );
  }
  /**
   * Stop all timers and destroy.
   */
  public stopAllTiming(): void {
    for (const key in this._timer) {
      const timeoutId = this._timer.get(key);
      clearTimeout(timeoutId);
    }
    this._timer.clear();
  }
  /**
   * After the xxx message is sent, the timer starts.
   *
   * @param params -
   * - callId: call id.
   * - userId: Could be an inviter or an invitee.
   * - callTimeoutState: call timeout state.
   */
  public startTiming(params: {
    callId: string;
    userId: string;
    callTimeoutState: CallTimeoutState;
  }): void {
    const timeoutId = setTimeout(() => {
      const callId = params.callId;
      const userId = params.userId;
      const callTimeoutState = params.callTimeoutState;
      calllog.log(
        'CallTimeoutHandler:startTiming:',
        callId,
        userId,
        callTimeoutState
      );
      this._timer.delete(this.key({ callId, userId }));
      switch (callTimeoutState) {
        case 'alert':
          this._listener?.onAlertTimeout({ callId, userId });
          break;
        case 'answer':
          this._listener?.onAnswerTimeout({ callId, userId });
          break;
        case 'confirm':
          this._listener?.onConfirmTimeout({ callId, userId });
          break;
        case 'invite':
          this._listener?.onInviteTimeout({ callId, userId });
          break;

        default:
          break;
      }
    }, this._timeout);
    this._timer.set(
      this.key({ callId: params.callId, userId: params.userId }),
      timeoutId
    );
  }
  public hasTiming(params: { callId: string; userId: string }): boolean {
    return this._timer.has(
      this.key({ callId: params.callId, userId: params.userId })
    );
  }
}
