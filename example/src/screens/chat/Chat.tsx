import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  Animated,
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
import {
  Button,
  createStyleSheet,
  FACE_ASSETS,
  getScaleFactor,
  LocalIcon,
  seqId,
  Services,
  TextInput,
  timestamp,
  useBottomSheet,
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
import { useStyleSheet } from '../../hooks/useStyleSheet';
import type { RootScreenParamsList } from '../../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

let count = 0;
export default function ChatScreen(_: Props): JSX.Element {
  console.log('test:ChatScreen:');
  const sf = getScaleFactor();
  const theme = useThemeContext();
  const ms = Services.ms;
  const TextInputRef = React.useRef<RNTextInput>(null);
  const msgListRef = React.useRef<MessageListRef>(null);
  const { bottom } = useSafeAreaInsets();
  const sheet = useBottomSheet();
  const faces = ['face', 'key'] as ('face' | 'key')[];
  const [face, setFace] = React.useState(faces[0]);
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
    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);

  const _calculateInputWidth = (width: number, isInput: boolean) => {
    return sf(width - 15 * 2 - 28 - 12 * 2 - 18 - 14 - (isInput ? 66 : 28));
  };

  const _onPressed = (value: string) => {
    setContent(content + moji.convert.fromCodePoint(value));
    setIsInput(true);
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

  const _showFaces = () => {
    const arr = FACE_ASSETS;
    return (
      <Animated.View style={{ height: faceHeightRef }}>
        <ScrollView>
          <View style={styles.faceContainer}>
            {arr.map((value) => {
              return (
                <TouchableOpacity
                  key={value}
                  style={{ padding: sf(5) }}
                  onPress={() => {
                    _onPressed(value);
                  }}
                >
                  <Text style={{ fontSize: sf(32) }}>
                    {moji.convert.fromCodePoint(value)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </Animated.View>
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
          <TouchableWithoutFeedback
            onPress={() => {
              keyboardVerticalOffset = sf(0);
              Keyboard.dismiss();
              _onFace('face');
            }}
          >
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexGrow: 1,
                  backgroundColor: '#fff8dc',
                }}
              >
                <MessageBubbleList ref={msgListRef} />
              </View>

              <View
                style={styles.inputContainer}
                onLayout={(_) => {
                  // console.log('test:event:', event.nativeEvent.layout);
                }}
              >
                <LocalIcon name="wave_in_circle" color="A5A7A6" size={28} />
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
                              console.log('test:onPress:data:');
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
                              console.log('test:onPress:data:');
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
                              console.log('test:onPress:data:');
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
              </View>

              {_showFaces()}
            </View>
          </TouchableWithoutFeedback>
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
});
