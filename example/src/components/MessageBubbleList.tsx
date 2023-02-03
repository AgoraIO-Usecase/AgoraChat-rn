import * as React from 'react';
import {
  ListRenderItem,
  ListRenderItemInfo,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  createStyleSheet,
  DynamicHeightList,
  DynamicHeightListRef,
  getScaleFactor,
  Image,
  Loading,
  LocalIcon,
  seqId,
  timestamp,
  wait,
} from 'react-native-chat-uikit';

import { DefaultAvatar } from './DefaultAvatars';

export interface MessageItemType {
  sender: string;
  timestamp: number;
  isSender?: boolean;
  key: string;
  type: 'text' | 'image' | 'voice';
  state?: 'unreaded' | 'readed' | 'arrived' | 'played' | 'sending' | 'failed';
}

export interface TextMessageItemType extends MessageItemType {
  text: string;
}

export interface ImageMessageItemType extends MessageItemType {
  image: string;
}
export interface VoiceMessageItemType extends MessageItemType {
  length: number;
}
const text1: TextMessageItemType = {
  sender: 'zs',
  timestamp: timestamp(),
  isSender: false,
  key: seqId('ml').toString(),
  text: 'Uffa, ho tanto da raccontare alla mia famiglia, ma quando chiamano loro dagli Stati Uniti io ho lezione e quando posso telefonare io loro dormono!',
  type: 'text',
  state: 'sending',
};
const text2: TextMessageItemType = {
  sender: 'zs',
  timestamp: timestamp(),
  isSender: true,
  key: seqId('ml').toString(),
  text: 'Uffa, ho tanto da raccontare alla mia famiglia, ma quando chiamano loro dagli Stati Uniti io ho lezione e quando posso telefonare io loro dormono!',
  type: 'text',
};
const image1: ImageMessageItemType = {
  sender: 'self',
  timestamp: timestamp(),
  isSender: false,
  key: seqId('ml').toString(),
  image:
    'https://t4.focus-img.cn/sh740wsh/zx/duplication/9aec104f-1380-4425-a5c6-bc03000c4332.JPEG',
  type: 'image',
};
const image2: ImageMessageItemType = {
  sender: 'self',
  timestamp: timestamp(),
  isSender: true,
  key: seqId('ml').toString(),
  image:
    'https://t4.focus-img.cn/sh740wsh/zx/duplication/9aec104f-1380-4425-a5c6-bc03000c4332.JPEG',
  type: 'image',
};
const voice1: VoiceMessageItemType = {
  sender: 'zs',
  timestamp: timestamp(),
  isSender: false,
  key: seqId('ml').toString(),
  length: 45,
  type: 'voice',
};
const voice2: VoiceMessageItemType = {
  sender: 'zs',
  timestamp: timestamp(),
  isSender: true,
  key: seqId('ml').toString(),
  length: 45,
  type: 'voice',
};
const TextMessageRenderItem: ListRenderItem<MessageItemType> = (
  info: ListRenderItemInfo<MessageItemType>
): React.ReactElement | null => {
  const sf = getScaleFactor();
  const { item } = info;
  const msg = item as TextMessageItemType;
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: msg.isSender ? 'row-reverse' : 'row',
          width: '90%',
        },
      ]}
    >
      <View
        style={[
          {
            marginRight: msg.isSender ? undefined : sf(10),
            marginLeft: msg.isSender ? sf(10) : undefined,
          },
        ]}
      >
        <DefaultAvatar size={sf(24)} radius={sf(12)} />
      </View>
      <View
        style={[
          styles.innerContainer,
          {
            borderBottomRightRadius: msg.isSender ? undefined : sf(12),
            borderBottomLeftRadius: msg.isSender ? sf(12) : undefined,
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              backgroundColor: msg.isSender ? '#0041FF' : '#F2F2F2',
              color: msg.isSender ? 'white' : '#333333',
            },
          ]}
        >
          {msg.text}
        </Text>
      </View>
      <View
        style={[
          {
            marginRight: msg.isSender ? sf(10) : undefined,
            marginLeft: msg.isSender ? undefined : sf(10),
            opacity: 1,
          },
        ]}
      >
        {msg.state === 'sending' ? (
          <Loading name="loading2" size={sf(12)} />
        ) : (
          <LocalIcon name="readed" size={sf(12)} />
        )}
      </View>
    </View>
  );
};
// height < 50%, width < 200px,
const ImageMessageRenderItem: ListRenderItem<MessageItemType> = (
  info: ListRenderItemInfo<MessageItemType>
): React.ReactElement | null => {
  const sf = getScaleFactor();
  const { item } = info;
  const msg = item as ImageMessageItemType;
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: msg.isSender ? 'row-reverse' : 'row',
          width: '80%',
        },
      ]}
    >
      <View
        style={[
          {
            marginRight: msg.isSender ? undefined : sf(10),
            marginLeft: msg.isSender ? sf(10) : undefined,
          },
        ]}
      >
        <DefaultAvatar size={sf(24)} radius={sf(12)} />
      </View>
      <View
        style={{
          height: sf(200),
          // flex: 1,
          flexGrow: 1,
        }}
      >
        <Image
          source={{
            uri: msg.image,
          }}
          resizeMode="cover"
          style={{ height: sf(200), borderRadius: sf(10) }}
          onLoad={(_) => {
            // console.log(e);
          }}
          onError={(_) => {
            // console.log(e);
          }}
        />
      </View>
      <View
        style={[
          {
            marginRight: msg.isSender ? sf(10) : undefined,
            marginLeft: msg.isSender ? undefined : sf(10),
            opacity: 1,
          },
        ]}
      >
        <LocalIcon name="readed" size={sf(12)} />
      </View>
    </View>
  );
};
const VoiceMessageRenderItem: ListRenderItem<MessageItemType> = (
  info: ListRenderItemInfo<MessageItemType>
): React.ReactElement | null => {
  const sf = getScaleFactor();
  const { item } = info;
  const { width } = useWindowDimensions();
  const msg = item as VoiceMessageItemType;
  const _width = (length: number) => {
    if (length < 0) {
      throw new Error('The voice length cannot be less than 0.');
    }
    return width * 0.7 * (1 / 60) * (length > 60 ? 60 : length);
  };
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: msg.isSender ? 'row-reverse' : 'row',
          width: _width(msg.length ?? 1),
        },
      ]}
    >
      <View
        style={[
          {
            marginRight: msg.isSender ? undefined : sf(10),
            marginLeft: msg.isSender ? sf(10) : undefined,
          },
        ]}
      >
        <DefaultAvatar size={sf(24)} radius={sf(12)} />
      </View>
      <View
        style={[
          styles.innerContainer,
          {
            flexDirection: msg.isSender ? 'row-reverse' : 'row',
            justifyContent: 'space-between',
            borderBottomRightRadius: msg.isSender ? undefined : sf(12),
            borderBottomLeftRadius: msg.isSender ? sf(12) : undefined,
            backgroundColor: msg.isSender ? '#0041FF' : '#F2F2F2',
          },
        ]}
      >
        <LocalIcon
          name={msg.isSender ? 'wave3_left' : 'wave3_right'}
          size={sf(22)}
          color={msg.isSender ? 'white' : '#A9A9A9'}
          style={{ marginHorizontal: sf(8) }}
        />
        <Text
          style={[
            styles.text,
            {
              color: msg.isSender ? 'white' : 'black',
              backgroundColor: msg.isSender ? '#0041FF' : '#F2F2F2',
            },
          ]}
        >
          {msg.length.toString() + "'"}
        </Text>
      </View>
      <View
        style={[
          {
            marginRight: msg.isSender ? sf(10) : undefined,
            marginLeft: msg.isSender ? undefined : sf(10),
            opacity: 1,
          },
        ]}
      >
        <LocalIcon name="readed" size={sf(12)} />
      </View>
    </View>
  );
};
const MessageRenderItem: ListRenderItem<MessageItemType> = (
  info: ListRenderItemInfo<MessageItemType>
): React.ReactElement | null => {
  // console.log('test:MessageRenderItem:', info.index);
  const { item } = info;
  let MessageItem: ListRenderItem<MessageItemType>;
  if (item.type === 'text') {
    MessageItem = TextMessageRenderItem;
  } else if (item.type === 'image') {
    MessageItem = ImageMessageRenderItem;
  } else if (item.type === 'voice') {
    MessageItem = VoiceMessageRenderItem;
  } else {
    throw new Error('error');
  }
  return (
    <View
      style={{
        width: '100%',
        alignItems:
          item.isSender === undefined
            ? 'center'
            : item.isSender === true
            ? 'flex-end'
            : 'flex-start',
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
type MessageBubbleListProps = {
  onPressed?: () => void;
};
const MessageBubbleList = (
  props: MessageBubbleListProps,
  ref?: React.Ref<MessageListRef>
): JSX.Element => {
  // console.log('test:MessageBubbleList:');
  const { onPressed } = props;
  const enableRefresh = true;
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<MessageItemType[]>([]);
  const listRef = React.useRef<DynamicHeightListRef>(null);
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
    items.push(text2);
    items.push(image1);
    items.push(image2);
    items.push(voice1);
    items.push(voice2);
    setLoading(false);
  }

  // console.log('test:MessageBubbleList:length:', items.length);

  const _add = React.useCallback(
    (msgs: MessageItemType[]) => {
      items.push(...msgs);
      setItems([...items]);
    },
    [items]
  );

  React.useImperativeHandle(
    ref,
    () => ({
      scrollToEnd: () => {
        listRef.current?.scrollToEnd();
      },
      scrollToTop: () => {},
      addMessage: (msgs: MessageItemType[]) => {
        // console.log('test:addMessage:', msgs.length);
        _add(msgs);
      },
    }),
    [_add]
  );

  return (
    <DynamicHeightList
      ref={listRef}
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
      onTouchEnd={onPressed}
    />
  );
};

const styles = createStyleSheet({
  container: {
    justifyContent: 'flex-start',
    // backgroundColor: 'yellow',
    alignItems: 'flex-end',
    flexDirection: 'row',
    padding: 10,
  },
  innerContainer: {
    flex: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    // backgroundColor: 'red',
    overflow: 'hidden',
  },
  text: {
    backgroundColor: 'rgba(242, 242, 242, 1)',
    padding: 10,
    flexWrap: 'wrap',
  },
});

export default React.forwardRef<MessageListRef, MessageBubbleListProps>(
  MessageBubbleList
);
