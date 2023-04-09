import * as React from 'react';
import { View } from 'react-native';
import { SimulateGif } from 'react-native-chat-uikit';

export default function TestSpeaker3(): JSX.Element {
  console.log('test:TestSpeaker:');

  return (
    <View
      style={{
        flex: 1,
        // backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <SimulateGif
        size={100}
        names={['msg_recv_audio02', 'msg_recv_audio01', 'msg_recv_audio']}
        color="blue"
      />
    </View>
  );
}
