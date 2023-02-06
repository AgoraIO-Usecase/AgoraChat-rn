import type { MaterialBottomTabScreenProps } from '@react-navigation/material-bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type {
  HeaderButtonProps,
  NativeStackScreenProps,
} from '@react-navigation/native-stack/lib/typescript/src/types';
import * as React from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import {
  Badge as UIBadge,
  Blank,
  createStyleSheet,
  EqualHeightList,
  EqualHeightListItemComponent,
  EqualHeightListItemData,
  EqualHeightListRef,
  getScaleFactor,
  LocalIcon,
  queueTask,
  useBottomSheet,
  useThemeContext,
} from 'react-native-chat-uikit';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COUNTRY } from '../__dev__/const';
import { DefaultAvatar } from '../components/DefaultAvatars';
import HomeHeaderTitle from '../components/HomeHeaderTitle';
import { ListItemSeparator } from '../components/ListItemSeparator';
import { ListSearchHeader } from '../components/ListSearchHeader';
import { useAppI18nContext } from '../contexts/AppI18nContext';
import type {
  BottomTabScreenParamsList,
  RootScreenParamsList,
} from '../routes';

type RootScreenParamsListOnly = Omit<
  RootScreenParamsList,
  keyof BottomTabScreenParamsList
>;
type Props = CompositeScreenProps<
  MaterialBottomTabScreenProps<BottomTabScreenParamsList, 'ConversationList'>,
  NativeStackScreenProps<RootScreenParamsListOnly>
>;

// type NavigationProp = CompositeNavigationProp<
//   MaterialBottomTabNavigationProp<
//     BottomTabScreenParamsList<BottomTabParamsList, 'option'>,
//     any,
//     undefined
//   >,
//   NativeStackNavigationProp<
//     RootScreenParamsList<RootParamsList, 'option'>,
//     any,
//     undefined
//   >
// >;

type ItemDataType = EqualHeightListItemData & {
  en: string;
  ch: string;
  timestamp: number;
};

const sf = getScaleFactor();

const DefaultAvatarMemo = React.memo(() => {
  return <DefaultAvatar size={sf(50)} radius={sf(25)} />;
});

const Item: EqualHeightListItemComponent = (props) => {
  const item = props.data as ItemDataType;
  const { width } = useWindowDimensions();
  const extraWidth = item.sideslip?.width ?? sf(100);
  const screenWidth = width;
  // console.log('test:width:', screenWidth + extraWidth);
  return (
    <View style={[styles.item, { width: screenWidth + extraWidth }]}>
      <View
        style={{
          // width: screenWidth,
          flexGrow: 1,
          flexShrink: 1,
          flexDirection: 'row',
        }}
      >
        <DefaultAvatarMemo />
        <View style={[styles.itemText, { justifyContent: 'space-between' }]}>
          <Text>{item.en}</Text>
          <Text>{item.ch}</Text>
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexGrow: 1,
          }}
        >
          <Text>MM:HH:MM</Text>
          <UIBadge
            count={10}
            badgeColor="rgba(255, 20, 204, 1)"
            size="default"
          />
        </View>
      </View>
      <View
        style={{
          // flexGrow: 1,
          width: extraWidth, // ??? why
          height: sf(60),
          flexDirection: 'row',
          // backgroundColor: 'green',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <View style={{ width: sf(20) }} />
        <View
          style={{
            height: sf(30),
            width: sf(30),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F2F2F2',
            overflow: 'hidden',
            borderRadius: sf(30),
          }}
        >
          <LocalIcon name="bell_slash" size={20} color="#666666" />
        </View>
        <View style={{ width: sf(15) }} />
        <View
          style={{
            height: sf(30),
            width: sf(30),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 20, 204, 1)',
            overflow: 'hidden',
            borderRadius: sf(30),
          }}
        >
          <LocalIcon name="trash" size={sf(20)} color="white" />
        </View>
      </View>
    </View>
  );
};

