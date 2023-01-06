export const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export const asyncTask = (callback: Function, ...args: any[]) =>
  process.nextTick(callback, args);

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
