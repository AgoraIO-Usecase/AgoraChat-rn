import * as React from 'react';
import { Button as RNButton, Text, View } from 'react-native';
import { useDeferredValue } from 'react-native-chat-uikit';

let count = 0;
export default function TestUtil() {
  React.useEffect(() => {}, []);

  const [value, setValue] = React.useState(0);
  const [value2, setValue2] = React.useState(0);

  const useDeferredValueM = React.useCallback(useDeferredValue, [value]);

  type ObjType = {
    name: string;
    age: number;
  };

  const [obj, setObj] = React.useState<ObjType>({ name: 'zs', age: count });

  return (
    <View style={{ marginTop: 100 }}>
      <View>
        <RNButton
          title="compare value"
          onPress={() => {
            setValue(++count);
          }}
        >
          defer value
        </RNButton>
        <Text>{value}</Text>
        <Text>{useDeferredValue(value)}</Text>
      </View>
      <View>
        <RNButton
          title="compare value"
          onPress={() => {
            setValue2(++count);
          }}
        >
          defer value2
        </RNButton>
        <Text>{value2}</Text>
        <Text>{useDeferredValueM(value2)}</Text>
      </View>
      <View>
        <RNButton
          title="compare object value"
          onPress={() => {
            setObj({ name: obj.name, age: obj.age + 1 });
          }}
        >
          defer object value
        </RNButton>
        <Text>{obj.age}</Text>
        <Text>{useDeferredValueM(obj).age}</Text>
      </View>
    </View>
  );
}
