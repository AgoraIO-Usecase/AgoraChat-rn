import {
  requireNativeComponent,
  UIManager,
  Platform,
  ViewStyle,
} from 'react-native';
import { ChatClient, ChatOptions } from 'react-native-chat-sdk';

export function multiply(a: number, b: number): Promise<number> {
  const r = ChatClient.getInstance().init(
    new ChatOptions({ appKey: 'test', autoLogin: false })
  );
  console.log('test:', r);
  return Promise.resolve(a * b);
}
const LINKING_ERROR =
  `The package 'react-native-chat-uikit' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

type ChatUikitProps = {
  color: string;
  style: ViewStyle;
};

const ComponentName = 'ChatUikitView';

export const ChatUikitView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<ChatUikitProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };
