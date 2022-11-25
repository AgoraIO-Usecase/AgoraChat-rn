import { registerRootComponent } from 'expo';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChatClient, ChatOptions } from 'react-native-chat-sdk';
import { ChatUikitView, multiply } from 'react-native-chat-uikit';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    multiply(3, 7).then(setResult);
    const r = ChatClient.getInstance().init(
      new ChatOptions({ appKey: 'test', autoLogin: false })
    );
    console.log('test:', r);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
      <ChatUikitView color="#32a852" style={styles.box} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
