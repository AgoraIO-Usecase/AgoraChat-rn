import type { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import * as React from 'react';
import { Placeholder } from 'react-native-chat-uikit';

import type { RootParamsList } from '../routes';

type Props = MaterialTopTabScreenProps<RootParamsList>;

export default function ContactListScreen({
  route,
  navigation,
}: Props): JSX.Element {
  console.log(route, navigation);
  return <Placeholder content={`${ContactListScreen.name}`} />;
}
