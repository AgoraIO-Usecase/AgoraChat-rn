import * as React from 'react';
import { SafeAreaView, Text } from 'react-native';

type Props = {
  content: string;
};

export default function Placeholder(props: Props): JSX.Element {
  return (
    <SafeAreaView>
      <Text style={{ color: '#ff00ff' }}>{props.content}</Text>
    </SafeAreaView>
  );
}
