import * as React from 'react';
import {
  DeviceEventEmitter,
  ListRenderItemInfo,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  EqualHeightListItemData,
  LocalIcon,
  timestamp,
} from 'react-native-chat-uikit';
import { FlatList } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';

import { COUNTRY } from './const';

type ItemDataType = EqualHeightListItemData & {
  en: string;
  ch: string;
};

const Item = (item: ItemDataType) => {
  const horizontal = true;
  const bounces = false;
  // const showsVerticalScrollIndicator = false;
  const showsHorizontalScrollIndicator = false;
  // const scrollEventThrottle = 10;
  const scrollViewRef = React.useRef<ScrollView>(null);
  // const disableIntervalMomentum = true;
  // const snapToEnd = false;
  const width = 80;
  const currentX = React.useRef(0);
  const currentY = React.useRef(0);
  const startTime = React.useRef(0);
  const endTime = React.useRef(0);

  React.useEffect(() => {
    // console.log('test:Item:useEffect:');
    const subscription = DeviceEventEmitter.addListener(
      'closeEditableTest',
      (_) => {
        // console.log('test:closeEditableTest:', data);
        closeEditableTest();
      }
    );
    return () => subscription.remove();
  }, []);

  const closeEditableTest = () => {
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  };

  const _autoAlign = (moveX: number, width: number) => {
    const w = width / 2;
    if (moveX >= 0 && moveX < w) {
      scrollViewRef.current?.scrollTo({ x: 0, animated: true });
    } else {
      scrollViewRef.current?.scrollTo({ x: width, animated: true });
    }
  };

  const _onClicked = () => {
    console.log('test:_onClicked:');
    endTime.current = timestamp();
    if (endTime.current - startTime.current < 1000) {
      console.log('onPressed');
    } else {
      console.log('onLongPressed');
    }
  };

  // const responderRef = React.useRef(
  //   PanResponder.create({
  //     onMoveShouldSetPanResponderCapture: () => false,
  //     onStartShouldSetPanResponderCapture: () => false,
  //     onPanResponderStart: (e, { moveX, x0, dx, vx }) => {
  //       console.log('test:onPanResponderStart:', moveX, x0, dx, vx);
  //       // e.preventDefault();
  //     },
  //     onPanResponderMove: (e, { moveX, x0, dx, vx }) => {
  //       console.log('test:onPanResponderMove:', moveX, x0, dx, vx);
  //       // e.preventDefault();
  //     },
  //     onPanResponderRelease: (e, { moveX, x0, dx, vx }) => {
  //       console.log('test:onPanResponderRelease:', moveX, x0, dx, vx);
  //       // e.preventDefault();
  //     },
  //     // onStartShouldSetResponderCapture: (event: GestureResponderEvent) => {

  //     // };
  //   })
  // ).current;

  return (
    <View>
      <ScrollView
        ref={scrollViewRef}
        onScrollBeginDrag={(event) => {
          console.log(
            'test:onScrollBeginDrag:',
            event.nativeEvent.contentOffset
          );
          // currentX.current = event.nativeEvent.contentOffset.x;
        }}
        onScrollEndDrag={(event) => {
          console.log('test:onScrollEndDrag:', event.nativeEvent.contentOffset);
          const x = event.nativeEvent.contentOffset.x;
          _autoAlign(x, width);
        }}
        onTouchStart={(event) => {
          console.log('test:onTouchStart:2:', event.nativeEvent.locationX);
          currentX.current = event.nativeEvent.locationX;
          currentY.current = event.nativeEvent.locationY;
          startTime.current = timestamp();
        }}
        onTouchEnd={(event) => {
          console.log('test:onTouchEnd:2:');
          if (
            event.nativeEvent.locationX === currentX.current &&
            event.nativeEvent.locationY === currentY.current
          ) {
            _onClicked();
          }
        }}
        // onStartShouldSetResponderCapture={(_) => {
        //   let r = false;
        //   if (scrollViewRef.current?.scrollResponderIsAnimating()) {
        //     r = true;
        //   } else {
        //     r = false;
        //   }
        //   console.log('test:onStartShouldSetResponderCapture:', r);
        //   return r;
        // }}
        bounces={bounces}
        horizontal={horizontal}
        // scrollEventThrottle={scrollEventThrottle}
        // showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        // disableIntervalMomentum={disableIntervalMomentum}
        // snapToEnd={snapToEnd}
        // pointerEvents="box-only"
        style={{ width: 300, backgroundColor: 'purple', height: 40 }}
      >
        <View
          style={{
            backgroundColor: 'green',
            width: 300,
            height: 80,
            borderColor: 'grey',
            borderWidth: 1,
          }}
          // {...responderRef.panHandlers}
          // onStartShouldSetResponderCapture={(_) => {
          //   return false;
          // }}
          // onTouchStart={() => {
          //   console.log('test:onTouchStart:1:');
          // }}
        >
          <Text>{item.en}</Text>
          <Text>{item.ch}</Text>
        </View>
        <View style={{ width: width }}>
          <LocalIcon name="delete" />
        </View>
      </ScrollView>
    </View>
  );
};

const RenderItem = (info: ListRenderItemInfo<ItemDataType>) => {
  const item = info.item as ItemDataType;
  return <Item {...item} />;
};

export default function TestListItem() {
  const [icon, setIcon] = React.useState(false);

  // React.useEffect(() => {
  //   console.log('test:Item:useEffect:2:');
  //   const subscription = DeviceEventEmitter.addListener(
  //     'closeEditableTest',
  //     (data) => {
  //       console.log('test:closeEditableTest:', data);
  //       // closeEditableTest();
  //     }
  //   );
  //   return () => subscription.remove();
  // }, []);

  const horizontal = true;
  const bounces = false;
  const data: ItemDataType[] = [];
  const r = COUNTRY.map((value) => {
    const i = value.lastIndexOf(' ');
    const en = value.slice(0, i);
    const ch = value.slice(i + 1);
    return {
      key: en,
      en: en,
      ch: ch,
    } as ItemDataType;
  });
  data.push(...r);

  return (
    <View style={{ marginTop: 100, flex: 1 }}>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            console.log(icon);
            setIcon(!icon);
          }}
        >
          change icon
        </Button>
      </View>
      <View>
        <ScrollView
          bounces={bounces}
          horizontal={horizontal}
          // pointerEvents="box-only"
          style={{ width: 300, backgroundColor: 'purple', height: 40 }}
        >
          <View
            style={{
              backgroundColor: 'green',
              // width: 350,
              height: 60,
              borderColor: 'grey',
              borderWidth: 1,
              flexDirection: 'row',
            }}
          >
            <Text>item.en</Text>
            <Text>item.ch</Text>
            <Text>item.en</Text>
            <Text>item.ch</Text>
            <Text>item.en</Text>
            <Text>item.ch</Text>
            <Text>item.en</Text>
            <Text>item.ch</Text>
            <Text>item.en</Text>
            <Text>item.ch</Text>
            <Text>item.en</Text>
            <Text>item.ch</Text>
          </View>
        </ScrollView>
      </View>
      <FlatList
        onScrollBeginDrag={(event) => {
          console.log(
            'test:onScrollBeginDrag:',
            event.nativeEvent.contentOffset
          );
          DeviceEventEmitter.emit('closeEditableTest', {
            x: event.nativeEvent.contentOffset.x,
          });
        }}
        // pointerEvents="box-none"
        style={{ backgroundColor: 'blue' }}
        data={data}
        renderItem={RenderItem}
      />
    </View>
  );
}
