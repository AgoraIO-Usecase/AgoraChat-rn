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

/**
 * Creates a throttled function that only invokes `fn` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `fn` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `fn`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `fn` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `fn` invocation.
 *
 * ref: [here](../../../../.yarn/releases/yarn-1.22.19.cjs)
 *
 * Examples: [here](../../../../example/src/__dev__/test_util.tsx)
 *
 * function once (fn) {
 *   var f = function () {
 *     if (f.called) return f.value
 *     f.called = true
 *     return f.value = fn.apply(this, arguments)
 *   }
 *   f.called = false
 *   return f
 * }
 *
 * @param fn any function
 * @param args any arguments
 * @returns Returns the result of the function call.
 */
export function once(fn: Function, ...args: any[]) {
  let f: any = function () {
    if (f.called) return f.value;
    f.called = true;
    return (f.value = fn.apply(f, args));
  };
  f.called = false;
  return f;
}
export function onceEx(fn: Function) {
  let f: any = function (...args: any[]) {
    if (f.called) return f.value;
    f.called = true;
    return (f.value = fn.apply(f, args));
  };
  f.called = false;
  return f;
}

export function hashCode(str?: string): number {
  let hash = 0,
    i,
    chr;
  if (str === undefined || str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
