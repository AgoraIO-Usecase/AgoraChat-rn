import * as React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-chat-uikit';

import { formatElapsed } from '../../../../packages/react-native-chat-callkit/src/utils/utils';

export default function TestUtils(): JSX.Element {
  return (
    <View style={{ top: 100 }}>
      <Button
        onPress={() => {
          const ret = formatElapsed(11125000);
          console.log('test:ret:', ret);
        }}
      >
        formatElapsed
      </Button>
    </View>
  );
}
