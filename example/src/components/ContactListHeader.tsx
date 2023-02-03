import type { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { createStyleSheet } from 'react-native-chat-uikit';

import { useAppI18nContext } from '../contexts/AppI18nContext';

export const ContactListHeader = (props: HeaderButtonProps): JSX.Element => {
  console.log('test:ContactListHeader:', props);
  const { header } = useAppI18nContext();
  // const navigation = useNavigation<NavigationProp<RootScreenParamsList>>();
  let right = header.groupInvite + '(0)';
  return (
    <Pressable onPress={() => {}}>
      <View style={styles.container}>
        <Text>{right}</Text>
      </View>
    </Pressable>
  );
};

const styles = createStyleSheet({
  container: {
    padding: 10,
    marginRight: -10,
  },
});
