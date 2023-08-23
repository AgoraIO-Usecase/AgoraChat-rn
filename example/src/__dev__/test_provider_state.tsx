import * as React from 'react';
import { GestureResponderEvent, View } from 'react-native';

export const useForceUpdate = () => {
  // useState causes component updates.
  const [, updater] = React.useState(0);
  return React.useCallback(() => updater((prev) => prev + 1), []);
};

type TestData = {
  name: string;
  callback: () => void;
};
const TestDataContext = React.createContext<TestData | undefined>(undefined);
type TestDataContextProps = React.PropsWithChildren<{ data: TestData }>;
function TestDataContextProvider({ data, children }: TestDataContextProps) {
  console.log('test:TestDataContextProvider:');
  // const updater = React.useRef(useForceUpdate());
  const updater = useForceUpdate();
  // const [count, setCount] = React.useState(0);
  return (
    <TestDataContext.Provider value={data}>
      <View
        onResponderRelease={() => {
          console.log('test:TestDataContextProvider:onResponderRelease:');
          // updater.current?.();
          // setCount(count + 1);
          updater();
        }}
        onResponderGrant={() => {
          console.log('test:TestDataContextProvider:onResponderGrant:');
          // updater.current?.();
          // setCount(count + 1);
          updater();
        }}
        onStartShouldSetResponder={(_: GestureResponderEvent): boolean => {
          return false;
        }}
        onStartShouldSetResponderCapture={(
          _: GestureResponderEvent
        ): boolean => {
          return false;
        }}
        style={{ height: 200, width: 200, backgroundColor: 'green' }}
      >
        {children}
      </View>
    </TestDataContext.Provider>
  );
}
TestDataContext.displayName = 'TestDataContext';
export function useTestDataContext(): TestData {
  const data = React.useContext(TestDataContext);
  if (!data) throw Error(`${TestDataContext.displayName} is not provided`);
  return data;
}

function SubComponent(): JSX.Element {
  const data = useTestDataContext();
  console.log('test:SubComponent:', data);
  const [count, setCount] = React.useState(0);
  return (
    <View
      style={{ height: 100, width: 100, backgroundColor: 'blue' }}
      onResponderRelease={() => {
        console.log('test:SubComponent:onResponderRelease:');
        // Does changing the provider context cause redrawing of subcomponents?
        // data.name = 'change';
        data.callback();
        setCount(count + 1);
      }}
      onResponderGrant={() => {
        console.log('test:SubComponent:onResponderGrant:');
        data.callback();
        setCount(count + 1);
      }}
      onStartShouldSetResponder={(_: GestureResponderEvent): boolean => {
        return true;
      }}
      onStartShouldSetResponderCapture={(_: GestureResponderEvent): boolean => {
        return true;
      }}
    />
  );
}

export default function testProvider() {
  return (
    <TestDataContextProvider
      data={{
        name: 'ls',
        callback: () => {
          console.log('test:testProvider:callback:');
        },
      }}
    >
      <SubComponent />
    </TestDataContextProvider>
  );
}
