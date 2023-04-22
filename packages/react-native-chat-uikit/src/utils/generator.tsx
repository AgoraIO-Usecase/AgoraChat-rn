import { v4 } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class Sequence {
  static aa = new Map<string, number>();
  static sequenceId(key: string): number {
    const r = Sequence.aa.get(key);
    let c = 0;
    if (r === undefined) {
      c = 1;
    } else {
      c = r + 1;
      if (c > 65535) {
        c = 1;
      }
    }
    Sequence.aa.set(key, c);
    return c;
  }
}

/**
 * Generate a sequence id.
 * @ref https://beta.reactjs.org/apis/react/useId#useid
 * @returns id
 */
export function seqId(key = '_global'): number {
  return Sequence.sequenceId(key);
}

export function uuid(): string {
  return v4();
}

/**
 * Get the current timestamp. Returns a timestamp in milliseconds by default.
 *
 * @param type second or millisecond.
 * @returns The current timestamp.
 */
export function timestamp(
  type: 'second' | 'millisecond' = 'millisecond'
): number {
  if (type === 'second') {
    return Math.round(new Date().getTime() / 1000);
  } else if (type === 'millisecond') {
    return new Date().getTime();
  } else {
    throw new Error('type is error:', type);
  }
}
