import * as React from 'react';
import {
  ListRenderItem,
  ListRenderItemInfo,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {
  DynamicHeightList,
  Image,
  seqId,
  timestamp,
  wait,
} from 'react-native-chat-uikit';

import { DefaultAvatar } from './DefaultAvatars';

export interface MessageItemType {
  sender: string;
  timestamp: number;
  isSender: boolean;
  key: string;
  type: 'text' | 'image';
}

export interface TextMessageItemType extends MessageItemType {
  text: string;
  style: StyleProp<TextStyle>;
}

export interface ImageMessageItemType extends MessageItemType {
  image: string;
  style: StyleProp<ViewStyle>;
}
const text1: TextMessageItemType = {
  sender: 'zs',
  timestamp: timestamp(),
  isSender: false,
  key: seqId('ml').toString(),
  style: {
    // backgroundColor: 'yellow',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '66%',
    // height: 80,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: 'Uffa, ho tanto da raccontare alla mia famiglia, ma quando chiamano loro dagli Stati Uniti io ho lezione e quando posso telefonare io loro dormono!',
  type: 'text',
};
const image2: ImageMessageItemType = {
  sender: 'self',
  timestamp: timestamp(),
  isSender: true,
  key: seqId('ml').toString(),
  style: {
    // backgroundColor: 'purple',
    alignSelf: 'flex-end',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '50%',
    // height: 160,
    flexDirection: 'row-reverse',
  },
  image:
    'https://t4.focus-img.cn/sh740wsh/zx/duplication/9aec104f-1380-4425-a5c6-bc03000c4332.JPEG',
  type: 'image',
};
const TextMessageRenderItem: ListRenderItem<MessageItemType> = (
  info: ListRenderItemInfo<MessageItemType>
): React.ReactElement | null => {
  const { item } = info;
  const msg = item as TextMessageItemType;
  return (
    <View style={[msg.style]}>
      <View style={{ alignSelf: 'flex-end', marginRight: 5, marginLeft: 10 }}>
        <DefaultAvatar size={24} radius={12} />
      </View>
      <View
        style={{
          flex: 1,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderBottomEndRadius: 10,
          // backgroundColor: 'red',
          overflow: 'hidden',
        }}
      >
        <Text
          style={{
            backgroundColor: 'rgba(242, 242, 242, 1)',
            padding: 10,
          }}
        >
          {msg.text}
        </Text>
      </View>
    </View>
  );
};
// height < 50%, width < 200px,
const ImageMessageRenderItem: ListRenderItem<MessageItemType> = (
  info: ListRenderItemInfo<MessageItemType>
): React.ReactElement | null => {
  const { item } = info;
  const msg = item as ImageMessageItemType;
  return (
    <View style={msg.style}>
      <View style={{ alignSelf: 'flex-end', marginRight: 5, marginLeft: 10 }}>
        <DefaultAvatar size={24} radius={12} />
      </View>
      <Image
        source={{
          uri: msg.image,
        }}
        resizeMode="cover"
        style={{ flex: 1, height: 200, borderRadius: 10 }}
        onLoad={(e) => {
          console.log(e);
        }}
        onError={(e) => {
          console.log(e);
        }}
      />
    </View>
  );
};
const MessageRenderItem: ListRenderItem<MessageItemType> = (
  info: ListRenderItemInfo<MessageItemType>
): React.ReactElement | null => {
  console.log('test:MessageRenderItem:', info.index);
  const { item } = info;
  let MessageItem: ListRenderItem<MessageItemType>;
  if (item.type === 'text') {
    MessageItem = TextMessageRenderItem;
  } else if (item.type === 'image') {
    MessageItem = ImageMessageRenderItem;
  } else {
    throw new Error('error');
  }
  return (
    <View
      style={{
        // backgroundColor: 'green',
        // borderBottomColor: 'blue',
        // borderWidth: 1,
        marginVertical: 4,
      }}
    >
      <MessageItem {...info} />
    </View>
  );
};
export type MessageListRef = {
  scrollToEnd: () => void;
  scrollToTop: () => void;
  addMessage: (msg: MessageItemType[]) => void;
};
type Props = {};
const MessageList = (
  _: Props,
  ref?: React.Ref<MessageListRef>
): JSX.Element => {
  console.log('test:MessageList:');
  const enableRefresh = true;
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<MessageItemType[]>([]);
  // const items = React.useMemo(() => {
  //   return _items;
  // }, [_items]);
  // for (let index = 0; index < 100; index++) {
  //   const element: MessageItemType = { key: index.toString() };
  //   items.push(element);
  // }
  if (loading) {
    items.length = 0;
    items.push(text1);
    items.push(image2);
    setLoading(false);
  }

  console.log('test:MessageList:length:', items.length);

  const _add = React.useCallback(
    (msgs: MessageItemType[]) => {
      items.push(...msgs);
      console.log('test:_add:', items.length);
      setItems([...items]);
    },
    [items]
  );

  React.useImperativeHandle(
    ref,
    () => ({
      scrollToEnd: () => {},
      scrollToTop: () => {},
      addMessage: (msgs: MessageItemType[]) => {
        console.log('test:addMessage:', msgs.length);
        _add(msgs);
        // items.push({
        //   sender: 'zs',
        //   timestamp: timestamp(),
        //   isSender: false,
        //   key: seqId('ml').toString(),
        //   style: {
        //     backgroundColor: 'yellow',
        //     justifyContent: 'flex-start',
        //     alignItems: 'center',
        //     width: '66%',
        //     // height: 80,
        //     flexDirection: 'row',
        //     flexWrap: 'wrap',
        //   },
        //   text: 'test',
        //   type: 'text',
        // } as TextMessageItemType);
      },
    }),
    [_add]
  );

  return (
    <DynamicHeightList
      items={items}
      extraData={items}
      RenderItemFC={MessageRenderItem}
      enableRefresh={enableRefresh}
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        _add([
          {
            sender: 'zs',
            timestamp: timestamp(),
            isSender: false,
            key: seqId('ml').toString(),
            style: {
              // backgroundColor: 'yellow',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '66%',
              // height: 80,
              flexDirection: 'row',
              flexWrap: 'wrap',
            },
            text: 'test',
            type: 'text',
          } as TextMessageItemType,
        ]);
        wait(1500)
          .then(() => {
            setRefreshing(false);
          })
          .catch();
      }}
      keyExtractor={(_: any, index: number) => {
        return index.toString();
      }}
    />
  );
};

export default React.forwardRef<MessageListRef, Props>(MessageList);
