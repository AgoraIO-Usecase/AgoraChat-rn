import * as React from 'react';
import { Pressable, View } from 'react-native';
import { RadioButton as MyRadioButton } from 'react-native-chat-uikit';
import { Button, Checkbox, RadioButton } from 'react-native-paper';

export default function TestRadioButton() {
  const [icon, setIcon] = React.useState(true);
  const [enabled, setEnabled] = React.useState(true);
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
        <Pressable
          style={{
            padding: 6,
          }}
          onPress={() => setEnabled(!enabled)}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 20,
              width: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: enabled ? 'blue' : 'grey',
              padding: 6,
            }}
          >
            {enabled ? (
              <View
                style={{
                  backgroundColor: enabled ? 'blue' : undefined,
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                }}
              />
            ) : undefined}
          </View>
        </Pressable>
      </View>
      <MyRadioButton
        size={40}
        checked={checked}
        onChecked={setChecked as any}
      />
    </View>
  );
}
