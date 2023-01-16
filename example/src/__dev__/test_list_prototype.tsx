import * as React from 'react';
import {
  Animated,
  FlatList,
  PanResponder,
  PanResponderInstance,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Button, LoadingRN } from 'react-native-chat-uikit';

import { COUNTRY } from './const';

const Item = (item: ItemType): JSX.Element => {
  // console.log('test:', id, first);
  return (
    <View
      style={[styles.item]}
      onLayout={(e) => {
        // console.log('test:item:target:', e.nativeEvent.target);
        // callback?.(Math.round(e.nativeEvent.layout.height));
        item.height = Math.round(e.nativeEvent.layout.height);
      }}
    >
      <Text style={styles.title}>{item.en}</Text>
      <Text style={styles.title}>{item.ch}</Text>
    </View>
  );
};

const renderItem = ({ item }: { item: ItemType }) => {
  console.log('test:renderItem:', item.en);
  return (
    <Item
      en={item.en}
      ch={item.ch}
      id={item.id}
      first={item.first}
      callback={item.callback}
    />
  );
};

const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

let count = 0;
export default function TestListPrototype() {
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isMoving, setIsMoving] = React.useState(false);
  const initY = React.useRef(new Animated.Value(0)).current;
  const { height } = useWindowDimensions();
  const ref = React.useRef<FlatList>(null);
  // const [itemHeight, setItemHeight] = React.useState(0);
  const [lastChar, setLastChar] = React.useState('');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // setTimeout(() => setRefreshing(false), 2000);
    wait(2000).then(() => setRefreshing(false));
    return <LoadingRN size="large" />;
  }, []);

  const initData = (): ItemType[] => {
    const obj = {} as any;
    return COUNTRY.map((item, index) => {
      const i = item.lastIndexOf(' ');
      const en = item.slice(0, i);
      const ch = item.slice(i + 1);
      let first = false;
      if (obj[en.slice(0, 1)]) {
        first = false;
      } else {
        first = true;
        obj[en.slice(0, 1)] = true;
      }
      return { id: index, en: en, ch: ch, first: first } as ItemType;
    });
  };

  const usePanResponder = (
    translateY: Animated.Value
  ): PanResponderInstance => {
    return React.useRef(
      PanResponder.create({
        onMoveShouldSetPanResponderCapture: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onPanResponderStart: (e, { moveY, y0, dy }) => {
          setIsMoving(true);
          dy >= 0 && translateY.setValue(dy);
          console.log('test:start:y:', dy, y0, moveY);
          console.log(
            'test:start:c',
            calculateIndex(y0),
            getChar(calculateIndex(y0))
          );
          const c = getChar(calculateIndex(y0));
          if (c) jumpToItem(c);
          e.preventDefault();
        },
        onPanResponderMove: (e, { moveY, y0, dy }) => {
          setIsMoving(true);
          dy >= 0 && translateY.setValue(dy);
          console.log('test:move:y:', dy, y0, moveY);
          const c = getChar(calculateIndex(moveY));
          if (c) jumpToItem(c);
          e.preventDefault();
        }, // Animated.event([null, { dy: translateY }], { useNativeDriver: false }),
        onPanResponderRelease: (e, { moveY, y0, dy }) => {
          setIsMoving(false);
          dy >= 0 && translateY.setValue(dy);
          console.log('test:release:y:', dy, y0, moveY);
          e.preventDefault();
        },
      })
    ).current;
  };

  const padding = 100;
  const calculateIndex = (y0: number): number => {
    const AZH = height - 2 * padding;
    const unitH = AZH / (AZ.length - 1);
    const index = Math.round((y0 - padding) / unitH);
    return index;
  };
  const getChar = (index: number) => {
    return AZ[index];
  };

  const [data, setData] = React.useState<ItemType[]>([]);
  const panResponder = usePanResponder(initY);

  if (loading) {
    const d = initData();
    setData(d);
    setLoading(false);
  }

  // const refff = React.useRef<View>();

  const jumpToItem = (char: string) => {
    if (char) setLastChar(char);
    for (const item of data) {
      const first = item.first;
      const en = item.en[0];
      if (first === true && char === en) {
        console.log('test:jumpToItem:', item);
        ref.current?.scrollToIndex({ animated: true, index: item?.id! });
        break;
      }
    }
    // for (let index = 0; index < data.length; index++) {
    //   const element = data[index];
    //   ref.current?.scrollToIndex({ animated: true, index: element?.id! });
    //   break;
    // }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button
        onPress={() => {
          if (data.length > 0) {
            const last = data[data.length - 1] as ItemType;
            const v = last.en + (count++).toString();
            const d = {
              id: last.id + 1,
              en: v,
              ch: v,
              height: 79.666,
            };
            data.push(d as ItemType);
            setData([...data]);
          } else {
            const id = count;
            const v = 'zuoyu' + (count++).toString();
            const d = {
              id: id,
              en: v,
              ch: v,
              height: 79.666,
            };
            setData([d as ItemType]);
          }
        }}
      >
        add item
      </Button>
      <Button
        onPress={() => {
          if (data.length > 0) {
            setData([]);
          }
        }}
      >
        clear
      </Button>
      <FlatList
        ref={ref}
        data={data}
        extraData={data}
        renderItem={renderItem}
        onLayout={(e) => {
          console.log('test:list:height:', e.nativeEvent.layout.height);
        }}
        getItemLayout={(item, index) => {
          const height = item?.[index]?.height as number | undefined;
          // console.log('test:getItemLayout:height:', height);
          const h = height ? height : 79.666 + 20;
          // console.log('test:-------', h);
          const r = {
            length: h,
            offset: h * index,
            index: index,
          };
          // console.log('test:getItemLayout:', r);
          return r;
        }}
        keyExtractor={(item) => {
          // console.log('test:index:id:', index, item.id);
          // item.id = index;
          return item.id.toString();
        }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={(info) => {
          console.log('test:info:', info.distanceFromEnd);
        }}
        // stickyHeaderIndices={[0]}
      />
      <Animated.View
        style={styles.alphabetContainer}
        pointerEvents="box-none"
        {...panResponder.panHandlers}
      >
        <Pressable
          pointerEvents="box-only"
          style={{
            flex: 1,
            width: 25,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'blue',
          }}
        >
          {AZ.split('').map((char) => {
            return (
              <Text
                style={[
                  styles.alphabetItem,
                  {
                    backgroundColor: lastChar === char ? 'red' : 'green',
                  },
                ]}
                key={char}
              >
                {char}
              </Text>
            );
          })}
        </Pressable>
      </Animated.View>
      {isMoving && (
        <View style={styles.char}>
          <Text>{lastChar}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
  },
  alphabetContainer: {
    position: 'absolute',
    right: 0,
    top: 100,
    bottom: 100,
    width: 40,
    // height: '100%',
    margin: 0,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    direction: 'rtl',
  },
  alphabetItem: {
    width: 10,
    flex: 1,
    display: 'flex',
    fontSize: 14,
    backgroundColor: 'green',
  },
  char: {
    flex: 1,
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'gray',
    borderRadius: 6,
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 50,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

type ItemType = {
  id: number;
  en: string;
  ch: string;
  first: boolean;
  callback?: (height: number) => void;
  height?: number;
};

const AZ = '*ABCDEFGHIJKLMNOPQRSTUVWXYZ#';
