import * as React from 'react';
import { GestureResponderEvent, View } from 'react-native';

// export const useForceUpdate = () => {
//   // useState causes component updates.
//   const [, updater] = React.useState(0);
//   return React.useCallback(() => updater((prev) => prev + 1), []);
// };

type TestData = {
  name: string;
  callback: () => void;
};
const TestDataContext = React.createContext<TestData | undefined>(undefined);
type TestDataContextProps = React.PropsWithChildren<{ data: TestData }>;
function TestDataContextProvider({ data, children }: TestDataContextProps) {
  console.log('test:TestDataContextProvider:');
  // const updater = React.useRef(useForceUpdate());
  // const updater = useForceUpdate();
  const [color, setColor] = React.useState('red');
  return (
    <TestDataContext.Provider value={data}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{ height: 200, width: 200, backgroundColor: color }}
          onResponderRelease={() => {
            // console.log('test:TestDataContextProvider:onResponderRelease:');
          }}
          onResponderGrant={() => {
            console.log('test:TestDataContextProvider:onResponderGrant:');
            setColor(color === 'red' ? 'green' : 'red');
          }}
          onStartShouldSetResponder={(_: GestureResponderEvent): boolean => {
            return true;
          }}
          onStartShouldSetResponderCapture={(
            _: GestureResponderEvent
          ): boolean => {
            return false;
          }}
        >
          {children}
        </View>
      </View>
    </TestDataContext.Provider>
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
  const [color, setColor] = React.useState('yellow');
  return (
    <View
      style={{ height: 100, width: 100, backgroundColor: color }}
      onResponderRelease={() => {
        // console.log('test:SubComponent:onResponderRelease:');
        // data.callback();
        // setColor(color === 'yellow' ? 'blue' : 'yellow');
      }}
      onResponderGrant={() => {
        console.log('test:SubComponent:onResponderGrant:');
        data.callback();
        setColor(color === 'yellow' ? 'blue' : 'yellow');
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
