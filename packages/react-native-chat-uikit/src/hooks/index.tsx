import React from 'react';

import { versionToArray } from '../utils/function';

export const useUpdate = () => {
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

// https://juejin.cn/post/7083466010505773093#3
// This function does not exist before react 18.
// export const useDeferredValue = (
//   defer: number,
//   f: (...args: any[]) => any,
//   ...args: any[]
// ) => {
//   console.log('test:version:', React.version);

//   const timeout = React.useRef<{
//     timeoutId: NodeJS.Timeout;
//     cur: number;
//   }>();

//   const _create = React.useCallback(
//     (defer: number, f: (...args: any[]) => any, ...args: any[]) => {
//       if (timeout.current === undefined) {
//         timeout.current = {
//           timeoutId: setTimeout(() => f(...args), defer),
//           cur: new Date().getTime(),
//         };
//       }
//     },
//     []
//   );
//   const _cancel = React.useCallback((defer: number) => {
//     if (timeout.current) {
//       if (timeout.current.cur + defer < new Date().getTime()) {
//         clearTimeout(timeout.current?.timeoutId);
//         timeout.current = undefined;
//       }
//     }
//   }, []);

//   _cancel(defer);
//   _create(defer, f, ...args);
// };

const DEFER = 500;
export const useDeferredValue2 = <T,>(value: T, defer: number = DEFER) => {
  const v = versionToArray(React.version);
  console.warn('test:version:', v);
  if (v[0] && v[0] >= 18) {
    throw new Error('Please use the official version.');
  }

  const _preValue = React.useRef(value);
  const [_value, setValue] = React.useState(_preValue.current);

  const timeout = React.useRef<{
    timeoutId: NodeJS.Timeout;
    cur: number;
  }>();

  const _create = React.useCallback(
    (
      defer: number,
      dispatch: React.Dispatch<React.SetStateAction<T>>,
      value: T
    ) => {
      if (timeout.current === undefined) {
        timeout.current = {
          timeoutId: setTimeout(() => {
            _preValue.current = value;
            dispatch(value);
          }, defer),
          cur: new Date().getTime(),
        };
      }
    },
    []
  );
  const _cancel = React.useCallback((defer: number) => {
    console.log('test:useDeferredValue:_cancel:');
    if (timeout.current) {
      console.log('test:useDeferredValue:_cancel:1:');
      const cur = new Date().getTime();
      if (timeout.current.cur + defer < cur) {
        console.log(
          'test:useDeferredValue:_cancel:2:',
          timeout.current.cur + defer,
          cur
        );
        clearTimeout(timeout.current?.timeoutId);
        timeout.current = undefined;
      }
    }
  }, []);

  _cancel(defer);
  _create(defer, setValue, value);

  return _value;
};

export const useDeferredValue = <T,>(value: T, defer: number = DEFER) => {
  const v = versionToArray(React.version);
  console.warn('test:version:', v);
  if (v[0] && v[0] >= 18) {
    throw new Error('Please use the official version.');
  }

  const _preValue = React.useRef(value);
  const [_value, setValue] = React.useState(_preValue.current);

  const _timeout = React.useRef<{
    timeoutId: NodeJS.Timeout;
    cur: number;
  }>();

  const timeout = React.useMemo(() => {
    console.log('test:useDeferredValue:useMemo:');
    return _timeout;
  }, []);

  const _create = React.useCallback(
    (
      defer: number,
      dispatch: React.Dispatch<React.SetStateAction<T>>,
      value: T
    ) => {
      if (timeout.current === undefined) {
        timeout.current = {
          timeoutId: setTimeout(() => {
            _preValue.current = value;
            dispatch(value);
          }, defer),
          cur: new Date().getTime(),
        };
      }
    },
    [timeout]
  );
  const _cancel = React.useCallback(
    (defer: number) => {
      console.log('test:useDeferredValue:_cancel:');
      if (timeout.current) {
        console.log('test:useDeferredValue:_cancel:1:');
        const cur = new Date().getTime();
        if (timeout.current.cur + defer < cur) {
          console.log(
            'test:useDeferredValue:_cancel:2:',
            timeout.current.cur + defer,
            cur
          );
          clearTimeout(timeout.current?.timeoutId);
          timeout.current = undefined;
        }
      }
    },
    [timeout]
  );

  _cancel(defer);
  _create(defer, setValue, value);

  return _value;
};
