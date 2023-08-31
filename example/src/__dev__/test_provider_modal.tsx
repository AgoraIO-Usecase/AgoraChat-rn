import * as React from 'react';
import { GestureResponderEvent, View } from 'react-native';
import { FragmentContainer, useBottomSheet } from 'react-native-chat-uikit';

function OtherComponent(): JSX.Element {
  const [color, setColor] = React.useState('#897336');
  let xxx = 0;
  let yyy = React.useRef(0);
  console.log('test:OtherComponent:', ++xxx, ++yyy.current);
  const sheet = useBottomSheet();

  const openSheet = () => {
    console.log('test:OtherComponent:openSheet:');
    sheet.openSheet({
      sheetItems: [
        {
          title: '1',
          onPress: () => {
            console.log('test:OtherComponent:openSheet:onPress:');
          },
        },
      ],
    });
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{ height: 100, width: 100, backgroundColor: color }}
        onResponderRelease={() => {
          // console.log('test:OtherComponent:onResponderRelease:');
          // data.callback();
          // setColor(color === 'yellow' ? 'blue' : 'yellow');
        }}
        onResponderGrant={() => {
          console.log('test:OtherComponent:onResponderGrant:');
          setColor(color === '#897336' ? '#862802' : '#897336');
          openSheet();
        }}
        onStartShouldSetResponder={(_: GestureResponderEvent): boolean => {
          return true;
        }}
        onStartShouldSetResponderCapture={(
          _: GestureResponderEvent
        ): boolean => {
          return true;
        }}
      />
    </View>
  );
}

export function SubComponent(): JSX.Element {
  console.log('test:SubComponent:');
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

export default function TestProvider(): JSX.Element {
  const enableModals = false;
  return (
    <View style={{ flex: 1 }}>
      <FragmentContainer enableModals={enableModals}>
        <OtherComponent />
      </FragmentContainer>
    </View>
  );
}
