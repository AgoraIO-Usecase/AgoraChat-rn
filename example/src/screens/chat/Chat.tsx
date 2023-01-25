import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
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
import {
  Button,
  FACE_ASSETS,
  LocalIcon,
  seqId,
  TextInput,
  timestamp,
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
  const TextInputRef = React.useRef<RNTextInput>(null);
  const msgListRef = React.useRef<MessageListRef>(null);
  const { bottom } = useSafeAreaInsets();
  const faces = ['face', 'key'] as ('face' | 'key')[];
  const [face, setFace] = React.useState(faces[0]);
  const [content, setContent] = React.useState('');
  const [isInput, setIsInput] = React.useState(false);
  const { width } = useWindowDimensions();
  let keyboardVerticalOffset = bottom + 50;

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
    return width - 15 * 2 - 28 - 12 * 2 - 18 - 14 - (isInput ? 66 : 28);
  };

  const _onPressed = (value: string) => {
    console.log('test:', value);
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

  const _showFaces = () => {
    const arr = FACE_ASSETS;
    return (
      <View style={{ height: 300 }}>
        <ScrollView>
          <View
            style={{
              flexWrap: 'wrap',
              flexDirection: 'row',
              padding: 15,
              justifyContent: 'space-evenly',
            }}
          >
            {arr.map((value) => {
              return (
                <TouchableOpacity
                  key={value}
                  style={{ padding: 5 }}
                  onPress={() => {
                    _onPressed(value);
                  }}
                >
                  <Text style={{ fontSize: 32 }}>
                    {moji.convert.fromCodePoint(value)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
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
          <TouchableWithoutFeedback
            onPress={() => {
              keyboardVerticalOffset = 0;
              Keyboard.dismiss();
              setFace('face');
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
                style={{
                  height: 60,
                  flexDirection: 'row',
                  paddingHorizontal: 15,
                  alignItems: 'center',
                }}
                onLayout={(_) => {
                  // console.log('test:event:', event.nativeEvent.layout);
                }}
              >
                <LocalIcon name="wave_in_circle" color="A5A7A6" size={28} />
                <View
                  style={{
                    flexGrow: 1,
                    paddingVertical: 12,
                    paddingHorizontal: 12,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      flexGrow: 1,
                      borderRadius: 24,
                      overflow: 'hidden',
                      borderColor: '#A5A7A6',
                      borderWidth: 1,
                    }}
                  >
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
                        setFace('face');
                      }}
                    />

                    <TouchableOpacity
                      style={{ justifyContent: 'center' }}
                      onPress={() => {
                        setFace(face === 'face' ? faces[1] : faces[0]);
                        Keyboard.dismiss();
                      }}
                    >
                      <LocalIcon
                        name={face as 'face' | 'key'}
                        color="#A5A7A6"
                        size={28}
                      />
                    </TouchableOpacity>

                    <View style={{ width: 4 }} />
                  </View>
                </View>
                {isInput ? (
                  <View style={{ justifyContent: 'center' }}>
                    <Button
                      style={{
                        height: 36,
                        width: 66,
                        borderRadius: 18,
                      }}
                      onPress={() => {
                        _sendMessage(content);
                      }}
                    >
                      Send
                    </Button>
                  </View>
                ) : (
                  <LocalIcon name="plus_in_circle" color="#A5A7A6" size={28} />
                )}
              </View>

              {face === 'key' ? _showFaces() : null}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
