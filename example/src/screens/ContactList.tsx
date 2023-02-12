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
  DeviceEventEmitter,
  Pressable,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import type { ChatContactEventListener } from 'react-native-chat-sdk';
import {
  autoFocus,
  Blank,
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

// import { COUNTRY } from '../__dev__/const';
import { DefaultAvatar } from '../components/DefaultAvatars';
import { ListItemSeparator } from '../components/ListItemSeparator';
import { ListSearchHeader } from '../components/ListSearchHeader';
import { useAppI18nContext } from '../contexts/AppI18nContext';
import { useAppChatSdkContext } from '../contexts/AppImSdkContext';
import { useStyleSheet } from '../hooks/useStyleSheet';
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

type ItemActionRadioDataType = {
  isActionEnabled: boolean;
  isInvited: boolean;
  onAction?: () => void;
};
type ItemActionBoolDataType = {
  name: string;
  onClicked?: () => void;
};
type ItemActionGroupInviteDataType = { groupInvite?: ItemActionRadioDataType };
type ItemActionCreateGroupDataType = { createGroup?: ItemActionRadioDataType };
type ItemActionModifyGroupMemberDataType = {
  modifyGroupMember?: ItemActionRadioDataType;
};
type ItemActionBlockDataType = { block?: ItemActionBoolDataType };
type ItemActionDataType =
  | ItemActionGroupInviteDataType
  | ItemActionCreateGroupDataType
  | ItemActionModifyGroupMemberDataType
  | ItemActionBlockDataType;
type ItemDataType = EqualHeightListItemData & {
  contactID: string;
  contactName: string;
  actionType?: Undefinable<ContactActionType>;
  action?: ItemActionDataType;
};

const Item: EqualHeightListItemComponent = (props) => {
  const sf = getScaleFactor();
  const item = props.data as ItemDataType;
  const toast = useToastContext();
  const alert = useAlert();

  const Right = (type: ContactActionType | undefined) => {
    switch (type) {
      case 'group_invite':
        return (
          <View style={styles.rightItem}>
            <CheckButton
              checked={
                (item.action as ItemActionGroupInviteDataType)?.groupInvite
                  ?.isInvited
              }
              onChecked={
                (item.action as ItemActionGroupInviteDataType)?.groupInvite
                  ?.onAction
              }
            />
          </View>
        );
      case 'create_group':
        return (
          <View style={styles.rightItem}>
            <CheckButton
              checked={
                (item.action as ItemActionCreateGroupDataType)?.createGroup
                  ?.isInvited
              }
              onChecked={
                (item.action as ItemActionCreateGroupDataType)?.createGroup
                  ?.onAction
              }
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
              {(item.action as ItemActionBlockDataType)?.block?.name}
            </Button>
          </View>
        );
      case 'group_member_modify':
        return (
          <View style={styles.rightItem}>
            <CheckButton
              checked={
                (item.action as ItemActionModifyGroupMemberDataType)
                  ?.modifyGroupMember?.isInvited
              }
              onChecked={
                (item.action as ItemActionModifyGroupMemberDataType)
                  ?.modifyGroupMember?.onAction
              }
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.item}>
      <DefaultAvatar size={sf(50)} radius={sf(25)} />
      <View style={styles.itemText}>
        <Text style={{ lineHeight: 20, fontSize: 16, fontWeight: '600' }}>
          {item.contactID}
        </Text>
        {/* <Text>{item.contactName}</Text> */}
      </View>
      {Right(item.actionType)}
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

export default function ContactListScreen({
  route,
  navigation,
}: Props): JSX.Element {
  const sf = getScaleFactor();
  const rp = route.params as any;
  const params = rp?.params as any;
  const type = params?.type as Undefinable<ContactActionType>;
  console.log('test:ContactListScreen:', params, type, route);
  const theme = useThemeContext();
  // const menu = useActionMenu();
  const sheet = useBottomSheet();
  const toast = useToastContext();
  const alert = useAlert();
  const { groupInfo, contactList } = useAppI18nContext();
  const { height: screenHeight } = useWindowDimensions();

  const listRef = React.useRef<EqualHeightListRef>(null);
  const enableRefresh = type === 'contact_list' ? true : false;
  const enableAlphabet = type === 'contact_list' ? true : false;
  const enableHeader = false;
  // const autoFocus = false;
  const data: ItemDataType[] = React.useMemo(() => [], []); // for search
  // let managedData = React.useRef<ItemDataType[]>(null);
  const [isEmpty, setIsEmpty] = React.useState(true);
  const { client } = useAppChatSdkContext();

  const manualRefresh = React.useCallback(
    (params: { type: 'init' | 'add' | 'search'; items: ItemDataType[] }) => {
      if (params.type === 'init') {
        data.length = 0;
        listRef.current?.manualRefresh([
          {
            type: 'clear',
          },
          {
            type: 'add',
            data: params.items as EqualHeightListItemData[],
            enableSort: true,
            sortDirection: 'asc',
          },
        ]);
        data.push(...params.items);
      } else if (params.type === 'search') {
        listRef.current?.manualRefresh([
          {
            type: 'clear',
          },
          {
            type: 'add',
            data: params.items as EqualHeightListItemData[],
            enableSort: true,
            sortDirection: 'asc',
          },
        ]);
      } else if (params.type === 'add') {
        listRef.current?.manualRefresh([
          {
            type: 'add',
            data: params.items as EqualHeightListItemData[],
            enableSort: true,
            sortDirection: 'asc',
          },
        ]);
        data.push(...params.items);
      } else {
        console.warn('test:');
        return;
      }
    },
    [data]
  );

  const standardizedData = React.useCallback(
    (item: Omit<ItemDataType, 'onLongPress' | 'onPress'>): ItemDataType => {
      const createAction = (
        action: Undefinable<ItemActionDataType>,
        actionType: Undefinable<ContactActionType>
      ) => {
        switch (actionType) {
          case 'group_invite': {
            const a = action as ItemActionGroupInviteDataType | undefined;
            return {
              groupInvite: {
                isActionEnabled: a?.groupInvite?.isActionEnabled,
                isInvited: a?.groupInvite?.isInvited,
                onAction: () => {
                  console.log('test:onAction:group_invite:');
                },
              },
            };
          }

          case 'create_group': {
            const a = action as ItemActionCreateGroupDataType;
            return {
              createGroup: {
                isActionEnabled: a?.createGroup?.isActionEnabled,
                isInvited: a?.createGroup?.isInvited,
                onAction: () => {
                  console.log('test:create_group:');
                },
              },
            };
          }

          case 'block_contact': {
            const a = action as ItemActionBlockDataType;
            return {
              block: {
                name: a?.block?.name,
                onClicked: () => {
                  console.log('test:block_contact:');
                },
              },
            };
          }

          case 'group_member_modify': {
            const a = action as ItemActionModifyGroupMemberDataType;
            return {
              modifyGroupMember: {
                isActionEnabled: a?.modifyGroupMember?.isActionEnabled,
                isInvited: a?.modifyGroupMember?.isInvited,
                onAction: () => {
                  console.log('test:onAction:group_member_modify:');
                },
              },
            };
          }

          default:
            return undefined;
        }
      };

      const { actionType, action, contactID } = item;
      return {
        ...item,
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
        onPress: (data) => {
          if (type === 'create_conversation') {
            navigation.navigate('Chat', { params: {} });
          } else if (type === 'group_member') {
            sheet.openSheet({
              sheetItems: [
                {
                  title: contactID,
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
            navigation.navigate({
              name: 'ContactInfo',
              params: { params: { userId: item.contactID } },
            });
          }
        },
        action: createAction(action, actionType),
      };
    },
    [
      alert,
      groupInfo.memberSheet.add,
      groupInfo.memberSheet.chat,
      groupInfo.memberSheet.remove,
      groupInfo.toast,
      navigation,
      sf,
      sheet,
      theme.colors.primary,
      toast,
      type,
    ]
  );

  const initData = React.useCallback(
    (list: ItemDataType[]) => {
      const r = list.map((item) => {
        return standardizedData({
          ...item,
          height: 80,
        });
      });
      manualRefresh({
        type: 'init',
        items: r,
      });
    },
    [manualRefresh, standardizedData]
  );

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

  const initList = React.useCallback(
    (type: Undefinable<ContactActionType>) => {
      if (type === 'contact_list') {
        client.contactManager
          .getAllContactsFromServer()
          .then((result) => {
            console.log('test:ContactListScreen:success:', result);
            setIsEmpty(result.length === 0);
            initData(
              result.map((id) => {
                return {
                  key: id,
                  contactID: id,
                  contactName: id,
                  actionType: 'contact_list',
                  action: undefined,
                } as ItemDataType;
              })
            ); // for test
          })
          .catch((error) => {
            console.warn('test:error:', error);
          });
      }
    },
    [client, initData]
  );

  const addListeners = React.useCallback(
    (_: Undefinable<ContactActionType>) => {
      const sub1 = DeviceEventEmitter.addListener(
        'manual_add_contact',
        (event) => {
          console.log('test:manual_add_contact:', event);
          const id = event;
          if (type === 'contact_list') {
            manualRefresh({
              type: 'add',
              items: [
                standardizedData({
                  key: id,
                  contactID: id,
                  contactName: id,
                  actionType: 'contact_list',
                  action: undefined,
                }),
              ],
            });
          }
        }
      );
      const sub2 = DeviceEventEmitter.addListener(
        'manual_remove_contact',
        (event) => {
          console.log('test:manual_remove_contact:', event);
        }
      );
      const contactEventListener: ChatContactEventListener = {
        onContactAdded: (userName: string) => {
          console.log('test:onContactAdded:', userName);
          toast.showToast(contactList.toast[0]!);
          if (type === 'contact_list') {
            manualRefresh({
              type: 'add',
              items: [
                standardizedData({
                  key: userName,
                  contactID: userName,
                  contactName: userName,
                  actionType: 'contact_list',
                  action: undefined,
                }),
              ],
            });
          }
        },

        onContactDeleted: (userName: string): void => {
          console.log('test:onContactDeleted:', userName);
          toast.showToast(contactList.toast[1]!);
        },

        onFriendRequestAccepted: (userName: string): void => {
          console.log('test:onFriendRequestAccepted:', userName);
          toast.showToast(contactList.toast[2]!);
        },

        onFriendRequestDeclined: (userName: string): void => {
          console.log('test:onFriendRequestDeclined:', userName);
          toast.showToast(contactList.toast[3]!);
        },
      };
      client.contactManager.addContactListener(contactEventListener);
      return () => {
        client.contactManager.removeContactListener(contactEventListener);
        sub1.remove();
        sub2.remove();
      };
    },
    [
      client.contactManager,
      contactList.toast,
      manualRefresh,
      standardizedData,
      toast,
      type,
    ]
  );

  React.useEffect(() => {
    const load = () => {
      console.log('test:load:', ContactListScreen.name);
      const unsubscribe = addListeners(type);
      initList(type);
      return {
        unsubscribe: unsubscribe,
      };
    };
    const unload = (params: { unsubscribe: () => void }) => {
      console.log('test:unload:', ContactListScreen.name);
      params.unsubscribe();
    };

    const res = load();
    return () => unload(res);
  }, [addListeners, initList, type]);

  // const onItems = (items: React.RefObject<EqualHeightListItemData[]>) => {
  //   console.log('test:onItems:', items.current);
  //   // managedData = items as React.RefObject<ItemDataType[]>;
  //   // const r = managedData as React.MutableRefObject<ItemDataType[]>;
  //   // r.current = items.current as ItemDataType[];
  // };

  return (
    <SafeAreaView
      mode="padding"
      style={useStyleSheet().safe}
      edges={['right', 'left']}
      onLayout={(_) => {
        // console.log('test:222:', event.nativeEvent.layout);
      }}
    >
      <ListSearchHeader
        autoFocus={autoFocus()}
        onChangeText={(text) => {
          queueTask(() => {
            const r: ItemDataType[] = [];
            for (const item of data) {
              if (item.key.includes(text)) {
                r.push(item);
              }
            }
            manualRefresh({
              type: 'search',
              items: r,
            });
          });
        }}
      />
      {isEmpty === true ? (
        <Blank />
      ) : (
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
          onRefresh={(refreshType) => {
            console.log('test:onRefresh:', refreshType);
            if (refreshType === 'started') {
              initList(type);
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
  rightItem: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexGrow: 1,
    paddingRight: 5,
  },
  rightButton: { padding: 10, marginRight: -10 },
});
