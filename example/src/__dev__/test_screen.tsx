import * as React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function TestScreen() {
  const { width, height } = useWindowDimensions();
  // const insets = useSafeAreaInsets();
  // console.log('insets:', insets);
  return (
    <SafeAreaProvider>
      <SafeAreaView
        mode="padding"
        style={{ flex: 1, backgroundColor: 'beige' }}
      >
        <View
          style={{
            flex: 1,
            width: '90%',
            // height: 500,
            // flexBasis: 500,
            alignItems: 'center',
            alignSelf: 'center',
            flexDirection: 'column',
            backgroundColor: 'darkcyan',
          }}
        >
          <View
            style={{
              flex: 1,
              width: width * 0.8,
              // height: 100,
              flexBasis: height * 0.8,
              flexGrow: 0,
              flexShrink: 1,
              backgroundColor: 'darkgreen',
              // marginTop: 100,
            }}
          />
          <View
            style={{
              flex: 1,
              width: 100,
              // height: 100,
              // flexBasis: 100,
              flexGrow: 1,
              backgroundColor: 'darkgrey',
            }}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
