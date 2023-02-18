import * as React from 'react';
import { Text, TextInput as RNTextInput, View } from 'react-native';
import { LocalIcon, TextInput } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

export default function TestInput() {
  console.log('test:TestInput:');
  const [icon, setIcon] = React.useState(true);
  const content = '😃😃😃😀😃😚😀😀';
  const secureTextEntry = true;
  const [value, setValue] = React.useState('');
  // const [value2, setValue2] = React.useState('');
  const value3 = React.useRef('');

  const onValue3 = (text: string) => {
    value3.current = text;
  };

  React.useEffect(() => {}, []);

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
      <View
        style={{
          backgroundColor: 'blue',
          width: 200,
          marginHorizontal: 10,
          // overflow: 'hidden',
        }}
      >
        <RNTextInput
          style={{
            backgroundColor: 'green',
            flexGrow: 1,
            height: 40,
            borderRadius: 20,
            paddingHorizontal: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          secureTextEntry={secureTextEntry}
          clearButtonMode="never"
          onChangeText={onValue3}
          // value={value3.current}
        />
        <LocalIcon
          style={{
            position: 'absolute',
            right: 10,
            top: -(40 / 2 + 20 / 2),
          }}
          name="delete"
          size={20}
        />
      </View>
      <View
        style={{
          width: 200,
        }}
      >
        <TextInput
          style={{
            height: 40,
            borderRadius: 20,
            paddingHorizontal: 20,
            backgroundColor: 'red',
          }}
          secureTextEntry={secureTextEntry}
        />
      </View>
      <View style={{ width: 200 }}>
        <TextInput
          style={{
            height: 40,
            borderRadius: 20,
            paddingHorizontal: 20,
            backgroundColor: 'orange',
          }}
          value={value}
          onChangeText={setValue}
          clearButtonMode="while-editing"
        />
      </View>

      <Text>{content}</Text>
    </View>
  );
}
