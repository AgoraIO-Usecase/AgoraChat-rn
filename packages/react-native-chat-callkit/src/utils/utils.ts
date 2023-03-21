import { v4 } from 'uuid';

export function uuid(): string {
  return v4();
}

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
