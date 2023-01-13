import { NavigationProp, useNavigation } from '@react-navigation/native';
import type { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAppI18nContext } from '../contexts/AppI18nContext';
import type { RootScreenParamsList } from '../routes';

export const GroupInviteHeader = (props: HeaderButtonProps): JSX.Element => {
  console.log('test:HomeHeaderRight:', props);
  const { header } = useAppI18nContext();
  const navigation = useNavigation<NavigationProp<RootScreenParamsList>>();
  let right = header.groupInvite + '(0)';
  return (
    <Pressable
      onPress={() => {
        navigation.navigate('Add', { params: { value: 'test' } });
      }}
    >
      <View style={{ padding: 10, marginRight: -10 }}>
        <Text>{right}</Text>
      </View>
    </Pressable>
  );
};
