import * as React from 'react';
import { Text, View } from 'react-native';
import { createStyleSheet } from 'react-native-chat-uikit';

export default function TestStyle() {
  React.useEffect(() => {
    const styles = createStyleSheet({
      divider: {
        width: '100%',
        height: 100,
        fontSize: 45,
        lineHeight: 45,
        borderRadius: 45,
        minWidth: '100%',
        minHeight: '100%',
        padding: '100%',
        paddingTop: '100%',
        paddingBottom: '100%',
        paddingLeft: '100%',
        paddingRight: '100%',
        margin: '100%',
        marginTop: '100%',
        marginBottom: '100%',
        marginLeft: '100%',
        marginRight: '100%',
        left: '100%',
        right: '100%',
        top: '100%',
        bottom: '100%',
      },
    });
    console.log(styles);
  }, []);

  return (
    <View>
      <Text>Result</Text>
    </View>
  );
}
