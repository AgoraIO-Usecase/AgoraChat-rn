import * as React from 'react';
import { Text, View } from 'react-native';
import { useContentStateContext } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

export default function TestContentState() {
  const [icon, setIcon] = React.useState(false);
  const state = useContentStateContext();

  const onIcon = (icon: boolean) => {
    setIcon(icon);
    if (icon === true) {
      state.showState({
        children: (
          <Text style={{ height: 100, width: 100, backgroundColor: 'grey' }}>
            44
          </Text>
        ),
        container: {},
      });
    } else {
      state.hideState();
    }
  };

  React.useEffect(() => {}, []);

  return (
    <View style={{ marginTop: 100 }}>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            console.log(icon);
            onIcon(!icon);
          }}
        >
          change icon
        </Button>
      </View>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            console.log(icon);
            onIcon(!icon);
          }}
        >
          change icon
        </Button>
      </View>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            console.log(icon);
            onIcon(!icon);
          }}
        >
          change icon
        </Button>
      </View>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            console.log(icon);
            onIcon(!icon);
          }}
        >
          change icon
        </Button>
      </View>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            console.log(icon);
            onIcon(!icon);
          }}
        >
          change icon
        </Button>
      </View>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            console.log(icon);
            onIcon(!icon);
          }}
        >
          change icon
        </Button>
      </View>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            console.log(icon);
            onIcon(!icon);
          }}
        >
          change icon
        </Button>
      </View>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            console.log(icon);
            onIcon(!icon);
          }}
        >
          change icon
        </Button>
      </View>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            console.log(icon);
            onIcon(!icon);
          }}
        >
          change icon
        </Button>
      </View>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            console.log(icon);
            onIcon(!icon);
          }}
        >
          change icon
        </Button>
      </View>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            console.log(icon);
            onIcon(!icon);
          }}
        >
          change icon
        </Button>
      </View>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            console.log(icon);
            onIcon(!icon);
          }}
        >
          change icon
        </Button>
      </View>
    </View>
  );
}
