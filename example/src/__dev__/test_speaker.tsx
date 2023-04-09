import * as React from 'react';
import { Button, Image, View } from 'react-native';

export default function TestSpeaker(): JSX.Element {
  console.log('test:TestSpeaker:');
  const f2 = React.useRef(
    require('./../../assets/msg_recv_audio01_3x.png')
  ).current;
  const f1 = React.useRef(
    require('./../../assets/msg_recv_audio02_3x.png')
  ).current;
  const f3 = React.useRef(
    require('./../../assets/msg_recv_audio_3x.png')
  ).current;
  const arr = React.useRef([f1, f2, f3]).current;
  const [file, setFile] = React.useState(f2);
  const count = React.useRef(0);

  return (
    <View
      style={{
        flex: 1,
        // backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Button
        title="start"
        onPress={() => {
          setInterval(() => {
            setFile(arr[count.current % 3]);
            count.current += 1;
          }, 500);
        }}
      />
      <Image source={file} style={{ width: 100, height: 100 }} />
    </View>
  );
}
