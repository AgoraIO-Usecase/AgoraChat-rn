import type { MaterialBottomTabScreenProps } from '@react-navigation/material-bottom-tabs';
import * as React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-chat-uikit';

import type { RootParamsList } from '../routes';

type Props = MaterialBottomTabScreenProps<RootParamsList, 'MySetting'>;

export default function MySettingScreen({ navigation }: Props): JSX.Element {
  return (
    <View>
      <Button
        onPress={() => {
          navigation.navigate('Login', {});
        }}
      >
        go log in
      </Button>
    </View>
  );
}
