import * as React from 'react';
import { View } from 'react-native';
import { CheckButton as MyCheckButton } from 'react-native-chat-uikit';
import { Button, Checkbox, RadioButton } from 'react-native-paper';

export default function TestCheckButton() {
  const [icon, setIcon] = React.useState(true);
  const [checked, setChecked] = React.useState(false);

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
      <View style={{ backgroundColor: 'red', width: 40 }}>
        <RadioButton
          value="sdf"
          status={icon ? 'checked' : 'unchecked'}
          onPress={() => setIcon(!icon)}
        />
        <Checkbox
          status={icon ? 'checked' : 'unchecked'}
          onPress={() => setIcon(!icon)}
        />
        <MyCheckButton checked={icon} onChecked={setIcon} />
      </View>
      <MyCheckButton size={40} checked={checked} onChecked={setChecked} />
    </View>
  );
}
