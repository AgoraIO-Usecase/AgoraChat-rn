import { useNavigation } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import * as React from 'react';
import {
  Animated,
  DeviceEventEmitter,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  // TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  ChatError,
  ChatMessage,
  ChatMessageChatType,
  ChatMessageStatusCallback,
  ChatMessageType,
} from 'react-native-chat-sdk';
import {
  Button,
  createStyleSheet,
  FACE_ASSETS,
  FragmentContainer,
  getScaleFactor,
  LocalIcon,
  LocalIconName,
  seqId,
  Services,
  TextInput,
  timeoutTask,
  timestamp,
  useAlert,
  useBottomSheet,
  useContentStateContext,
  useThemeContext,
  useToastContext,
} from 'react-native-chat-uikit';
import { ScrollView } from 'react-native-gesture-handler';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import moji from 'twemoji';

import MessageBubbleList, {
  ImageMessageItemType,
  MessageItemType,
  MessageListRef,
  TextMessageItemType,
  VoiceMessageItemType,
} from '../components/MessageBubbleList';
import { useAppI18nContext } from '../contexts/AppI18nContext';
import { useAppChatSdkContext } from '../contexts/AppImSdkContext';
import { type AlertEvent, type ChatEventType, ChatEvent } from '../events';
import { useStyleSheet } from '../hooks/useStyleSheet';
import type { RootParamsList, RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

type NavigationProp = NativeStackNavigationProp<
  RootScreenParamsList<RootParamsList, 'option'>,
  'Chat',
  undefined
>;

type FaceListProps = {
  height: Animated.Value;
  // onPress?: (face: string) => void;
};

const InvisiblePlaceholder = React.memo(() => {
  console.log('test:InvisiblePlaceholder:');
  const sheet = useBottomSheet();
  const toast = useToastContext();
  const alert = useAlert();
  const { groupInfo, chat } = useAppI18nContext();
  const theme = useThemeContext();
  const sf = getScaleFactor();
  const state = useContentStateContext();

  const navigation = useNavigation<NavigationProp>();

  React.useEffect(() => {
    console.log('test:load:111:');
    const sub = DeviceEventEmitter.addListener(ChatEvent, (event) => {
      // console.log('test:ChatEvent:Chat:', event);
      switch (event.type as ChatEventType) {
        case 'enable_voice':
          {
            const eventParams = event.params;
            const eventType = eventParams.type as AlertEvent;
            console.log('test:state:', eventParams, eventType);
            state.showState({
              children: (
                <View
                  style={{
                    height: sf(100),
                    width: sf(161),
                    borderRadius: sf(16),
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <LocalIcon name="mic" size={sf(40)} />
                    <LocalIcon name="volume8" size={sf(40)} />
                  </View>
                  <Text style={{ color: 'white' }}>{chat.voiceState}</Text>
                </View>
              ),
            });
          }
          break;
        case 'disable_voice':
          {
            const eventParams = event.params;
            const eventType = eventParams.type as AlertEvent;
            console.log('test:state:', eventParams, eventType);
            state.hideState();
          }
          break;
        default:
          break;
      }
    });
    return () => {
      console.log('test:unload:222:');
      sub.remove();
    };
  }, [
    toast,
    sheet,
    alert,
    groupInfo.inviteAlert.title,
    groupInfo.inviteAlert.message,
    groupInfo.inviteAlert.cancelButton,
    groupInfo.inviteAlert.confirmButton,
    groupInfo.toast,
    groupInfo.memberSheet.add,
    groupInfo.memberSheet.remove,
    groupInfo.memberSheet.chat,
    navigation,
    theme.colors.primary,
    sf,
    state,
    chat.voiceState,
  ]);

  return <></>;
});

const FaceList = React.memo(
  (props: FaceListProps) => {
    const { height } = props;
    const sf = getScaleFactor();
    const arr = FACE_ASSETS;
    return (
      <Animated.View style={{ height: height }}>
        <ScrollView>
          <View style={styles.faceContainer}>
            {arr.map((face) => {
              return (
                <TouchableOpacity
                  key={face}
                  style={{ padding: sf(5) }}
                  onPress={() => {
                    // onPress?.(face);
                    DeviceEventEmitter.emit('onFace', face);
                  }}
                >
                  <Text style={{ fontSize: sf(32) }}>
                    {moji.convert.fromCodePoint(face)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </Animated.View>
    );
  },
  () => {
    return true;
  }
);

const Content = React.memo(
  ({
    chatId,
    chatType,
  }: Props & { chatId: string; chatType: ChatMessageChatType }) => {
    const sf = getScaleFactor();
    const theme = useThemeContext();
    const { chat } = useAppI18nContext();
    const ms = Services.ms;
    const TextInputRef = React.useRef<RNTextInput>(null);
    const msgListRef = React.useRef<MessageListRef>(null);
    const sheet = useBottomSheet();
    const faces = ['face', 'key'] as ('face' | 'key')[];
    const waves = ['wave_in_circle', 'key'] as ('wave_in_circle' | 'key')[];
    const [face, setFace] = React.useState(faces[0]);
    const [wave, setWave] = React.useState(waves[0]);
    // const [content, setContent] = React.useState('');
    const content = React.useRef('');
    const [isInput, setIsInput] = React.useState(false);
    const { width } = useWindowDimensions();
    const faceHeight = sf(300);
    const faceHeightRef = React.useRef(new Animated.Value(0)).current;
    const { client } = useAppChatSdkContext();
    console.log('test:Content:', chatId, chatType);

    const onContent = (text: string) => {
      content.current = text;
    };

    const createFaceTableAnimated = React.useMemo(() => {
      return {
        showFace: () => {
          Animated.timing(faceHeightRef, {
            toValue: faceHeight,
            duration: 250,
            useNativeDriver: false,
          }).start();
        },
        hideFace: () => {
          Animated.timing(faceHeightRef, {
            toValue: 0,
            duration: 250,
            useNativeDriver: false,
          }).start();
        },
      };
    }, [faceHeight, faceHeightRef]);

    const { showFace, hideFace } = createFaceTableAnimated;

    const calculateInputWidth = React.useCallback(
      (width: number, isInput: boolean) => {
        return sf(width - 15 * 2 - 28 - 12 * 2 - 18 - 14 - (isInput ? 66 : 28));
      },
      [sf]
    );

    const convertMessage = React.useCallback(
      (item: MessageItemType): ChatMessage | undefined => {
        let r;
        switch (item.type) {
          case ChatMessageType.TXT:
            {
              const txt = item as TextMessageItemType;
              r = ChatMessage.createTextMessage(chatId, txt.text, chatType);
            }
            break;
          case ChatMessageType.IMAGE:
            {
              const img = item as ImageMessageItemType;
              r = ChatMessage.createImageMessage(
                chatId,
                img.localPath!,
                chatType
              );
            }
            break;
          case ChatMessageType.VOICE:
            {
              const voice = item as VoiceMessageItemType;
              r = ChatMessage.createVoiceMessage(
                chatId,
                voice.localPath!,
                chatType
              );
            }
            break;
          default:
            break;
        }
        return r;
      },
      [chatId, chatType]
    );

    const sendToServer = React.useCallback(
      (msg: ChatMessage) => {
        client.chatManager
          .sendMessage(msg, {
            onProgress: (localMsgId: string, progress: number): void => {
              console.log('test:message:onProgress:', localMsgId, progress);
              DeviceEventEmitter.emit(ChatEvent, {
                type: 'msg_progress' as ChatEventType,
                params: {
                  localMsgId,
                  progress,
                },
              });
            },
            onError: (localMsgId: string, error: ChatError): void => {
              console.log('test:message:onError:', localMsgId, error);
              DeviceEventEmitter.emit(ChatEvent, {
                type: 'msg_state' as ChatEventType,
                params: {
                  localMsgId,
                  result: false,
                  reason: error,
                },
              });
            },
            onSuccess: (message: ChatMessage): void => {
              console.log('test:message:onSuccess:', message.localMsgId);
              setTimeout(() => {
                DeviceEventEmitter.emit(ChatEvent, {
                  type: 'msg_state' as ChatEventType,
                  params: {
                    localMsgId: message.localMsgId,
                    result: true,
                    msg: message,
                  },
                });
              }, 1000);
            },
          } as ChatMessageStatusCallback)
          .then((result) => {
            console.log('test:result:', result);
          })
          .catch((error) => {
            console.warn('test:error:', error);
          });
      },
      [client]
    );

    const sendTextMessage = React.useCallback(
      (text: string) => {
        if (text.length === 0) {
          return;
        }
        TextInputRef.current?.clear();
        const item = {
          sender: chatId,
          timestamp: timestamp(),
          isSender: true,
          key: seqId('ml').toString(),
          text: text,
          type: ChatMessageType.TXT,
          state: 'sending',
        } as TextMessageItemType;

        const msg = convertMessage(item);
        if (msg === undefined) {
          throw new Error('This is impossible.');
        }
        item.key = msg.localMsgId;

        msgListRef.current?.addMessage([item]);
        timeoutTask(() => {
          msgListRef.current?.scrollToEnd();
        });
        sendToServer(msg);
      },
      [chatId, convertMessage, sendToServer]
    );

    const onFace = (value?: 'face' | 'key') => {
      setFace(value);
      if (value === 'key') {
        showFace();
      } else if (value === 'face') {
        hideFace();
      } else {
        hideFace();
      }
    };

    React.useEffect(() => {
      console.log('test:Chat:listener:111:');
      const subscription1 = Keyboard.addListener('keyboardWillHide', (_) => {
        setIsInput(false);
      });
      const subscription2 = Keyboard.addListener('keyboardWillShow', (_) => {
        setIsInput(true);
      });
      const subscription3 = DeviceEventEmitter.addListener('onFace', (face) => {
        const s = content + moji.convert.fromCodePoint(face);
        onContent(s);
        setIsInput(true);
      });
      return () => {
        console.log('test:Chat:listener:222:');
        subscription1.remove();
        subscription2.remove();
        subscription3.remove();
      };
    }, [content]);

    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexGrow: 1,
            // backgroundColor: '#fff8dc',
          }}
        >
          <MessageBubbleList
            ref={msgListRef}
            onPressed={() => {
              // keyboardVerticalOffset = sf(0);
              Keyboard.dismiss();
              onFace('face');
            }}
          />
        </View>

        <View
          style={styles.inputContainer}
          onLayout={(_) => {
            // console.log('test:event:', event.nativeEvent.layout);
          }}
        >
          <TouchableOpacity
            style={{ justifyContent: 'center' }}
            onPress={() => {
              setWave(wave === 'wave_in_circle' ? waves[1] : waves[0]);
              Keyboard.dismiss();
              onFace('face');
            }}
          >
            <LocalIcon name={wave as LocalIconName} color="#A5A7A6" size={28} />
          </TouchableOpacity>

          {wave === 'wave_in_circle' ? (
            <React.Fragment>
              <View style={styles.inputContainer2}>
                <View style={styles.inputContainer3}>
                  <TextInput
                    ref={TextInputRef}
                    style={{
                      flexGrow: 1,
                      backgroundColor: 'white',
                      width: calculateInputWidth(width, isInput),
                    }}
                    onChangeText={(text) => {
                      onContent(text);
                    }}
                    // value={content}
                    returnKeyType="send"
                    onKeyPress={(_) => {
                      // console.log(
                      //   'test:event:event.nativeEvent.key:',
                      //   event.nativeEvent.key
                      // );
                    }}
                    onSubmitEditing={(event) => {
                      const c = event.nativeEvent.text;
                      // Keyboard.dismiss();
                      event.preventDefault();
                      sendTextMessage(c);
                    }}
                    onFocus={() => {
                      onFace('face');
                    }}
                  />

                  <TouchableOpacity
                    style={{ justifyContent: 'center' }}
                    onPress={() => {
                      onFace(face === 'face' ? faces[1] : faces[0]);
                      Keyboard.dismiss();
                    }}
                  >
                    <LocalIcon
                      name={face as 'face' | 'key'}
                      color="#A5A7A6"
                      size={sf(28)}
                    />
                  </TouchableOpacity>

                  <View style={{ width: sf(4) }} />
                </View>
              </View>

              {isInput ? (
                <View style={{ justifyContent: 'center' }}>
                  <Button
                    style={{
                      height: sf(36),
                      width: sf(66),
                      borderRadius: sf(18),
                    }}
                    onPress={() => {
                      sendTextMessage(content.current);
                    }}
                  >
                    Send
                  </Button>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    sheet.openSheet({
                      sheetItems: [
                        {
                          iconColor: theme.colors.primary,
                          title: 'Camera',
                          titleColor: 'black',
                          onPress: () => {
                            ms.openCamera({})
                              .then((result) => {
                                console.log('test:result:', result);
                              })
                              .catch((error) => {
                                console.warn('error:', error);
                              });
                          },
                        },
                        {
                          iconColor: theme.colors.primary,
                          title: 'Album',
                          titleColor: 'black',
                          onPress: () => {
                            ms.openMediaLibrary({ selectionLimit: 1 })
                              .then((result) => {
                                console.log('test:result:', result);
                              })
                              .catch((error) => {
                                console.warn('error:', error);
                              });
                          },
                        },
                        {
                          iconColor: theme.colors.primary,
                          title: 'Files',
                          titleColor: 'black',
                          onPress: () => {
                            ms.openDocument({})
                              .then((result) => {
                                console.log('test:result:', result);
                              })
                              .catch((error) => {
                                console.warn('error:', error);
                              });
                          },
                        },
                      ],
                    });
                  }}
                >
                  <LocalIcon
                    name="plus_in_circle"
                    color="#A5A7A6"
                    size={sf(28)}
                  />
                </TouchableOpacity>
              )}
            </React.Fragment>
          ) : (
            <View style={{ flexDirection: 'row' }}>
              <Button
                color={{
                  enabled: {
                    content: 'black',
                    background: 'rgba(242, 242, 242, 1)',
                  },
                  pressed: {
                    content: 'black',
                    background: '#E6E6E6',
                  },
                }}
                style={[styles.talk, { width: sf(width - 24 - 28 - 20) }]}
                onPressIn={() => {
                  DeviceEventEmitter.emit(ChatEvent, {
                    type: 'enable_voice' as ChatEventType,
                    params: {},
                  });
                }}
                onPressOut={() => {
                  DeviceEventEmitter.emit(ChatEvent, {
                    type: 'disable_voice' as ChatEventType,
                    params: {},
                  });
                }}
              >
                {chat.voiceButton}
              </Button>
            </View>
          )}
        </View>

        <FaceList height={faceHeightRef} />
      </View>
    );
  }
);

export default function ChatScreen({ route, navigation }: Props): JSX.Element {
  console.log('test:ChatScreen:');
  const rp = route.params as any;
  const params = rp?.params as { chatId: string; chatType: number };
  const sf = getScaleFactor();
  const { bottom } = useSafeAreaInsets();
  const chatId = params.chatId;
  const chatType = params.chatType;
  let keyboardVerticalOffset = sf(bottom + 50);

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: chatId,
    });
  }, [chatId, navigation]);

  return (
    <SafeAreaView
      mode="padding"
      style={useStyleSheet().safe}
      edges={['right', 'left', 'bottom']}
    >
      <View
        style={{
          // backgroundColor: '#deb887',
          flex: 1,
        }}
      >
        <KeyboardAvoidingView
          pointerEvents="box-none"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={keyboardVerticalOffset}
          style={{
            flex: 1,
          }}
        >
          {/* <TouchableWithoutFeedback
            onPress={() => {
              keyboardVerticalOffset = sf(0);
              Keyboard.dismiss();
              onFace('face');
            }}
          > */}
          <Content
            route={route}
            navigation={navigation}
            chatId={chatId}
            chatType={chatType}
          />
          {/* </TouchableWithoutFeedback> */}
        </KeyboardAvoidingView>
      </View>
      <FragmentContainer>
        <InvisiblePlaceholder />
      </FragmentContainer>
    </SafeAreaView>
  );
}

const styles = createStyleSheet({
  faceContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-evenly',
  },
  inputContainer: {
    height: 60,
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  inputContainer2: {
    flexGrow: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  inputContainer3: {
    flexDirection: 'row',
    flexGrow: 1,
    borderRadius: 24,
    overflow: 'hidden',
    borderColor: '#A5A7A6',
    borderWidth: 1,
  },
  talk: {
    height: 36,
    marginHorizontal: 12,
    borderRadius: 18,
    // flexGrow: 1,
  },
});
