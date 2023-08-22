import * as React from 'react';
import { Pressable, View } from 'react-native';

export const useForceUpdate = () => {
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
  const [count, setCount] = React.useState(0);
  return (
    <TestDataContext.Provider value={data}>
      <Pressable
        onPress={() => {
          console.log('test:TestDataContextProvider:onPress:');
          // updater.current?.();
          setCount(count + 1);
        }}
        style={{ height: 200, width: 200, backgroundColor: 'green' }}
      >
        {children}
      </Pressable>
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
  return (
    <View
      style={{ height: 100, width: 100, backgroundColor: 'blue' }}
      onTouchEnd={() => {
        console.log('test:SubComponent:onTouchEnd:');
        // Does changing the provider context cause redrawing of subcomponents?
        // data.name = 'change';
        data.callback();
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
