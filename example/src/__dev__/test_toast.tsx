import * as React from 'react';
import { View } from 'react-native';
import { Toast } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

export default function TestLoading() {
  const [icon, setIcon] = React.useState(false);

  React.useEffect(() => {}, []);

  return (
    <View style={{ marginTop: 100, flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'red' }}>
        <Button
          mode="text"
          uppercase={false}
          onPress={() => {
            setIcon(!icon);
          }}
        >
          test menu bar
        </Button>
      </View>
      <Toast visible={icon} type="normal" children="test" bottom={60} />
    </View>
  );
}
