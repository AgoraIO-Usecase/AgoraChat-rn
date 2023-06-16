import * as React from 'react';
import { View } from 'react-native';
import {
  MessageBubbleListFragment as DefaultMessageBubbleList,
  MessageBubbleListRef as DefaultMessageBubbleListRef,
} from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

export default function TestMessageList() {
  React.useEffect(() => {}, []);
  const ref = React.useRef<DefaultMessageBubbleListRef>(null);

  const MessageListM = React.memo(DefaultMessageBubbleList);

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
      <MessageListM ref={ref} />
    </View>
  );
}
