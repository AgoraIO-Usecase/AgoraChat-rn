import type {
  MaterialBottomTabNavigationProp,
  MaterialBottomTabScreenProps,
} from '@react-navigation/material-bottom-tabs';
import type {
  MaterialTopTabNavigationProp,
  MaterialTopTabScreenProps,
} from '@react-navigation/material-top-tabs';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  // NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type {
  HeaderButtonProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack/lib/typescript/src/types';
import * as React from 'react';
import {
  Pressable,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Button,
  CheckButton,
  createStyleSheet,
  Divider,
  EqualHeightList,
  EqualHeightListItemComponent,
  EqualHeightListItemData,
  EqualHeightListRef,
  getScaleFactor,
  LocalIcon,
  queueTask,
  useAlert,
  useBottomSheet,
  useManualCloseDialog,
  useThemeContext,
  useToastContext,
} from 'react-native-chat-uikit';
import { Switch, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COUNTRY } from '../__dev__/const';
import { DefaultAvatar } from '../components/DefaultAvatars';
import { ListItemSeparator } from '../components/ListItemSeparator';
import { ListSearchHeader } from '../components/ListSearchHeader';
import { useAppI18nContext } from '../contexts/AppI18nContext';
import type {
  BottomTabParamsList,
  BottomTabScreenParamsList,
  RootParamsList,
  RootScreenParamsList,
  TopTabParamsList,
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

type NavigationProp = CompositeNavigationProp<
  MaterialTopTabNavigationProp<
    TopTabScreenParamsList<TopTabParamsList, 'option'>,
    'ContactList',
    undefined
  >,
  CompositeNavigationProp<
    MaterialBottomTabNavigationProp<
      BottomTabScreenParamsList<BottomTabParamsList, 'option'>,
      any,
      undefined
    >,
    NativeStackNavigationProp<
      RootScreenParamsList<RootParamsList, 'option'>,
      any,
      undefined
    >
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
    createGroup?: {
      isActionEnabled: boolean;
      isInvited: boolean;
      onAction?: () => void;
    };
    modifyGroupMember?: {
      isActionEnabled: boolean;
      isInvited: boolean;
      onAction?: () => void;
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
          <View style={styles.rightItem}>
            <CheckButton
              checked={item.action?.groupInvite?.isInvited}
              onChecked={item.action?.groupInvite?.onAction}
            />
          </View>
        );
      case 'create_group':
        return (
          <View style={styles.rightItem}>
            <CheckButton
              checked={item.action?.createGroup?.isInvited}
              onChecked={item.action?.createGroup?.onAction}
            />
          </View>
        );
      case 'block_contact':
        return (
          <View style={styles.rightItem}>
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
      case 'group_member_modify':
        return (
          <View style={styles.rightItem}>
            <CheckButton
              checked={item.action?.modifyGroupMember?.isInvited}
              onChecked={item.action?.modifyGroupMember?.onAction}
            />
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

const NavigationHeaderTitle = (type: Undefinable<ContactActionType>) => {
  switch (type) {
    case 'group_member_modify':
      return 'Members';
    case 'block_contact':
      return 'Blocked Lists';
    default:
      return undefined;
  }
};

const NavigationHeaderRight = (_: HeaderButtonProps) => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const rp = route.params as any;
  const params = rp?.params as any;
  const type = params?.type as Undefinable<ContactActionType>;
  console.log('test:NavigationHeaderRight:', params, type);
  // const theme = useThemeContext();
  // const menu = useActionMenu();
  const sf = getScaleFactor();
  const sheet = useBottomSheet();
  const toast = useToastContext();
  const { manualClose } = useManualCloseDialog();
  const alert = useAlert();
  const { header, groupInfo } = useAppI18nContext();
  const { width: screenWidth } = useWindowDimensions();

  const [selectedCount] = React.useState(10);

  const Right = ({ type }: { type: Undefinable<ContactActionType> }) => {
    const { contactList } = useAppI18nContext();
    if (type === 'group_invite') {
      const right = `${header.groupInvite}(${selectedCount})`;
      return (
        <View style={styles.rightButton}>
          <Text>{right}</Text>
        </View>
      );
    } else if (type === 'group_member') {
      return (
        <View style={styles.rightButton}>
          <LocalIcon name="contact_add_contacts" size={sf(28)} />
        </View>
      );
    } else if (type === 'create_group') {
      const _createGroup = () => {
        sheet.openSheet({
          sheetItems: [
            {
              key: '1',
              Custom: (
                <View
                  style={{
                    width: sf(screenWidth - 40),
                  }}
                >
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingVertical: sf(12),
                      flexGrow: 1,
                    }}
                  >
                    <Text
                      style={{
                        color: '#666666',
                        fontSize: sf(14),
                        fontWeight: '600',
                        lineHeight: sf(18),
                      }}
                    >
                      {contactList.groupSetting.groupSetting}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: sf(12),
                    }}
                  >
                    <Text
                      style={{
                        color: '#333333',
                        fontSize: sf(15),
                        fontWeight: '600',
                        lineHeight: sf(20),
                      }}
                    >
                      {contactList.groupSetting.publicGroup}
                    </Text>
                    <Switch />
                  </View>
                  <Divider height={sf(0.25)} marginLeft={1} marginRight={1} />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: sf(12),
                    }}
                  >
                    <Text
                      style={{
                        color: '#333333',
                        fontSize: sf(15),
                        fontWeight: '600',
                        lineHeight: sf(20),
                      }}
                    >
                      {contactList.groupSetting.memberInvite}
                    </Text>
                    <Switch />
                  </View>
                  <Divider height={sf(0.25)} marginLeft={1} marginRight={1} />
                  <View
                    style={{
                      paddingVertical: sf(20),
                    }}
                  >
                    <Button
                      style={{ height: sf(48), borderRadius: sf(24) }}
                      onPress={() => {
                        manualClose()
                          .then(() => {
                            if (navigation.canGoBack()) {
                              navigation.goBack();
                              // navigation.pop(1);
                              navigation.push('Chat', { params: {} });
                              // navigation.popToTop();
                            }
                          })
                          .catch((error) => {
                            console.warn('test:error:', error);
                          });
                      }}
                    >
                      {contactList.groupSetting.createGroup}
                    </Button>
                  </View>
                </View>
              ),
            },
          ],
        });
      };
      const right = `${header.createGroup}(${selectedCount})`;
      return (
        <TouchableOpacity style={styles.rightButton} onPress={_createGroup}>
          <Text style={{ color: selectedCount === 0 ? 'black' : '#114EFF' }}>
            {right}
          </Text>
        </TouchableOpacity>
      );
    } else if (type === 'group_member_modify') {
      const _addMember = () => {
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
                toast.showToast(groupInfo.toast[0]!);
              },
            },
          ],
        });
      };
      const right = `${header.addMembers}(${selectedCount})`;
      return (
        <TouchableOpacity style={styles.rightButton} onPress={_addMember}>
          <Text style={{ color: selectedCount === 0 ? 'black' : '#114EFF' }}>
            {right}
          </Text>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };
  return (
    <Pressable
      onPress={() => {
        if (type === 'group_member') {
          navigation.push('ContactList' as any, {
            params: { type: 'group_member_modify' },
          });
        } else {
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
                  toast.showToast(groupInfo.toast[0]!);
                },
              },
            ],
          });
        }
      }}
    >
      <Right type={type} />
    </Pressable>
  );
};

