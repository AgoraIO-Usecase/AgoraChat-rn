import * as React from 'react';
import {
  Animated,
  // Button as RNButton,
  DeviceEventEmitter,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  // TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
// import {
//   type AudioSet,
//   AudioEncoderAndroidType,
//   AudioSourceAndroidType,
//   AVEncoderAudioQualityIOSType,
//   AVEncodingOption,
//   AVModeIOSOption,
// } from 'react-native-audio-recorder-player';
import {
  ChatConversationType,
  ChatCustomMessageBody,
  ChatDownloadStatus,
  ChatError,
  ChatFileMessageBody,
  ChatImageMessageBody,
  ChatLocationMessageBody,
  ChatMessage,
  ChatMessageChatType,
  ChatMessageDirection,
  ChatMessageStatus,
  ChatMessageStatusCallback,
  ChatMessageType,
  ChatSearchDirection,
  ChatTextMessageBody,
  ChatVideoMessageBody,
  ChatVoiceMessageBody,
} from 'react-native-chat-sdk';
import {
  type LocalIconName,
  type MessageChatSdkEventType,
  Button,
  createStyleSheet,
  // DataEventType,
  FaceList as ChatFaceList,
  // getFileExtension,
  getScaleFactor,
  LocalIcon,
  localUrl,
  MessageChatSdkEvent,
  playUrl,
  removeFileHeader,
  seqId,
  Services,
  TextInput,
  timeoutTask,
  timestamp,
  useI18nContext,
  uuid,
} from 'react-native-chat-uikit';
import moji from 'twemoji';

import { useAppChatSdkContext } from '../contexts/AppImSdkContext';
// import { sendEvent, sendEventProps } from '../events/sendEvent';
import MessageBubbleList, {
  type CustomMessageItemType,
  type ImageMessageItemType,
  type MessageBubbleListProps,
  type MessageBubbleListRef,
  type MessageItemStateType,
  type MessageItemType,
  type TextMessageItemType,
  type VoiceMessageItemType,
  FileMessageItemType,
  LocationMessageItemType,
  VideoMessageItemType,
} from './MessageBubbleList';

type BaseProps = {
  chatId: string;
  chatType: ChatMessageChatType;
  onFace?: (value?: 'face' | 'key') => void;
  inputRef?: React.RefObject<RNTextInput>;
};

type ChatInputProps = BaseProps & {
  onSendTextMessage?: ({ content }: { content: string }) => void;
  onInit?: ({
    setIsInput,
    exeTest,
    getContent,
    setContent,
  }: {
    setIsInput: React.Dispatch<React.SetStateAction<boolean>>;
    exeTest: () => void;
    getContent: () => string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
  }) => void;
  onVoiceRecordEnd?: (params: { localPath: string; duration: number }) => void;
  onClickInputMoreButton?: () => void;
  onPressInInputVoiceButton?: () => void;
  onPressOutInputVoiceButton?: () => void;
};

type ChatContentRef = {
  sendImageMessage: (
    params: {
      name: string;
      localPath: string;
      fileSize: string;
      imageType: string;
      width: number;
      height: number;
    }[]
  ) => void;
  sendVoiceMessage: (params: {
    localPath: string;
    fileSize?: number;
    duration?: number;
  }) => void;
  sendTextMessage: (params: { content: string }) => void;
  sendCustomMessage: (params: { data: CustomMessageItemType }) => void;
  sendFileMessage: (params: {
    localPath: string;
    fileSize?: number;
    displayName?: string;
  }) => void;
  sendVideoMessage: (params: {
    localPath: string;
    fileSize?: number;
    displayName?: string;
    duration: number;
    thumbnailLocalPath?: string;
    width?: number;
    height?: number;
  }) => void;
  sendLocationMessage: (params: {
    address: string;
    latitude: string;
    longitude: string;
  }) => void;
};
type ChatContentProps = BaseProps & {
  propsRef?: React.RefObject<ChatContentRef>;
  messageBubbleList?: {
    MessageBubbleListP: React.ForwardRefExoticComponent<
      MessageBubbleListProps & React.RefAttributes<MessageBubbleListRef>
    >;
    MessageBubbleListPropsP: MessageBubbleListProps;
    MessageBubbleListRefP: React.RefObject<MessageBubbleListRef>;
  };
  customMessageBubble?: {
    CustomMessageRenderItemP: React.FunctionComponent<
      MessageItemType & { eventType: string; data: any }
    >;
  };
  // eslint-disable-next-line react/no-unused-prop-types
  onUpdateReadCount?: (unreadCount: number) => void;
  onClickMessageBubble?: (data: MessageItemType) => void;
  onLongPressMessageBubble?: (data: MessageItemType) => void;
  onClickInputMoreButton?: () => void;
  onPressInInputVoiceButton?: () => void;
  onPressOutInputVoiceButton?: () => void;
  onSendMessage?: (message: ChatMessage) => void;
  onSendMessageEnd?: (message: ChatMessage) => void;
  onVoiceRecordEnd?: (params: { localPath: string; duration: number }) => void;
};

// const sendEventFromChat = (
//   params: Omit<sendEventProps, 'senderId' | 'timestamp' | 'eventBizType'>
// ) => {
//   sendEvent({
//     ...params,
//     senderId: 'ChatFragment',
//     eventBizType: 'chat',
//   } as sendEventProps);
// };

const ChatInput = React.memo((props: ChatInputProps) => {
  const {
    onFace,
    onSendTextMessage,
    onInit,
    inputRef,
    // chatId,
    // onVoiceRecordEnd,
    onClickInputMoreButton,
    onPressInInputVoiceButton,
    onPressOutInputVoiceButton,
    ...others
  } = props;
  const sf = getScaleFactor();
  const { chat } = useI18nContext();
  // const TextInputRef = React.useRef<RNTextInput>(null);
  const faces = ['face', 'key'] as ('face' | 'key')[];
  const waves = ['wave_in_circle', 'key'] as ('wave_in_circle' | 'key')[];
  const [face, setFace] = React.useState(faces[0]);
  const [wave, setWave] = React.useState(waves[0]);
  const [content, setContent] = React.useState('');
  // const content = React.useRef('');
  const [isInput, setIsInput] = React.useState(false);
  const { width } = useWindowDimensions();
  if (others === undefined) console.log('test:', width);

  const onContent = (text: string) => {
    setContent(text);
    if (text.length === 0) {
      setIsInput(false);
    } else {
      setIsInput(true);
    }
  };

  const calculateInputWidth = React.useCallback(() => {
    console.log('test:123123123123:');
    return sf(width - 15 * 2 - 28 - 15 * 2 - (isInput === true ? 66 : 28));
  }, [isInput, sf, width]);

  const _onFace = (value?: 'face' | 'key') => {
    setFace(value);
    onFace?.(value);
  };

  React.useEffect(() => {
    onInit?.({
      setIsInput,
      exeTest: () => {},
      getContent: () => {
        return content;
      },
      setContent,
    }); // Give the setting permission to the other party.
    return () => {};
  }, [content, onInit]);

  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          width: sf(28),
          height: sf(28),
          marginHorizontal: sf(15),
        }}
        onPress={() => {
          setWave(wave === 'wave_in_circle' ? waves[1] : waves[0]);
          Keyboard.dismiss();
          _onFace('face');
        }}
      >
        <LocalIcon name={wave as LocalIconName} color="#A5A7A6" size={28} />
      </TouchableOpacity>

      {wave === 'wave_in_circle' ? (
        <React.Fragment>
          <View style={styles.inputContainer2}>
            <View
              style={[
                styles.inputContainer3,
                {
                  maxWidth: calculateInputWidth(),
                },
              ]}
            >
              <TextInput
                ref={inputRef}
                containerStyle={{
                  flex: 1,
                  maxWidth: calculateInputWidth(),
                  paddingLeft: sf(8),
                  alignSelf: 'center',
                }}
                style={{
                  backgroundColor: 'white',
                }}
                onChangeText={(text) => {
                  onContent(text);
                }}
                value={content}
                returnKeyType="send"
                onKeyPress={(_) => {}}
                onSubmitEditing={(event) => {
                  const c = event.nativeEvent.text;
                  event.preventDefault();
                  onSendTextMessage?.({ content: c });
                }}
                onFocus={() => {
                  _onFace('face');
                }}
              />

              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  _onFace(face === 'face' ? faces[1] : faces[0]);
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
            <View
              style={{
                justifyContent: 'center',
                marginHorizontal: sf(15),
              }}
            >
              <Button
                style={{
                  height: sf(36),
                  width: sf(66),
                  borderRadius: sf(18),
                }}
                onPress={() => {
                  onSendTextMessage?.({ content });
                }}
              >
                Send
              </Button>
            </View>
          ) : (
            <TouchableOpacity
              style={{
                marginHorizontal: sf(15),
              }}
              onPress={() => {
                if (onClickInputMoreButton) {
                  onClickInputMoreButton();
                } else {
                  // sendEventFromChat({
                  //   eventType: 'SheetEvent',
                  //   action: 'open_input_extension',
                  //   params: {},
                  // });
                }
              }}
            >
              <LocalIcon name="plus_in_circle" color="#A5A7A6" size={sf(28)} />
            </TouchableOpacity>
          )}
        </React.Fragment>
      ) : (
        <View
          style={{
            flexDirection: 'row',
          }}
        >
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
            style={[
              styles.talk,
              {
                maxWidth: calculateInputWidth() + sf(30),
                flexGrow: 1,
                marginHorizontal: 0,
              },
            ]}
            onPressIn={() => {
              if (onPressInInputVoiceButton) {
                onPressInInputVoiceButton();
              } else {
                // sendEventFromChat({
                //   eventType: 'VoiceStateEvent',
                //   action: 'enable_voice',
                //   params: {},
                // });
                // Services.ms
                //   .startRecordAudio({
                //     audio: {
                //       AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
                //       AudioSourceAndroid: AudioSourceAndroidType.MIC,
                //       AVModeIOS: AVModeIOSOption.measurement,
                //       AVEncoderAudioQualityKeyIOS:
                //         AVEncoderAudioQualityIOSType.high,
                //       AVNumberOfChannelsKeyIOS: 2,
                //       AVFormatIDKeyIOS: AVEncodingOption.aac,
                //     } as AudioSet,
                //     // url: localPath,
                //     onPosition: (pos) => {
                //       console.log('test:startRecordAudio:pos:', pos);
                //     },
                //     onFailed: (error) => {
                //       console.warn('test:startRecordAudio:onFailed:', error);
                //     },
                //     onFinished: ({ result, path, error }) => {
                //       console.log(
                //         'test:startRecordAudio:onFinished:',
                //         result,
                //         path,
                //         error
                //       );
                //     },
                //   })
                //   .then((result) => {
                //     console.log('test:startRecordAudio:result:', result);
                //   })
                //   .catch((error) => {
                //     console.warn('test:startRecordAudio:error:', error);
                //   });
              }
            }}
            onPressOut={() => {
              if (onPressOutInputVoiceButton) {
                onPressOutInputVoiceButton();
              } else {
                // sendEventFromChat({
                //   eventType: 'VoiceStateEvent',
                //   action: 'disable_voice',
                //   params: {},
                // });
                // let localPath = localUrl(
                //   Services.dcs.getFileDir(chatId, uuid())
                // );
                // Services.ms
                //   .stopRecordAudio()
                //   .then((result?: { pos: number; path: string }) => {
                //     if (result?.path) {
                //       const extension = getFileExtension(result.path);
                //       console.log('test:extension:', extension);
                //       localPath = localPath + extension;
                //       Services.ms
                //         .saveFromLocal({
                //           targetPath: localPath,
                //           localPath: result.path,
                //         })
                //         .then(() => {
                //           onVoiceRecordEnd?.({
                //             localPath,
                //             duration: result.pos / 1000,
                //           });
                //         })
                //         .catch((error) => {
                //           console.warn(
                //             'test:startRecordAudio:save:error',
                //             error
                //           );
                //         });
                //     }
                //   })
                //   .catch((error) => {
                //     console.warn('test:stopRecordAudio:error:', error);
                //   });
              }
            }}
          >
            {chat.voiceButton}
          </Button>
        </View>
      )}
    </View>
  );
});

