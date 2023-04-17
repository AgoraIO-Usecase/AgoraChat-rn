import React from 'react';
import {
  type ListRenderItem,
  type ListRenderItemInfo,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  createStyleSheet,
  DefaultAvatar,
  getScaleFactor,
  Loading,
  LocalIcon,
  LocalIconName,
  MessageItemStateType,
  MessageItemType,
  TextMessageItemType,
} from 'react-native-chat-uikit';

const convertState = (state?: MessageItemStateType): LocalIconName => {
  let r = 'sent' as LocalIconName;
  switch (state) {
    case 'arrived':
      r = 'read';
      break;
    case 'failed':
      r = 'ex_mark';
      break;
    case 'sending':
      r = 'loading2';
      break;
    default:
      break;
  }
  return r;
};

const StateLabel = React.memo(({ state }: { state?: MessageItemStateType }) => {
  const sf = getScaleFactor();
  if (state === 'sending') {
    return <Loading name={convertState(state)} size={sf(12)} />;
  } else {
    return <LocalIcon name={convertState(state)} size={sf(12)} />;
  }
});

const RenderRecallMessage = (props: MessageItemType): JSX.Element => {
  const { state, ext, ...others } = props;
  if (state === ('' as any)) console.log(others);
  if (state === 'recalled') {
    const tip = ext.recall.tip;
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>{tip}</Text>
      </View>
    );
  }
  return <View />;
};

export const MyTextMessageBubble: ListRenderItem<MessageItemType> = React.memo(
  (info: ListRenderItemInfo<MessageItemType>): React.ReactElement | null => {
    const sf = getScaleFactor();
    const { width: screenWidth } = useWindowDimensions();
    const { item } = info;
    const msg = item as TextMessageItemType;
    if (item.state === 'recalled') {
      return <RenderRecallMessage {...item} />;
    }
    return (
      <View
        style={[
          styles.container,
          {
            flexDirection: msg.isSender ? 'row-reverse' : 'row',
            maxWidth: screenWidth * 0.9,
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
              maxWidth: screenWidth * 0.7,
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
          <StateLabel state={msg.state} />
        </View>
      </View>
    );
  }
);

const styles = createStyleSheet({
  container: {
    justifyContent: 'flex-start',
    // backgroundColor: 'yellow',
    alignItems: 'flex-end',
    flexDirection: 'row',
    padding: 10,
  },
  innerContainer: {
    // flex: 1,
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
