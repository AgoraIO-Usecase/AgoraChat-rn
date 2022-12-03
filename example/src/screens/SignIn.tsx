import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Button, View } from 'react-native';

import type { ScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<ScreenParamsList>;

export default function SignInScreen({
  route,
  navigation,
}: Props): JSX.Element {
  console.log('test:', route, navigation);
  return (
    <View>
      <Button
        title="go to sign up"
        onPress={() => {
          navigation.push('SignUp', { params: undefined });
        }}
      />
      <Button
        title="go to home"
        onPress={() => {
          navigation.push('Home', { params: undefined });
        }}
      />
    </View>
  );
}
