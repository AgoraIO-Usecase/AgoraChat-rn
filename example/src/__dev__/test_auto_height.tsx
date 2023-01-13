import * as React from 'react';
import { Text, View } from 'react-native';
// import { MenuBar } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

export default function TestAutoHeight() {
  console.log('test:TestAutoHeight:');
  const [icon, setIcon] = React.useState(true);
  const [, setHeight] = React.useState(0);
  const text2 =
    'ChatSdkContextProvider \n(at containers/index.tsx:100) ChatSdkContextProvider (at containers/index.tsx:100) ChatSdkContextProvider (at containers/index.tsx:100) ChatSdkContextProvider (at containers/index.tsx:100) ChatSdkContextProvider (at containers/index.tsx:100)';

  React.useEffect(() => {}, []);

  return (
    <View style={{ marginTop: 100 }}>
      <View>
        <Button
          mode="text"
          uppercase={false}
          onPress={() => {
            setIcon(!icon);
          }}
        >
          test menu bar
        </Button>
      </View>
      <View
        style={{
          // flexGrow: 1,
          // flex: 1,
          position: 'absolute',
          top: 100,
          // height: height,
          // minHeight: 100,
          // maxHeight: 400,
          // flexBasis: 150,
          width: '100%',
          // width: 200,
          backgroundColor: 'red',
        }}
      >
        {/* <View
          style={{
            flexGrow: 1,
            // flex: 1,
            backgroundColor: 'green',
            height: 140,
          }}
          onLayout={(event) => {
            console.log(event.nativeEvent.layout);
            setHeight(event.nativeEvent.layout.height);
          }}
        /> */}
        <View>
          <Text
            numberOfLines={10}
            style={{
              flexGrow: 1,
              // flex: 1,
              backgroundColor: 'green',
              flexWrap: 'wrap',
              // width: '100%',
              // height: 140,
              // width: 190,
              maxHeight: 200,
              minHeight: 100,
            }}
            onLayout={(event) => {
              console.log(event.nativeEvent.layout);
              setHeight(event.nativeEvent.layout.height);
            }}
          >
            {text2}
          </Text>
        </View>
      </View>
    </View>
  );
}
