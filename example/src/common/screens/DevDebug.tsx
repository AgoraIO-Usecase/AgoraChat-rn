import * as React from 'react';
import { SafeAreaView, View, ViewProps } from 'react-native';

type Props = ViewProps & {
  children: React.ReactNode;
};

export default function DevDebug(props: Props): JSX.Element {
  // return <View {...props} />;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View {...props} />
    </SafeAreaView>
  );
}
