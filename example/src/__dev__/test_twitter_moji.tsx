import * as React from 'react';
import { Text, View } from 'react-native';
import { Image, TextInput } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';
import moji from 'twemoji';

export default function TestTweMoji() {
  const [icon, setIcon] = React.useState(true);
  const [content, setContent] = React.useState('');
  const s = 'https://twemoji.maxcdn.com/v/14.0.2/72x72/2764.png';
  const ss = decodeURI(s);
  const sss = encodeURI(ss);
  console.log('test:', ss, sss);
  const [url, setUrl] = React.useState(s);

  React.useEffect(() => {}, []);

  const test = () => {
    const rr = moji.convert.fromCodePoint('1f62e');
    const r = moji.parse('I \u2764\uFE0F emoji!');
    console.log('test:r:', r, typeof r, rr);
    setContent(rr);
    const s = moji.parse('\u2764\uFE0F');
    console.log('test:s:', s);
  };

  return (
    <View style={{ marginTop: 100 }}>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            console.log(icon);
            setIcon(!icon);
            setUrl(s);
            test();
          }}
        >
          change icon
        </Button>
      </View>
      <TextInput style={{ backgroundColor: 'red' }} />
      <Text style={{ fontSize: 60 }}>{content}</Text>
      <Image
        source={{ uri: url }}
        style={{ width: 60, height: 60 }}
        onError={(error) => {
          console.log('test:', error);
        }}
      />
    </View>
  );
}
