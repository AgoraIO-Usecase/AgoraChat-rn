import * as React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { LocalIcon, Switch } from 'react-native-chat-uikit';

const Fn: React.ComponentType<{ name: string }> = ({
  name,
}: {
  name: string;
}) => {
  return <Text>{name}</Text>;
};

type CB = ({ name }: { name: string }) => React.ReactElement<{ name: string }>;

const Fn2: React.ComponentType<{ name: string; Cb: CB }> = ({
  name,
  Cb,
}: {
  name: string;
  Cb: CB;
}) => {
  return <Cb name={name} />;
};

// type MyFunctionComponent<P = {}> = (props: P) => JSX.Element;
// type MyFunctionComponent<P = {}> = React.FunctionComponent<P>;
type MyFunctionComponent<P = {}> = React.ComponentType<P>;

type ItemType<
  P1 = React.PropsWithChildren<{}>,
  P2 = React.PropsWithChildren<{}>
> = MyFunctionComponent<{
  Left?: MyFunctionComponent<P1>;
  LeftProps?: P1;
  Right?: MyFunctionComponent<P2>;
  RightProps?: P2;
  onPress?: (data?: any) => void;
}>;

const ListItem: ItemType<
  {
    style?: StyleProp<TextStyle>;
    children?: React.ReactNode;
  },
  {
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
  }
> = ({ Left, LeftProps, Right, RightProps, onPress }) => {
  return (
    <Pressable
      onPress={() => {
        onPress?.('hello');
      }}
      style={styles.listItem}
    >
      {Left ? <Left {...LeftProps} /> : null}
      {Right ? <Right {...RightProps} /> : null}
    </Pressable>
  );
  // return (
  //   <Pressable
  //     onPress={() => {
  //       onPress('hello');
  //     }}
  //     style={styles.listItem}
  //   >
  //     <Text style={styles.left}>Blocked List</Text>
  //     <View
  //       style={{
  //         flexDirection: 'row',
  //         width: 20,
  //         justifyContent: 'space-between',
  //       }}
  //     >
  //       <Text style={styles.memberCount}>5</Text>
  //       <View style={{ width: 5 }} />
  //       <LocalIcon name="go_small_black_mobile" size={14} />
  //     </View>
  //   </Pressable>
  // );
};
const ListItemT: ItemType<any, any> = ({
  Left,
  LeftProps,
  Right,
  RightProps,
  onPress,
}) => {
  return (
    <Pressable
      onPress={() => {
        onPress?.('hello');
      }}
      style={styles.listItem}
    >
      {Left ? <Left {...LeftProps} /> : null}
      {Right ? <Right {...RightProps} /> : null}
    </Pressable>
  );
};

// type ItemTypeS = ItemType<
//   {
//     style?: StyleProp<TextStyle>;
//     children?: React.ReactNode;
//   },
//   {
//     size?: number;
//     thumbColor?: string;
//     inactiveThumbColor?: string;
//     inactiveTrackColor?: string;
//     value?: boolean;
//     onChangeValue?: (value: boolean) => void;
//   }
// >;
const ListItemT1: ItemType<
  {
    style?: StyleProp<TextStyle>;
    children?: React.ReactNode;
  },
  {
    size?: number;
    thumbColor?: string;
    inactiveThumbColor?: string;
    inactiveTrackColor?: string;
    value?: boolean;
    onChangeValue?: (value: boolean) => void;
  }
> = ({ Left, LeftProps, Right, RightProps, onPress }) => {
  return (
    <Pressable
      onPress={() => {
        onPress?.('hello');
      }}
      style={styles.listItem}
    >
      {Left ? <Left {...LeftProps} /> : null}
      {Right ? <Right {...RightProps} /> : null}
    </Pressable>
  );
};

// const MyText: MyFunctionComponent<{
//   style?: StyleProp<TextStyle>;
//   children?: React.ReactNode;
// }> = ({ style, children }) => {
//   return <Text style={style}>{children}</Text>;
// };

