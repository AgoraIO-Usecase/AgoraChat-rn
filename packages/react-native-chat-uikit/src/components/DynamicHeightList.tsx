import * as React from 'react';
import {
  FlatList as RNFlatList,
  FlatListProps as RNFlatListProps,
  ListRenderItem,
  View,
} from 'react-native';

import createStyleSheet from '../styles/createStyleSheet';

type RenderItemType<ItemT extends {}> = ListRenderItem<ItemT>;

export type DynamicHeightListRef = {
  scrollToEnd: () => void;
  scrollToTop: () => void;
};

export type DynamicHeightListProps<ItemT extends {}> = Omit<
  RNFlatListProps<ItemT>,
  'data' | 'renderItem' | 'onRefresh'
> & {
  items: ItemT[];
  RenderItemFC: RenderItemType<ItemT>;
  enableRefresh: boolean;
  onRefresh?: (() => void) | null | undefined;
};

export const DynamicHeightList: <ItemT extends {}>(
  props: DynamicHeightListProps<ItemT>,
  ref?: React.ForwardedRef<DynamicHeightListRef>
) => JSX.Element = <ItemT extends {}>(
  props: DynamicHeightListProps<ItemT>,
  ref?: React.ForwardedRef<DynamicHeightListRef>
): JSX.Element => {
  React.useImperativeHandle(
    ref,
    () => ({
      scrollToEnd: () => {
        listRef.current?.scrollToEnd();
      },
      scrollToTop: () => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
      },
    }),
    []
  );

  const listRef = React.useRef<RNFlatList>(null);
  const {
    items,
    RenderItemFC,
    enableRefresh,
    onRefresh,
    refreshing,
    style,
    ...others
  } = props;

  return (
    <View style={styles.container}>
      <RNFlatList
        ref={(value) => {
          if (value) {
            const s = listRef as React.MutableRefObject<RNFlatList>;
            s.current = value;
          }
        }}
        data={items}
        renderItem={RenderItemFC}
        refreshing={enableRefresh === true ? refreshing : undefined}
        onRefresh={enableRefresh === true ? onRefresh : undefined}
        style={[style]}
        {...others}
      />
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    flex: 1,
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
});

export default React.forwardRef<
  DynamicHeightListRef,
  DynamicHeightListProps<any>
>(DynamicHeightList);
