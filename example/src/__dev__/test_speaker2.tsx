import * as React from 'react';
import { Animated, Button, Image, View } from 'react-native';

export default function TestSpeaker2(): JSX.Element {
  console.log('test:TestSpeaker:');
  const f1 = React.useRef(
    require('./../../assets/msg_recv_audio_3x.png')
  ).current;
  const f2 = React.useRef(require('./../../assets/ui_struct_2.png')).current;
  const w = React.useRef(new Animated.Value(0)).current;
  const w2 = React.useRef(new Animated.Value(45)).current;
  const w3 = React.useRef(new Animated.Value(35)).current;
  console.log('test:TestSpeaker:', w, w2, w3);

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
          Animated.loop(
            Animated.timing(w, {
              toValue: 100,
              duration: 1000,
              useNativeDriver: false,
            } as Animated.TimingAnimationConfig)
          ).start();
        }}
      />
      <View
        style={{
          width: 100,
          height: 100,
          // backgroundColor: 'red',
        }}
      >
        <Image source={f1} style={{ width: 100, height: 100 }} />
        <Animated.View
          style={{
            width: 100,
            height: '100%',
            position: 'absolute',
            opacity: 1,
            left: w,
          }}
        >
          <Image source={f2} style={{ width: 100, height: 100 }} />
        </Animated.View>
      </View>
    </View>
  );
}
