import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter, Platform } from 'react-native';
import {
  type AudioSet,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
} from 'react-native-audio-recorder-player';
import {
  ChatConversationType,
  ChatMessage,
  ChatMessageType,
} from 'react-native-chat-sdk';
import {
  ChatFragment,
  ChatFragmentRef,
  DataEventType,
  getFileExtension,
  ImageMessageItemType,
  localUrl,
  MessageBubbleListFragment,
  MessageBubbleListProps,
  MessageItemType,
  playUrl,
  ScreenContainer,
  Services,
  uuid,
  VoiceMessageItemType,
} from 'react-native-chat-uikit';

import { CustomMessageRenderItem } from '../components/CustomMessageBubble';
import { MyFileMessageBubble } from '../components/MyFileMessageBubble';
import { MyTextMessageBubble } from '../components/MyTextMessageBubble';
import { MyVideoMessageBubble } from '../components/MyVideoMessageBubble';
import { useAppChatSdkContext } from '../contexts/AppImSdkContext';
import type { BizEventType, DataActionEventType } from '../events';
import { sendEvent, sendEventProps } from '../events/sendEvent';
// import ChatFragment, { ChatFragmentRef } from '../fragments/Chat';
// import type {
//   ImageMessageItemType,
//   MessageBubbleListProps,
//   MessageItemType,
//   VoiceMessageItemType,
// } from '../fragments/MessageBubbleListFragment';
// import MessageBubbleListFragment from '../fragments/MessageBubbleListFragment';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

// type NavigationProp = NativeStackNavigationProp<
//   RootScreenParamsList<RootParamsList, 'option'>,
//   'Chat',
//   undefined
// >;

const sendEventFromChat = (
  params: Omit<sendEventProps, 'senderId' | 'timestamp' | 'eventBizType'>
) => {
  sendEvent({
    ...params,
    senderId: 'Chat',
    eventBizType: 'chat',
  } as sendEventProps);
};

