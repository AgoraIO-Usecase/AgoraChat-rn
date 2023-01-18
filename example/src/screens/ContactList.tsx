import type { MaterialBottomTabScreenProps } from '@react-navigation/material-bottom-tabs';
import type { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import {
  createStyleSheet,
  EqualHeightList,
  EqualHeightListItemComponent,
  EqualHeightListItemData,
  EqualHeightListRef,
  LocalIcon,
  queueTask,
  RadioButton,
  useAlert,
  useBottomSheet,
  useThemeContext,
} from 'react-native-chat-uikit';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COUNTRY } from '../__dev__/const';
import { DefaultAvatar } from '../components/DefaultAvatars';
import { ListItemSeparator } from '../components/ListItemSeparator';
import { ListSearchHeader } from '../components/ListSearchHeader';
import { useAppI18nContext } from '../contexts/AppI18nContext';
import type {
  BottomTabScreenParamsList,
  RootScreenParamsList,
  TopTabScreenParamsList,
} from '../routes';
import type { GroupActionType, Undefinable } from '../types';

type BottomTabScreenParamsListOnly = Omit<
  BottomTabScreenParamsList,
  keyof TopTabScreenParamsList
>;
type RootScreenParamsListOnly = Omit<
  RootScreenParamsList,
  keyof BottomTabScreenParamsList
>;
type Props = CompositeScreenProps<
  MaterialTopTabScreenProps<TopTabScreenParamsList, 'ContactList'>,
  CompositeScreenProps<
    MaterialBottomTabScreenProps<BottomTabScreenParamsListOnly>,
    NativeStackScreenProps<RootScreenParamsListOnly>
  >
>;

type ItemDataType = EqualHeightListItemData & {
  en: string;
  ch: string;
  type?: Undefinable<GroupActionType>;
  action?: {
    isActionEnabled: boolean;
    isInvited: boolean;
    onAction?: () => void;
  };
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
      {item.type === 'group_invite' ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'flex-end',
            flexGrow: 1,
            paddingRight: 5,
          }}
        >
          <RadioButton
            checked={item.action?.isInvited}
            onChecked={item.action?.onAction}
          />
        </View>
      ) : null}
    </View>
  );
};

let count = 0;
export default function ContactListScreen({
  route,
  navigation,
}: Props): JSX.Element {
  const rp = route.params as any;
  const params = rp?.params as any;
  const type = params?.type as Undefinable<GroupActionType>;
  console.log('test:ContactListScreen:', params, type);
  const theme = useThemeContext();
  // const menu = useActionMenu();
  const sheet = useBottomSheet();
  const alert = useAlert();
  const { header, groupInfo } = useAppI18nContext();

  const listRef = React.useRef<EqualHeightListRef>(null);
  const enableRefresh = true;
  const enableAlphabet = true;
  const enableHeader = true;
  const autoFocus = false;
  const data: ItemDataType[] = [];
  const r = COUNTRY.map((value, index) => {
    const i = value.lastIndexOf(' ');
    const en = value.slice(0, i);
    const ch = value.slice(i + 1);
    return {
      key: en,
      en: en,
      ch: ch,
      height: 80,
      onLongPress: (data) => {
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
        navigation.navigate({ name: 'ContactInfo', params: {} });
      },
      type: type,
      action: {
        isActionEnabled: true,
        isInvited: index % 2 === 0 ? true : false,
        onAction: () => {
          console.log('test:onAction:');
        },
      },
    } as ItemDataType;
  });
  data.push(...r);

  const NavigationHeaderRight = React.useCallback(
    (_: HeaderButtonProps) => {
      const Right = ({ type }: { type: Undefinable<GroupActionType> }) => {
        if (type === 'group_invite') {
          const right = `${header.groupInvite}(${0})`;
          return (
            <View style={{ padding: 10, marginRight: -10 }}>
              <Text>{right}</Text>
            </View>
          );
        } else if (type === 'group_member') {
          return (
            <View style={{ padding: 10, marginRight: -10 }}>
              <LocalIcon name="contact_add_contacts" size={28} />
            </View>
          );
        } else {
          return null;
        }
      };
      return (
        <Pressable
          onPress={() => {
            alert.openAlert({
              title: groupInfo.inviteAlert.title,
              message: groupInfo.inviteAlert.message,
              buttons: [
                {
                  text: groupInfo.inviteAlert.cancelButton,
                  onPress: () => {
                    navigation.goBack();
                  },
                },
                {
                  text: groupInfo.inviteAlert.confirmButton,
                  onPress: () => {
                    navigation.goBack();
                  },
                },
              ],
            });
          }}
        >
          <Right type={type} />
        </Pressable>
      );
    },
    [alert, groupInfo, header.groupInvite, navigation, type]
  );

  React.useEffect(() => {
    if (type === 'group_invite' || type === 'group_member') {
      navigation.setOptions({
        headerRight: NavigationHeaderRight,
      });
    }
  }, [NavigationHeaderRight, header.groupInvite, navigation, type]);

  return (
    <SafeAreaView
      mode="padding"
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={['right', 'left']}
    >
      <EqualHeightList
        parentName="ContactList"
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
