import { type NavigationProp, useNavigation } from '@react-navigation/native';
import type { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { LocalIcon } from 'react-native-chat-uikit';

import type { RootScreenParamsList } from '../routes';

export default function HomeHeaderRight(props: HeaderButtonProps): JSX.Element {
  console.log('test:HomeHeaderRight:', props);
  const navigation = useNavigation<NavigationProp<RootScreenParamsList>>();
  return (
    <Pressable
      onPress={() => {
        navigation.navigate('Add', { params: { value: 'test' } });
      }}
    >
      <View style={{ padding: 10, marginRight: -10 }}>
        <LocalIcon name="chat_nav_add" style={{ padding: 0 }} size={20} />
      </View>
    </Pressable>
  );
}
