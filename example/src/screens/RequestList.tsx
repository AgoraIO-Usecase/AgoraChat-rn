import type { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import {
  Blank,
  Button,
  createStyleSheet,
  EqualHeightList,
  EqualHeightListItemComponent,
  EqualHeightListItemData,
  EqualHeightListRef,
  LocalIcon,
  queueTask,
  useBottomSheet,
  useThemeContext,
} from 'react-native-chat-uikit';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COUNTRY } from '../__dev__/const';
import { DefaultAvatar } from '../components/DefaultAvatars';
import { ListItemSeparator } from '../components/ListItemSeparator';
import { ListSearchHeader } from '../components/ListSearchHeader';
import type { RootParamsList } from '../routes';

type Props = MaterialTopTabScreenProps<RootParamsList>;

type ItemDataType = EqualHeightListItemData & {
  en: string;
  ch: string;
  onAction?: (isAccepted: boolean) => void;
};

const DefaultAvatarMemo = React.memo(() => {
  return <DefaultAvatar size={50} radius={25} />;
});

const Item: EqualHeightListItemComponent = (props) => {
  const item = props.data as ItemDataType;
  return (
    <View style={styles.item}>
      <View
        style={{
          flex: 1,
          // backgroundColor: 'red',
          // height: '100%',
          // width: '100%',
          // minHeight: '100%',
          flexGrow: 1,
          // flexShrink: 0,
        }}
      >
        <View style={styles.item2}>
          <DefaultAvatarMemo />
          <View style={styles.itemText}>
            <Text>{item.en}</Text>
            <Text>{item.ch}</Text>
          </View>
        </View>
        <View style={styles.item3}>
          <Button
            style={{ alignSelf: 'flex-end', height: 28, borderRadius: 14 }}
            onPress={() => item.onAction?.(true)}
          >
            <Text style={{ color: 'white', marginHorizontal: 8 }}>Accept</Text>
          </Button>
          <Pressable onPress={() => item.onAction?.(false)}>
            <LocalIcon
              name="xmark_thick"
              color="black"
              style={{ alignSelf: 'flex-end', marginLeft: 15 }}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

let count = 0;
export default function RequestListScreen(_props: Props): JSX.Element {
  // console.log('test:GroupListScreen:', route, navigation);
  const theme = useThemeContext();
  // const menu = useActionMenu();
  const sheet = useBottomSheet();

  const listRef = React.useRef<EqualHeightListRef>(null);
  const enableRefresh = true;
  const enableAlphabet = false;
  const enableHeader = false;
  const autoFocus = false;
  const isEmpty = false;
  const data: ItemDataType[] = [];
  const r = COUNTRY.map((value) => {
    const i = value.lastIndexOf(' ');
    const en = value.slice(0, i);
    const ch = value.slice(i + 1);
    return {
      key: en,
      en: en,
      ch: ch,
      onLongPress: (data) => {
        console.log('test:onLongPress:data:', data);
        // menu.openMenu({
        //   // title: 'test',
        //   menuItems: [
        //     {
        //       title: '1',
        //       onPress: () => {
        //         console.log('test:1:');
        //       },
        //     },
        //     {
        //       title: '2',
        //       onPress: () => {
        //         console.log('test:2:');
        //       },
        //     },
        //   ],
        // });
        sheet.openSheet({
          sheetItems: [
            {
              icon: 'loading',
              iconColor: theme.colors.primary,
              title: '1',
              titleColor: 'black',
              onPress: () => {
                console.log('test:onPress:data:', data);
              },
            },
            {
              icon: 'loading',
              iconColor: theme.colors.primary,
              title: '2',
              titleColor: 'black',
              onPress: () => {
                console.log('test:onPress:data:', data);
              },
            },
          ],
        });
      },
      onPress: (data) => {
        console.log('test:onPress:data:', data);
      },
    } as ItemDataType;
  });
  data.push(...r);

  return (
    <SafeAreaView
      mode="padding"
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={['right', 'left']}
    >
      {isEmpty ? (
        <Blank />
      ) : (
        <EqualHeightList
          onLayout={(event) => {
            console.log(
              'test:EqualHeightList:',
              event.nativeEvent.layout.height
            );
          }}
          ref={listRef}
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
            alphabetItemContainer: {
              width: 15,
              borderRadius: 8,
            },
          }}
          Header={(props) => (
            <ListSearchHeader
              autoFocus={autoFocus}
              onChangeText={(text) => {
                console.log('test:ListSearchHeader:onChangeText:', Text);
                queueTask(() => {
                  const r: ItemDataType[] = [];
                  for (const item of data) {
                    if (item.key.includes(text)) {
                      r.push(item);
                    }
                  }
                  listRef.current?.manualRefresh([
                    {
                      type: 'clear',
                    },
                    {
                      type: 'add',
                      data: r,
                      enableSort: true,
                    },
                  ]);
                });
              }}
              {...props}
            />
          )}
          ItemSeparatorComponent={ListItemSeparator}
          onRefresh={(type) => {
            if (type === 'started') {
              const en = 'aaa';
              const v = en + count++;
              listRef.current?.manualRefresh([
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
      )}
    </SafeAreaView>
  );
}
const styles = createStyleSheet({
  item: {
    flex: 1,
    // backgroundColor: 'green',
    padding: 20,
    paddingVertical: 10,
    marginVertical: 0,
    marginHorizontal: 0,
    height: 138,
    alignItems: 'center',
    flexDirection: 'row',
  },
  item2: {
    flex: 1,
    // backgroundColor: '#f9c2ff',
    // padding: 20,
    marginVertical: 0,
    marginHorizontal: 0,
    // height: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item3: {
    // flex: 1,
    // backgroundColor: 'red',
    padding: 5,
    marginVertical: 0,
    marginHorizontal: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // alignContent: 'flex-end',
  },
  itemText: {
    marginLeft: 10,
  },
});
