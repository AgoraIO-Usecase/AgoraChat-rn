import * as React from 'react';
import { View } from 'react-native';
import { Prompt } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

export default function TestPrompt() {
  const [icon, setIcon] = React.useState(false);

  React.useEffect(() => {}, []);

  return (
    <View style={{ marginTop: 100, flexDirection: 'row' }}>
      <View style={{ width: 100 }}>
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
        <Prompt
          visible={icon}
          onHide={function (): void {
            setIcon(false);
          }}
          onSubmit={(value) => {
            console.log('value:', value);
          }}
          title="test prompt"
        />
      </View>
    </View>
  );
}