let count = 0;
export default function ConversationListScreen({
  navigation,
}: Props): JSX.Element {
  // console.log('test:ConversationListScreen:', navigation);
  // return <Placeholder content={`${ConversationListScreen.name}`} />;
  // console.log('test:GroupListScreen:', route, navigation);
  const sf = getScaleFactor();
  const theme = useThemeContext();
  // const menu = useActionMenu();
  const sheet = useBottomSheet();
  const { conversation } = useAppI18nContext();

  const listRef = React.useRef<EqualHeightListRef>(null);
  const enableRefresh = true;
  const enableAlphabet = false;
  const enableHeader = true;
  const autoFocus = false;
  const data: ItemDataType[] = [];
  const width = sf(100);
  const isEmpty = false;
  const r = COUNTRY.map((value) => {
    const i = value.lastIndexOf(' ');
    const en = value.slice(0, i);
    const ch = value.slice(i + 1);
    return {
      key: en,
      en: en,
      ch: ch,
      type: 'sideslip',
      sideslip: {
        width: width,
      },
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
      onPress: (_) => {
        navigation.navigate({ name: 'Chat', params: {} });
      },
    } as ItemDataType;
  });
  data.push(...r);

  const NavigationHeaderRight: React.FunctionComponent<HeaderButtonProps> =
    React.useCallback(
      (_: HeaderButtonProps) => {
        // const navigation = useNavigation<NavigationProp>();
        // const sheet = useBottomSheet();
        // const { conversation } = useAppI18nContext();
        return (
          <Pressable
            onPress={() => {
              console.log('test:NavigationHeaderRight:onPress:');
              sheet.openSheet({
                sheetItems: [
                  {
                    title: conversation.new,
                    titleColor: 'black',
                    onPress: () => {
                      console.log('test:onPress:data:');
                      // navigation.navigate('ContactList', {
                      //   params: { type: 'create_conversation' },
                      // });
                      navigation.navigate({
                        name: 'ContactList',
                        params: { params: { type: 'create_conversation' } },
                      });
                    },
                  },
                  {
                    title: conversation.createGroup,
                    titleColor: 'black',
                    onPress: () => {
                      console.log('test:onPress:data:');
                      navigation.navigate('ContactList', {
                        params: { type: 'create_group' },
                      });
                    },
                  },
                  {
                    title: conversation.addContact,
                    titleColor: 'black',
                    onPress: () => {
                      console.log('test:onPress:data:');
                      navigation.navigate('Search', {
                        params: { type: 'add_contact' },
                      });
                    },
                  },
                  {
                    title: conversation.joinPublicGroup,
                    titleColor: 'black',
                    onPress: () => {
                      console.log('test:onPress:data:');
                      navigation.navigate('Search', {
                        params: { type: 'join_public_group' },
                      });
                    },
                  },
                ],
              });
            }}
          >
            <View style={{ padding: sf(10), marginRight: -sf(10) }}>
              <LocalIcon
                name="chat_nav_add"
                style={{ padding: 0 }}
                size={sf(20)}
              />
            </View>
          </Pressable>
        );
      },
      [
        conversation.addContact,
        conversation.createGroup,
        conversation.joinPublicGroup,
        conversation.new,
        navigation,
        sf,
        sheet,
      ]
    );

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('test:HomeScreen:222:');
      navigation.getParent()?.setOptions({
        headerBackVisible: false,
        headerRight: NavigationHeaderRight,
        headerTitle: () => <HomeHeaderTitle name="Chats" />,
        headerShadowVisible: false,
      });
    });
    return unsubscribe;
  }, [NavigationHeaderRight, navigation]);

  return (
    <SafeAreaView
      mode="padding"
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={['right', 'left']}
    >
      {isEmpty ? (
        <Blank />
      ) : (
        <React.Fragment>
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
          />
          <EqualHeightList
            parentName="ConversationList"
            onLayout={(_) => {
              // console.log(
              //   'test:EqualHeightList:',
              //   event.nativeEvent.layout.height
              // );
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
                width: sf(15),
                borderRadius: sf(8),
              },
            }}
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
        </React.Fragment>
      )}
    </SafeAreaView>
  );
}
const styles = createStyleSheet({
  item: {
    // flex: 1,
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
