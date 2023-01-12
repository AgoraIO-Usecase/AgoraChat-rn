import * as React from 'react';
import { View } from 'react-native';
import { Blank } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

export default function TestMessageList() {
  React.useEffect(() => {}, []);

  return (
    <View
      style={{
        marginTop: 100,
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <View>
        <Button mode="contained" uppercase={false} onPress={() => {}}>
          change icon
        </Button>
      </View>
      <Blank />
    </View>
  );
}
