import * as React from 'react';
import { View } from 'react-native';

import DevDebug from '../common/screens/DevDebug';
import TestColor from './test_color';

export default function test_layout(): JSX.Element {
  const s = true;
  if (s) {
    return default_2();
  } else {
    return default_1();
  }
}

function default_2(): JSX.Element {
  return <TestColor />;
}
function default_1(): JSX.Element {
  return (
    <DevDebug
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderColor: 'blue',
        borderWidth: 10,
        backgroundColor: 'green',
      }}
    >
      <View
        style={{
          flex: 1,
          width: 100,
          height: 100,
          backgroundColor: 'red',
        }}
      />
    </DevDebug>
  );
}
