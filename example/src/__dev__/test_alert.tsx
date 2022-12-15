import * as React from 'react';
import { View } from 'react-native';
import { Alert } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

export default function TestIcon() {
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
      <Alert
        title="haha"
        message="message"
        visible={icon}
        onHide={function (): void {
          console.log('test:onHide:', icon);
          setIcon(false);
        }}
      />
    </View>
  );
}
