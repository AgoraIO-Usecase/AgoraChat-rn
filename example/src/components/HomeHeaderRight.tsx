import type { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { createStyleSheet, LocalIcon } from 'react-native-chat-uikit';

export default function HomeHeaderRight(props: HeaderButtonProps): JSX.Element {
  console.log('test:HomeHeaderRight:', props);
  // const navigation = useNavigation<NavigationProp<RootScreenParamsList>>();
  return (
    <Pressable onPress={() => {}}>
      <View style={styles.container}>
        <LocalIcon name="chat_nav_add" size={20} />
      </View>
    </Pressable>
  );
}
const styles = createStyleSheet({
  container: { padding: 10, marginRight: -10 },
});
