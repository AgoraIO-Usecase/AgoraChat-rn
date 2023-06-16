import * as React from 'react';
import { Button as RNButton, View } from 'react-native';
import { LocalIcon, VectorIcon } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

export default function TestIcon() {
  const [icon, setIcon] = React.useState(true);

  React.useEffect(() => {}, []);

  return (
    <View style={{ marginTop: 100 }}>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            console.log(icon);
            setIcon(!icon);
          }}
        >
          change icon
        </Button>
      </View>
      <View>
        <RNButton
          title="change icon"
          onPress={() => {
            console.log(icon);
            setIcon(!icon);
          }}
        />
      </View>
      <LocalIcon name={icon ? 'alert_info' : 'alert_success'} size={48} />
      <VectorIcon name={icon ? 'ab-testing' : 'abacus'} size={48} />
    </View>
  );
}
