import * as React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Toast } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

export default function TestLoading() {
  const [icon, setIcon] = React.useState(false);
  const [opacity, setOpacity] = React.useState(false);
  const { width, height } = useWindowDimensions();

  React.useEffect(() => {}, []);

  return (
    <View style={{ marginTop: 100, flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Button
          mode="text"
          uppercase={false}
          onPress={() => {
            setIcon(!icon);
            setOpacity(!opacity);
          }}
        >
          test menu bar
        </Button>
      </View>
      <View
        pointerEvents="none"
        style={[
          {
            backgroundColor: 'rgba(100, 100, 100, 0.5)',
            flex: 1,
            position: 'absolute',
            width: width,
            height: height,
            opacity: opacity ? 1 : 0,
          },
        ]}
      >
        <Toast visible={icon} type="normal" children="test" bottom={200} />
      </View>
    </View>
  );
}
