// import {
//   Platform,
//   requireNativeComponent,
//   UIManager,
//   ViewStyle,
// } from 'react-native';
// import { ChatClient, ChatOptions } from 'react-native-chat-sdk';

// export function multiply(a: number, b: number): Promise<number> {
//   const r = ChatClient.getInstance().init(
//     new ChatOptions({ appKey: 'test', autoLogin: false })
//   );
//   console.log('test:', r);
//   return Promise.resolve(a * b);
// }
// const LINKING_ERROR =
//   `The package 'react-native-chat-callkit' doesn't seem to be linked. Make sure: \n\n` +
//   Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
//   '- You rebuilt the app after installing the package\n' +
//   '- You are not using Expo Go\n';

// type ChatCallkitProps = {
//   color: string;
//   style: ViewStyle;
// };

// const ComponentName = 'ChatCallkitView';

// export const ChatCallkitView =
//   UIManager.getViewManagerConfig(ComponentName) != null
//     ? requireNativeComponent<ChatCallkitProps>(ComponentName)
//     : () => {
//         throw new Error(LINKING_ERROR);
//       };

export * from './call/index';
export { GlobalContainer } from './containers/GlobalContainer';
export { useCallkitSdkContext } from './contexts/CallkitSdkContext';
export {
  CallEndReason,
  CallErrorCode,
  CallErrorType,
  CallState,
  CallType,
} from './enums';
export * from './types';
export { InviteeListProps, MultiCall, MultiCallProps } from './view/MultiCall';
export { SingleCall, SingleCallProps } from './view/SingleCall';
