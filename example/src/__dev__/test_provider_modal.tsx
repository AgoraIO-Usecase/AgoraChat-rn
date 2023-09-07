import * as React from 'react';
import { GestureResponderEvent, View } from 'react-native';
import { FragmentContainer, useBottomSheet } from 'react-native-chat-uikit';

/**
 * use useBottomSheet, but no use useState
 */
function Block3({ name }: { name?: string }): JSX.Element {
  const [color] = React.useState('#447d36');
  let xxx = 0;
  let yyy = React.useRef(0);
  console.log('test:Block3:', ++xxx, ++yyy.current, name);
  const { openSheet } = useBottomSheet();

  const openSheetI = React.useCallback(() => {
    console.log('test:Block3:openSheet:');
    openSheet({
      sheetItems: [
        {
          title: '1',
          onPress: () => {
            console.log('test:Block3:openSheet:onPress:');
          },
        },
      ],
    });
  }, [openSheet]);
  return (
    <View
      style={{ height: 100, width: 100, backgroundColor: color }}
      onResponderRelease={() => {}}
      onResponderGrant={() => {
        console.log('test:Block3:onResponderGrant:');
        openSheetI();
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

const Block3Memo = React.memo(Block3);

/**
 * use useBottomSheet, but no use useState
 */
function Block2({ name }: { name?: string }): JSX.Element {
  const [color] = React.useState('#140d36');
  let xxx = 0;
  let yyy = React.useRef(0);
  console.log('test:Block2:', ++xxx, ++yyy.current, name);
  const { openSheet } = useBottomSheet();

  const openSheetI = React.useCallback(() => {
    console.log('test:Block2:openSheet:');
    openSheet({
      sheetItems: [
        {
          title: '1',
          onPress: () => {
            console.log('test:Block2:openSheet:onPress:');
          },
        },
      ],
    });
  }, [openSheet]);
  return (
    <View
      style={{ height: 100, width: 100, backgroundColor: color }}
      onResponderRelease={() => {}}
      onResponderGrant={() => {
        console.log('test:Block2:onResponderGrant:');
        openSheetI();
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

/**
 * use useState, but no use useBottomSheet
 */
function Block4({ name }: { name?: string }): JSX.Element {
  const [color, setColor] = React.useState('#897336');
  let xxx = 0;
  let yyy = React.useRef(0);
  console.log('test:Block4:', ++xxx, ++yyy.current, name);

  return (
    <View
      style={{ height: 100, width: 100, backgroundColor: color }}
      onResponderRelease={() => {}}
      onResponderGrant={() => {
        console.log('test:Block4:onResponderGrant:');
        setColor(color === '#897336' ? '#862802' : '#897336');
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

/**
 * no use useBottomSheet, but use useState
 */
function Block1(): JSX.Element {
  console.log('test:block1:');
  const [color, setColor] = React.useState('#63a');
  return (
    <View
      style={{ height: 100, width: 100, backgroundColor: color }}
      onResponderRelease={() => {}}
      onResponderGrant={() => {
        console.log('test:Block1:onResponderGrant:');
        setColor(color === '#63a' ? '#19a' : '#63a');
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

/**
 * have a children
 */
function Block5({ children }: React.PropsWithChildren<{}>): JSX.Element {
  console.log('test:Block5:');
  return (
    <View style={{ height: 200, width: 200, backgroundColor: 'grey' }}>
      {children}
    </View>
  );
}

export default function TestProvider(): JSX.Element {
  console.log('test:TestProvider');
  const enableModals = false;
  return (
    <View style={{ flex: 1 }}>
      <FragmentContainer enableModals={enableModals}>
        <Block1 />
        <Block2 />
        <Block3Memo name={'Block3Memo'} />
        <Block4 />
        <Block5>
          <Block3 name={'Block3'} />
        </Block5>
      </FragmentContainer>
    </View>
  );
}
