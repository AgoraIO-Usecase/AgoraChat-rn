import React from 'react';

import type { CallManager } from '../call';

type CallkitSdkContextProps = React.PropsWithChildren<{ call: CallManager }>;

const CallkitSdkContext = React.createContext<
  CallkitSdkContextProps | undefined
>(undefined);
CallkitSdkContext.displayName = 'CallkitChatSdkContext';

export function CallkitSdkContextProvider({
  call,
  children,
}: CallkitSdkContextProps) {
  return (
    <CallkitSdkContext.Provider value={{ call }}>
      {children}
    </CallkitSdkContext.Provider>
  );
}

export function useCallkitSdkContext(): CallkitSdkContextProps {
  const call = React.useContext(CallkitSdkContext);
  if (!call) throw Error(`${CallkitSdkContext.displayName} is not provided`);
  return call;
}
