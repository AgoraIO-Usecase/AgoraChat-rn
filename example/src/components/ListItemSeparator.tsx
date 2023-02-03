import * as React from 'react';
import { View } from 'react-native';
import { createStyleSheet, Divider } from 'react-native-chat-uikit';

export const ListItemSeparator = () => {
  return (
    <View>
      <Divider color={styles.divider.color} height={styles.divider.height} />
    </View>
  );
};

const styles = createStyleSheet({
  divider: {
    color: 'rgba(153, 153, 153, 1)',
    height: 0.25,
    marginLeft: 100,
  },
});
