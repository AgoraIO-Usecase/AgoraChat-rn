import type { MaterialBottomTabScreenProps } from '@react-navigation/material-bottom-tabs';
import * as React from 'react';
import { Placeholder } from 'react-native-chat-uikit';

import type { RootParamsList } from '../routes';

type Props = MaterialBottomTabScreenProps<RootParamsList>;

export default function ConversationListScreen({
  route,
  navigation,
}: Props): JSX.Element {
  console.log('test:ConversationListScreen:', route, navigation);
  return <Placeholder content={`${ConversationListScreen.name}`} />;
}
