import * as React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-chat-uikit';

import type { User } from '../../../../packages/react-native-chat-callkit/src/types';
import { AudioTabs } from '../../../../packages/react-native-chat-callkit/src/view/components/AudioTabs';

let count = 0;
export function Test() {
  const users = React.useMemo(() => [] as User[], []);
  const [, setValue] = React.useState(0);
  // for (let index = 0; index < 2; index++) {
  //   users.push({
  //     userId: `id_{${index}}`,
  //     userName: `name_${index}`,
  //     userHadJoined: false,
  //     isSelf: false,
  //   });
  //   count = index + 1;
  // }
  return (
    <View style={{ flex: 1, top: 100 }}>
      <Button
        onPress={() => {
          users.push({
            userId: `id_{${count}}`,
            userName: `name_${count}`,
            userHadJoined: false,
            isSelf: false,
          });
          ++count;
          setValue(count);
          console.log('test:1:', count, users.length);
        }}
      >
        update
      </Button>
      {/* <Text>{value}</Text> */}
      <AudioTabs users={users} />
    </View>
  );
  // return <AudioTabs users={users} />;
}

export default function TestTabAudio() {
  return Test();
}
