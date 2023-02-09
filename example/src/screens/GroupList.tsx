import type { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import * as React from 'react';
import { View } from 'react-native';
import {
  autoFocus,
  Blank,
  createStyleSheet,
  EqualHeightList,
  EqualHeightListItemComponent,
  EqualHeightListItemData,
  EqualHeightListRef,
  getScaleFactor,
  queueTask,
  useBottomSheet,
  useChatSdkContext,
  useThemeContext,
} from 'react-native-chat-uikit';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

// import { COUNTRY } from '../__dev__/const';
import { DefaultAvatar } from '../components/DefaultAvatars';
import { ListItemSeparator } from '../components/ListItemSeparator';
import { ListSearchHeader } from '../components/ListSearchHeader';
import { useStyleSheet } from '../hooks/useStyleSheet';
import type { RootParamsList } from '../routes';

type Props = MaterialTopTabScreenProps<RootParamsList>;

type ItemDataType = EqualHeightListItemData & {
  groupID: string;
  groupName: string;
};

const Item: EqualHeightListItemComponent = (props) => {
  const sf = getScaleFactor();
  const item = props.data as ItemDataType;
  return (
    <View style={styles.item}>
      <DefaultAvatar size={sf(50)} radius={sf(25)} />
      <View style={styles.itemText}>
        <Text style={{ lineHeight: 20, fontSize: 16, fontWeight: '600' }}>
          {item.groupID}
        </Text>
        <Text>{item.groupName}</Text>
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
  const sf = getScaleFactor();

  const listRef = React.useRef<EqualHeightListRef>(null);
  const enableRefresh = true;
  const enableAlphabet = false;
  const enableHeader = true;
  // const autoFocus = false;
  const data: ItemDataType[] = [];
  const [isEmpty, setIsEmpty] = React.useState(true);

  const initData = React.useCallback(
    (list: string[]) => {
      const r = list.map((value) => {
        const i = value.lastIndexOf(' ');
        const groupID = value.slice(0, i);
        const groupName = value.slice(i + 1);
        return {
          key: groupID,
          groupID: groupID,
          groupName: groupName,
          onLongPress: (data) => {
            console.log('test:onLongPress:data:', data);
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
            navigation.navigate('GroupInfo', { params: {} });
            // navigation.navigate({ name: 'GroupInfo', params: {} });
          },
        } as ItemDataType;
      });
      // data.push(...r);
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
    },
    [navigation, sheet, theme.colors.primary]
  );

  const { client } = useChatSdkContext();
  const initList = React.useCallback(() => {
    client.groupManager
      .getJoinedGroups()
      .then((result) => {
        console.log('test:GroupListScreen:success:', result);
        setIsEmpty(result.length === 0);
        initData(
          result.map((item) => {
            return item.groupId + ' ' + item.groupName;
          })
        ); // for test
      })
      .catch((error) => {
        console.warn('test:error:', error);
      });
  }, [client, initData]);

  React.useEffect(() => {
    const load = () => {
      console.log('test:load:');
      initList();
    };
    const unload = () => {
      console.log('test:unload:');
    };

    load();
    return () => unload();
  }, [initList]);

  return (
    <SafeAreaView
      mode="padding"
      style={useStyleSheet().safe}
      edges={['right', 'left']}
    >
      <ListSearchHeader
        autoFocus={autoFocus()}
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
      />
      {isEmpty === true ? (
        <Blank />
      ) : (
        <EqualHeightList
          parentName="GroupList"
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
              width: sf(15),
              borderRadius: 8,
            },
          }}
          ItemSeparatorComponent={ListItemSeparator}
          onRefresh={(type) => {
            if (type === 'started') {
              const groupID = 'aaa';
              const v = groupID + count++;
              listRef.current?.manualRefresh([
                {
                  type: 'add',
                  data: [
                    {
                      groupID: v,
                      groupName: v,
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
