// ref: https://github.com/jashkenas/underscore/blob/b713f5a6d75b12c8c57fb3f410df029497c2a43f/modules/throttle.js

type Function = (...args: any[]) => any;

// A (possibly faster) way to get the current timestamp as an integer.
function now() {
  return new Date().getTime();
}

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
export function throttle(
  func: Function,
  wait: number = 500,
  options: any = { leading: false }
) {
  let timeout: NodeJS.Timeout | null, context: any, args: any, result: any;
  let previous = 0;
  if (!options) options = {};

  const later = function () {
    previous = options.leading === false ? 0 : now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  const throttled = function (...argument: any[]) {
    const _now = now();
    if (!previous && options.leading === false) previous = _now;
    const remaining = wait - (_now - previous);
    context = throttled;
    args = argument;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = _now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function () {
    if (timeout) {
      clearTimeout(timeout);
    }
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}
