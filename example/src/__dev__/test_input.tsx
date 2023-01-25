import * as React from 'react';
import { Text, View } from 'react-native';
import { TextInput } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

export default function TestInput() {
  const [icon, setIcon] = React.useState(true);
  const content = '😃😃😃😀😃😚😀😀';

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
      <TextInput style={{ backgroundColor: 'red' }} />
      <Text>{content}</Text>
    </View>
  );
}
