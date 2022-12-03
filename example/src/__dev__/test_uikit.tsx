import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { ChatUikitView } from 'react-native-chat-uikit';

if (Platform.OS === 'web') {
  console.error('web platforms are not supported.');
}

export default function TestUIKit() {
  React.useEffect(() => {
    console.log('test:');
  }, []);

  return (
    <View style={styles.container}>
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