let count = 0;
export default function ContactListScreen({
  route,
  navigation,
}: Props): JSX.Element {
  const sf = getScaleFactor();
  const rp = route.params as any;
  const params = rp?.params as any;
  const type = params?.type as Undefinable<ContactActionType>;
  console.log('test:ContactListScreen:', params, type);
  const theme = useThemeContext();
  // const menu = useActionMenu();
  const sheet = useBottomSheet();
  const toast = useToastContext();
  const alert = useAlert();
  const { groupInfo } = useAppI18nContext();
  const { height: screenHeight } = useWindowDimensions();

  const listRef = React.useRef<EqualHeightListRef>(null);
  const enableRefresh = true;
  const enableAlphabet = true;
  const enableHeader = false;
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
                console.log('test:onAction:group_invite:');
              },
            },
          };
        case 'create_group':
          return {
            createGroup: {
              isActionEnabled: true,
              isInvited: index % 2 === 0 ? true : false,
              onAction: () => {
                console.log('test:create_group:');
              },
            },
          };
        case 'block_contact':
          return {
            block: {
              name: 'Unblock',
              onClicked: () => {
                console.log('test:block_contact:');
              },
            },
          };
        case 'group_member_modify':
          return {
            modifyGroupMember: {
              isActionEnabled: true,
              isInvited: index % 2 === 0 ? true : false,
              onAction: () => {
                console.log('test:onAction:group_member_modify:');
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
        if (type === 'contact_list') {
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
        }
      },
      onPress: (_) => {
        if (type === 'create_conversation') {
          navigation.navigate('Chat', { params: {} });
        } else if (type === 'group_member') {
          sheet.openSheet({
            sheetItems: [
              {
                title: en,
                titleColor: 'black',
                onPress: () => {
                  console.log('test:onPress:data:', data);
                },
                containerStyle: {
                  marginTop: sf(10),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: undefined,
                  minWidth: undefined,
                  backgroundColor: undefined,
                  borderRadius: undefined,
                },
                titleStyle: {
                  fontWeight: '600',
                  fontSize: sf(14),
                  lineHeight: sf(16),
                  color: 'rgba(102, 102, 102, 1)',
                  marginHorizontal: undefined,
                },
              },
              {
                title: groupInfo.memberSheet.add,
                titleColor: 'black',
                onPress: () => {
                  console.log('test:onPress:data:', data);
                  toast.showToast(groupInfo.toast[4]!);
                },
              },
              {
                title: groupInfo.memberSheet.remove,
                titleColor: 'rgba(255, 20, 204, 1)',
                onPress: () => {
                  console.log('test:onPress:data:', data);
                  alert.openAlert({
                    title: 'Remove NickName?',
                    buttons: [
                      {
                        text: 'Cancel',
                        onPress: () => {},
                      },
                      {
                        text: 'Confirm',
                        onPress: () => {
                          toast.showToast('Removed');
                        },
                      },
                    ],
                  });
                },
              },
              {
                title: groupInfo.memberSheet.chat,
                titleColor: 'black',
                onPress: () => {
                  console.log('test:onPress:data:', data);
                },
              },
            ],
          });
        } else {
          navigation.navigate({ name: 'ContactInfo', params: {} });
        }
      },
      type: type,
      action: action(type, index),
    } as ItemDataType;
  });
  data.push(...r);

  const _calculateAlphabetHeight = () => {
    const r = sf(screenHeight - 450 - 340);
    return r;
  };

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: NavigationHeaderRight,
      headerTitle: NavigationHeaderTitle(type),
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    });
  }, [navigation, type]);

  return (
    <SafeAreaView
      mode="padding"
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={['right', 'left']}
    >
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
      />
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
          alphabetContainer: {
            top: _calculateAlphabetHeight(),
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
  rightItem: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexGrow: 1,
    paddingRight: 5,
  },
  rightButton: { padding: 10, marginRight: -10 },
});
