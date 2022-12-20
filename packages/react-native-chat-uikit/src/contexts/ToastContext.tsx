import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Toast from '../components/Toast';
import type { ToastContextType, ToastType } from '../types';

const ToastContext = React.createContext<ToastContextType | null>(null);

const VISIBLE_MS = 3000;
export function ToastProvider({
  children,
  dismissTimeout = VISIBLE_MS,
}: React.PropsWithChildren<{ dismissTimeout?: number }>) {
  const [state, setState] = React.useState({
    visible: false,
    type: 'error' as ToastType,
    text: '',
  });
  const { bottom } = useSafeAreaInsets();

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
        show: (text, type = 'normal') =>
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
  if (!context)
    throw new Error(
      'ToastContext is not provided, wrap your app with ToastProvider'
    );
  return context;
}
