import * as React from 'react';
import { View } from 'react-native';
import { useForceUpdate } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

export default function TestForceUpdate() {
  console.log('test:TestForceUpdate:');
  // ref: https://reactjs.org/docs/hooks-faq.html#how-much-of-my-react-knowledge-stays-relevant
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const forceUpdate2 = useForceUpdate();

  function handleClick() {
    forceUpdate();
  }

  function handleClick2() {
    forceUpdate2();
  }

  React.useEffect(() => {}, []);

  return (
    <View style={{ marginTop: 100 }}>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            handleClick();
          }}
        >
          change icon
        </Button>
      </View>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            handleClick2();
          }}
        >
          change icon
        </Button>
      </View>
    </View>
  );
}
