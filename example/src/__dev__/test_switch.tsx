import * as React from 'react';
import { Button as RNButton, View } from 'react-native';
import { Switch } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

export default function TestSwitch() {
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
      <Switch
        value={icon}
        onChangeValue={setIcon}
        thumbColor="white"
        inactiveThumbColor="white"
        size={80}
      />
      <Switch size={30} />
    </View>
  );
}
