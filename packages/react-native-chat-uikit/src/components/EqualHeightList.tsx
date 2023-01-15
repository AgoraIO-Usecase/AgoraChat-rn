/* eslint-disable react/no-unused-prop-types */

import * as React from 'react';
import {
  Animated,
  FlatList as RNFlatList,
  FlatListProps as RNFlatListProps,
  ListRenderItemInfo,
  PanResponder,
  Pressable,
  RefreshControlProps,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import createStyleSheet from '../styles/createStyleSheet';
import { arraySort, wait } from '../utils/function';

export interface ItemData {
  key: string;
  onLongPress?: (data?: ItemData) => void;
  onPress?: (data?: ItemData) => void;
}

export interface ItemProps {
  data: ItemData;
  style?: StyleProp<ViewStyle>;
}

export type ItemComponent = (props: ItemProps) => JSX.Element;

export type ItemContainerProps = React.PropsWithChildren<{
  index: number;
  alphabet?: string;
  isFirst?: boolean;
  height?: React.Ref<number>;
  style?: StyleProp<ViewStyle>;
  data?: ItemData;
}>;

export type ItemContainerComponent = (props: ItemContainerProps) => JSX.Element;

type RenderItemProps = {
  itemProps: ItemProps;
  Item: ItemComponent;
  itemContainerProps: ItemContainerProps;
  ItemContainer: ItemContainerComponent;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ListHeaderProps {}
export type ListHeaderComponent = (props: ListHeaderProps) => JSX.Element;

const DefaultItem: ItemComponent = (props: ItemProps): JSX.Element => {
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
      // onLongPress={() => {
      //   props.data?.onLongPress?.(props.data);
      // }}
      // onPress={() => {
      //   props.data?.onPress?.(props.data);
      // }}
    >
      {props.children}
    </View>
  );
};

// let RenderItemInternalCount = 0;
const RenderItemInternal = React.memo(
  (info: ListRenderItemInfo<RenderItemProps>) => {
    // console.log('test:RenderItemM:', ++RenderItemInternalCount);
    const { ItemContainer, itemContainerProps, itemProps, Item } = info.item;
    return (
      <ItemContainer {...itemContainerProps}>
        <Item {...itemProps} />
      </ItemContainer>
    );
  }
  // (a, b) => {
  //   if (
  //     a.item.itemProps.data === b.item.itemProps.data &&
  //     a.item.itemContainerProps.alphabet ===
  //       b.item.itemContainerProps.alphabet &&
  //     a.item.itemContainerProps.height === b.item.itemContainerProps.height &&
  //     a.item.itemContainerProps.index === b.item.itemContainerProps.index &&
  //     a.item.itemContainerProps.isFirst === b.item.itemContainerProps.isFirst
  //   ) {
  //     return true;
  //   }
  //   return false;
  // }
);

// let RenderItemCount = 0;
const RenderItem = ({
  item,
}: ListRenderItemInfo<RenderItemProps>): JSX.Element => {
  // console.log('test:RenderItem:', ++RenderItemCount);
  const { ItemContainer, itemContainerProps, itemProps, Item } = item;
  return (
    <RenderItemInternal
      item={{
        itemProps: itemProps,
        Item: Item,
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
  alphabetItemContainer?: StyleProp<TextStyle>;
  alphabetContainer?: StyleProp<ViewStyle>;
  alphabetCurrent?: StyleProp<TextStyle>;
  enableToast?: boolean;
  alphabetToast?: StyleProp<ViewStyle>;
};

type ListHeaderComponentType = {
  Component: React.ComponentType<ListHeaderProps>;
  props: ListHeaderProps;
};

type ListRefreshComponentType = {
  Component: React.ReactElement<RefreshControlProps>;
  props: RefreshControlProps;
};

export type EqualHeightListProps = Omit<
  RNFlatListProps<RenderItemProps>,
  | 'data'
  | 'renderItem'
  | 'getItemLayout'
  | 'keyExtractor'
  | 'refreshing'
  | 'onRefresh'
> & {
  items: ItemData[];
  itemStyle?: StyleProp<ViewStyle>;
  ItemFC: ItemComponent;
  itemContainerStyle?: StyleProp<ViewStyle>;
  enableAlphabet: boolean;
  enableRefresh: boolean;
  enableHeader: boolean;
  enableSort?: boolean;
  onScroll?: (item: ItemData) => void;
  onRefresh?: (state: 'started' | 'ended') => void;
  RefreshComponent?: ListRefreshComponentType;
  HeaderComponent?: ListHeaderComponentType;
  Header?: ListHeaderComponent;
  alphabet?: AlphabetType;
};

export type ListItemUpdateType = {
  type: 'add' | 'del' | 'update' | 'clear';
  data?: ItemData[];
  enableSort?: boolean;
};

export type EqualHeightListRef = {
  test: (data: any) => void;
  manualRefresh: (updateItems: ListItemUpdateType[]) => void;
};

export const EqualHeightList: (
  props: EqualHeightListProps,
  ref?: React.ForwardedRef<EqualHeightListRef>
) => JSX.Element = (
  props: EqualHeightListProps,
  ref?: React.ForwardedRef<EqualHeightListRef>
): JSX.Element => {
  console.log('test:EqualHeightList:');
  React.useImperativeHandle(
    ref,
    () => ({
      test: <ItemT extends ItemData = ItemData>(value: ItemT) => {
        console.log('test:ref:', value);
      },
      manualRefresh: (updateItems: ListItemUpdateType[]) => {
        console.log('test:manualRefresh:', updateItems);
        _handleManualRefresh(updateItems);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // const data = React.useMemo<RenderItemProps[]>(() => [], []);
  const [data, setData] = React.useState<RenderItemProps[]>([]);
  const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#';
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
        setLastChar('');
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
    enableHeader,
    enableSort,
    onRefresh,
    RefreshComponent,
    HeaderComponent,
    Header,
    ItemSeparatorComponent,
    ...others
  } = props;

  const [refreshing, setRefreshing] = React.useState(false);
  const [isMoving, setIsMoving] = React.useState(false);
  const [lastChar, setLastChar] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  const _prepareData = React.useCallback(
    (items: ItemData[]) => {
      // console.log('test:_prepareData:', items.length);
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
            data: item,
          },
        } as RenderItemProps;
      });
      data.push(...r);
      // console.log('test:data:length:', data.length);
      // setData(data);
    },
    [ItemFC, data, itemContainerStyle, itemStyle]
  );

  React.useEffect(() => {}, []);

  if (loading) {
    data.splice(0, data.length);
    if (enableSort === true) arraySort(items);
    _prepareData(items);
    setLoading(false);
  }

  const _onRefresh = React.useCallback((): void => {
    // console.log('test:_onRefresh:', enableRefresh);
    if (enableRefresh === undefined || enableRefresh === false) {
      setRefreshing(false);
      return;
    }
    setRefreshing(true);
    onRefresh?.('started');
    wait(REFRESH_TIMEOUT).then(() => {
      setRefreshing(false);
      onRefresh?.('ended');
    });
  }, [enableRefresh, onRefresh]);

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

  const _handleManualRefresh = (updateItems: ListItemUpdateType[]) => {
    for (const item of updateItems) {
      switch (item.type) {
        case 'add':
          if (item.data) {
            _prepareData(item.data);
          }
          if (item.enableSort === true) {
            data.sort((a, b) => {
              if (a.itemProps.data.key > b.itemProps.data.key) {
                return 1;
              } else if (a.itemProps.data.key < b.itemProps.data.key) {
                return -1;
              } else {
                return 0;
              }
            });
          }
          break;
        case 'update':
          if (item.data) {
            for (const d of item.data) {
              for (const dd of data) {
                if (dd.itemProps.data.key === d.key) {
                  // console.log('test:key:', d.key, dd.itemProps.data, d);
                  dd.itemProps.data = d;
                  break;
                }
              }
            }
          }
          break;
        case 'del':
          throw new Error('Array deletion is expensive.');
        case 'clear':
          data.splice(0, data.length);
          break;
        default:
          throw new Error(`This type ${item.type} is not supported.`);
      }
    }
    setData([...data]);
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

  const r = (
    <View
      onLayout={(event) => {
        console.log('test:EqualHeightList:', event.nativeEvent.layout.height);
      }}
      style={[styles.container]}
    >
      <RNFlatList
        ref={(value) => {
          if (value) {
            const s = listRef as React.MutableRefObject<RNFlatList>;
            s.current = value;
          }
        }}
        data={data}
        extraData={data}
        renderItem={RenderItem}
        getItemLayout={(_: any, index: number) => {
          let h = _calculateItemH;
          const s = ItemSeparatorComponent ? 0.333 : 0; // ???
          h += s;
          const r = {
            length: h,
            offset: h * index,
            index: index,
          };
          return r;
        }}
        keyExtractor={(item: RenderItemProps) => {
          // console.log('test:keyExtractor:', item.itemProps.data.key);
          return item.itemProps.data.key;
        }}
        refreshing={enableRefresh === true ? refreshing : undefined}
        onRefresh={enableRefresh === true ? _onRefresh : undefined}
        refreshControl={
          enableRefresh === true
            ? RefreshComponent
              ? RefreshComponent.Component
              : undefined
            : undefined
        }
        onEndReached={(info) => {
          console.log('test:info:', info.distanceFromEnd);
        }}
        ListHeaderComponent={
          enableHeader === true
            ? HeaderComponent
              ? React.memo(() => (
                  <HeaderComponent.Component {...HeaderComponent.props} />
                ))
              : Header
              ? Header
              : undefined
            : undefined
        }
        // ListHeaderComponent={enableHeader === true ? Header : undefined}
        ItemSeparatorComponent={ItemSeparatorComponent}
        // keyboardShouldPersistTaps={'never'}
        // keyboardDismissMode={'none'}
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
              onFocus={(e) => {
                e.preventDefault();
              }}
              style={[
                {
                  flex: 1,
                  width: 18,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white',
                },
              ]}
            >
              {AZ.split('').map((char) => {
                return (
                  <View
                    key={char}
                    style={[
                      styles.alphabetView,
                      alphabet?.alphabetItemContainer,
                    ]}
                  >
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
    // backgroundColor: '#f9c2ff',
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
    top: 70,
    // bottom: 100,
    width: 40,
    // height: '80%',
    height: 450,
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