export default function ChatScreen({ route, navigation }: Props): JSX.Element {
  console.log('test:ChatScreen:');
  const rp = route.params as any;
  const params = rp?.params as { chatId: string; chatType: number };
  const chatId = params.chatId;
  const chatType = params.chatType as ChatConversationType;
  const messageBubbleListRefP =
    React.useRef<typeof MessageBubbleListFragment>(null);
  const chatRef = React.useRef<ChatFragmentRef>({} as any);
  const { client } = useAppChatSdkContext();

  const onClickMessageBubble = React.useCallback(
    (data: MessageItemType) => {
      const eventParams = data;
      if (eventParams.type === ChatMessageType.VOICE) {
        const voice = eventParams as VoiceMessageItemType;
        if (voice.localPath) {
          Services.ms
            .playAudio({
              url: playUrl(voice.localPath),
              onPlay({ isMuted, currentPosition, duration }) {
                console.log('test:onPlay', isMuted, currentPosition, duration);
              },
            })
            .then(() => {
              console.log('test:playAudio:finish:');
            })
            .catch((error) => {
              console.warn('test:error:', error);
            });
        }
      } else if (eventParams.type === ChatMessageType.IMAGE) {
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

  const onClickInputMoreButton = React.useCallback(() => {
    sendEventFromChat({
      eventType: 'SheetEvent',
      action: 'open_input_extension',
      params: {},
    });
  }, []);

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: chatId,
    });
  }, [chatId, navigation]);

  const addListeners = React.useCallback(() => {
    const sub = DeviceEventEmitter.addListener(
      'DataEvent' as DataEventType,
      async (event) => {
        const { action, params } = event as {
          eventBizType: BizEventType;
          action: DataActionEventType;
          senderId: string;
          params: any;
          timestamp?: number;
        };
        switch (action) {
          case 'chat_open_camera':
            Services.ms
              .openCamera({})
              .then((result) => {
                console.log('openCamera:', Platform.OS, result);
                // chatRef.current?.sendImageMessage([result as any]);
              })
              .catch((error) => {
                console.warn('error:', error);
              });
            break;
          case 'chat_open_document':
            {
              const ret = await Services.ps.hasMediaLibraryPermission();
              if (ret === false) {
                await Services.ps.requestMediaLibraryPermission();
              }
              Services.ms
                .openDocument({})
                .then((result) => {
                  console.log('openDocument:', Platform.OS, result);
                  chatRef.current?.sendFileMessage({
                    localPath: result?.uri ?? '',
                    fileSize: result?.size ?? 0,
                    displayName: result?.name,
                    onResult: (result) => {
                      console.log('openDocument:result', result);
                    },
                  });
                })
                .catch((error) => {
                  console.warn('error:', error);
                });
            }

            break;
          case 'chat_open_media_library':
            Services.ms
              .openMediaLibrary({ selectionLimit: 1 })
              .then((result) => {
                console.log('openMediaLibrary:', Platform.OS, result);
                chatRef.current?.sendImageMessage(
                  result.map((value) => {
                    return {
                      name: value?.name ?? '',
                      localPath: value?.uri ?? '',
                      fileSize: value?.size ?? 0,
                      imageType: value?.type ?? '',
                      width: value?.width ?? 0,
                      height: value?.height ?? 0,
                      onResult: (result) => {
                        console.log('openMediaLibrary:result:', result);
                      },
                    };
                  })
                );
              })
              .catch((error) => {
                console.warn('error:', error);
              });
            break;
          case 'delete_local_message':
            chatRef.current?.deleteLocalMessage({
              ...params,
              onResult: (result) => {
                console.log('delete_local_message:', result);
              },
            });
            break;
          case 'resend_message':
            chatRef.current?.resendMessage({
              ...params,
              onResult: (result) => {
                console.log('resend_message:', result);
              },
            });
            break;
          // case 'recall_message':
          //   chatRef.current?.recallMessage({
          //     ...params,
          //     onResult: (result) => {
          //       console.log('recall_message:', result);
          //     },
          //   });
          //   break;

          default:
            break;
        }
      }
    );
    return () => {
      sub.remove();
    };
  }, []);

  const onPressInInputVoiceButton = React.useCallback(() => {
    sendEventFromChat({
      eventType: 'VoiceStateEvent',
      action: 'enable_voice',
      params: {},
    });
    // !!! The simulator will crash.
    Services.ms
      .startRecordAudio({
        audio: {
          AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
          AudioSourceAndroid: AudioSourceAndroidType.MIC,
          AVModeIOS: AVModeIOSOption.measurement,
          AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
          AVNumberOfChannelsKeyIOS: 2,
          AVFormatIDKeyIOS: AVEncodingOption.aac,
        } as AudioSet,
        onPosition: (pos) => {
          console.log('test:startRecordAudio:pos:', pos);
        },
        onFailed: (error) => {
          console.warn('test:startRecordAudio:onFailed:', error);
        },
        onFinished: ({ result, path, error }) => {
          console.log('test:startRecordAudio:onFinished:', result, path, error);
        },
      })
      .then((result) => {
        console.log('test:startRecordAudio:result:', result);
      })
      .catch((error) => {
        console.warn('test:startRecordAudio:error:', error);
      });
  }, []);
  const onVoiceRecordEnd = React.useCallback((params: any) => {
    chatRef.current.sendVoiceMessage(params);
  }, []);
  const onPressOutInputVoiceButton = React.useCallback(() => {
    sendEventFromChat({
      eventType: 'VoiceStateEvent',
      action: 'disable_voice',
      params: {},
    });
    let localPath = localUrl(Services.dcs.getFileDir(chatId, uuid()));
    Services.ms
      .stopRecordAudio()
      .then((result?: { pos: number; path: string }) => {
        if (result?.path) {
          const extension = getFileExtension(result.path);
          console.log('test:extension:', extension);
          localPath = localPath + extension;
          Services.ms
            .saveFromLocal({
              targetPath: localPath,
              localPath: result.path,
            })
            .then(() => {
              onVoiceRecordEnd?.({
                localPath,
                duration: result.pos / 1000,
              });
            })
            .catch((error) => {
              console.warn('test:startRecordAudio:save:error', error);
            });
        }
      })
      .catch((error) => {
        console.warn('test:stopRecordAudio:error:', error);
      });
  }, [chatId, onVoiceRecordEnd]);
  const onLongPressMessageBubble = React.useCallback(
    (data) => {
      sendEventFromChat({
        eventType: 'ActionMenuEvent',
        action: 'long_press_message_bubble',
        params: { ...data, convId: chatId, convType: chatType },
      });
    },
    [chatId, chatType]
  );
  const onSendMessage = React.useCallback((message: ChatMessage) => {
    sendEventFromChat({
      eventType: 'DataEvent',
      action: 'on_send_before',
      params: { message },
    });
  }, []);
  const onSendMessageEnd = React.useCallback((message: ChatMessage) => {
    sendEventFromChat({
      eventType: 'DataEvent',
      action: 'on_send_result',
      params: { message },
    });
  }, []);
  const onUpdateReadCount = React.useCallback((unreadCount: number) => {
    sendEvent({
      eventType: 'DataEvent',
      action: 'update_all_count',
      params: { count: unreadCount },
      eventBizType: 'conversation',
      senderId: 'Chat',
    });
  }, []);

  const createConversationIfNotExisted = React.useCallback(() => {
    sendEventFromChat({
      eventType: 'DataEvent',
      action: 'exec_create_conversation',
      params: {
        convId: chatId,
        convType: chatType as number as ChatConversationType,
      },
    });
  }, [chatId, chatType]);

  const updateAllUnreadCount = React.useCallback(() => {
    client.chatManager
      .getUnreadCount()
      .then((result) => {
        if (result !== undefined) {
          onUpdateReadCount?.(result);
        }
      })
      .catch((error) => {
        console.warn('test:error:', error);
      });
  }, [client.chatManager, onUpdateReadCount]);

  const clearRead = React.useCallback(() => {
    client.chatManager
      .markAllMessagesAsRead(chatId, chatType as number as ChatConversationType)
      .then(() => {
        sendEventFromChat({
          eventType: 'DataEvent',
          action: 'update_conversation_read_state',
          params: {
            convId: chatId,
            convType: chatType as number as ChatConversationType,
          },
        });

        updateAllUnreadCount();
      })
      .catch((error) => {
        console.warn('test:error', error);
      });
  }, [chatId, chatType, client.chatManager, updateAllUnreadCount]);

  const init = React.useCallback(() => {
    // notify create conversation if not existed.
    createConversationIfNotExisted();
    clearRead();
  }, [clearRead, createConversationIfNotExisted]);

  React.useEffect(() => {
    const load = () => {
      console.log('test:load:', ChatScreen.name);
      const unsubscribe = addListeners();
      init();
      return {
        unsubscribe: unsubscribe,
      };
    };
    const unload = (params: { unsubscribe: () => void }) => {
      console.log('test:unload:', ChatScreen.name);
      params.unsubscribe();
    };

    const res = load();
    return () => unload(res);
  }, [addListeners, init]);

  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        propsRef={chatRef}
        screenParams={route.params as any}
        messageBubbleList={{
          MessageBubbleListP: MessageBubbleListFragment,
          MessageBubbleListPropsP: {
            onPressed: () => {
              console.log('test:onPressed:', 'click message bubble list');
            },
            TextMessageItem: MyTextMessageBubble,
            VideoMessageItem: MyVideoMessageBubble,
            FileMessageItem: MyFileMessageBubble,
          } as MessageBubbleListProps,
          MessageBubbleListRefP: messageBubbleListRefP as any,
        }}
        customMessageBubble={{
          CustomMessageRenderItemP: CustomMessageRenderItem,
        }}
        onUpdateReadCount={onUpdateReadCount}
        onClickMessageBubble={onClickMessageBubble}
        onClickInputMoreButton={onClickInputMoreButton}
        onPressInInputVoiceButton={onPressInInputVoiceButton}
        onPressOutInputVoiceButton={onPressOutInputVoiceButton}
        onLongPressMessageBubble={onLongPressMessageBubble}
        onSendMessage={onSendMessage}
        onSendMessageEnd={onSendMessageEnd}
        onVoiceRecordEnd={onVoiceRecordEnd}
      />
    </ScreenContainer>
  );
}
