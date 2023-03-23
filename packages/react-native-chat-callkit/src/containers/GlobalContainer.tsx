import * as React from 'react';

import { createManagerImpl } from '../call/CallManagerImpl';
import { CallkitSdkContextProvider } from '../contexts/CallkitSdkContext';
import type { CallkitSdkContextType } from '../types';
import { onceEx } from '../utils/utils';

/**
 * Initializes the property list of 'callkit'.
 */
export type GlobalContainerProps =
  React.PropsWithChildren<CallkitSdkContextType>;

/**
 * Initializes the entry to 'callkit'.
 *
 * @returns
 */
export function GlobalContainer(props: GlobalContainerProps): JSX.Element {
  console.log('callkit:GlobalContainer:', props);
  const { children, ...others } = props;
  const call = createManagerImpl();
  const init = onceEx((props: CallkitSdkContextType) => {
    console.log('callkit:GlobalContainer:onceEx:', props);
    call.init(props);
  });

  init(others);

  return (
    <CallkitSdkContextProvider call={call}>
      {children}
    </CallkitSdkContextProvider>
  );
}
