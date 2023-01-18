import * as React from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LoadingRN } from 'react-native-chat-uikit';

type ItemData = {
  id: string;
  title: string;
};

const DATA: ItemData[] = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

const Item = ({ title, id }: { title: string; id: string }): JSX.Element => (
  <View
    style={[
      styles.item,
      {
        height: id === '3ac68afc-c605-48d3-a4f8-fbd91aa97f63' ? 100 : undefined,
      },
    ]}
  >
    <Text style={styles.title}>{title}</Text>
  </View>
);

const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export default function TestList() {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // setTimeout(() => setRefreshing(false), 2000);
    wait(2000).then(() => setRefreshing(false));
    return <LoadingRN size="large" />;
  }, []);

  const renderItem = ({ item }: { item: ItemData }) => (
    <Item title={item.title} id={item.id} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={(info) => {
          console.log('test:onEndReached:', info);
        }}
        stickyHeaderIndices={[0]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
