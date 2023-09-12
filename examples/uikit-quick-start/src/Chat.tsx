import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ChatFragment, ScreenContainer } from 'react-native-chat-uikit';

import { dlog, RootParamsList } from './AppConfig';

export function ChatScreen({
  route,
}: NativeStackScreenProps<typeof RootParamsList>): JSX.Element {
  dlog.log('test:', route.params);
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{
          params: route.params as any,
        }}
      />
    </ScreenContainer>
  );
}
