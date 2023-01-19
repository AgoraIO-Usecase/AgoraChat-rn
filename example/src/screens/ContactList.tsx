import type { MaterialBottomTabScreenProps } from '@react-navigation/material-bottom-tabs';
import type { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import {
  Button,
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
  useToastContext,
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
import type { ContactActionType, Undefinable } from '../types';

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
  type?: Undefinable<ContactActionType>;
  action?: {
    groupInvite?: {
      isActionEnabled: boolean;
      isInvited: boolean;
      onAction?: () => void;
    };
    block?: {
      name: string;
      onClicked?: () => void;
    };
  };
};

const DefaultAvatarMemo = React.memo(() => {
  return <DefaultAvatar size={50} radius={25} />;
});

const Item: EqualHeightListItemComponent = (props) => {
  const item = props.data as ItemDataType;
  const toast = useToastContext();
  const alert = useAlert();

  const Right = (type: ContactActionType | undefined) => {
    switch (type) {
      case 'group_invite':
        return (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'flex-end',
              flexGrow: 1,
              paddingRight: 5,
            }}
          >
            <RadioButton
              checked={item.action?.groupInvite?.isInvited}
              onChecked={item.action?.groupInvite?.onAction}
            />
          </View>
        );
      case 'block_contact':
        return (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'flex-end',
              flexGrow: 1,
              paddingRight: 5,
            }}
          >
            <Button
              style={{ height: 30, borderRadius: 24, paddingHorizontal: 10 }}
              color={{
                disabled: {
                  content: 'rgba(102, 102, 102, 1)',
                  background: '#F2F2F2',
                },
                enabled: {
                  content: 'rgba(102, 102, 102, 1)',
                  background: '#F2F2F2',
                },
                pressed: {
                  content: 'rgba(102, 102, 102, 1)',
                  background: '#E6E6E6',
                },
              }}
              onPress={() => {
                alert.openAlert({
                  title: 'Unblock NickName?',
                  buttons: [
                    {
                      text: 'Cancel',
                      onPress: () => {},
                    },
                    {
                      text: 'Confirm',
                      onPress: () => {
                        toast.showToast('Unblocked');
                      },
                    },
                  ],
                });
              }}
            >
              {item.action?.block?.name}
            </Button>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.item}>
      <DefaultAvatarMemo />
      <View style={styles.itemText}>
        <Text>{item.en}</Text>
        <Text>{item.ch}</Text>
      </View>
      {Right(item.type)}
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
  const type = params?.type as Undefinable<ContactActionType>;
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

  const action = React.useCallback(
    (type: ContactActionType | undefined, index: number) => {
      switch (type) {
        case 'group_invite':
          return {
            groupInvite: {
              isActionEnabled: true,
              isInvited: index % 2 === 0 ? true : false,
              onAction: () => {
                console.log('test:onAction:');
              },
            },
          };
        case 'block_contact':
          return {
            block: {
              name: 'Unblock',
              onClicked: () => {
                console.log('test:onClicked:');
              },
            },
          };
        default:
          return undefined;
      }
    },
    []
  );

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
      action: action(type, index),
    } as ItemDataType;
  });
  data.push(...r);

  const NavigationHeaderRight = React.useCallback(
    (_: HeaderButtonProps) => {
      const Right = ({ type }: { type: Undefinable<ContactActionType> }) => {
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
        Header={(props) => {
          return (
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
          );
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
