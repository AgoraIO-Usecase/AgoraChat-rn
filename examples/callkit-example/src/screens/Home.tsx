import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Text } from 'react-native';
import { DevDebug } from 'react-native-chat-uikit';

import type { RootParamsList } from '../routes';

export default function HomeScreen(
  _: NativeStackScreenProps<RootParamsList, 'Home'>
): JSX.Element {
  console.log('test:HomeScreen:');
  return (
    <DevDebug>
      <Text>developing</Text>
    </DevDebug>
  );
}
