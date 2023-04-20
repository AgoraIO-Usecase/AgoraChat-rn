import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStyleSheet,
  DefaultAvatar,
  getScaleFactor,
  MessageItemType,
  StateLabel,
} from 'react-native-chat-uikit';

export const CustomMessageRenderItem = React.memo(
  ({
    data,
    ...others
  }: MessageItemType & {
    eventType: string;
    data: any;
  }): React.ReactElement | null => {
    const sf = getScaleFactor();
    const msg = others;
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
            {data.toString()}
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
