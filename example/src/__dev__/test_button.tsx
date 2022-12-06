import * as React from 'react';
import { Button as RNButton, View } from 'react-native';
import { Button } from 'react-native-paper';

export default function TestButton() {
  const [icon, setIcon] = React.useState(true);

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
    </View>
  );
}
