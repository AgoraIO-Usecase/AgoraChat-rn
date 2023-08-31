import * as React from 'react';
import { View } from 'react-native';

type TestData = {
  name: string;
  callback: () => void;
  callbackWithParam?: (params: any) => void;
};
const TestDataContext = React.createContext<TestData | undefined>(undefined);
type TestDataContextProps = React.PropsWithChildren<{ data: TestData }>;
function TestDataContextProvider({ data, children }: TestDataContextProps) {
  console.log('test:TestDataContextProvider:', data);
  return (
    <TestDataContext.Provider value={data}>{children}</TestDataContext.Provider>
  );
}
TestDataContext.displayName = 'TestDataContext';
export function useTestDataContext(): TestData {
  console.log('test:useTestDataContext:');
  const data = React.useContext(TestDataContext);
  if (!data) throw Error(`${TestDataContext.displayName} is not provided`);
  return data;
}

function SubComponent(): JSX.Element {
  const data = useTestDataContext();
  console.log('test:SubComponent:', data);
  return (
    <View
      style={{ height: 100, width: 100, backgroundColor: 'red' }}
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
  console.log('test:testProvider:');
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
