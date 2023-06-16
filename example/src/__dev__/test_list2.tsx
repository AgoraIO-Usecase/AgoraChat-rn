/* eslint-disable react/no-unstable-nested-components */
import * as React from 'react';
import {
  AppRegistry,
  RefreshControlProps,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Button,
  EqualHeightList,
  EqualHeightListItemComponent,
  EqualHeightListItemData,
  EqualHeightListRef,
  ListHeaderProps,
  LocalIcon,
  SearchBar,
} from 'react-native-chat-uikit';
import { RefreshControl } from 'react-native-gesture-handler';

import { COUNTRY } from './const';

type ItemDataType = EqualHeightListItemData & {
  en: string;
  ch: string;
};

const Item: EqualHeightListItemComponent = (props) => {
  const item = props.data as ItemDataType;
  return (
    <View style={styles.item}>
      <Text>{item.en}</Text>
      <Text>{item.ch}</Text>
    </View>
  );
};

const CustomRefreshComponent = (props: RefreshControlProps) => {
  const { refreshing } = props;
  return (
    <RefreshControl
      refreshing={refreshing}
      style={{ justifyContent: 'center', alignItems: 'center' }}
    >
      <View
        style={{
          width: 50,
          height: 50,
          backgroundColor: 'red',
          marginTop: 50,
        }}
      />
    </RefreshControl>
  );
};

export default function TestList2() {
  let count = 0;
  const ref = React.useRef<EqualHeightListRef>(null);
  const enableRefresh = true;
  const enableAlphabet = true;
  const enableHeader = true;
  const useCustomRefresh = false;
  const enableCancel = false;
  const enableClear = true;
  const data: ItemDataType[] = [];
  const r = COUNTRY.map((value) => {
    const i = value.lastIndexOf(' ');
    const en = value.slice(0, i);
    const ch = value.slice(i + 1);
    return {
      key: en,
      en: en,
      ch: ch,
    } as ItemDataType;
  });
  data.push(...r);

  const s = {
    type: (props: RefreshControlProps) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { onRefresh, refreshing, progressViewOffset, ...others } = props;
      // console.log('test:', onRefresh, progressViewOffset);
      return (
        <View
          style={{
            height: 30,
            width: 30,
            backgroundColor: '#f9c2ff',
            opacity: refreshing ? 0 : 1,
          }}
          {...others}
        >
          <LocalIcon name="loading" size={20} />
        </View>
      );
    },
    props: {
      refreshing: true,
      progressViewOffset: 100,
    },
    key: 'CustomRefreshComponent',
  };

  const s3 = {
    // Component: {
    //   type: (props: RefreshControlProps) => {
    //     const { onRefresh, refreshing, progressViewOffset, ...others } =
    //       props;
    //     console.log('test:', onRefresh, progressViewOffset);
    //     return (
    //       <View
    //         style={{
    //           height: 30,
    //           width: 30,
    //           backgroundColor: '#f9c2ff',
    //           opacity: refreshing ? 0 : 1,
    //         }}
    //         {...others}
    //       >
    //         <LocalIcon name="loading" size={20} />
    //       </View>
    //     );
    //   },
    //   props: {
    //     refreshing: true,
    //     progressViewOffset: 100,
    //   },
    //   key: 'CustomRefreshComponent',
    // },
    Component: <CustomRefreshComponent refreshing />,
    props: {
      refreshing: true,
    },
  };

  AppRegistry.registerComponent(s.key, () => s.type);
  console.log('test:AppRegistry:', AppRegistry.getAppKeys());

  // const s2 = {
  //   Component: (props: any) => (
  //     <View {...props}>
  //       <Text>h</Text>
  //     </View>
  //   ),
  //   props: {
  //     backgroundColor: 'red',
  //   },
  // };

  const s4 = {
    Component: (props: ListHeaderProps) => (
      <View {...props}>
        <SearchBar enableCancel={enableCancel} enableClear={enableClear} />
      </View>
    ),
    props: {
      backgroundColor: 'red',
      name: 'haha',
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button
        onPress={() => {
          const en = 'aaa';
          const v = en + count++;
          ref.current?.manualRefresh([
            {
              type: 'add',
              data: [
                {
                  en: v,
                  ch: v,
                  key: v,
                } as EqualHeightListItemData,
              ],
              enableSort: true,
            },
          ]);
        }}
      >
        sort add data
      </Button>
      <Button
        onPress={() => {
          const en = 'eee';
          const v = en + count++;
          ref.current?.manualRefresh([
            {
              type: 'add',
              data: [
                {
                  en: v,
                  ch: v,
                  key: v,
                } as EqualHeightListItemData,
              ],
              enableSort: false,
            },
          ]);
        }}
      >
        add data
      </Button>
      <Button
        onPress={() => {
          ref.current?.manualRefresh([
            {
              type: 'clear',
            },
          ]);
        }}
      >
        clear data
      </Button>
      <Button
        onPress={() => {
          const en = 'Angola';
          const v = en + count++;
          ref.current?.manualRefresh([
            {
              type: 'update',
              data: [
                {
                  en: en,
                  ch: v,
                  key: en,
                } as EqualHeightListItemData,
              ],
              enableSort: false,
            },
          ]);
        }}
      >
        update data
      </Button>
      <EqualHeightList
        ref={ref}
        items={data}
        ItemFC={Item}
        enableAlphabet={enableAlphabet}
        enableRefresh={enableRefresh}
        enableHeader={enableHeader}
        alphabet={{
          alphabetCurrent: {
            backgroundColor: 'orange',
            color: 'white',
          },
        }}
        RefreshComponent={useCustomRefresh ? s3 : undefined}
        HeaderComponent={enableHeader === true ? s4 : undefined}
        onRefresh={(type) => {
          if (type === 'started') {
            const en = 'aaa';
            const v = en + count++;
            ref.current?.manualRefresh([
              {
                type: 'add',
                data: [
                  {
                    en: v,
                    ch: v,
                    key: v,
                  } as EqualHeightListItemData,
                ],
                enableSort: true,
              },
            ]);
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    // backgroundColor: 'red',
  },
  item: {
    flex: 1,
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    height: 80,
  },
});
