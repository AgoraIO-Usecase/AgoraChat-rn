import * as React from 'react';

import Toast from '../components/Toast';
import type { ToastType } from '../types';
import type { ToastContextType } from './types';

const ToastContext = React.createContext<ToastContextType | null>(null);
ToastContext.displayName = 'IMUIKitToastContext';

type ToastContextProps = React.PropsWithChildren<{ dismissTimeout?: number }>;

const TIMEOUT = 3000;
export function ToastContextProvider({
  children,
  dismissTimeout = TIMEOUT,
}: ToastContextProps) {
  const [state, setState] = React.useState({
    visible: false,
    type: 'error' as ToastType,
    text: '',
  });
  const bottom = 166;

  React.useEffect(() => {
    if (!state.visible) return;

    const hideTimeout = setTimeout(() => {
      setState((prev) => ({ ...prev, visible: false }));
    }, dismissTimeout);
    return () => clearTimeout(hideTimeout);
  });

  return (
    <ToastContext.Provider
      value={{
        showToast: (text, type = 'normal') =>
          text && setState({ text, type, visible: true }),
      }}
    >
      {children}
      <Toast type={state.type} visible={state.visible} bottom={bottom}>
        {state.text}
      </Toast>
    </ToastContext.Provider>
  );
}

export function useToastContext(): ToastContextType {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error(`${ToastContext.displayName} is not provided`);
  return context;
}
