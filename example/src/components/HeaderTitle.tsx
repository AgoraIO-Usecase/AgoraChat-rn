import * as React from 'react';
import { Text } from 'react-native';

type HeaderTitleProps = {
  name: string;
};

export default function HeaderTitle({ name }: HeaderTitleProps): JSX.Element {
  return (
    <Text
      style={{
        color: 'rgba(0, 95, 255, 1)',
        fontSize: 22,
        fontWeight: '900',
      }}
    >
      {name}
    </Text>
  );
}