const ChatContent = React.memo(
  ({
    propsRef,
    chatId,
    chatType,
    messageBubbleList,
    onFace,
    inputRef,
    customMessageBubble,
    // onUpdateReadCount,
    onClickMessageBubble,
    onLongPressMessageBubble,
    onClickInputMoreButton,
    onPressInInputVoiceButton,
    onPressOutInputVoiceButton,
    onSendMessage,
    onSendMessageEnd,
    onVoiceRecordEnd,
  }: ChatContentProps) => {
    const sf = getScaleFactor();
    const TextInputRef = React.useRef<RNTextInput>(null);
    const msgListRef = React.useRef<MessageBubbleListRef>(null);
    const [, setContent] = React.useState('');
    const getContentRef = React.useRef<() => string>(() => '');
    const setContentRef = React.useRef(setContent);
    const [, setIsInput] = React.useState(false);
    const setIsInputRef = React.useRef(setIsInput);
    const setTestRef = React.useRef(() => {});
    const faceHeight = sf(300);
    const faceHeightRef = React.useRef(new Animated.Value(0)).current;
    const { client } = useAppChatSdkContext();

    const getMsgListRef = React.useCallback(() => {
      if (messageBubbleList) {
        return messageBubbleList.MessageBubbleListRefP;
      } else {
        return msgListRef;
      }
    }, [messageBubbleList]);

    const getInputRef = React.useCallback(() => {
      if (inputRef) {
        return inputRef;
      } else {
        return TextInputRef;
      }
    }, [inputRef]);

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

    const convertToMessage = React.useCallback(
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
                chatType,
                {
                  displayName: img.displayName,
                  width: img.width ?? 0,
                  height: img.height ?? 0,
                  fileSize: img.fileSize ?? 0,
                } as any
              );
            }
            break;
          case ChatMessageType.VOICE:
            {
              const voice = item as VoiceMessageItemType;
              r = ChatMessage.createVoiceMessage(
                chatId,
                voice.localPath!,
                chatType,
                {
                  duration: voice.duration,
                  displayName: '',
                }
              );
            }
            break;
          case ChatMessageType.CUSTOM:
            {
              const custom = item as CustomMessageItemType;
              r = ChatMessage.createCustomMessage(
                chatId,
                custom.SubComponentProps.eventType,
                chatType,
                {
                  params: custom.SubComponentProps.data,
                }
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

    const onClickMessageBubbleInternal = React.useCallback(
      (item: MessageItemType) => {
        const eventParams = item;
        if (eventParams.type === ChatMessageType.VOICE) {
          const voice = eventParams as VoiceMessageItemType;
          if (voice.localPath) {
            Services.ms
              .playAudio({
                url: playUrl(voice.localPath),
                onPlay({ isMuted, currentPosition, duration }) {
                  console.log(
                    'test:onPlay',
                    isMuted,
                    currentPosition,
                    duration
                  );
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
          // TODO: The image preview is displayed.
        }
      },
      []
    );

    const standardizedData = React.useCallback(
      (
        item: Omit<MessageItemType, 'onPress' | 'onLongPress'>
      ): MessageItemType => {
        const r = {
          ...item,
          onLongPress: (data: MessageItemType) => {
            if (onLongPressMessageBubble) {
              onLongPressMessageBubble(data);
            } else {
              // sendEventFromChat({
              //   eventType: 'ActionMenuEvent',
              //   action: 'long_press_message_bubble',
              //   params: data,
              // });
            }
          },
          onPress: (data: MessageItemType) => {
            if (onClickMessageBubble) {
              onClickMessageBubble(data);
            } else {
              onClickMessageBubbleInternal(data);
            }
          },
        } as MessageItemType;
        return r;
      },
      [
        onClickMessageBubble,
        onClickMessageBubbleInternal,
        onLongPressMessageBubble,
      ]
    );

    const convertFromMessage = React.useCallback(
      (msg: ChatMessage): MessageItemType => {
        const convertFromMessageState = (msg: ChatMessage) => {
          if (msg.status === ChatMessageStatus.SUCCESS) {
            return 'arrived' as MessageItemStateType;
          } else if (msg.status === ChatMessageStatus.CREATE) {
            return 'sending' as MessageItemStateType;
          } else if (msg.status === ChatMessageStatus.FAIL) {
            return 'failed' as MessageItemStateType;
          } else if (msg.status === ChatMessageStatus.PROGRESS) {
            if (msg.direction === ChatMessageDirection.RECEIVE)
              return 'receiving' as MessageItemStateType;
            else return 'sending' as MessageItemStateType;
          } else {
            return 'failed' as MessageItemStateType;
          }
        };
        const convertFromMessageBody = (
          msg: ChatMessage,
          item: MessageItemType
        ) => {
          const type = msg.body.type;
          switch (type) {
            case ChatMessageType.VOICE:
              {
                const body = msg.body as ChatVoiceMessageBody;
                const r = item as VoiceMessageItemType;
                r.localPath = body.localPath;
                r.remoteUrl = body.remotePath;
                r.fileSize = body.fileSize;
                r.fileStatus = body.fileStatus;
                r.duration = body.duration;
                r.type = ChatMessageType.VOICE;
              }
              break;
            case ChatMessageType.IMAGE:
              {
                const body = msg.body as ChatImageMessageBody;
                const r = item as ImageMessageItemType;
                r.localPath = body.localPath;
                r.remoteUrl = body.remotePath;
                r.fileSize = body.fileSize;
                r.fileStatus = body.fileStatus;
                r.localThumbPath = body.thumbnailLocalPath;
                r.type = ChatMessageType.IMAGE;
              }
              break;
            case ChatMessageType.TXT:
              {
                const body = msg.body as ChatTextMessageBody;
                const r = item as TextMessageItemType;
                r.text = body.content;
                r.type = ChatMessageType.TXT;
              }
              break;
            case ChatMessageType.CUSTOM:
              {
                const body = msg.body as ChatCustomMessageBody;
                const r = item as CustomMessageItemType;
                r.SubComponentProps = {
                  eventType: body.event,
                  data: body.params,
                  ...item,
                } as MessageItemType & { eventType: string; data: any };
                r.SubComponent = customMessageBubble?.CustomMessageRenderItemP!; // !!! must
                r.type = ChatMessageType.CUSTOM;
              }
              break;
            case ChatMessageType.LOCATION:
              {
                const body = msg.body as ChatLocationMessageBody;
                const r = item as LocationMessageItemType;
                r.address = body.address;
                r.latitude = body.latitude;
                r.longitude = body.longitude;
                r.type = ChatMessageType.LOCATION;
              }
              break;
            case ChatMessageType.FILE:
              {
                const body = msg.body as ChatFileMessageBody;
                const r = item as FileMessageItemType;
                r.localPath = body.localPath;
                r.remoteUrl = body.remotePath;
                r.fileSize = body.fileSize;
                r.fileStatus = body.fileStatus;
                r.type = ChatMessageType.FILE;
              }
              break;
            case ChatMessageType.VIDEO:
              {
                const body = msg.body as ChatVideoMessageBody;
                const r = item as VideoMessageItemType;
                r.localPath = body.localPath;
                r.remoteUrl = body.remotePath;
                r.fileSize = body.fileSize;
                r.fileStatus = body.fileStatus;
                r.duration = body.duration;
                r.thumbnailLocalPath = body.thumbnailLocalPath;
                r.thumbnailRemoteUrl = body.thumbnailRemotePath;
                r.width = body.width;
                r.height = body.height;
                r.displayName = body.displayName;
                r.type = ChatMessageType.VIDEO;
              }
              break;
            default:
              throw new Error('This is impossible.');
          }
        };
        const r = {
          sender: msg.from,
          timestamp: msg.serverTime,
          isSender:
            msg.direction === ChatMessageDirection.RECEIVE ? false : true,
          key: msg.localMsgId,
          msgId: msg.msgId,
          state: convertFromMessageState(msg),
        } as MessageItemType;
        convertFromMessageBody(msg, r);
        return standardizedData(r);
      },
      [customMessageBubble?.CustomMessageRenderItemP, standardizedData]
    );

    const updateMessageState = React.useCallback(
      (params: {
        localMsgId: string;
        result: boolean;
        reason?: any;
        item?: MessageItemType;
      }) => {
        getMsgListRef().current?.updateMessageState(params);
      },
      [getMsgListRef]
    );

    const downloadAttachment = React.useCallback(
      (msg: ChatMessage) => {
        if (
          msg.body.type === ChatMessageType.IMAGE ||
          msg.body.type === ChatMessageType.VOICE
        ) {
          client.chatManager.downloadAttachment(msg, {
            onProgress: (localMsgId: string, progress: number): void => {
              console.log(
                'test:downloadAttachment:onProgress:',
                localMsgId,
                progress
              );
            },
            onError: (localMsgId: string, error: ChatError): void => {
              console.log(
                'test:downloadAttachment:onError:',
                localMsgId,
                error
              );
            },
            onSuccess: (message: ChatMessage): void => {
              updateMessageState({
                localMsgId: message.localMsgId,
                result: true,
                item: convertFromMessage(message),
              });
            },
          } as ChatMessageStatusCallback);
        }
      },
      [client.chatManager, convertFromMessage, updateMessageState]
    );

    const checkAttachment = React.useCallback(
      (msg: ChatMessage) => {
        const isExisted = async (msg: ChatMessage) => {
          if (msg.body.type === ChatMessageType.IMAGE) {
            const body = msg.body as ChatImageMessageBody;
            // const thumb = await Services.dcs.isExistedFile(
            //   body.thumbnailLocalPath
            // );
            const org = await Services.dcs.isExistedFile(body.localPath);
            if (org === false) {
              return false;
            } else {
              return true;
            }
          } else if (msg.body.type === ChatMessageType.VOICE) {
            const body = msg.body as ChatVoiceMessageBody;
            const org = await Services.dcs.isExistedFile(body.localPath);
            return org;
          } else {
            return true;
          }
        };
        isExisted(msg)
          .then((result) => {
            if (result === false) {
              downloadAttachment(msg);
            }
          })
          .catch((error) => {
            console.warn('test:checkAttachment:error:', error);
          });
      },
      [downloadAttachment]
    );

    const sendToServer = React.useCallback(
      (msg: ChatMessage) => {
        onSendMessage?.(msg);
        // onSendBefore(msg);
        client.chatManager
          .sendMessage(msg, {
            onProgress: (localMsgId: string, progress: number): void => {
              console.log('test:sendToServer:onProgress', localMsgId, progress);
            },
            onError: (localMsgId: string, error: ChatError): void => {
              console.log('test:sendToServer:onError', localMsgId);
              updateMessageState({
                localMsgId,
                result: false,
                reason: error,
              });
              // msg.status = ChatMessageStatus.FAIL; // !!! Error: You attempted to set the key `status` with the value `3` on an object that is meant to be immutable and has been frozen.
              onSendMessageEnd?.({
                ...msg,
                status: ChatMessageStatus.FAIL,
              } as ChatMessage);
              // onSendResult({
              //   ...msg,
              //   status: ChatMessageStatus.FAIL,
              // } as ChatMessage);
            },
            onSuccess: (message: ChatMessage): void => {
              console.log('test:sendToServer:onSuccess', message.localMsgId);
              updateMessageState({
                localMsgId: message.localMsgId,
                result: true,
                item: convertFromMessage(message),
              });
              onSendMessageEnd?.(message);
              // onSendResult(message);
            },
          } as ChatMessageStatusCallback)
          .then(() => {})
          .catch((error) => {
            console.warn('test:sendToServer:error:', error);
          });
      },
      [
        client.chatManager,
        convertFromMessage,
        onSendMessage,
        onSendMessageEnd,
        updateMessageState,
      ]
    );

    const sendTextMessage = React.useCallback(
      (text: string) => {
        if (text.length === 0) {
          return;
        }
        getInputRef().current?.clear();
        setContentRef.current?.('');
        const item = {
          sender: chatId,
          timestamp: timestamp(),
          isSender: true,
          key: seqId('ml').toString(),
          text: text,
          type: ChatMessageType.TXT,
          state: 'sending',
        } as TextMessageItemType;

        const msg = convertToMessage(item);
        if (msg === undefined) {
          throw new Error('This is impossible.');
        }

        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: [convertFromMessage(msg)],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg);
      },
      [
        chatId,
        convertFromMessage,
        convertToMessage,
        getInputRef,
        getMsgListRef,
        sendToServer,
      ]
    );

    const sendImageMessage = React.useCallback(
      async ({
        name,
        localPath,
        fileSize,
        width,
        height,
      }: {
        name: string;
        localPath: string;
        fileSize?: number;
        imageType?: string;
        width?: number;
        height?: number;
      }) => {
        if (localPath.length === 0) {
          return;
        }
        const targetPath = localUrl(Services.dcs.getFileDir(chatId, uuid()));
        await Services.ms.saveFromLocal({
          localPath,
          targetPath: targetPath,
        });
        if (__DEV__) {
          const test_existed = await Services.dcs.isExistedFile(targetPath);
          console.log(
            'test:test_existed:',
            test_existed,
            'target:',
            targetPath,
            'org:',
            localPath
          );
        }

        const modifiedTargetPath = removeFileHeader(targetPath);
        const item = {
          key: seqId('ml').toString(),
          displayName: name,
          sender: chatId,
          isSender: true,
          type: ChatMessageType.IMAGE,
          state: 'sending',
          localPath: modifiedTargetPath,
          fileSize: fileSize,
          width: width,
          height: height,
        } as ImageMessageItemType;

        const msg = convertToMessage(item);
        if (msg === undefined) {
          throw new Error('This is impossible.');
        }

        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: [convertFromMessage(msg)],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg);
      },
      [
        chatId,
        convertFromMessage,
        convertToMessage,
        getMsgListRef,
        sendToServer,
      ]
    );

    const sendFileMessage = React.useCallback(
      async (params: {
        localPath: string;
        fileSize?: number;
        displayName?: string;
      }) => {
        if (params.localPath.length === 0) {
          return;
        }
        if (__DEV__) {
          const test_existed = await Services.dcs.isExistedFile(
            params.localPath
          );
          console.log('test:test_existed:', test_existed);
        }

        const modifiedTargetPath = removeFileHeader(params.localPath);
        const item = {
          key: seqId('ml').toString(),
          sender: chatId,
          isSender: true,
          type: ChatMessageType.FILE,
          state: 'sending',
          localPath: modifiedTargetPath,
          fileSize: params.fileSize,
          displayName: params.displayName,
          fileStatus: ChatDownloadStatus.PENDING,
        } as FileMessageItemType;

        const msg = convertToMessage(item);
        if (msg === undefined) {
          throw new Error('This is impossible.');
        }

        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: [convertFromMessage(msg)],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg);
      },
      [
        chatId,
        convertFromMessage,
        convertToMessage,
        getMsgListRef,
        sendToServer,
      ]
    );
    const sendVideoMessage = React.useCallback(
      async (params: {
        localPath: string;
        fileSize?: number;
        displayName?: string;
        duration: number;
        thumbnailLocalPath?: string;
        width?: number;
        height?: number;
      }) => {
        if (params.localPath.length === 0) {
          return;
        }
        if (__DEV__) {
          const test_existed = await Services.dcs.isExistedFile(
            params.localPath
          );
          console.log('test:test_existed:', test_existed);
        }

        const modifiedTargetPath = removeFileHeader(params.localPath);
        const item = {
          key: seqId('ml').toString(),
          sender: chatId,
          isSender: true,
          type: ChatMessageType.VIDEO,
          state: 'sending',
          localPath: modifiedTargetPath,
          duration: params.duration,
          fileSize: params.fileSize,
          displayName: params.displayName,
          thumbnailLocalPath: params.thumbnailLocalPath,
          width: params.width,
          height: params.height,
          fileStatus: ChatDownloadStatus.PENDING,
        } as VideoMessageItemType;

        const msg = convertToMessage(item);
        if (msg === undefined) {
          throw new Error('This is impossible.');
        }

        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: [convertFromMessage(msg)],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg);
      },
      [
        chatId,
        convertFromMessage,
        convertToMessage,
        getMsgListRef,
        sendToServer,
      ]
    );
    const sendLocationMessage = React.useCallback(
      (params: { address: string; latitude: string; longitude: string }) => {
        const item = {
          sender: chatId,
          timestamp: timestamp(),
          isSender: true,
          key: seqId('ml').toString(),
          type: ChatMessageType.LOCATION,
          state: 'sending',
          address: params.address,
          latitude: params.latitude,
          longitude: params.longitude,
        } as LocationMessageItemType;

        const msg = convertToMessage(item);
        if (msg === undefined) {
          throw new Error('This is impossible.');
        }

        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: [convertFromMessage(msg)],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg);
      },
      [
        chatId,
        convertFromMessage,
        convertToMessage,
        getMsgListRef,
        sendToServer,
      ]
    );

    const sendCustomMessage = React.useCallback(
      ({ data }: { data: CustomMessageItemType }) => {
        const msg = convertToMessage(data);
        if (msg === undefined) {
          throw new Error('This is impossible.');
        }

        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: [convertFromMessage(msg)],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg);
      },
      [convertFromMessage, convertToMessage, getMsgListRef, sendToServer]
    );

    const sendVoiceMessage = React.useCallback(
      async ({
        localPath,
        duration,
      }: {
        localPath: string;
        fileSize?: number;
        duration?: number;
      }) => {
        if (localPath.length === 0) {
          return;
        }
        if (__DEV__) {
          const test_existed = await Services.dcs.isExistedFile(localPath);
          console.log('test:test_existed:', test_existed);
        }

        const modifiedTargetPath = removeFileHeader(localPath);
        const item = {
          sender: chatId,
          isSender: true,
          type: ChatMessageType.VOICE,
          state: 'sending',
          localPath: modifiedTargetPath,
          duration: duration,
        } as VoiceMessageItemType;

        const msg = convertToMessage(item);
        if (msg === undefined) {
          throw new Error('This is impossible.');
        }

        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: [convertFromMessage(msg)],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg);
      },
      [
        chatId,
        convertFromMessage,
        convertToMessage,
        getMsgListRef,
        sendToServer,
      ]
    );

    const loadHistoryMessage = React.useCallback(
      (msgs: ChatMessage[]) => {
        const items = [] as MessageItemType[];
        for (const msg of msgs) {
          const item = convertFromMessage(msg);
          items.push(item);
          checkAttachment(msg);
        }
        getMsgListRef().current?.addMessage({
          direction: 'before',
          msgs: items,
        });
      },
      [checkAttachment, convertFromMessage, getMsgListRef]
    );

    const requestHistoryMessage = React.useCallback(
      (earliestId?: string) => {
        client.chatManager
          .getMessages(
            chatId,
            chatType as number as ChatConversationType,
            earliestId ?? '',
            ChatSearchDirection.UP,
            2
          )
          .then((result) => {
            if (result) {
              loadHistoryMessage(result);
            }
          })
          .catch((error) => {
            console.warn('test:error:', error);
          });
      },
      [chatId, chatType, client.chatManager, loadHistoryMessage]
    );

    const loadMessage = React.useCallback(
      (msgs: ChatMessage[]) => {
        const items = [] as MessageItemType[];
        for (const msg of msgs) {
          const item = convertFromMessage(msg);
          items.push(item);
          checkAttachment(msg);
        }
        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: items,
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
      },
      [checkAttachment, convertFromMessage, getMsgListRef]
    );

    const _onFace = (value?: 'face' | 'key') => {
      if (value === 'key') {
        showFace();
      } else if (value === 'face') {
        hideFace();
      } else {
        hideFace();
      }
      onFace?.(value);
    };

    // const createConversationIfNotExisted = React.useCallback(() => {
    //   sendEventFromChat({
    //     eventType: 'DataEvent',
    //     action: 'exec_create_conversation',
    //     params: {
    //       convId: chatId,
    //       convType: chatType as number as ChatConversationType,
    //     },
    //   });
    // }, [chatId, chatType]);

    // const updateAllUnreadCount = React.useCallback(() => {
    //   client.chatManager
    //     .getUnreadCount()
    //     .then((result) => {
    //       if (result !== undefined) {
    //         onUpdateReadCount?.(result);
    //       }
    //     })
    //     .catch((error) => {
    //       console.warn('test:error:', error);
    //     });
    // }, [client.chatManager, onUpdateReadCount]);

    // const clearRead = React.useCallback(() => {
    //   client.chatManager
    //     .markAllMessagesAsRead(
    //       chatId,
    //       chatType as number as ChatConversationType
    //     )
    //     .then(() => {
    //       sendEventFromChat({
    //         eventType: 'DataEvent',
    //         action: 'update_conversation_read_state',
    //         params: {
    //           convId: chatId,
    //           convType: chatType as number as ChatConversationType,
    //         },
    //       });

    //       updateAllUnreadCount();
    //     })
    //     .catch((error) => {
    //       console.warn('test:error', error);
    //     });
    // }, [chatId, chatType, client.chatManager, updateAllUnreadCount]);

    const onFaceInternal = React.useCallback((face: string) => {
      const content = getContentRef.current();
      const s = content + moji.convert.fromCodePoint(face);
      setContentRef.current(s);
      setIsInputRef.current(true);
    }, []);

    React.useEffect(() => {
      const subscription1 = Keyboard.addListener('keyboardWillHide', (_) => {
        setIsInputRef.current(false);
      });
      const subscription2 = Keyboard.addListener('keyboardWillShow', (_) => {
        setIsInputRef.current(true);
      });
      const subscription3 = DeviceEventEmitter.addListener('onFace', (face) => {
        const content = getContentRef.current();
        const s = content + moji.convert.fromCodePoint(face);
        setContentRef.current(s);
        setIsInputRef.current(true);
      });
      return () => {
        subscription1.remove();
        subscription2.remove();
        subscription3.remove();
      };
    }, []);

    if (propsRef?.current) {
      propsRef.current.sendImageMessage = (params: any) => {
        const eventParams = params as any[];
        for (const item of eventParams) {
          sendImageMessage({
            name: item.name,
            localPath: item.uri,
            fileSize: item.size,
            imageType: item.type,
            width: item.width,
            height: item.height,
          })
            .then()
            .catch((error) => {
              console.warn('test:sendImageMessage:error', error);
            });
        }
      };
      propsRef.current.sendVoiceMessage = (params: any) => {
        sendVoiceMessage({
          localPath: params.localPath,
          duration: params.duration,
        })
          .then()
          .catch((error) => {
            console.warn('test:sendVoiceMessage:error', error);
          });
      };
      propsRef.current.sendTextMessage = (params) => {
        sendTextMessage(params.content);
      };
      propsRef.current.sendCustomMessage = (params) => {
        sendCustomMessage(params);
      };
      propsRef.current.sendFileMessage = (params) => {
        sendFileMessage(params)
          .then()
          .catch((error) => {
            console.warn('test:sendFileMessage:error', error);
          });
      };
      propsRef.current.sendVideoMessage = (params) => {
        sendVideoMessage(params)
          .then()
          .catch((error) => {
            console.warn('test:sendVideoMessage:error', error);
          });
      };
      propsRef.current.sendLocationMessage = (params) => {
        sendLocationMessage(params);
      };
    }

    const addListeners = React.useCallback(() => {
      const sub2 = DeviceEventEmitter.addListener(
        MessageChatSdkEvent,
        (event) => {
          const eventType = event.type as MessageChatSdkEventType;
          const eventParams = event.params as { messages: ChatMessage[] };
          switch (eventType) {
            case 'onMessagesReceived':
              {
                /// todo: !!! 10000 message count ???
                const messages = eventParams.messages;
                const r = [] as ChatMessage[];
                for (const msg of messages) {
                  if (msg.conversationId === chatId) {
                    r.push(msg);
                  }
                }
                if (r.length > 0) loadMessage(r);
              }
              break;
            default:
              break;
          }
        }
      );

      return () => {
        sub2.remove();
      };
    }, [chatId, loadMessage]);

    const initDirs = React.useCallback((convIds: string[]) => {
      for (const convId of convIds) {
        Services.dcs
          .isExistedConversationDir(convId)
          .then((result) => {
            if (result === false) {
              Services.dcs
                .createConversationDir(convId)
                .then(() => {})
                .catch((error) => {
                  console.warn('test:create:dir:error:', error);
                });
            }
          })
          .catch((error) => {
            console.warn('test:isExisted:dir:error:', error);
          });
      }
    }, []);

    const initList = React.useCallback(() => {
      client.chatManager
        .getMessages(
          chatId,
          chatType as number as ChatConversationType,
          '',
          ChatSearchDirection.UP,
          2
        )
        .then((result) => {
          if (result) {
            loadMessage(result);
          }
        })
        .catch((error) => {
          console.warn('test:error:', error);
        });
    }, [chatId, chatType, client.chatManager, loadMessage]);

    React.useEffect(() => {
      const load = () => {
        const unsubscribe = addListeners();
        initList();
        initDirs([chatId]);
        // createConversationIfNotExisted();
        // clearRead();
        return {
          unsubscribe: unsubscribe,
        };
      };
      const unload = (params: { unsubscribe: () => void }) => {
        params.unsubscribe();
      };

      const res = load();
      return () => unload(res);
    }, [addListeners, initList, initDirs, chatId]);

    const onRequestHistoryMessage = React.useCallback(
      (params: { earliestId: string }) => {
        requestHistoryMessage(params.earliestId);
      },
      [requestHistoryMessage]
    );

    const ChatMessageBubbleList = React.memo(() =>
      messageBubbleList ? (
        <messageBubbleList.MessageBubbleListP
          ref={messageBubbleList.MessageBubbleListRefP}
          {...messageBubbleList.MessageBubbleListPropsP}
          onPressed={() => {
            Keyboard.dismiss();
            _onFace('face');
            messageBubbleList.MessageBubbleListPropsP?.onPressed?.();
          }}
          onRequestHistoryMessage={onRequestHistoryMessage}
        />
      ) : (
        <MessageBubbleList
          ref={msgListRef}
          onPressed={() => {
            Keyboard.dismiss();
            _onFace('face');
          }}
          onRequestHistoryMessage={onRequestHistoryMessage}
        />
      )
    );

    const onVoiceRecordEndInternal = React.useCallback(
      (params: { localPath: string; duration: number }) => {
        sendVoiceMessage({
          localPath: params.localPath,
          duration: params.duration,
        })
          .then()
          .catch((error) => {
            console.warn('test:sendVoiceMessage:error', error);
          });
      },
      [sendVoiceMessage]
    );

    const keyboardVerticalOffset = sf(
      Platform.select({ ios: 100, android: 0 })!
    );

    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexGrow: 1,
            // backgroundColor: '#fff8dc',
          }}
        >
          <ChatMessageBubbleList />
        </View>
        <KeyboardAvoidingView
          pointerEvents="box-none"
          // style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              // keyboardVerticalOffset = sf(0);
              Keyboard.dismiss();
              _onFace('face');
            }}
          >
            <ChatInput
              inputRef={inputRef ? inputRef : TextInputRef}
              chatId={chatId}
              chatType={chatType}
              onFace={_onFace}
              onSendTextMessage={({ content }) => {
                const test = true;
                if (test) sendTextMessage(content);
                else
                  sendCustomMessage({
                    data: {
                      sender: chatId,
                      timestamp: timestamp(),
                      isSender: true,
                      key: seqId('ml').toString(),
                      type: ChatMessageType.CUSTOM,
                      state: 'sending',
                      SubComponentProps: {
                        data: content,
                        eventType: 'test',
                      },
                    } as CustomMessageItemType,
                  });
                setTestRef.current();
              }}
              onInit={({ setIsInput, exeTest, getContent, setContent }) => {
                setIsInputRef.current = setIsInput;
                setTestRef.current = exeTest;
                setContentRef.current = setContent;
                getContentRef.current = getContent;
              }}
              onVoiceRecordEnd={
                onVoiceRecordEnd ? onVoiceRecordEnd : onVoiceRecordEndInternal
              }
              onClickInputMoreButton={onClickInputMoreButton}
              onPressInInputVoiceButton={onPressInInputVoiceButton}
              onPressOutInputVoiceButton={onPressOutInputVoiceButton}
            />
          </TouchableWithoutFeedback>
          <ChatFaceList height={faceHeightRef} onFace={onFaceInternal} />
        </KeyboardAvoidingView>
      </View>
    );
  }
);

