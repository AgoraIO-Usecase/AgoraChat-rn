import * as React from 'react';
import { View } from 'react-native';
import { LoadingRN } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

export default function TestBox() {
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
          show test
        </Button>
      </View>
      {icon ? (
        <View
          style={{
            flex: 1,
            padding: 50,
            backgroundColor: 'red',
            justifyContent: 'center',
          }}
        >
          <LoadingRN size="small" />
        </View>
      ) : undefined}
    </View>
  );
}
