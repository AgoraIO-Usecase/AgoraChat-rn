import * as React from 'react';
import { Text } from 'react-native';
import { createStyleSheet } from 'react-native-chat-uikit';

type HeaderTitleProps = {
  name: string;
};

export default function HeaderTitle({ name }: HeaderTitleProps): JSX.Element {
  return <Text style={styles.container}>{name}</Text>;
}

const styles = createStyleSheet({
  container: {
    color: 'rgba(0, 95, 255, 1)',
    fontSize: 22,
    fontWeight: '900',
  },
});
