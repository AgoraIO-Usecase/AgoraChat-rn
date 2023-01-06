/* eslint-disable react/no-unused-prop-types */
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
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';

import { useHeaderContext } from '../contexts';
import createStyleSheet from '../styles/createStyleSheet';
import { arraySort, wait } from '../utils/function';
import LoadingRN from './LoadingRN';

export interface ItemData {
  key: string;
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
}>;

export type ItemContainerComponent = (props: ItemContainerProps) => JSX.Element;

type RenderItemProps = {
  itemProps: ItemProps;
  Item: ItemComponent;
  itemContainerProps: ItemContainerProps;
  ItemContainer: ItemContainerComponent;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RefreshProps {}
export type RefreshComponent = (props: RefreshProps) => JSX.Element;

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
    >
      {props.children}
    </View>
  );
};

// const RenderItemM = React.memo(
//   (info: ListRenderItemInfo<RenderItemProps>) => {
//     console.log('test:RenderItemM:');
//     const { ItemContainer, itemContainerProps, itemProps, Item } = info.item;
//     return (
//       <ItemContainer {...itemContainerProps}>
//         <Item {...itemProps} />
//       </ItemContainer>
//     );
//   },
//   (a, b) => {
//     if (
//       a.item.itemProps.data === b.item.itemProps.data &&
//       a.item.itemContainerProps.alphabet ===
//         b.item.itemContainerProps.alphabet &&
//       a.item.itemContainerProps.height === b.item.itemContainerProps.height &&
//       a.item.itemContainerProps.index === b.item.itemContainerProps.index &&
//       a.item.itemContainerProps.isFirst === b.item.itemContainerProps.isFirst
//     ) {
//       return true;
//     }
//     return false;
//   }
// );

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
  // return (
  //   <item.ItemContainer {...item.itemContainerProps}>
  //     <item.Item {...item.itemProps} />
  //   </item.ItemContainer>
  // );
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

type EqualHeightListProps = Omit<
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
  enableSort?: boolean;
  onScroll?: (item: ItemData) => void;
  onRefresh?: (state: 'started' | 'ended') => void;
  RefreshComponent?: RefreshComponentType;
  alphabet?: AlphabetType;
};

// export type ItemType<Params extends {}> = Params &
//   React.PropsWithChildren<{
//     index: number;
//     alphabet?: string;
//     isFirst?: boolean;
//     height?: React.Ref<number>;
//     style?: StyleProp<ViewStyle>;
//     Children?: React.ComponentType<ItemType<Params>>;
//   }>;

// const RenderItem = <Params extends {}>({
//   item,
// }: ListRenderItemInfo<ItemType<Params>>) => {
//   return (
//     <View
//       style={[styles.item, item.style]}
//       onLayout={(e) => {
//         if (item.height) {
//           const ref = item.height as React.MutableRefObject<number>;
//           ref.current = e.nativeEvent.layout.height;
//         }
//         // console.log('test:item:target:', e.nativeEvent.target);
//       }}
//     >
//       {item.children}
//     </View>
//   );
// };

// type EqualHeightListProps<ItemParams extends {}, RefreshProps extends {}> = Omit<
//   RNFlatListProps<ItemType<ItemParams>>,
//   | 'data'
//   | 'renderItem'
//   | 'getItemLayout'
//   | 'keyExtractor'
//   | 'refreshing'
//   | 'onRefresh'
// > & {
//   items: ItemType<ItemParams>[];
//   enableAlphabet: boolean;
//   onScroll?: (item: ItemType<ItemParams>) => void;
//   onRefresh?: (state: 'started' | 'ended') => void;
//   RefreshComponent?: {
//     Component: React.ComponentType<RefreshProps>;
//     props: RefreshProps;
//   };
//   alphabet?: {
//     alphabetItem?: StyleProp<TextStyle>;
//     alphabetContainer?: StyleProp<ViewStyle>;
//   };
//   itemStyle?: StyleProp<ViewStyle>;
// };

// const useListRef = () => {
//   return React.useRef<RNFlatList>(null);
// };

