import * as React from 'react';
import { View } from 'react-native';
import { Avatar } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

export default function TestAvatar() {
  const [icon, setIcon] = React.useState(true);
  const url = 'http://pic1.16xx8.com/allimg/170303/jc09967_021.jpg';

  React.useEffect(() => {}, []);

  return (
    <View style={{ marginTop: 100, backgroundColor: 'green', flex: 1 }}>
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
      <View
        style={{
          width: 100,
          height: 100,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'orange',
        }}
      >
        <Avatar uri={url} />
      </View>
      <View
        style={{
          width: 100,
          height: 100,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'orange',
        }}
      >
        <Avatar
          uri={url}
          state={{ stateUri: 'alert_default', stateOverflow: 'visible' }}
        />
      </View>
    </View>
  );
}