/**
 * ChatFragment controller
 */
export type ChatFragmentRef = {
  /**
   * send image message
   */
  sendImageMessage: (
    params: {
      name: string;
      localPath: string;
      fileSize: string;
      imageType: string;
      width: number;
      height: number;
    }[]
  ) => void;
  /**
   * send voice message
   */
  sendVoiceMessage: (params: {
    localPath: string;
    fileSize?: number;
    duration?: number;
  }) => void;

  /**
   * send a text message.
   */
  sendTextMessage: (params: { content: string }) => void;

  /**
   * send a custom message.
   */
  sendCustomMessage: (params: { data: CustomMessageItemType }) => void;

  /**
   * send a file message.
   */
  sendFileMessage: (params: {
    localPath: string;
    fileSize?: number;
    displayName?: string;
  }) => void;

  /**
   * send a video message.
   */
  sendVideoMessage: (params: {
    localPath: string;
    fileSize?: number;
    displayName?: string;
    duration: number;
    thumbnailLocalPath?: string;
    width?: number;
    height?: number;
  }) => void;

  /**
   * send a location message.
   */
  sendLocationMessage: (params: {
    address: string;
    latitude: string;
    longitude: string;
  }) => void;
};

/**
 * ChatFragment properties
 */
type ChatFragmentProps = {
  /**
   * ChatFragment controller
   */
  propsRef?: React.RefObject<ChatFragmentRef>;
  /**
   * ChatFragment parameters
   */
  screenParams: {
    params: {
      chatId: string;
      chatType: number;
    };
  };
  /**
   * Message bubble list component
   */
  messageBubbleList?: {
    MessageBubbleListP: React.ForwardRefExoticComponent<
      MessageBubbleListProps & React.RefAttributes<MessageBubbleListRef>
    >;
    MessageBubbleListPropsP: MessageBubbleListProps;
    MessageBubbleListRefP: React.RefObject<MessageBubbleListRef>;
  };
  /**
   * Message bubble item component for custom type message
   */
  customMessageBubble?: {
    CustomMessageRenderItemP: React.FunctionComponent<
      MessageItemType & { eventType: string; data: any }
    >;
  };
  /**
   * Update message no reading callback notification.
   */
  onUpdateReadCount?: (unreadCount: number) => void;
  /**
   * Click the message bubble callback notification.
   */
  onClickMessageBubble?: (data: MessageItemType) => void;
  /**
   * Long press the message bubble callback notification.
   */
  onLongPressMessageBubble?: (data: MessageItemType) => void;
  /**
   * Click the input more button callback notification.
   */
  onClickInputMoreButton?: () => void;
  /**
   * Press down the input voice button callback notification.
   */
  onPressInInputVoiceButton?: () => void;
  /**
   * Press up the input voice button callback notification.
   */
  onPressOutInputVoiceButton?: () => void;
  /**
   * A callback notification before sending a message.
   */
  onSendMessage?: (message: ChatMessage) => void;
  /**
   * A callback notification after sending a message.
   */
  onSendMessageEnd?: (message: ChatMessage) => void;
  /**
   * A callback notification after a voice file is recorded.
   */
  onVoiceRecordEnd?: (params: { localPath: string; duration: number }) => void;
};

