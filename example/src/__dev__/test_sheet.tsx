import * as React from 'react';
import { Button as RNButton, View } from 'react-native';
import { BottomSheet } from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function TestBox() {
  const [icon, setIcon] = React.useState(true);

  React.useEffect(() => {}, []);

  return (
    <SafeAreaProvider>
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
          >
            change icon
          </RNButton>
        </View>
        <BottomSheet
          visible={icon}
          onHide={function (): Promise<void> {
            return new Promise(() => {
              setIcon(false);
              console.log('test:onHide:');
            });
          }}
          sheetItems={[
            {
              icon: 'loading',
              title: 'name1',
              onPress: () => {
                console.log('test');
              },
            },
            {
              icon: 'loading',
              title: 'name2',
              onPress: () => {
                console.log('test');
              },
            },
            {
              icon: 'loading',
              title: 'name3',
              onPress: () => {
                console.log('test');
              },
            },
            {
              icon: 'loading',
              title: 'name4',
              onPress: () => {
                console.log('test');
              },
            },
            {
              icon: 'loading',
              title: 'name5',
              onPress: () => {
                console.log('test');
              },
            },
            {
              icon: 'loading',
              title: 'name6',
              onPress: () => {
                console.log('test');
              },
            },
          ]}
        />
      </View>
    </SafeAreaProvider>
  );
}
