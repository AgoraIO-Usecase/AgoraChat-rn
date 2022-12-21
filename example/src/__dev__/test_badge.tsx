import * as React from 'react';
import { View } from 'react-native';
import { Badge } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

export default function TestIcon() {
  const [icon, setIcon] = React.useState(90);

  React.useEffect(() => {}, []);

  return (
    <View style={{ marginTop: 100 }}>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            console.log(icon);
            setIcon(icon + 1);
          }}
        >
          change icon
        </Button>
      </View>
      <View style={{ width: 50, height: 50 }}>
        <Badge count={icon} />
      </View>
    </View>
  );
}
