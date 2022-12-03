import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Button, View } from 'react-native';

import type { ScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<ScreenParamsList>;

export default function AddScreen({ route, navigation }: Props): JSX.Element {
  console.log('test:', route, navigation);
  return (
    <View>
      <Button
        title="go to add contact"
        onPress={() => {
          // navigation2.navigate('SignUp', {});
          navigation.push('AddContact', { params: undefined });
        }}
      />
      <Button
        title="go to home"
        onPress={() => {
          // navigation.push('Home', { params: undefined });
          navigation.goBack();
        }}
      />
    </View>
  );
}
