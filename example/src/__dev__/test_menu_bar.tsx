import * as React from 'react';
import { View } from 'react-native';
import { MenuBar } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

export default function TestLoading() {
  const [icon, setIcon] = React.useState(true);

  React.useEffect(() => {}, []);

  return (
    <View style={{ marginTop: 100 }}>
      <View>
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
      <MenuBar
        name="hh"
        icon="Icon_Emoji"
        onPress={function (): void {
          console.log('test:');
        }}
      />
    </View>
  );
}
