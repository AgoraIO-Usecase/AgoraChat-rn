export const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

// type Function = (...args: any[]) => any;

export const asyncTask = (f: Function, ...args: any[]) => {
  try {
    setImmediate(f, args);
  } catch (error) {
    console.warn('test:asyncTask:', error);
  }
};

// export const useAsyncTask = (
//   immediate: React.MutableRefObject<NodeJS.Immediate>,
//   f: Function,
//   ...args: any[]
// ) => {
//   try {
//     immediate.current = setImmediate(f, args);
//   } catch (error) {
//     console.warn('test:useAsyncTask:', error);
//   }
// };

export const queueTask = (f: Function, ...args: any[]) => {
  try {
    queueMicrotask(() => f(args));
  } catch (error) {
    console.warn('test:queueTask:', error);
  }
};

export const arraySort = <T extends { key: string }>(list: T[]) => {
  list.sort((a, b) => {
    if (a.key > b.key) {
      return 1;
    } else if (a.key < b.key) {
      return -1;
    }
    return 0;
  });
};

type Function = (...args: any[]) => any;
type Callback = Function;

/**
 * Example:
 * ```typescript
 * callbackToAsync(
 *   alphabetListRef.current.measure,
 *   (
 *     x: number,
 *     y: number,
 *     width: number,
 *     height: number,
 *     pageX: number,
 *     pageY: number
 *   ) => {
 *     console.log('test:measure:', x, y, width, height, pageX, pageY);
 *     listYRef.current = pageY;
 *   }
 * );
 * ```
 * @param f any sync function.
 * @param args It can be any parameter, including callback parameters.
 * @returns callback result.
 */
export const callbackToAsync = (f: Function, cb: Callback, ...args: any[]) => {
  const r = new Promise((success, fail) => {
    try {
      console.log('test:callbackToAsync:', f, cb, ...args);
      const r = f(cb, ...args);
      success(r);
    } catch (e: any) {
      fail(e);
    }
  });
  return r;
};

export const versionToArray = (v: string): number[] => {
  return v.split('.').map((_v) => parseInt(_v));
};
