// import type rn from 'react-native';
// import type { addons } from 'react-native';

export type { IMSDKOption, IMUIKitContainerProps } from './containers';
export { default as IMUIKitContainer } from './containers';
export { default as DevDebug } from './screens/DevDebug';
export { default as Placeholder } from './screens/Placeholder';
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
