import * as React from 'react';
import { Button as RNButton, Text, View } from 'react-native';
import { useDeferredValue } from 'react-native-chat-uikit';

let count = 0;
// const DEFER = 500;
// const useDeferredValueInternal = <T,>(
//   value: T,
//   timeout: React.MutableRefObject<{
//     timeoutId: NodeJS.Timeout;
//     cur: number;
//   } | null>,
//   defer: number = DEFER
// ) => {
//   const v = versionToArray(React.version);
//   console.warn('test:version:', v);
//   if (v[0] && v[0] >= 18) {
//     throw new Error('Please use the official version.');
//   }

//   const _preValue = React.useRef(value);
//   const [_value, setValue] = React.useState(_preValue.current);

//   const _create = React.useCallback(
//     (
//       defer: number,
//       dispatch: React.Dispatch<React.SetStateAction<T>>,
//       value: T
//     ) => {
//       if (timeout.current === undefined) {
//         timeout.current = {
//           timeoutId: setTimeout(() => {
//             _preValue.current = value;
//             dispatch(value);
//           }, defer),
//           cur: new Date().getTime(),
//         };
//       }
//     },
//     [timeout]
//   );
//   const _cancel = React.useCallback(
//     (defer: number) => {
//       console.log('test:useDeferredValue:_cancel:');
//       if (timeout.current) {
//         console.log('test:useDeferredValue:_cancel:1:');
//         const cur = new Date().getTime();
//         if (timeout.current.cur + defer < cur) {
//           console.log(
//             'test:useDeferredValue:_cancel:2:',
//             timeout.current.cur + defer,
//             cur
//           );
//           clearTimeout(timeout.current?.timeoutId);
//           timeout.current = null;
//         }
//       }
//     },
//     [timeout]
//   );

//   _cancel(defer);
//   _create(defer, setValue, value);

//   return _value;
// };

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
