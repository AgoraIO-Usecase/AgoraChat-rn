import * as React from 'react';
import { FlatList, Text, TouchableHighlight, View } from 'react-native';
import { Divider } from 'react-native-chat-uikit';

export default function TestDivider() {
  return (
    <View style={{ marginTop: 100 }}>
      <FlatList
        ItemSeparatorComponent={() => {
          return <Divider />;
        }}
        data={[
          { title: 'Title Text', key: 'item1' },
          { title: 'Title Text', key: 'item2' },
          { title: 'Title Text', key: 'item3' },
        ]}
        renderItem={({ item, index, separators }) => (
          <TouchableHighlight
            onPress={() => {
              console.log(index);
            }}
            onShowUnderlay={separators.highlight}
            onHideUnderlay={separators.unhighlight}
          >
            <View style={{ backgroundColor: 'white' }}>
              <Text>{item.title}</Text>
            </View>
          </TouchableHighlight>
        )}
      />
    </View>
  );
}
