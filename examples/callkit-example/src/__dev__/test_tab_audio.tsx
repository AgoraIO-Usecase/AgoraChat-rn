import * as React from 'react';
import { View } from 'react-native';

import {
  AudioTabs,
  AudioUser,
} from '../../../../packages/react-native-chat-callkit/src/view/components/AudioTabs';

export function test() {
  const users = [] as AudioUser[];
  for (let index = 0; index < 16; index++) {
    users.push({
      userId: `id_{${index}}`,
      userName: `name_${index}`,
    });
  }
  return (
    <View style={{ flex: 1 }}>
      <AudioTabs users={users} />
    </View>
  );
  // return <AudioTabs users={users} />;
}

export default function TestTabAudio() {
  return test();
}
