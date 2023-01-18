import type { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import * as React from 'react';
import { View } from 'react-native';
import {
  createStyleSheet,
  EqualHeightList,
  EqualHeightListItemComponent,
  EqualHeightListItemData,
  EqualHeightListRef,
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
};

const DefaultAvatarMemo = React.memo(() => {
  return <DefaultAvatar size={50} radius={25} />;
});

const Item: EqualHeightListItemComponent = (props) => {
  const item = props.data as ItemDataType;
  return (
    <View style={styles.item}>
      <DefaultAvatarMemo />
      <View style={styles.itemText}>
        <Text>{item.en}</Text>
        <Text>{item.ch}</Text>
      </View>
    </View>
  );
};

let count = 0;
export default function GroupListScreen({ navigation }: Props): JSX.Element {
  // console.log('test:GroupListScreen:', route, navigation);
  const theme = useThemeContext();
  // const menu = useActionMenu();
  const sheet = useBottomSheet();

  const listRef = React.useRef<EqualHeightListRef>(null);
  const enableRefresh = true;
  const enableAlphabet = false;
  const enableHeader = true;
  const autoFocus = false;
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
        navigation.navigate({ name: 'GroupInfo', params: {} });
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
      <EqualHeightList
        parentName="GroupList"
        onLayout={(_) => {
          // console.log('test:EqualHeightList:', event.nativeEvent.layout.height);
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
    </SafeAreaView>
  );
}
const styles = createStyleSheet({
  item: {
    flex: 1,
    // backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 0,
    marginHorizontal: 0,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    marginLeft: 10,
  },
});
