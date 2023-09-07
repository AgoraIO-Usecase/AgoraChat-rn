import * as React from 'react';
import { View } from 'react-native';

type TestData = {
  name: string;
  callback: () => void;
  addListener?: (listener: () => void) => void;
  removeListener?: (listener: () => void) => void;
  dispatchNotification?: () => void;
};
const TestDataContext = React.createContext<TestData | undefined>(undefined);
type TestDataContextProps = React.PropsWithChildren<{ data: TestData }>;
function TestDataContextProvider({ data, children }: TestDataContextProps) {
  console.log('test:TestDataContextProvider:');
  const [color, setColor] = React.useState('red');
  // const map = React.useRef<Map<string, Function>>(new Map());
  const list = React.useRef<Set<Function>>(new Set());

  if (data) {
    data.addListener = (listener: () => void) => {
      console.log('test:TestDataContextProvider:addListener');
      // map.current.set(listener.name, listener);
      list.current.add(listener);
    };
  }
  if (data) {
    data.removeListener = (listener: () => void) => {
      console.log('test:TestDataContextProvider:removeListener');
      // map.current.delete(listener.name);
      list.current.delete(listener);
    };
  }
  if (data) {
    data.dispatchNotification = () => {
      console.log('test:TestDataContextProvider:dispatchNotification');
      // map.current.forEach((listener) => {
      //   console.log('test:dispatchNotification:listener');
      //   listener();
      // });
      list.current.forEach((listener) => {
        console.log('test:dispatchNotification:listener');
        listener();
      });
    };
  }

  React.useEffect(() => {
    return () => {};
  }, [data, data.addListener, data.removeListener]);

  return (
    <TestDataContext.Provider value={data}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{ height: 300, width: 300, backgroundColor: color }}
          onResponderRelease={() => {}}
          onResponderGrant={() => {
            console.log('test:TestDataContextProvider:onResponderGrant:');
            setColor(color === 'red' ? 'green' : 'red');
          }}
          onStartShouldSetResponder={(): boolean => {
            return true;
          }}
          onStartShouldSetResponderCapture={(): boolean => {
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

function SubComponent({
  name,
  children,
}: React.PropsWithChildren<{ name?: string }>): JSX.Element {
  const data = useTestDataContext();
  console.log('test:SubComponent:', data, name);
  const [color, setColor] = React.useState('yellow');

  // const onNotification = React.useCallback(() => {
  //   console.log('test:SubComponent:onNotification:', name);
  // }, [name]);

  // React.useEffect(() => {
  //   data?.addListener?.(onNotification);
  //   return () => {
  //     data?.removeListener?.(onNotification);
  //   };
  // }, [data, onNotification]);

  React.useEffect(() => {
    const onNotification = () => {
      console.log('test:SubComponent:onNotification:', name);
    };
    data?.addListener?.(onNotification);
    return () => {
      data?.removeListener?.(onNotification);
    };
  }, [data, name]);

  return (
    <View
      style={{ height: 200, width: 200, backgroundColor: color }}
      onResponderRelease={() => {}}
      onResponderGrant={() => {
        console.log('test:SubComponent:onResponderGrant:');
        data.callback();
        setColor(color === 'yellow' ? 'blue' : 'yellow');
      }}
      onStartShouldSetResponder={(): boolean => {
        return true;
      }}
      onStartShouldSetResponderCapture={(): boolean => {
        return false;
      }}
    >
      {children}
    </View>
  );
}

const SubComponentMemo = React.memo(SubComponent);

function SubSubComponent({ name }: { name?: string }): JSX.Element {
  const data = useTestDataContext();
  console.log('test:SubSubComponent:', data, name);
  const [color, setColor] = React.useState('orange');
  return (
    <View
      style={{ height: 100, width: 100, backgroundColor: color }}
      onResponderRelease={() => {}}
      onResponderGrant={() => {
        console.log('test:SubSubComponent:onResponderGrant:');
        data.callback();
        setColor(color === 'orange' ? 'red' : 'orange');
        data?.dispatchNotification?.();
      }}
      onStartShouldSetResponder={(): boolean => {
        return true;
      }}
      onStartShouldSetResponderCapture={(): boolean => {
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
      <SubComponentMemo name={'submemo'} />
      <SubComponent name={'sub'}>
        <SubSubComponent name={'subsub'} />
      </SubComponent>
    </TestDataContextProvider>
  );
}