// type Method = {
//   ScrollToIndex?: (params: {
//     animated?: boolean | null | undefined;
//     index: number;
//     viewOffset?: number | undefined;
//     viewPosition?: number | undefined;
//   }) => void;
//   Jump?: (char: string) => void;
// };

// export const S: Method = {
//   ScrollToIndex: undefined,
//   Jump: undefined,
// };

export const EqualHeightList: (
  props: EqualHeightListProps,
  ref?: React.ForwardedRef<RNFlatList<RenderItemProps>>
) => JSX.Element = (
  props: EqualHeightListProps,
  ref?: React.ForwardedRef<RNFlatList<RenderItemProps>>
): JSX.Element => {
  const data = React.useMemo<RenderItemProps[]>(() => [], []);
  const AZ = '*ABCDEFGHIJKLMNOPQRSTUVWXYZ#';
  const REFRESH_TIMEOUT = 1500;
  const { defaultTopInset } = useHeaderContext();
  const listRef = React.useRef<RNFlatList>(null);
  const heightRef = React.useRef(0);
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
  const { height } = useWindowDimensions();
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

  // const useRenderItemW = React.useCallback(
  //   ({ item }: ListRenderItemInfo<RenderItemProps>): JSX.Element => {
  //     return (
  //       <RenderItemM props={item as RenderItemProps & IntrinsicAttributes} />
  //     );
  //   },
  //   []
  // );

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
      // console.log('test:init:item:', item, index);
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
          height: once === false ? heightRef : undefined,
        },
      } as RenderItemProps;
    });
    data.push(...r);
  }, [ItemFC, data, itemContainerStyle, itemStyle, items]);

  React.useEffect(() => {
    // data.length = 0;
    // data.splice(0, data.length);
    // if (enableSort === true) arraySort(items);
    // _onInit();
    // listRef.current?.scrollToIndex({ index: 0, animated: true });
    // listRef.current?.scrollToEnd();
  }, []);

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
    const r = React.memo(() => {
      if (RefreshComponent)
        return <RefreshComponent.Component {...RefreshComponent.props} />;
      return <LoadingRN size="large" />;
    });
    return r;
  }, [RefreshComponent, enableRefresh, onRefresh]);

  const _calculateAlphabetTop = React.useCallback(
    (alphabet: AlphabetType | undefined, topInset: number) => {
      let top = topInset;
      if (alphabet?.alphabetContainer) {
        const out =
          alphabet.alphabetContainer as StyleProp<ViewStyle> as ViewStyle;
        if (out.top && typeof out.top === 'number') top += out.top;
      } else {
        const out =
          styles.alphabetContainer as StyleProp<ViewStyle> as ViewStyle;
        if (out.top && typeof out.top === 'number') top += out.top;
      }
      return top;
    },
    []
  );

  const _calculateAlphabetHeight = React.useCallback(
    (alphabet: AlphabetType | undefined, topInset: number, height: number) => {
      let h = height;
      if (alphabet?.alphabetContainer) {
        const out =
          alphabet.alphabetContainer as StyleProp<ViewStyle> as ViewStyle;
        if (out.top && typeof out.top === 'number') h -= out.top;
        if (out.bottom && typeof out.bottom === 'number') h -= out.bottom;
      } else {
        const out =
          styles.alphabetContainer as StyleProp<ViewStyle> as ViewStyle;
        // console.log('test:out:', out.top, out.bottom, defaultRatio);
        if (out.top && typeof out.top === 'number') h -= out.top;
        if (out.bottom && typeof out.bottom === 'number') h -= out.bottom;
      }
      h -= topInset;
      return h;
    },
    []
  );

  const _calculateAlphabetIndex = (y: number): number => {
    const AZH = _calculateAlphabetHeight(alphabet, defaultTopInset, height);
    const top = _calculateAlphabetTop(alphabet, defaultTopInset);
    const unitH = AZH / (AZ.length + 1);
    const index = Math.round((y - top) / unitH);
    // console.log('test:AZH:', AZH, y, top, index);
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
      heightRef.current
    );
    console.log('test:_calculateItemH:', height);
    const space = _calculateItemSpace();
    const h = height + space;
    return h;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    _calculateItemHeight,
    _calculateItemSpace,
    itemContainerStyle,
    itemStyle,
    heightRef.current,
  ]);

  // too dangerous !!!
  // Hold ref safe.
  // S.Jump = jumpToItem;

  const r: any = (
    <View style={styles.container}>
      <RNFlatList
        ref={(value) => {
          if (value) {
            const s = listRef as React.MutableRefObject<RNFlatList>;
            s.current = value;
            if (ref) {
              const f = ref as React.MutableRefObject<RNFlatList>;
              f.current = value;
            }
          }
        }}
        data={data}
        renderItem={RenderItem}
        onLayout={(_) => {
          // console.log('test:list:height:', e.nativeEvent.layout.height);
        }}
        getItemLayout={(_: any, index: number) => {
          // console.log('test:getItemLayout:height:', heightRef.current);
          // const height = _calculateItemHeight();
          // const space = _calculateItemSpace();
          // const h = height + space;
          const h = _calculateItemH;
          // const h = 100;
          // console.log('test:h:', h);
          const r = {
            length: h,
            offset: h * index,
            index: index,
          };
          return r;
        }}
        keyExtractor={(item: RenderItemProps) => {
          const key = item.itemContainerProps.index.toString();
          // const key2 = item.itemProps.data.key;
          // console.log(
          //   'test:key:',
          //   item.itemProps.data.key,
          //   item.itemContainerProps.index
          // );
          return key;
        }}
        refreshing={enableRefresh === true ? refreshing : undefined}
        onRefresh={enableRefresh === true ? _onRefresh : undefined}
        onEndReached={(info) => {
          console.log('test:info:', info.distanceFromEnd);
        }}
        // stickyHeaderIndices={[0]}
        {...others}
      />
      {enableAlphabet === true ? (
        <React.Fragment>
          <Animated.View
            style={[styles.alphabetContainer, alphabet?.alphabetContainer]}
            pointerEvents="box-none"
            {...responderRef.panHandlers}
          >
            <Pressable
              pointerEvents="box-only"
              style={{
                flex: 1,
                width: 18,
                justifyContent: 'center',
                alignItems: 'center',
                // borderRadius: 10,
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
  // EqualHeightList.scrollToIndex = r.scrollToIndexInternal = React.useCallback(
  //   (params: {
  //     animated?: boolean | null | undefined;
  //     index: number;
  //     viewOffset?: number | undefined;
  //     viewPosition?: number | undefined;
  //   }): void => {
  //     const ref = listRef.current;
  //     ref?.scrollToIndex({
  //       animated: params.animated,
  //       index: params.index,
  //       viewOffset: params.viewOffset,
  //       viewPosition: params.viewPosition,
  //     });
  //   },
  //   [listRef]
  // );
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

// EqualHeightList.scrollToIndex = function scrollToIndex(params: {
//   animated?: boolean | null | undefined;
//   index: number;
//   viewOffset?: number | undefined;
//   viewPosition?: number | undefined;
// }): void {
//   // const e = EqualHeightList as any;
//   useListRef().current.scrollToIndexInternal({
//     animated: params.animated,
//     index: params.index,
//     viewOffset: params.viewOffset,
//     viewPosition: params.viewPosition,
//   });
// };

// export default React.forwardRef<
//   typeof RNFlatList,
//   EqualHeightListProps<any, any>
// >(EqualHeightList);

// export type S<T extends {}, P extends {}> = React.ForwardRefExoticComponent<
//   React.PropsWithoutRef<EqualHeightListProps<T, P>> &
//     React.RefAttributes<EqualHeightListProps<T, P>>
// >;

// export function forwardRefT<
//   Params extends {},
//   Props extends {} = {},
//   T = typeof RNFlatList,
//   P = EqualHeightListProps<Params, Props>
// >(
//   render: React.ForwardRefRenderFunction<T, P>
// ): React.ForwardRefExoticComponent<
//   React.PropsWithoutRef<P> & React.RefAttributes<T>
// > {
//   return React.forwardRef<T, P>(render);
// }

// export default forwardRefT<any, any>(EqualHeightList);

export default React.forwardRef<RNFlatList, EqualHeightListProps>(
  EqualHeightList
);
