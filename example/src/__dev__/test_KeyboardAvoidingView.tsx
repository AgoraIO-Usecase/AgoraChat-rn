import * as React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import type { ChatMessageChatType } from 'react-native-chat-sdk';
import {
  Button,
  createStyleSheet,
  getScaleFactor,
  LocalIcon,
  LocalIconName,
  TextInput,
  useI18nContext,
} from 'react-native-chat-uikit';

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

export default function TestKeyboardAvoidingView() {
  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'red',
            height: 100,
          }}
        >
          <Text>hh</Text>
        </View>
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ChatInput chatId="" chatType={1} />
        {/* <View
          style={{
            backgroundColor: 'green',
            height: 60,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TextInput />
        </View> */}
      </KeyboardAvoidingView>
    </View>
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
