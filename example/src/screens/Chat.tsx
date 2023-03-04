import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter } from 'react-native';
import { ChatMessageType } from 'react-native-chat-sdk';
import { ScreenContainer } from 'react-native-chat-uikit';

import { CustomMessageRenderItem } from '../components/CustomMessageBubble';
import { HomeEvent, HomeEventType } from '../events';
import ChatFragment from '../fragments/Chat';
import type {
  ImageMessageItemType,
  MessageBubbleListProps,
  MessageItemType,
} from '../fragments/MessageBubbleList';
import MessageBubbleList from '../fragments/MessageBubbleList';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

// type NavigationProp = NativeStackNavigationProp<
//   RootScreenParamsList<RootParamsList, 'option'>,
//   'Chat',
//   undefined
// >;

export default function ChatScreen({ route, navigation }: Props): JSX.Element {
  console.log('test:ChatScreen:');
  const rp = route.params as any;
  const params = rp?.params as { chatId: string; chatType: number };
  const chatId = params.chatId;
  const messageBubbleListRefP = React.useRef<typeof MessageBubbleList>(null);

  const onItemPress = React.useCallback(
    (data: MessageItemType) => {
      if (data.type === ChatMessageType.IMAGE) {
        const imageData = data as ImageMessageItemType;
        const url = imageData.remoteUrl;
        const localPath = imageData.localPath;
        navigation.push('ImagePreview', {
          params: { url: url ?? '', localPath: localPath ?? '' },
        });
      }
    },
    [navigation]
  );

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: chatId,
    });
  }, [chatId, navigation]);

  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={route.params as any}
        messageBubbleList={{
          MessageBubbleListP: MessageBubbleList,
          MessageBubbleListPropsP: {
            onPressed: () => {},
          } as MessageBubbleListProps,
          MessageBubbleListRefP: messageBubbleListRefP as any,
        }}
        onFace={() => {}}
        customMessageBubble={{
          CustomMessageRenderItemP: CustomMessageRenderItem,
        }}
        onUpdateReadCount={(unreadCount) => {
          DeviceEventEmitter.emit(HomeEvent, {
            type: 'update_all_count' as HomeEventType,
            params: { count: unreadCount },
          });
        }}
        onItemPress={onItemPress}
      />
    </ScreenContainer>
  );
}