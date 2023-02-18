import * as React from 'react';
import { Text } from 'react-native';

import {
  ContentStateContextProvider,
  DialogContextProvider,
  ToastContextProvider,
} from '../contexts';

export type FragmentContainerProps = {
  children?: React.ReactNode;
};

export function FragmentContainer({
  children,
}: FragmentContainerProps): JSX.Element {
  console.log('test:FragmentContainer:');

  return (
    <DialogContextProvider>
      <ToastContextProvider>
        <ContentStateContextProvider
          content={{
            children: (
              <Text
                style={{
                  height: 100,
                  width: 100,
                  backgroundColor: 'purple',
                }}
              >
                hh
              </Text>
            ),
          }}
        >
          {children}
        </ContentStateContextProvider>
      </ToastContextProvider>
    </DialogContextProvider>
  );
}
