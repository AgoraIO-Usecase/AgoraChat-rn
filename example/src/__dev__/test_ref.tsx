import * as React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

type Props = {
  width?: number;
  height?: number;
};
const MultiComponent = (props: Props) => {
  // console.log('test:MultiComponent:', props);
  const { width, height } = props;

  // 1
  const w = width;

  // 2
  // const [w, setW] = React.useState(width ?? 100);

  // 3
  // const w = React.useRef(width ?? 100);

  console.log('test:MultiComponent:', props, w);
  return (
    <View style={{ width: w, height: height ?? 100 }}>
      <Text>hh</Text>
    </View>
  );
};

let count = 0;
export default function TestRef() {
  const [c, setC] = React.useState(count);

  React.useEffect(() => {}, []);

  return (
    <View style={{ marginTop: 100 }}>
      <MultiComponent width={c} />
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            setC(++count);
          }}
        >
          change icon
        </Button>
      </View>
    </View>
  );
}
