import * as React from 'react';
import { Button as RNButton, Text, View } from 'react-native';
import { useDeferredValue } from 'react-native-chat-uikit';

let count = 0;
export default function TestUtilDefer() {
  React.useEffect(() => {}, []);

  const [value, setValue] = React.useState(0);
  const [value2, setValue2] = React.useState(0);

  const useDeferredValueM = React.useCallback(useDeferredValue, [value]);

  type ObjType = {
    name: string;
    age: number;
  };

  const [obj, setObj] = React.useState<ObjType>({ name: 'zs', age: count });
  const data = React.useMemo<ObjType[]>(() => [{ name: 'zs', age: count }], []);
  const [objs, setObjs] = React.useState<ObjType[]>(data);

  return (
    <View style={{ marginTop: 100 }}>
      <View>
        <RNButton
          title="compare value"
          onPress={() => {
            setValue(++count);
          }}
        />
        <Text>{value}</Text>
        <Text>{useDeferredValue(value)}</Text>
      </View>
      <View>
        <RNButton
          title="compare value"
          onPress={() => {
            setValue2(++count);
          }}
        />
        <Text>{value2}</Text>
        <Text>{useDeferredValueM(value2)}</Text>
      </View>
      <View>
        <RNButton
          title="compare object value"
          onPress={() => {
            setObj({ name: obj.name, age: obj.age + 1 });
          }}
        />
        <Text>{obj.age}</Text>
        <Text>{useDeferredValueM(obj).age}</Text>
      </View>
      <View>
        <RNButton
          title="compare object array value"
          onPress={() => {
            setObjs([{ name: objs[0]!.name, age: objs[0]!.age + 1 }]);
          }}
        />
        <Text>{objs[0]!.age}</Text>
        <Text>{useDeferredValueM(objs)[0]!.age}</Text>
      </View>
    </View>
  );
}
