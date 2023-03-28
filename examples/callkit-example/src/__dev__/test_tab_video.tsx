import * as React from 'react';
import { View } from 'react-native';

import {
  VideoTabs,
  VideoUser,
} from '../../../../packages/react-native-chat-callkit/src/view/components/VideoTabs';

export function test() {
  const users = [] as VideoUser[];
  for (let index = 0; index < 6; index++) {
    users.push({
      userId: `id_{${index}}`,
      userName: `name_${index}`,
      muteAudio: true,
      muteVideo: true,
    });
  }
  return (
    <View style={{ flex: 1 }}>
      <VideoTabs users={users} />
    </View>
  );
  // return <AudioTabs users={users} />;
}

export default function TestTabAudio() {
  return test();
}
