import * as React from 'react';
import { Button as RNButton, View } from 'react-native';
import { ActionMenu } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

export default function TestMenu() {
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
      <ActionMenu
        menuItems={[{ title: 'name1' }, { title: 'name2' }]}
        visible={icon}
        onHide={function (): void {
          setIcon(false);
        }}
        title="title"
      />
    </View>
  );
}
