import * as React from 'react';
import {
  Animated,
  FlatList as RNFlatList,
  FlatListProps as RNFlatListProps,
  ListRenderItemInfo,
  PanResponder,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import createStyleSheet from '../styles/createStyleSheet';
import { arraySort, wait } from '../utils/function';
import LoadingRN from './LoadingRN';

const RefreshComponentMemo = React.memo(
  (props: { RefreshComponent?: RefreshComponentType }) => {
    const { RefreshComponent } = props;
    if (RefreshComponent)
      return <RefreshComponent.Component {...RefreshComponent.props} />;
    return <LoadingRN size="large" />;
  }
);

export interface ItemData {
  key: string;
}

export interface ItemProps<ItemT extends ItemData = ItemData> {
  data: ItemT;
  style?: StyleProp<ViewStyle>;
}

export type ItemComponent<ItemT extends ItemData = ItemData> = (
  props: ItemProps<ItemT>
) => JSX.Element;

export type ItemContainerProps = React.PropsWithChildren<{
  index: number;
  alphabet?: string;
  isFirst?: boolean;
  height?: React.Ref<number>;
  style?: StyleProp<ViewStyle>;
}>;

export type ItemContainerComponent = (props: ItemContainerProps) => JSX.Element;

type RenderItemProps<ItemT extends ItemData = ItemData> = {
  itemProps: ItemProps<ItemT>;
  Item: ItemComponent<ItemT>;
  itemContainerProps: ItemContainerProps;
  ItemContainer: ItemContainerComponent;
};

export interface RefreshProps {}
export type RefreshComponent = (props: RefreshProps) => JSX.Element;

const DefaultItem: ItemComponent<ItemData> = (
  props: ItemProps<ItemData>
): JSX.Element => {
  return <Text style={[styles.item, props.style]}>{props.data.key}</Text>;
};

const DefaultItemContainer: ItemContainerComponent = (
  props: ItemContainerProps
): JSX.Element => {
  return (
    <View
      style={[props.style]}
      onLayout={(e) => {
        if (props.height) {
          const ref = props.height as React.MutableRefObject<number>;
          ref.current = e.nativeEvent.layout.height;
          // console.log('test:onLayout:height:', ref.current);
        }
      }}
    >
      {props.children}
    </View>
  );
};

// let RenderItemInternalCount = 0;
const RenderItemInternal = React.memo(
  <ItemT extends ItemData = ItemData>(
    info: ListRenderItemInfo<RenderItemProps<ItemT>>
  ) => {
    // console.log('test:RenderItemM:', ++RenderItemInternalCount);
    const { ItemContainer, itemContainerProps, itemProps, Item } = info.item;
    return (
      <ItemContainer {...itemContainerProps}>
        <Item {...itemProps} />
      </ItemContainer>
    );
  },
  (a, b) => {
    if (
      a.item.itemProps.data === b.item.itemProps.data &&
      a.item.itemContainerProps.alphabet ===
        b.item.itemContainerProps.alphabet &&
      a.item.itemContainerProps.height === b.item.itemContainerProps.height &&
      a.item.itemContainerProps.index === b.item.itemContainerProps.index &&
      a.item.itemContainerProps.isFirst === b.item.itemContainerProps.isFirst
    ) {
      return true;
    }
    return false;
  }
);

// let RenderItemCount = 0;
const RenderItem = <ItemT extends ItemData = ItemData>({
  item,
}: ListRenderItemInfo<RenderItemProps<ItemT>>): JSX.Element => {
  // console.log('test:RenderItem:', ++RenderItemCount);
  const { ItemContainer, itemContainerProps, itemProps, Item } = item;
  return (
    <RenderItemInternal
      item={{
        itemProps: itemProps,
        Item: Item as any,
        itemContainerProps: itemContainerProps,
        ItemContainer: ItemContainer,
      }}
      index={itemContainerProps.index}
      separators={{
        highlight: function (): void {},
        unhighlight: function (): void {},
        updateProps: function (): void {},
      }}
    />
  );
};

type AlphabetType = {
  alphabetItem?: StyleProp<TextStyle>;
  alphabetContainer?: StyleProp<ViewStyle>;
  alphabetCurrent?: StyleProp<TextStyle>;
  enableToast?: boolean;
  alphabetToast?: StyleProp<ViewStyle>;
};

type RefreshComponentType = {
  Component: RefreshComponent;
  props: RefreshProps;
};

type EqualHeightListProps<ItemT extends ItemData = ItemData> = Omit<
  RNFlatListProps<RenderItemProps>,
  | 'data'
  | 'renderItem'
  | 'getItemLayout'
  | 'keyExtractor'
  | 'refreshing'
  | 'onRefresh'
> & {
  items: ItemT[];
  itemStyle?: StyleProp<ViewStyle>;
  ItemFC: ItemComponent;
  itemContainerStyle?: StyleProp<ViewStyle>;
  enableAlphabet: boolean;
  enableRefresh: boolean;
  enableSort?: boolean;
  onScroll?: (item: ItemT) => void;
  onRefresh?: (state: 'started' | 'ended') => void;
  RefreshComponent?: RefreshComponentType;
  alphabet?: AlphabetType;
};

export type EqualHeightListRef<ItemT extends ItemData = ItemData> = {
  test: (data: ItemT) => void;
};

export const EqualHeightList: <ItemT extends ItemData = ItemData>(
  props: EqualHeightListProps,
  ref?: React.ForwardedRef<EqualHeightListRef<ItemT>>
) => JSX.Element = (
  props: EqualHeightListProps,
  ref?: React.ForwardedRef<EqualHeightListRef<any>>
): JSX.Element => {
  React.useImperativeHandle(
    ref,
    () => ({
      test: <ItemT extends ItemData = ItemData>(value: ItemT) => {
        console.log('test:ref:', value);
      },
    }),
    []
  );

  const data = React.useMemo<RenderItemProps[]>(() => [], []);
  const AZ = '*ABCDEFGHIJKLMNOPQRSTUVWXYZ#';
  const REFRESH_TIMEOUT = 1500;
  const listRef = React.useRef<RNFlatList>(null);
  const listItemHeightRef = React.useRef(0);
  const listHeightRef = React.useRef(0);
  const listYRef = React.useRef(0);
  const alphabetListRef = React.useRef<View>(null);
  const responderRef = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onPanResponderStart: (e, { y0 }) => {
        setIsMoving(true);
        const c = getChar(_calculateAlphabetIndex(y0));
        if (c) jumpToItem(c);
        e.preventDefault();
      },
      onPanResponderMove: (e, { moveY }) => {
        setIsMoving(true);
        const c = getChar(_calculateAlphabetIndex(moveY));
        if (c) jumpToItem(c);
        e.preventDefault();
      },
      onPanResponderRelease: (e) => {
        setIsMoving(false);
        e.preventDefault();
      },
    })
  ).current;
  const {
    alphabet,
    items,
    itemStyle,
    ItemFC,
    itemContainerStyle,
    enableAlphabet,
    enableRefresh,
    enableSort,
    onRefresh,
    RefreshComponent,
    ...others
  } = props;

  const [refreshing, setRefreshing] = React.useState(false);
  const [isMoving, setIsMoving] = React.useState(false);
  const [lastChar, setLastChar] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  const _onInit = React.useCallback(() => {
    console.log('test:_onInit:');
    const obj = {} as any;
    let once = false;
    const r = items.map((item, index) => {
      let isFirst = false;
      const alphabet = item.key[0] ? item.key[0] : '#';
      if (obj[alphabet]) {
        isFirst = false;
      } else {
        isFirst = true;
        obj[alphabet] = true;
      }
      return {
        Item: ItemFC ?? DefaultItem,
        itemProps: {
          data: item,
          style: itemStyle,
        },
        ItemContainer: DefaultItemContainer,
        itemContainerProps: {
          index: index,
          alphabet: alphabet,
          isFirst: isFirst,
          style: itemContainerStyle,
          height: once === false ? listItemHeightRef : undefined,
        },
      } as RenderItemProps;
    });
    data.push(...r);
  }, [ItemFC, data, itemContainerStyle, itemStyle, items]);

  React.useEffect(() => {}, []);

  if (loading) {
    data.splice(0, data.length);
    if (enableSort === true) arraySort(items);
    _onInit();
    setLoading(false);
  }

  const _onRefresh = React.useCallback(() => {
    if (enableRefresh === undefined || enableRefresh === false) {
      setRefreshing(false);
      return null;
    }
    setRefreshing(true);
    onRefresh?.('started');
    wait(REFRESH_TIMEOUT).then(() => {
      setRefreshing(false);
      onRefresh?.('ended');
    });
    return <RefreshComponentMemo RefreshComponent={RefreshComponent} />;
  }, [RefreshComponent, enableRefresh, onRefresh]);

  const _asyncSetAlphabetListPageY = () => {
    const r = new Promise((success, fail) => {
      if (alphabetListRef?.current) {
        alphabetListRef.current.measure(
          (
            _: number,
            __: number,
            ___: number,
            ____: number,
            _____: number,
            pageY: number
          ) => {
            // console.log('test:measure:', x, y, width, height, pageX, pageY);
            listYRef.current = pageY;
            success(0);
          }
        );
      } else {
        fail();
      }
    });
    return r;
  };

  const _calculateAlphabetIndex = (y: number): number => {
    const AZH = listHeightRef.current;
    const unitH = AZH / (AZ.length + 0);
    const index = Math.round((y - listYRef.current) / unitH);
    // console.log(
    //   'test:AZH:',
    //   AZH,
    //   unitH,
    //   y,
    //   index,
    //   listHeightRef.current,
    //   listYRef.current
    // );
    return index;
  };

  const _calculateItemHeight = React.useCallback(
    (
      itemStyle: StyleProp<ViewStyle> | undefined,
      itemContainerStyle: StyleProp<ViewStyle> | undefined,
      height: number
    ) => {
      let h = 0;
      if (itemStyle) {
        const out = itemStyle as StyleProp<ViewStyle> as ViewStyle;
        if (out.height && typeof out.height === 'number') h += out.height;
      }
      if (itemContainerStyle) {
        const out = itemContainerStyle as StyleProp<ViewStyle> as ViewStyle;
        if (out.height && typeof out.height === 'number') h += out.height;
      }
      if (itemStyle === undefined && itemContainerStyle === undefined) {
        // If you need to dynamically calculate the height, the positioning may be delayed. Specifically, clicking on a letter to locate will fail the first time.
        h = height;
      }
      // console.log('test:_calculateItemHeight:', h);
      return h;
    },
    []
  );
  const _calculateItemSpace = React.useCallback(() => {
    let h = 0;
    return h;
  }, []);

  const getChar = (index: number) => {
    return AZ[index];
  };

  const jumpToItem = (char: string) => {
    if (char) setLastChar(char);
    for (const item of data) {
      const isFirst = item.itemContainerProps.isFirst;
      const c = item.itemContainerProps.alphabet;
      if (isFirst === true && char === c) {
        listRef.current?.scrollToIndex({
          animated: true,
          index: item.itemContainerProps.index,
        });
        break;
      }
    }
  };

  const _calculateItemH = React.useMemo(() => {
    const height = _calculateItemHeight(
      itemStyle,
      itemContainerStyle,
      listItemHeightRef.current
    );
    // console.log('test:_calculateItemH:', height);
    const space = _calculateItemSpace();
    const h = height + space;
    return h;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    _calculateItemHeight,
    _calculateItemSpace,
    itemContainerStyle,
    itemStyle,
    listItemHeightRef.current,
  ]);

  const r: any = (
    <View style={styles.container}>
      <RNFlatList
        ref={(value) => {
          if (value) {
            const s = listRef as React.MutableRefObject<RNFlatList>;
            s.current = value;
          }
        }}
        data={data}
        renderItem={RenderItem}
        getItemLayout={(_: any, index: number) => {
          const h = _calculateItemH;
          const r = {
            length: h,
            offset: h * index,
            index: index,
          };
          return r;
        }}
        keyExtractor={(item: RenderItemProps) => {
          return item.itemContainerProps.index.toString();
        }}
        refreshing={enableRefresh === true ? refreshing : undefined}
        onRefresh={enableRefresh === true ? _onRefresh : undefined}
        onEndReached={(info) => {
          console.log('test:onEndReached:', info.distanceFromEnd);
        }}
        // stickyHeaderIndices={[0]}
        {...others}
      />
      {enableAlphabet === true ? (
        <React.Fragment>
          <Animated.View
            ref={alphabetListRef}
            style={[styles.alphabetContainer, alphabet?.alphabetContainer]}
            pointerEvents="box-none"
            onLayout={(event) => {
              const h = event.nativeEvent.layout.height;
              // const y = event.nativeEvent.layout.y;
              // console.log('test:list:height:2', h, y);
              listHeightRef.current = h;
              _asyncSetAlphabetListPageY();
            }}
            {...responderRef.panHandlers}
          >
            <Pressable
              pointerEvents="box-only"
              style={{
                flex: 1,
                width: 18,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
              }}
            >
              {AZ.split('').map((char) => {
                return (
                  <View key={char} style={styles.alphabetView}>
                    <Text
                      style={[
                        styles.alphabetItem,
                        alphabet?.alphabetItem,
                        lastChar === char
                          ? alphabet?.alphabetCurrent
                          : undefined,
                      ]}
                    >
                      {char}
                    </Text>
                  </View>
                );
              })}
            </Pressable>
          </Animated.View>
          {isMoving && (
            <View
              style={[
                styles.char,
                alphabet?.enableToast === true
                  ? alphabet?.alphabetToast
                  : undefined,
              ]}
            >
              <Text style={styles.chatText}>{lastChar}</Text>
            </View>
          )}
        </React.Fragment>
      ) : null}
    </View>
  );
  return r;
};

const styles = createStyleSheet({
  container: {
    flex: 1,
    justifyContent: 'center',
    // marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
  },
  alphabetContainer: {
    position: 'absolute',
    right: 0,
    top: 100,
    bottom: 100,
    width: 40,
    // height: '100%',
    margin: 0,
    // backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    direction: 'rtl',
  },
  alphabetItem: {
    width: 18,
    flex: 1,
    display: 'flex',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  alphabetView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 18,
    flex: 1,
    display: 'flex',
    borderRadius: 9,
    overflow: 'hidden',
    backgroundColor: 'red',
  },
  char: {
    flex: 1,
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 6,
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 50,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  chatText: {
    color: 'white',
  },
});

export default React.forwardRef<EqualHeightListRef, EqualHeightListProps>(
  EqualHeightList
);
