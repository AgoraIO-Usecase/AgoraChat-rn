import * as React from 'react';
import { Text } from 'react-native';

export default function TestColor(_params: any): JSX.Element {
  test_1();
  return <Text>hello</Text>;
}

function test_1(): void {
  const sf_color = {
    primary: 'red',
  };
  const my_color = {
    ...sf_color,
    primary: 'blue',
  };
  console.log(my_color);
}
