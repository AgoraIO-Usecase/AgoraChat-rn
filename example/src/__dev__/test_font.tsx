import * as React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function TestFont() {
  React.useEffect(() => {}, []);

  return (
    <View style={{ marginTop: 100 }}>
      <View>
        <Text
          style={{
            fontSize: 60,
            fontFamily: 'Baguette',
          }}
        >
          test font
        </Text>
      </View>
    </View>
  );
}
