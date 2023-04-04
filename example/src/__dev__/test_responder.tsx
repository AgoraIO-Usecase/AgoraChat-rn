// from: https://blog.csdn.net/qq_30053399/article/details/77776049?ops_request_misc=&request_id=&biz_id=102&utm_term=react%20native%20%E4%BA%8B%E4%BB%B6%E5%93%8D%E5%BA%94&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduweb~default-0-77776049.142^v81^insert_down38,201^v4^add_ask,239^v2^insert_chatgpt&spm=1018.2226.3001.4187
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
