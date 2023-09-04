import * as React from 'react';
import {
  Animated,
  // Button,
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
  ChatGroupMessageAck,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import RNFS from 'react-native-fs';
// import {
//   type LocalIconName,
//   type MessageChatSdkEventType,
//   Button,
//   createStyleSheet,
//   // DataEventType,
//   FaceList as ChatFaceList,
//   // getFileExtension,
//   getScaleFactor,
//   LocalIcon,
//   localUrl,
//   MessageChatSdkEvent,
//   playUrl,
//   removeFileHeader,
//   seqId,
//   Services,
//   TextInput,
//   timeoutTask,
//   timestamp,
//   useI18nContext,
//   uuid,
// } from 'react-native-chat-uikit';
import moji from 'twemoji';

import Button from '../components/Button';
import { FaceList } from '../components/FaceList';
import { LocalIcon, type LocalIconName } from '../components/Icon';
import TextInput from '../components/TextInput';
import { useChatSdkContext, useI18nContext } from '../contexts';
import {
  MessageChatSdkEvent,
  type MessageChatSdkEventType,
} from '../nativeEvents';
import { Services } from '../services';
import { getScaleFactor } from '../styles/createScaleFactor';
import createStyleSheet from '../styles/createStyleSheet';
import { timeoutTask } from '../utils/function';
import { seqId, timestamp, uuid } from '../utils/generator';
import {
  localUrl,
  localUrlEscape,
  playUrl,
  removeFileHeader,
} from '../utils/platform';
// import { useAppChatSdkContext } from '../contexts/AppImSdkContext';
// import { sendEvent, sendEventProps } from '../events/sendEvent';
import MessageBubbleList, {
  type CustomMessageItemType,
  FileMessageItemType,
  type ImageMessageItemType,
  LocationMessageItemType,
  type MessageBubbleListProps,
  type MessageBubbleListRef,
  type MessageItemType,
  type TextMessageItemType,
  updateMessageStateType,
  VideoMessageItemType,
  type VoiceMessageItemType,
} from './MessageBubbleList';
import type { MessageItemStateType } from './types';

const ChatMessageBubbleList = React.memo(
  (props: {
    messageBubbleList?: {
      MessageBubbleListP: React.ForwardRefExoticComponent<
        MessageBubbleListProps & React.RefAttributes<MessageBubbleListRef>
      >;
      MessageBubbleListPropsP: MessageBubbleListProps;
      MessageBubbleListRefP: React.RefObject<MessageBubbleListRef>;
    };
    _onFace: (value?: 'face' | 'key') => void;
    onRequestHistoryMessage: (params: { earliestId: string }) => void;
    msgListRef: React.RefObject<MessageBubbleListRef>;
  }) => {
    const { messageBubbleList, _onFace, onRequestHistoryMessage, msgListRef } =
      props;
    return messageBubbleList ? (
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
    );
  }
);

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
  insertMessage: (params: { msg: ChatMessage }) => void;
  sendImageMessage: (
    params: {
      name: string;
      localPath: string;
      fileSize: number;
      imageType: string;
      width: number;
      height: number;
      onResult?: (params: any) => void;
    }[]
  ) => void;
  sendVoiceMessage: (params: {
    localPath: string;
    fileSize?: number;
    duration?: number;
    onResult?: (params: any) => void;
  }) => void;
  sendTextMessage: (params: {
    content: string;
    onResult?: (params: any) => void;
  }) => void;
  sendCustomMessage: (params: {
    data: CustomMessageItemType;
    onResult?: (params: any) => void;
  }) => void;
  sendFileMessage: (params: {
    localPath: string;
    fileSize?: number;
    displayName?: string;
    onResult?: (params: any) => void;
  }) => void;
  sendVideoMessage: (params: {
    localPath: string;
    fileSize?: number;
    displayName?: string;
    duration: number;
    thumbnailLocalPath?: string;
    width?: number;
    height?: number;
    onResult?: (params: any) => void;
  }) => void;
  sendLocationMessage: (params: {
    address: string;
    latitude: string;
    longitude: string;
    onResult?: (params: any) => void;
  }) => void;
  loadHistoryMessage: (
    msgs: ChatMessage[],
    onResult?: (params: any) => void
  ) => void;
  deleteLocalMessage: (params: {
    convId: string;
    convType: ChatConversationType;
    msgId: string;
    key: string;
    onResult?: (params: any) => void;
  }) => void;
  recallMessage: (params: {
    msgId: string;
    key: string;
    onResult?: (params: any) => void;
  }) => void;
  resendMessage: (params: {
    msgId: string;
    key: string;
    onResult?: (params: any) => void;
  }) => void;
  downloadAttachment: (params: {
    msg: ChatMessage;
    onResult?: (params?: any) => void;
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

  onUpdateReadCount?: (unreadCount: number) => void;
  onClickMessageBubble?: (data: MessageItemType) => void;
  onLongPressMessageBubble?: (data: MessageItemType) => void;
  onClickInputMoreButton?: () => void;
  onPressInInputVoiceButton?: () => void;
  onPressOutInputVoiceButton?: () => void;
  onSendMessage?: (message: ChatMessage) => void;
  onSendMessageEnd?: (message: ChatMessage) => void;
  onVoiceRecordEnd?: (params: { localPath: string; duration: number }) => void;
  keyboardVerticalOffset?: number;
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
    keyboardVerticalOffset,
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
    const { client, getCurrentId } = useChatSdkContext();
    const { bottom } = useSafeAreaInsets();

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
          case ChatMessageType.FILE:
            {
              const file = item as FileMessageItemType;
              r = ChatMessage.createFileMessage(
                chatId,
                file.localPath,
                chatType,
                {
                  displayName: file.displayName ?? 'file',
                  fileSize: file.fileSize ?? 0,
                } as any
              );
            }
            break;
          case ChatMessageType.LOCATION:
            {
              const location = item as LocationMessageItemType;
              r = ChatMessage.createLocationMessage(
                chatId,
                location.latitude,
                location.longitude,
                chatType,
                {
                  address: location.address,
                }
              );
            }
            break;
          case ChatMessageType.VIDEO:
            {
              const video = item as VideoMessageItemType;
              r = ChatMessage.createVideoMessage(
                chatId,
                video.localPath,
                chatType,
                {
                  displayName: video.displayName ?? 'video',
                  thumbnailLocalPath: video.thumbnailLocalPath ?? '',
                  duration: video.duration,
                  width: video.width ?? 0,
                  height: video.height ?? 0,
                }
              );
            }
            break;
          default:
            break;
        }
        if (r) r.attributes = item.ext;
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
                url: localUrlEscape(playUrl(voice.localPath)),
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
      (msg: ChatMessage, state?: MessageItemStateType): MessageItemType => {
        const convertFromMessageState = (msg: ChatMessage) => {
          let ret: MessageItemStateType | undefined;
          if (msg.status === ChatMessageStatus.SUCCESS) {
            ret = 'sended' as MessageItemStateType;
          } else if (msg.status === ChatMessageStatus.CREATE) {
            ret = 'sending' as MessageItemStateType;
          } else if (msg.status === ChatMessageStatus.FAIL) {
            ret = 'failed' as MessageItemStateType;
          } else if (msg.status === ChatMessageStatus.PROGRESS) {
            if (msg.direction === ChatMessageDirection.RECEIVE)
              ret = 'receiving' as MessageItemStateType;
            else ret = 'sending' as MessageItemStateType;
          } else {
            ret = 'failed' as MessageItemStateType;
          }
          if (msg.direction === ChatMessageDirection.RECEIVE) {
            ret = 'received';
          }
          if (ret === 'sending' || ret === 'receiving') {
            if (timestamp() > msg.localTime + 1000 * 60) {
              ret = 'failed';
            }
          }
          if (ret === 'sended') {
            if (msg.hasDeliverAck === true) {
              ret = 'arrived';
            }
            if (msg.hasReadAck === true) {
              ret = 'read';
            }
          }
          return ret;
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
                r.displayName = body.displayName;
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
                r.displayName = body.displayName;
                r.localThumbPath = body.thumbnailLocalPath;
                r.remoteThumbPath = body.thumbnailRemotePath;
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
                r.displayName = body.displayName;
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
          state: state ?? convertFromMessageState(msg),
          ext: msg.attributes,
        } as MessageItemType;
        convertFromMessageBody(msg, r);
        return standardizedData(r);
      },
      [customMessageBubble?.CustomMessageRenderItemP, standardizedData]
    );

    const updateMessageState = React.useCallback(
      (params: {
        localMsgId: string;
        type: updateMessageStateType;
        items: MessageItemType[];
      }) => {
        getMsgListRef().current?.updateMessageState(params);
      },
      [getMsgListRef]
    );

    const downloadThumbAttachment = React.useCallback(
      (msg: ChatMessage) => {
        if (
          msg.body.type === ChatMessageType.IMAGE ||
          msg.body.type === ChatMessageType.VIDEO
        ) {
          client.chatManager.downloadThumbnail(msg, {
            onProgress: (localMsgId: string, progress: number): void => {
              console.log(
                'test:downloadThumbnail:onProgress:',
                localMsgId,
                progress
              );
            },
            onError: (localMsgId: string, error: ChatError): void => {
              console.log('test:downloadThumbnail:onError:', localMsgId, error);
            },
            onSuccess: (message: ChatMessage): void => {
              updateMessageState({
                localMsgId: message.localMsgId,
                type: 'one-all',
                items: [convertFromMessage(message)],
              });
            },
          } as ChatMessageStatusCallback);
        }
      },
      [client.chatManager, convertFromMessage, updateMessageState]
    );

    const checkThumbAttachment = React.useCallback(
      (msg: ChatMessage) => {
        const isExisted = async (msg: ChatMessage) => {
          let ret = false;
          if (msg.body.type === ChatMessageType.IMAGE) {
            const body = msg.body as ChatImageMessageBody;
            ret = await Services.dcs.isExistedFile(body.thumbnailLocalPath);
          } else if (msg.body.type === ChatMessageType.VIDEO) {
            const body = msg.body as ChatVideoMessageBody;
            ret = await Services.dcs.isExistedFile(body.thumbnailLocalPath);
          }
          return ret;
        };
        isExisted(msg)
          .then((result) => {
            if (result === false) {
              downloadThumbAttachment(msg);
            }
          })
          .catch((error) => {
            console.warn('test:checkThumbAttachment:error:', error);
          });
      },
      [downloadThumbAttachment]
    );

    const downloadAttachment = React.useCallback(
      (msg: ChatMessage, onResult?: (params?: { error?: any }) => void) => {
        if (
          msg.body.type === ChatMessageType.IMAGE ||
          msg.body.type === ChatMessageType.VOICE ||
          msg.body.type === ChatMessageType.VIDEO ||
          msg.body.type === ChatMessageType.FILE
        ) {
          client.chatManager.downloadAttachment(msg, {
            onProgress: (localMsgId: string, progress: number): void => {
              console.log(
                'test:downloadAttachment:onProgress:',
                localMsgId,
                progress
              );
            },
            onError: (_: string, error: ChatError): void => {
              onResult?.({ error });
            },
            onSuccess: (_: ChatMessage): void => {
              onResult?.();
            },
          } as ChatMessageStatusCallback);
        }
      },
      [client.chatManager]
    );

    const checkAttachment = React.useCallback(
      (msg: ChatMessage, onResult?: (params?: { error?: any }) => void) => {
        const isExisted = async (msg: ChatMessage) => {
          let ret = false;
          if (
            msg.body.type === ChatMessageType.IMAGE ||
            msg.body.type === ChatMessageType.VOICE ||
            msg.body.type === ChatMessageType.FILE ||
            msg.body.type === ChatMessageType.VIDEO
          ) {
            const body = msg.body as ChatFileMessageBody;
            ret = await Services.dcs.isExistedFile(body.localPath);
          }
          return ret;
        };
        isExisted(msg)
          .then((result) => {
            if (result === false) {
              downloadAttachment(msg, onResult);
            }
          })
          .catch((error) => {
            onResult?.({ error });
          });
      },
      [downloadAttachment]
    );

    const sendToServer = React.useCallback(
      (msg: ChatMessage, onResult?: (params: any) => void) => {
        onSendMessage?.(msg);
        // onSendBefore(msg);
        client.chatManager
          .sendMessage(msg, {
            onProgress: (localMsgId: string, progress: number): void => {
              console.log('test:sendToServer:onProgress', localMsgId, progress);
            },
            onError: (localMsgId: string, error: ChatError): void => {
              console.log('test:sendToServer:onError', localMsgId);
              msg.status = ChatMessageStatus.FAIL;
              updateMessageState({
                localMsgId,
                type: 'one-state',
                items: [convertFromMessage(msg)],
              });
              // msg.status = ChatMessageStatus.FAIL; // !!! Error: You attempted to set the key `status` with the value `3` on an object that is meant to be immutable and has been frozen.
              onSendMessageEnd?.({
                ...msg,
              } as ChatMessage);
              // onSendResult({
              //   ...msg,
              //   status: ChatMessageStatus.FAIL,
              // } as ChatMessage);
              onResult?.({
                localMsgId,
                error,
              });
            },
            onSuccess: (message: ChatMessage): void => {
              console.log('test:sendToServer:onSuccess', message.localMsgId);
              updateMessageState({
                localMsgId: message.localMsgId,
                type: 'one-all',
                items: [convertFromMessage(message, 'sended')],
              });
              onSendMessageEnd?.(message);
              // onSendResult(message);
              onResult?.(undefined);
            },
          } as ChatMessageStatusCallback)
          .then(() => {})
          .catch((error) => {
            console.warn('test:sendToServer:error:', error);
            onResult?.(error);
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
      (text: string, onResult?: (params: any) => void) => {
        if (text.length === 0) {
          return;
        }
        getInputRef().current?.clear();
        setContentRef.current?.('');
        const item = {
          sender: chatId,
          timestamp: timestamp(),
          isSender: true,
          // key: seqId('ml').toString(),
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
          msgs: [{ ...convertFromMessage(msg), ...item }],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg, onResult);
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

    const insertMessage = React.useCallback(
      (params: { msg: ChatMessage }) => {
        const { msg } = params;
        if (msg === undefined) {
          throw new Error('This is impossible.');
        }

        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: [{ ...convertFromMessage(msg) }],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });

        client.chatManager.insertMessage(msg).then().catch();
      },
      [client.chatManager, convertFromMessage, getMsgListRef]
    );

    const sendImageMessage = React.useCallback(
      async ({
        name,
        localPath,
        fileSize,
        width,
        height,
        onResult,
      }: {
        name: string;
        localPath: string;
        fileSize?: number;
        imageType?: string;
        width?: number;
        height?: number;
        onResult?: (params: any) => void;
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
          // key: seqId('ml').toString(),
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
          msgs: [{ ...convertFromMessage(msg), ...item }],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg, onResult);
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
        onResult?: ((params: any) => void) | undefined;
      }) => {
        if (params.localPath.length === 0) {
          return;
        }
        // const localPathD = decodeURIComponent(params.localPath);
        // if (Platform.OS === 'android') {
        //   // const r = await Services.ps.hasMediaLibraryPermission();
        //   // if (r === false) {
        //   // await Services.ps.requestMediaLibraryPermission();
        //   // }

        //   try {
        //     const result = await RNFS.stat(localPathD);
        //     console.log('test:123:', result);
        //   } catch (error) {
        //     console.warn('test:234:', error);
        //   }

        //   return;
        // }
        if (__DEV__) {
          const test_existed = await Services.dcs.isExistedFile(
            params.localPath
          );
          console.log('test:test_existed:', test_existed);
        }

        let modifiedTargetPath = removeFileHeader(params.localPath);
        if (Platform.OS === 'ios') {
          modifiedTargetPath = decodeURIComponent(modifiedTargetPath);
        }
        const item = {
          // key: seqId('ml').toString(),
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
          msgs: [{ ...convertFromMessage(msg), ...item }],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg, params.onResult);
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
        onResult?: ((params: any) => void) | undefined;
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

        // const modifiedTargetPath = removeFileHeader(params.localPath);
        const modifiedTargetPath = params.localPath;
        const item = {
          // key: seqId('ml').toString(),
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
          msgs: [{ ...convertFromMessage(msg), ...item }],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg, params.onResult);
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
      (params: {
        address: string;
        latitude: string;
        longitude: string;
        onResult?: ((params: any) => void) | undefined;
      }) => {
        const item = {
          sender: chatId,
          timestamp: timestamp(),
          isSender: true,
          // key: seqId('ml').toString(),
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
          msgs: [{ ...convertFromMessage(msg), ...item }],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg, params.onResult);
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
      ({
        data,
        onResult,
      }: {
        data: CustomMessageItemType;
        onResult?: (params: any) => void;
      }) => {
        const msg = convertToMessage(data);
        if (msg === undefined) {
          throw new Error('This is impossible.');
        }

        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: [{ ...convertFromMessage(msg), state: 'sending' }],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg, onResult);
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
          msgs: [{ ...convertFromMessage(msg), ...item }],
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
      (msgs: ChatMessage[], onResult?: (params: any) => void) => {
        const items = [] as MessageItemType[];
        for (const msg of msgs) {
          const item = convertFromMessage(msg);
          items.push(item);
          if (
            client.options?.isAutoDownload === false ||
            msg.from === getCurrentId()
          ) {
            checkThumbAttachment(msg);
          }
        }
        getMsgListRef().current?.addMessage({
          direction: 'before',
          msgs: items,
        });
        onResult?.(undefined);
      },
      [
        checkThumbAttachment,
        client.options?.isAutoDownload,
        convertFromMessage,
        getCurrentId,
        getMsgListRef,
      ]
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

    const deleteLocalMessage = React.useCallback(
      (params: {
        convId: string;
        convType: ChatConversationType;
        msgId: string;
        key: string;
        onResult?: ((params: any) => void) | undefined;
      }) => {
        const { convId, convType, msgId, key } = params;
        client.chatManager
          .deleteMessage(convId, convType, msgId)
          .then(() => {
            getMsgListRef().current?.delMessage({ localMsgId: key, msgId });
            params.onResult?.(undefined);
          })
          .catch((error) => {
            params.onResult?.({ error });
          });
      },
      [client.chatManager, getMsgListRef]
    );

    const recallMessage = React.useCallback(
      (params: {
        msgId: string;
        key: string;
        onResult?: ((params: any) => void) | undefined;
      }): void => {
        const { msgId } = params;
        client.chatManager
          .getMessage(msgId)
          .then((msg) => {
            if (msg) {
              client.chatManager
                .recallMessage(msgId)
                .then(() => {
                  getMsgListRef().current?.delMessage({
                    localMsgId: params.key,
                    msgId,
                  });
                  params.onResult?.({ message: msg });
                })
                .catch((error) => {
                  params.onResult?.({ error });
                });
            }
          })
          .catch((error) => {
            params.onResult?.({ error });
          });
      },
      [client.chatManager, getMsgListRef]
    );
    const resendMessage = React.useCallback(
      (params: {
        msgId: string;
        key: string;
        onResult?: (params: any) => void;
      }): void => {
        const { msgId, key, onResult } = params;
        client.chatManager
          .getMessage(msgId)
          .then((msg) => {
            if (msg && msg?.status !== ChatMessageStatus.SUCCESS) {
              getMsgListRef().current?.resendMessage(key);
              client.chatManager
                .resendMessage(msg, {
                  onError(_: string, error: ChatError) {
                    onResult?.({ error });
                  },
                  onSuccess(message: ChatMessage) {
                    updateMessageState({
                      localMsgId: message.localMsgId,
                      type: 'one-all',
                      items: [convertFromMessage(message)],
                    });
                    onResult?.({ message });
                  },
                } as ChatMessageStatusCallback)
                .then()
                .catch((error) => {
                  onResult?.({ error });
                });
            }
          })
          .catch((error) => {
            onResult?.({ error });
          });
      },
      [
        client.chatManager,
        convertFromMessage,
        getMsgListRef,
        updateMessageState,
      ]
    );

    const loadMessage = React.useCallback(
      (msgs: ChatMessage[]) => {
        const items = [] as MessageItemType[];
        for (const msg of msgs) {
          const item = convertFromMessage(msg);
          items.push(item);
          if (
            client.options?.isAutoDownload === false ||
            msg.from === getCurrentId()
          ) {
            checkThumbAttachment(msg);
          }
        }
        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: items,
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
      },
      [
        checkThumbAttachment,
        client.options?.isAutoDownload,
        convertFromMessage,
        getCurrentId,
        getMsgListRef,
      ]
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
      const subscription5 = Keyboard.addListener('keyboardDidHide', (_) => {
        setIsInputRef.current(false);
      });
      const subscription2 = Keyboard.addListener('keyboardWillShow', (_) => {
        setIsInputRef.current(true);
      });
      const subscription4 = Keyboard.addListener('keyboardDidShow', (_) => {
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
        subscription4.remove();
        subscription5.remove();
      };
    }, []);

    if (propsRef?.current) {
      propsRef.current.insertMessage = (params: any) => {
        insertMessage(params);
      };
      propsRef.current.sendImageMessage = (params: any) => {
        const eventParams = params;
        for (const item of eventParams) {
          sendImageMessage(item)
            .then(() => {
              item.onResult?.(undefined);
            })
            .catch((error) => {
              console.warn('test:sendImageMessage:error', error);
              item.onResult?.(error);
            });
        }
      };
      propsRef.current.sendVoiceMessage = (params) => {
        sendVoiceMessage({
          localPath: params.localPath,
          duration: params.duration,
        })
          .then(() => {
            params.onResult?.(undefined);
          })
          .catch((error) => {
            console.warn('test:sendVoiceMessage:error', error);
            params.onResult?.(error);
          });
      };
      propsRef.current.sendTextMessage = (params) => {
        sendTextMessage(params.content, params.onResult);
      };
      propsRef.current.sendCustomMessage = (params) => {
        sendCustomMessage(params);
      };
      propsRef.current.sendFileMessage = (params) => {
        sendFileMessage(params)
          .then(() => {
            params.onResult?.(undefined);
          })
          .catch((error) => {
            console.warn('test:sendFileMessage:error', error);
            params.onResult?.(error);
          });
      };
      propsRef.current.sendVideoMessage = (params) => {
        sendVideoMessage(params)
          .then(() => {
            params.onResult?.(undefined);
          })
          .catch((error) => {
            console.warn('test:sendVideoMessage:error', error);
            params.onResult?.(error);
          });
      };
      propsRef.current.sendLocationMessage = (params) => {
        sendLocationMessage(params);
      };
      propsRef.current.loadHistoryMessage = (params) => {
        loadHistoryMessage(params);
      };
      propsRef.current.deleteLocalMessage = (params) => {
        deleteLocalMessage(params);
      };
      propsRef.current.recallMessage = (params) => {
        recallMessage(params);
      };
      propsRef.current.resendMessage = (params) => {
        resendMessage(params);
      };
      propsRef.current.downloadAttachment = (params) => {
        checkAttachment(params.msg, params.onResult);
      };
    }

    const addListeners = React.useCallback(() => {
      const sub2 = DeviceEventEmitter.addListener(
        MessageChatSdkEvent,
        (event) => {
          const eventType = event.type as MessageChatSdkEventType;

          switch (eventType) {
            case 'onMessagesReceived':
              {
                const eventParams = event.params as { messages: ChatMessage[] };
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
            // case 'onMessagesRecalled': {
            //   const messages = eventParams.messages;
            //   for (const msg of messages) {
            //     if (msg.conversationId === chatId) {
            //       console.log('test:onMessagesRecalled:', msg.msgId);
            //       client.chatManager
            //         .getMessage(msg.msgId)
            //         .then((value) => {
            //           console.log('test:onMessagesRecalled:getMessage:', value);
            //         })
            //         .catch();
            //       // getMsgListRef().current?.recallMessage(msg);
            //     }
            //   }

            //   break;
            // }
            case 'onConversationRead':
              updateMessageState({
                localMsgId: '',
                type: 'all-state',
                items: [
                  {
                    state: 'read',
                  } as MessageItemType,
                ],
              });
              break;
            case 'onMessagesRead':
              {
                const eventParams = event.params as { messages: ChatMessage[] };
                for (const msg of eventParams.messages) {
                  updateMessageState({
                    localMsgId: msg.localMsgId,
                    type: 'one-state',
                    items: [
                      {
                        key: msg.localMsgId,
                        state: 'read',
                      } as MessageItemType,
                    ],
                  });
                }
              }
              break;
            case 'onGroupMessageRead':
              {
                const eventParams = event.params as {
                  messagesAcks: ChatGroupMessageAck[];
                };
                for (const ack of eventParams.messagesAcks) {
                  updateMessageState({
                    localMsgId: ack.msg_id,
                    type: 'one-state',
                    items: [
                      {
                        msgId: ack.msg_id,
                        state: 'read',
                      } as MessageItemType,
                    ],
                  });
                }
              }
              break;
            case 'onMessagesDelivered':
              {
                const eventParams = event.params as { messages: ChatMessage[] };
                for (const msg of eventParams.messages) {
                  updateMessageState({
                    localMsgId: msg.localMsgId,
                    type: 'one-state',
                    items: [
                      {
                        key: msg.localMsgId,
                        state: 'arrived',
                      } as MessageItemType,
                    ],
                  });
                }
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
    }, [chatId, loadMessage, updateMessageState]);

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
        if (
          messageBubbleList?.MessageBubbleListPropsP.onRequestHistoryMessage
        ) {
          messageBubbleList?.MessageBubbleListPropsP.onRequestHistoryMessage({
            earliestId: params.earliestId,
          });
        } else {
          requestHistoryMessage(params.earliestId);
        }
      },
      [messageBubbleList?.MessageBubbleListPropsP, requestHistoryMessage]
    );

    // const ChatMessageBubbleList = () =>
    //   messageBubbleList ? (
    //     <messageBubbleList.MessageBubbleListP
    //       ref={messageBubbleList.MessageBubbleListRefP}
    //       {...messageBubbleList.MessageBubbleListPropsP}
    //       onPressed={() => {
    //         Keyboard.dismiss();
    //         _onFace('face');
    //         messageBubbleList.MessageBubbleListPropsP?.onPressed?.();
    //       }}
    //       onRequestHistoryMessage={onRequestHistoryMessage}
    //     />
    //   ) : (
    //     <MessageBubbleList
    //       ref={msgListRef}
    //       onPressed={() => {
    //         Keyboard.dismiss();
    //         _onFace('face');
    //       }}
    //       onRequestHistoryMessage={onRequestHistoryMessage}
    //     />
    //   );

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

    // There are problems with react-navigation native stack and keyboard being used together.
    const chatInputHeight = 60;
    const keyboardVerticalOffsetInternal = sf(
      Platform.select({ ios: chatInputHeight + bottom, android: 0 })!
    );

    return (
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            _onFace('face');
          }}
        >
          <View
            style={{
              flexGrow: 1,
              // backgroundColor: '#fff8dc',
            }}
          >
            <ChatMessageBubbleList
              messageBubbleList={messageBubbleList}
              _onFace={_onFace}
              onRequestHistoryMessage={onRequestHistoryMessage}
              msgListRef={msgListRef}
            />
          </View>
        </TouchableWithoutFeedback>
        <KeyboardAvoidingView
          pointerEvents="box-none"
          // style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={
            keyboardVerticalOffset ?? keyboardVerticalOffsetInternal
          }
          onLayout={(event) => {
            console.log('test:zuoyu:1:', event.nativeEvent);
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

          <FaceList height={faceHeightRef} onFace={onFaceInternal} />
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
   * Insert a local message.
   *
   * Typical application: Add prompt messages.
   */
  insertMessage: (params: { msg: ChatMessage }) => void;
  /**
   * send image message
   */
  sendImageMessage: (
    params: {
      name: string;
      localPath: string;
      fileSize: number;
      imageType: string;
      width: number;
      height: number;
      onResult?: (params: any) => void;
    }[]
  ) => void;
  /**
   * send voice message
   */
  sendVoiceMessage: (params: {
    localPath: string;
    fileSize?: number;
    duration?: number;
    onResult?: (params: any) => void;
  }) => void;

  /**
   * send a text message.
   */
  sendTextMessage: (params: {
    content: string;
    onResult?: (params: any) => void;
  }) => void;

  /**
   * send a custom message.
   */
  sendCustomMessage: (params: {
    data: CustomMessageItemType;
    onResult?: (params: any) => void;
  }) => void;

  /**
   * send a file message.
   */
  sendFileMessage: (params: {
    localPath: string;
    fileSize?: number;
    displayName?: string;
    onResult?: (params: any) => void;
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
    onResult?: (params: any) => void;
  }) => void;

  /**
   * send a location message.
   */
  sendLocationMessage: (params: {
    address: string;
    latitude: string;
    longitude: string;
    onResult?: (params: any) => void;
  }) => void;

  /**
   * load history messages.
   */
  loadHistoryMessage: (
    msgs: ChatMessage[],
    onResult?: (params: any) => void
  ) => void;

  /**
   * delete local message.
   */
  deleteLocalMessage: (params: {
    convId: string;
    convType: ChatConversationType;
    msgId: string;
    key: string;
    onResult?: (params: any) => void;
  }) => void;

  /**
   * Undo a message that has been successfully sent.
   */
  recallMessage: (params: {
    msgId: string;
    key: string;
    onResult?: (params: any) => void;
  }) => void;

  /**
   * Resend the message that failed to be sent.
   */
  resendMessage: (params: {
    msgId: string;
    key: string;
    onResult?: (params: any) => void;
  }) => void;

  /**
   * download message attachment.
   */
  downloadAttachment: (params: {
    msg: ChatMessage;
    onResult?: (params?: any) => void;
  }) => void;
};

/**
 * ChatFragment properties
 */
export type ChatFragmentProps = {
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
  /**
   * Try to solve the keyboard height problem.
   */
  keyboardVerticalOffset?: number;
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
    keyboardVerticalOffset,
  } = props;
  const params = screenParams.params as {
    chatId: string;
    chatType: number;
  };

  const chatId = params.chatId;
  const chatType = params.chatType;
  const chatContentRef = React.useRef<ChatContentRef>({} as any);

  if (propsRef?.current) {
    propsRef.current.insertMessage = (params) => {
      chatContentRef?.current.insertMessage(params);
    };
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
    propsRef.current.loadHistoryMessage = (params) => {
      chatContentRef?.current.loadHistoryMessage(params);
    };
    propsRef.current.deleteLocalMessage = (params) => {
      chatContentRef?.current.deleteLocalMessage(params);
    };
    propsRef.current.recallMessage = (params) => {
      chatContentRef?.current.recallMessage(params);
    };
    propsRef.current.resendMessage = (params) => {
      chatContentRef?.current.resendMessage(params);
    };
    propsRef.current.downloadAttachment = (params) => {
      chatContentRef?.current.downloadAttachment(params);
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
        keyboardVerticalOffset={keyboardVerticalOffset}
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
