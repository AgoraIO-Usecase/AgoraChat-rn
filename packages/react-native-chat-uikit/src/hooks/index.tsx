import React from 'react';

export const useUpdate = () => {
  const [, updater] = React.useState(0);
  return React.useCallback(() => updater((prev) => prev + 1), []);
};
