import React from 'react';

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
export const useDeferredValue = (
  defer: number,
  f: (...args: any[]) => any,
  ...args: any[]
) => {
  console.log('test:version:', React.version);

  const timeout = React.useRef<{
    timeoutId: NodeJS.Timeout;
    cur: number;
  }>();

  const _create = React.useCallback(
    (defer: number, f: (...args: any[]) => any, ...args: any[]) => {
      if (timeout.current === undefined) {
        timeout.current = {
          timeoutId: setTimeout(() => f(...args), defer),
          cur: new Date().getTime(),
        };
      }
    },
    []
  );
  const _cancel = React.useCallback((defer: number) => {
    if (timeout.current) {
      if (timeout.current.cur + defer < new Date().getTime()) {
        clearTimeout(timeout.current?.timeoutId);
        timeout.current = undefined;
      }
    }
  }, []);

  _cancel(defer);
  _create(defer, f, ...args);
};
