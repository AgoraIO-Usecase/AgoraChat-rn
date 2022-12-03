import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChatClient, ChatOptions } from 'react-native-chat-sdk';

export default function TestSdk() {
  const [result] = React.useState<number | undefined>();

  React.useEffect(() => {
    const r = ChatClient.getInstance().init(
      new ChatOptions({ appKey: 'test', autoLogin: false })
    );
    console.log('test:', r);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