export default function ChatFragment(props: ChatFragmentProps): JSX.Element {
  const {
    propsRef,
    screenParams,
    messageBubbleList,
    customMessageBubble,
    onUpdateReadCount,
    onClickMessageBubble,
    onLongPressMessageBubble,
    onClickInputMoreButton,
    onPressInInputVoiceButton,
    onPressOutInputVoiceButton,
    onSendMessage,
    onSendMessageEnd,
    onVoiceRecordEnd,
  } = props;
  const params = screenParams.params as {
    chatId: string;
    chatType: number;
  };

  const chatId = params.chatId;
  const chatType = params.chatType;
  const chatContentRef = React.useRef<ChatContentRef>({} as any);

  if (propsRef?.current) {
    propsRef.current.sendImageMessage = (params) => {
      chatContentRef?.current.sendImageMessage(params);
    };
    propsRef.current.sendVoiceMessage = (params) => {
      chatContentRef?.current.sendVoiceMessage(params);
    };
    propsRef.current.sendCustomMessage = (params) => {
      chatContentRef?.current.sendCustomMessage(params);
    };
    propsRef.current.sendTextMessage = (params) => {
      chatContentRef?.current.sendTextMessage(params);
    };
    propsRef.current.sendVideoMessage = (params) => {
      chatContentRef?.current.sendVideoMessage(params);
    };
    propsRef.current.sendFileMessage = (params) => {
      chatContentRef?.current.sendFileMessage(params);
    };
    propsRef.current.sendLocationMessage = (params) => {
      chatContentRef?.current.sendLocationMessage(params);
    };
  }
  return (
    <React.Fragment>
      {/* <KeyboardAvoidingView
        pointerEvents="box-none"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={{
          flex: 1,
        }}
      > */}
      {/* <TouchableWithoutFeedback
    onPress={() => {
      keyboardVerticalOffset = sf(0);
      Keyboard.dismiss();
      _onFace('face');
    }}
  > */}
      <ChatContent
        propsRef={chatContentRef}
        chatId={chatId}
        chatType={chatType}
        messageBubbleList={messageBubbleList}
        customMessageBubble={customMessageBubble}
        onUpdateReadCount={onUpdateReadCount}
        onClickMessageBubble={onClickMessageBubble}
        onLongPressMessageBubble={onLongPressMessageBubble}
        onClickInputMoreButton={onClickInputMoreButton}
        onPressInInputVoiceButton={onPressInInputVoiceButton}
        onPressOutInputVoiceButton={onPressOutInputVoiceButton}
        onSendMessage={onSendMessage}
        onSendMessageEnd={onSendMessageEnd}
        onVoiceRecordEnd={onVoiceRecordEnd}
      />
      {/* </TouchableWithoutFeedback> */}
      {/* </KeyboardAvoidingView> */}
    </React.Fragment>
  );
}

const styles = createStyleSheet({
  inputContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer2: {
    flexDirection: 'row',
    paddingVertical: 14,
  },
  inputContainer3: {
    flexDirection: 'row',
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    borderColor: '#A5A7A6',
    borderWidth: 1,
    height: 36,
  },
  talk: {
    height: 36,
    marginHorizontal: 12,
    borderRadius: 18,
  },
});
