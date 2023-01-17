import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import {
  Button,
  LocalIcon,
  seqId,
  TextInput,
  timestamp,
} from 'react-native-chat-uikit';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

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
  const [content, setContent] = React.useState('');
  const [isInput, setIsInput] = React.useState(false);
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
              console.log('test:rr:');
              keyboardVerticalOffset = 0;
              Keyboard.dismiss();
            }}
          > */}
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
                  />
                  <LocalIcon name="face" color="#A5A7A6" size={28} />
                  <View style={{ width: 4 }} />
                </View>
              </View>
              {isInput ? (
                <View style={{ height: 30, justifyContent: 'center' }}>
                  <Button
                    onPress={() => {
                      _sendMessage(content);
                    }}
                  >
                    send
                  </Button>
                </View>
              ) : (
                <LocalIcon name="plus_in_circle" color="#A5A7A6" size={28} />
              )}
            </View>
          </View>
          {/* </TouchableWithoutFeedback> */}
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
