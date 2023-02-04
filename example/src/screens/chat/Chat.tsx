import type { NativeStackScreenProps } from '@react-navigation/native-stack';
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
  Button,
  createStyleSheet,
  FACE_ASSETS,
  getScaleFactor,
  LocalIcon,
  LocalIconName,
  seqId,
  Services,
  TextInput,
  timestamp,
  useBottomSheet,
  useContentStateContext,
  useThemeContext,
} from 'react-native-chat-uikit';
import { ScrollView } from 'react-native-gesture-handler';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import moji from 'twemoji';

import MessageBubbleList, {
  MessageListRef,
  TextMessageItemType,
} from '../../components/MessageBubbleList';
import { useAppI18nContext } from '../../contexts/AppI18nContext';
import { useStyleSheet } from '../../hooks/useStyleSheet';
import type { RootScreenParamsList } from '../../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

type FaceListProps = {
  height: Animated.Value;
  // onPress?: (face: string) => void;
};

const FaceList = React.memo(
  (props: FaceListProps) => {
    console.log('test:111:');
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

let count = 0;
export default function ChatScreen(_: Props): JSX.Element {
  console.log('test:ChatScreen:');
  const sf = getScaleFactor();
  const theme = useThemeContext();
  const { chat } = useAppI18nContext();
  const ms = Services.ms;
  const TextInputRef = React.useRef<RNTextInput>(null);
  const msgListRef = React.useRef<MessageListRef>(null);
  const { bottom } = useSafeAreaInsets();
  const sheet = useBottomSheet();
  const state = useContentStateContext();
  const faces = ['face', 'key'] as ('face' | 'key')[];
  const waves = ['wave_in_circle', 'key'] as ('wave_in_circle' | 'key')[];
  const [face, setFace] = React.useState(faces[0]);
  const [wave, setWave] = React.useState(waves[0]);
  const [content, setContent] = React.useState('');
  const [isInput, setIsInput] = React.useState(false);
  const { width } = useWindowDimensions();
  const faceHeight = sf(300);
  const faceHeightRef = React.useRef(new Animated.Value(0)).current;
  let keyboardVerticalOffset = sf(bottom + 50);

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

  React.useEffect(() => {
    const subscription1 = Keyboard.addListener('keyboardWillHide', (_) => {
      setIsInput(false);
    });
    const subscription2 = Keyboard.addListener('keyboardWillShow', (_) => {
      setIsInput(true);
    });
    const subscription3 = DeviceEventEmitter.addListener('onFace', (face) => {
      const s = content + moji.convert.fromCodePoint(face);
      setContent(s);
      setIsInput(true);
    });
    return () => {
      subscription1.remove();
      subscription2.remove();
      subscription3.remove();
    };
  }, [content]);

  const _calculateInputWidth = (width: number, isInput: boolean) => {
    return sf(width - 15 * 2 - 28 - 12 * 2 - 18 - 14 - (isInput ? 66 : 28));
  };

  const _sendMessage = (text: string) => {
    if (text.length === 0) {
      return;
    }
    setContent('');
    msgListRef.current?.addMessage([
      {
        sender: 'zs',
        timestamp: timestamp(),
        isSender: ++count % 2 === 0 ? true : false,
        key: seqId('ml').toString(),
        text: text,
        type: 'text',
      } as TextMessageItemType,
    ]);
    msgListRef.current?.scrollToEnd();
  };

  const _onFace = (value?: 'face' | 'key') => {
    setFace(value);
    if (value === 'key') {
      showFace();
    } else if (value === 'face') {
      hideFace();
    } else {
      hideFace();
    }
  };

  const _content = () => {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexGrow: 1,
            backgroundColor: '#fff8dc',
          }}
        >
          <MessageBubbleList
            ref={msgListRef}
            onPressed={() => {
              keyboardVerticalOffset = sf(0);
              Keyboard.dismiss();
              _onFace('face');
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
              _onFace('face');
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
                      width: _calculateInputWidth(width, isInput),
                    }}
                    onChangeText={(text) => {
                      setContent(text);
                    }}
                    value={content}
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
                      _sendMessage(c);
                    }}
                    onFocus={() => {
                      _onFace('face');
                    }}
                  />

                  <TouchableOpacity
                    style={{ justifyContent: 'center' }}
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
                <View style={{ justifyContent: 'center' }}>
                  <Button
                    style={{
                      height: sf(36),
                      width: sf(66),
                      borderRadius: sf(18),
                    }}
                    onPress={() => {
                      _sendMessage(content);
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
                        <Text style={{ color: 'white' }}>
                          {chat.voiceState}
                        </Text>
                      </View>
                    ),
                  });
                }}
                onPressOut={() => {
                  state.hideState();
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
  };

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
              _onFace('face');
            }}
          > */}
          {_content()}
          {/* </TouchableWithoutFeedback> */}
        </KeyboardAvoidingView>
      </View>
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
