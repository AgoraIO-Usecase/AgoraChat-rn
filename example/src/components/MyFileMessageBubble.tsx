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
  FileMessageItemType,
  getScaleFactor,
  Image,
  localLocalIcon,
  MessageItemType,
  StateLabel,
} from 'react-native-chat-uikit';

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

export const MyFileMessageBubble: ListRenderItem<MessageItemType> = React.memo(
  (info: ListRenderItemInfo<MessageItemType>): React.ReactElement | null => {
    const sf = getScaleFactor();
    const { width: screenWidth } = useWindowDimensions();
    const { item } = info;
    const msg = item as FileMessageItemType;
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
          <View style={styles.file}>
            {msg.isSender ? (
              <View>
                <Image
                  source={localLocalIcon('file_doc')}
                  style={{ height: 36, width: 36 }}
                />
              </View>
            ) : null}
            <View>
              <Text
                numberOfLines={1}
                style={[
                  {
                    fontSize: sf(15),
                    fontWeight: '600',
                    lineHeight: sf(22),
                    color: '#333333',
                    maxWidth: screenWidth * 0.6,
                  },
                ]}
              >
                {msg.displayName}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  {
                    fontSize: sf(12),
                    fontWeight: '400',
                    lineHeight: sf(20),
                    color: '#666666',
                    maxWidth: screenWidth * 0.6,
                  },
                ]}
              >
                {msg.fileSize}
              </Text>
            </View>

            {msg.isSender ? null : (
              <View>
                <Image
                  source={localLocalIcon('file_doc')}
                  style={{ height: 36, width: 36 }}
                />
              </View>
            )}
          </View>
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
  file: {
    flexDirection: 'row',
    backgroundColor: 'rgba(242, 242, 242, 1)',
    padding: 10,
  },
});