type SSSS<P> = (props: P) => React.ReactElement;

type SSSSS<P> = SSSS<{
  Left: SSSS<P>;
  LeftProps: P;
}>;

type Params = { name: string };
const Item4: SSSSS<Params> = ({ Left, LeftProps }) => {
  return <Left {...LeftProps} />;
};

const ItemItem = () => {
  return (
    <Item4
      Left={function (props: {
        name: string;
      }): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
        return <Text>{props.name}</Text>;
      }}
      LeftProps={{
        name: 'hello',
      }}
    />
  );
};

export default function TestComponent() {
  const [isMute, setIsMute] = React.useState(false);
  return (
    <View style={{ marginTop: 100 }}>
      <Text>hh</Text>
      <Fn name="fn" />
      <Fn2 name="fn2" Cb={({ name }) => <Text>{name}</Text>} />
      <ItemItem />
      <ListItem
        Left={({ style, children }) => {
          return <Text style={style}>{children}</Text>;
        }}
        LeftProps={{ style: styles.left, children: '9090' }}
        Right={({ style, children }) => {
          return <View style={style}>{children}</View>;
        }}
        RightProps={{
          style: styles.right,
          children: (
            <React.Fragment>
              <Text style={styles.memberCount}>5</Text>
              <View style={{ width: 5 }} />
              <LocalIcon name="go_small_black_mobile" size={14} />
            </React.Fragment>
          ),
        }}
        onPress={function (data?: any): void {
          console.log('test:data:', data);
        }}
      />
      <ListItemT
        // Left={({ style, children, name, age }) => {
        //   console.log('test:', name, age);
        //   return <Text style={style}>{children}</Text>;
        // }}
        Left={Text}
        LeftProps={{ style: styles.left, children: '9090', name: 'haha' }}
        // Right={({ style, children }) => {
        //   return <View style={style}>{children}</View>;
        // }}
        Right={View}
        RightProps={{
          style: styles.right,
          children: (
            <React.Fragment>
              <Text style={styles.memberCount}>5</Text>
              <View style={{ width: 5 }} />
              <LocalIcon name="go_small_black_mobile" size={14} />
            </React.Fragment>
          ),
        }}
        onPress={function (data?: any): void {
          console.log('test:data:', data);
        }}
      />
      <View style={styles.listItem}>
        <Text style={styles.left}>Mute</Text>
        <Switch
          size={28}
          thumbColor="white"
          inactiveThumbColor="white"
          inactiveTrackColor="rgba(216, 216, 216, 1)"
          value={isMute}
          onChangeValue={function (val: boolean): void {
            setIsMute(val);
          }}
        />
      </View>
      <ListItemT
        Left={Text}
        LeftProps={{ style: styles.left, children: '9090', name: 'haha' }}
        Right={Switch}
        RightProps={{
          size: 28,
          thumbColor: 'white',
          inactiveThumbColor: 'white',
          inactiveTrackColor: 'rgba(216, 216, 216, 1)',
          value: isMute,
          onChangeValue: (value: boolean) => {
            setIsMute(value);
          },
        }}
      />
      <ListItemT1
        Left={Text}
        LeftProps={{ style: styles.left, children: '9090' }}
        Right={Switch}
        RightProps={{
          size: 28,
          thumbColor: 'white',
          inactiveThumbColor: 'white',
          inactiveTrackColor: 'rgba(216, 216, 216, 1)',
          value: isMute,
          onChangeValue: (value: boolean) => {
            setIsMute(value);
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    height: 53,
    backgroundColor: '#adff2f',
  },
  left: { fontSize: 15, fontWeight: '600', lineHeight: 20 },
  memberCount: {
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
  },
  right: {
    flexDirection: 'row',
    width: 20,
    justifyContent: 'space-between',
  },
});
