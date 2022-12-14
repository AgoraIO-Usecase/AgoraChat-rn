import * as React from 'react';
import { Button as RNButton, View } from 'react-native';
import { DialogBox } from 'react-native-chat-uikit';
import { Button, Text } from 'react-native-paper';

export default function TestLoading() {
  const [icon, setIcon] = React.useState(true);

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
      <View>
        <RNButton
          title="change icon"
          onPress={() => {
            console.log(icon);
            setIcon(!icon);
          }}
        >
          change icon
        </RNButton>
      </View>
      <DialogBox
        style={{
          height: 300,
          width: 300,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>haha</Text>
      </DialogBox>
    </View>
  );
}
