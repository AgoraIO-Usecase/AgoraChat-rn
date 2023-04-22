import React from 'react';

import { versionToArray } from '../utils/function';

export const useForceUpdate = () => {
  const [, updater] = React.useState(0);
  return React.useCallback(() => updater((prev) => prev + 1), []);
};

type Function = (...args: any[]) => any;

export const useAsyncTask = (
  immediate: React.MutableRefObject<NodeJS.Immediate>,
  f: Function,
  ...args: any[]
) => {
  try {
    immediate.current = setImmediate(f, args);
  } catch (error) {
    console.warn('test:useAsyncTask:', error);
  }
};

const DEFER = 500;

type TimeoutType = {
  timeoutId: NodeJS.Timeout;
  cur: number;
};

/**
 * ref: https://juejin.cn/post/7083466010505773093#3
 * !!! This function does not exist before react 18.
 *
 * Typical application scenarios: Delayed display of search results to improve performance.
 *
 * This method can only be used inside the rendering component, if you need to use it elsewhere, please use `throttle`.
 *
 * @param value any type value
 * @param defer timeout (ms)
 * @returns deferred timeout value
 */
export const useDeferredValue = <T,>(value: T, defer: number = DEFER) => {
  const v = versionToArray(React.version);
  if (v[0] && v[0] >= 18) {
    throw new Error('Please use the official version.');
  }

  const _preValue = React.useRef(value);
  const preValue = React.useMemo(() => {
    return _preValue;
  }, []);
  const [_value, setValue] = React.useState(preValue.current);

  const _timeout = React.useRef<TimeoutType>();
  const timeout = React.useMemo(() => {
    return _timeout;
  }, []);

  const _create = React.useCallback(
    (
      defer: number,
      timeout: React.MutableRefObject<TimeoutType | undefined>,
      dispatch: React.Dispatch<React.SetStateAction<T>>,
      value: T,
      preValue: React.MutableRefObject<T>
    ) => {
      if (timeout.current === undefined) {
        timeout.current = {
          timeoutId: setTimeout(() => {
            preValue.current = value;
            timeout.current = undefined;
            dispatch(value);
          }, defer),
          cur: new Date().getTime(),
        };
      }
    },
    []
  );
  const _cancel = React.useCallback(
    (
      defer: number,
      timeout: React.MutableRefObject<TimeoutType | undefined>
    ) => {
      if (timeout.current) {
        const cur = new Date().getTime();
        if (cur <= timeout.current.cur + defer) {
          clearTimeout(timeout.current.timeoutId);
          timeout.current = undefined;
        }
      }
    },
    []
  );

  if (preValue.current === value) {
    return _value;
  }

  _cancel(defer, timeout);
  _create(defer, timeout, setValue, value, preValue);

  return _value;
};
