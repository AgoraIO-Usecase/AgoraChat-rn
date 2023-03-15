import * as React from 'react';
import { View } from 'react-native';
import { Alert } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

export default function TestAlert() {
  const [icon, setIcon] = React.useState(false);

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
        visible={icon}
        onHide={function (): void {
          console.log('test:onHide:', icon);
          setIcon(false);
        }}
        buttons={[
          {
            text: 'hh',
            onPress: () => {
              setIcon(false);
            },
          },
          {
            text: 'nn',
            onPress: () => {
              setIcon(false);
            },
          },
        ]}
      />
    </View>
  );
}
