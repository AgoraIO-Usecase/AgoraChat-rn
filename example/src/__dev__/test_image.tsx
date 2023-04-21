import * as React from 'react';
import { Button as RNButton, View } from 'react-native';
import { Image } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

export default function TestImage() {
  const [icon, setIcon] = React.useState(true);
  const [uri, setUri] = React.useState('');

  return (
    <View style={{ marginTop: 100 }}>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            console.log(icon);
            setIcon(!icon);
          }}
        >
          change icon
        </Button>
      </View>
      <View>
        <RNButton
          title="change icon"
          onPress={() => {
            console.log(icon);
            setIcon(!icon);
            setUri(
              icon
                ? 'http://pic.66zhuang.com/pics/image/2015-02-28/57771592d86b38b76fca120fb037ee3e.png'
                : 'https://reactnative.dev/img/tiny_logo.png'
            );
          }}
        >
          change icon
        </RNButton>
      </View>
      <Image
        source={{
          uri: uri,
        }}
        resizeMode="cover"
        style={{ height: 100, width: 100 }}
        onLoad={(e) => {
          console.log(e);
        }}
        onError={(e) => {
          console.log(e);
        }}
      />
    </View>
  );
}
