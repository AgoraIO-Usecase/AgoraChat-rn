import * as React from 'react';
import {
  GestureResponderEvent,
  GestureResponderHandlers,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';

export default function TestResponder() {
  React.useEffect(() => {}, []);
  const [color1, setColor1] = React.useState('cornsilk');
  const [color2, setColor2] = React.useState('darkseagreen');
  const [color3, setColor3] = React.useState('deepskyblue');

  const handlers1 = {
    onStartShouldSetResponder: (_: GestureResponderEvent): boolean => {
      return true;
    },
    onMoveShouldSetResponder: (_: GestureResponderEvent): boolean => {
      return false;
    },
    onStartShouldSetResponderCapture: (_: GestureResponderEvent): boolean => {
      return true;
    },
    onMoveShouldSetResponderCapture: (_: GestureResponderEvent): boolean => {
      return false;
    },
    onResponderGrant: (_: GestureResponderEvent) => {
      setColor1('red');
    },
    onResponderMove: (_: GestureResponderEvent) => {
      console.log(123);
    },
    onResponderRelease: (_: GestureResponderEvent) => {
      setColor1('cornsilk');
    },
  } as GestureResponderHandlers;

  const handlers2 = {
    onStartShouldSetResponder: (_: GestureResponderEvent): boolean => {
      return false;
    },
    onMoveShouldSetResponder: (_: GestureResponderEvent): boolean => {
      return false;
    },
    onStartShouldSetResponderCapture: (_: GestureResponderEvent): boolean => {
      return false;
    },
    onMoveShouldSetResponderCapture: (_: GestureResponderEvent): boolean => {
      return false;
    },
    onResponderGrant: () => {
      setColor2('red');
    },
    onResponderMove: () => {
      console.log(123);
    },
    onResponderRelease: () => {
      setColor2('darkseagreen');
    },
  } as GestureResponderHandlers;

  const handlers3 = {
    onStartShouldSetResponder: (_: GestureResponderEvent): boolean => {
      return true;
    },
    onMoveShouldSetResponder: (_: GestureResponderEvent): boolean => {
      return false;
    },
    onStartShouldSetResponderCapture: (_: GestureResponderEvent): boolean => {
      return true;
    },
    onMoveShouldSetResponderCapture: (_: GestureResponderEvent): boolean => {
      return false;
    },
    onResponderGrant: () => {
      setColor3('red');
    },
    onResponderMove: () => {
      console.log(123);
    },
    onResponderRelease: () => {
      setColor3('deepskyblue');
    },
  } as GestureResponderHandlers;

  return (
    <View style={{ marginTop: 100 }}>
      <View
        style={{ width: 300, height: 300, backgroundColor: color1 }}
        {...handlers1}
      >
        <View
          style={{ width: 200, height: 200, backgroundColor: color2 }}
          {...handlers2}
        >
          <View
            style={{ width: 100, height: 100, backgroundColor: color3 }}
            {...handlers3}
          >
            <Text>hh</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
