import * as React from 'react';
import { View } from 'react-native';
import { Image } from 'react-native-chat-uikit';

export default function TestGif(): JSX.Element {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        source={{
          // uri: 'https://www.insidedogsworld.com/wp-content/uploads/2016/03/Dog-Pictures.jpg',
          uri: 'https://media.giphy.com/media/l2SpMU9sWIvT2nrCo/giphy.gif',
        }}
        style={{ height: 100, width: 100 }}
      />
    </View>
  );
}
