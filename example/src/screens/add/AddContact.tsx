import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Button, View } from 'react-native';

import type { RootScreenParamsList } from '../../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

export default function AddContactScreen({
  route,
  navigation,
}: Props): JSX.Element {
  console.log('test:AddContactScreen:', route, navigation);
  return (
    <View>
      <Button
        title="go to Add"
        onPress={() => {
          // navigation.push('Home', { params: undefined });
          navigation.goBack();
        }}
      />
    </View>
  );
}
