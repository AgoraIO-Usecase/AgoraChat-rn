import {
  Platform,
  requireNativeComponent,
  UIManager,
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

// import type rn from 'react-native';
// import type { addons } from 'react-native';

export { Container, ContainerProps } from './containers';
export { default as DevDebug } from './screens/DevDebug';
export { default as Placeholder } from './screens/Placeholder';
export { default as DarkTheme } from './theme/DarkTheme';
export { default as DefaultTheme } from './theme/DefaultTheme';
export { default as LightTheme } from './theme/LightTheme';
export { default as ThemeContext } from './theme/ThemeContext';
export { default as ThemeProvider } from './theme/ThemeProvider';
export { default as useTheme } from './theme/useTheme';
export * from './types';

// declare module 'example/src/common' {
//   import type DevDebugInternal from './example/src/common/screens/DevDebug';
//   export interface TestModuleStatic {
//     verifySnapshot: (done: (indicator?: any) => void) => void;
//     markTestPassed: (indicator: any) => void;
//     markTestCompleted: () => void;
//   }

//   export const TestModule: DevDebugInternal;
//   export type TestModule = DevDebugInternal;
// }

// function test222(): void {
//   interface ss extends rn.addons.TestModule {}
//   interface sss extends addons.TestModule {}
// }
