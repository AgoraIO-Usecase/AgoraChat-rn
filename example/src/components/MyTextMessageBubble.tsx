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
  MessageItemType,
  StateLabel,
  TextMessageItemType,
} from 'react-native-chat-uikit';

const RenderRecallMessage = (props: MessageItemType): JSX.Element => {
  const { state, ext, ...others } = props;
  if (state === ('' as any)) console.log(others);
  const tip = ext.recall_content;
  return (
    <View
      style={{
        // flex: 1,
        height: 30,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#A6A6A6' }}>{tip}</Text>
    </View>
  );
};

const RenderTipMessage = (props: MessageItemType): JSX.Element => {
  const { state, ext, ...others } = props;
  if (state === ('' as any)) console.log(others);
  const tip = ext.tip_content;
  return (
    <View
      style={{
        flex: 1,
        height: 30,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ flex: 1, color: '#A6A6A6' }}>{tip}</Text>
    </View>
  );
};

export const MyTextMessageBubble: ListRenderItem<MessageItemType> = React.memo(
  (info: ListRenderItemInfo<MessageItemType>): React.ReactElement | null => {
    const sf = getScaleFactor();
    const { width: screenWidth } = useWindowDimensions();
    const { item } = info;
    const msg = item as TextMessageItemType;
    if (msg.ext && msg.ext.type === 'recall') {
      return <RenderRecallMessage {...item} />;
    } else if (msg.ext && msg.ext.type === 'time') {
      return <RenderTipMessage {...item} />;
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
          <DefaultAvatar id={msg.sender} size={sf(24)} radius={sf(12)} />
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
