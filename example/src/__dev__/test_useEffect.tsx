import * as React from 'react';
import { Text, View } from 'react-native';
import { useChatSdkContext } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

type MyComponentProps = {
  visible?: boolean;
};
const MyComponent = (props: MyComponentProps) => {
  const { client } = useChatSdkContext();

  const xxx = React.useCallback(() => {
    console.log('test:useCallback:');
    client.getAccessToken();
  }, [client]);

  React.useEffect(() => {
    const load = () => {
      console.log('test:load:');
      xxx();
    };
    const unload = () => {
      console.log('test:unload:');
    };

    load();
    return () => unload();
  }, [xxx]);

  return (
    <View
      style={{
        backgroundColor: 'green',
        width: 100,
        height: 100,
        display: props.visible ? 'flex' : 'none',
      }}
    >
      <Text>hh</Text>
    </View>
  );
};

export default function TestUseEffect() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {}, []);

  return (
    <View style={{ marginTop: 100 }}>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            console.log(visible);
            setVisible(!visible);
          }}
        >
          change icon
        </Button>
      </View>
      {/* <MyComponent visible={visible} /> */}
      {visible ? <MyComponent visible={visible} /> : null}
    </View>
  );
}
