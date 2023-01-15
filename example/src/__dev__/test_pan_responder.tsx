import * as React from 'react';
import { LayoutChangeEvent, PanResponder, View } from 'react-native';
import { Button } from 'react-native-paper';

export default function TestPanResponder() {
  const [icon, setIcon] = React.useState(false);
  const currentX0 = React.useRef(0);
  const currentDx = React.useRef(0);
  const currentX = React.useRef(0);
  // currentDx.current = 0;
  const [xxx, setX] = React.useState(currentX0.current + currentDx.current);

  const testXXX = () => {
    console.log('test:xxx:', xxx);
    return xxx;
  };

  console.warn(
    'test:TestPanResponder:',
    currentX0.current,
    currentDx.current,
    currentX.current,
    xxx
  );

  React.useEffect(() => {}, []);

  // const onX0 = (x: number) => {
  //   console.log('test:onX0:', x);
  //   currentX0.current = x;
  //   setX(currentX0.current + currentDx.current);
  // };
  // const onDx = (x: number) => {
  //   console.log('test:onDx:', x);
  //   currentDx.current = x;
  //   setX(currentX0.current + currentDx.current);
  // };

  const onX0DX = (x0: number, dx: number) => {
    console.log('test:onDx:', x0, dx);
    currentX0.current = x0;
    currentDx.current = dx;
    setX(currentX0.current + currentDx.current);
  };

  const responderRef = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onPanResponderStart: (e, { moveX, x0, dx, vx }) => {
        console.log('test:onPanResponderStart:', moveX, x0, dx, vx);
        // onX0(x0);
        // onDx(0);
        onX0DX(currentX.current, 0);
        e.preventDefault();
      },
      onPanResponderMove: (e, { moveX, x0, dx, vx }) => {
        console.log('test:onPanResponderMove:', moveX, x0, dx, vx);
        // onDx(dx);
        onX0DX(currentX.current, dx);
        e.preventDefault();
      },
      onPanResponderRelease: (e, { moveX, x0, dx, vx }) => {
        console.log('test:onPanResponderRelease:', moveX, x0, dx, vx);
        // wait(100).then(() => {
        // currentX.current = xxx;
        currentX.current = testXXX();
        console.warn(
          'test:onPanResponderRelease:',
          currentX0.current,
          currentDx.current,
          currentX.current,
          xxx
        );
        // });

        e.preventDefault();
      },
    })
  ).current;

  return (
    <View style={{ marginTop: 100, flex: 1 }}>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            console.log(icon);
            setIcon(!icon);
          }}
        >
          change icon
        </Button>
      </View>
      {/* <Pressable
        pointerEvents="box-none"
        // onPress={(e) => {
        //   console.log('test:Pressable:onPress:');
        //   e.preventDefault();
        // }}
        {...responderRef.panHandlers}
      >
        <View
          pointerEvents="box-only"
          style={{
            height: 100,
            width: 100,
            backgroundColor: 'green',
          }}
        />
      </Pressable> */}
      <View
        onLayout={(event: LayoutChangeEvent) => {
          // const { x } = event.nativeEvent.layout;
          console.log('test:onLayout:', event.nativeEvent.layout);
          // wait(1).then(() => {
          //   currentX0.current = x;
          // });
        }}
        pointerEvents="box-none"
        // onPress={(e) => {
        //   console.log('test:Pressable:onPress:');
        //   e.preventDefault();
        // }}
        {...responderRef.panHandlers}
        style={{
          backgroundColor: 'grey',
          // flex: 1,
        }}
      >
        <View
          pointerEvents="box-only"
          style={{
            height: 100,
            width: 200,
            backgroundColor: 'blue',
            left: testXXX(),
          }}
        />
      </View>
    </View>
  );
}
