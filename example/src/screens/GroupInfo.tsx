import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  Avatar,
  createStyleSheet,
  getScaleFactor,
  LocalIcon,
  ScreenContainer,
  Services,
  Switch,
  useAlert,
  useBottomSheet,
  usePrompt,
  useToastContext,
} from 'react-native-chat-uikit';

import { useAppI18nContext } from '../contexts/AppI18nContext';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

const sf = getScaleFactor();

export function GroupInfoScreenInternal({ navigation }: Props): JSX.Element {
  //   console.log('test:ConversationListScreen:', route.params, navigation);
  //   return <Placeholder content={`${GroupInfoScreen.name}`} />;
  const { groupInfo } = useAppI18nContext();
  const [isMute, setIsMute] = React.useState(false);
  const alert = useAlert();
  const sheet = useBottomSheet();
  const prompt = usePrompt();
  const toast = useToastContext();
  const cbs = Services.cbs;
  const id = 'GroupId: xxx';
  const memberCount = 5;
  const groupName = 'GroupName';

  const onHeader = () => {
    sheet.openSheet({
      sheetItems: [
        {
          title: groupInfo.modify.name,
          titleColor: 'black',
          onPress: () => {
            prompt.openPrompt({
              title: groupInfo.modify.name,
              placeholder: groupInfo.modify.namePrompt.placeholder,
              submitLabel: groupInfo.modify.namePrompt.confirm,
              cancelLabel: groupInfo.modify.namePrompt.cancel,
              onSubmit: (text: string) => {
                console.log('test:onSubmit:', text);
              },
              onCancel() {
                console.log('test:onCancel:');
              },
            });
          },
        },
        {
          title: groupInfo.modify.description,
          titleColor: 'black',
          onPress: () => {
            prompt.openPrompt({
              title: groupInfo.modify.description,
              placeholder: groupInfo.modify.descriptionPrompt.placeholder,
              submitLabel: groupInfo.modify.descriptionPrompt.confirm,
              cancelLabel: groupInfo.modify.descriptionPrompt.cancel,
              onSubmit: (text: string) => {
                console.log('test:onSubmit:', text);
              },
              onCancel() {
                console.log('test:onCancel:');
              },
            });
          },
        },
        {
          title: groupInfo.modify.groupId,
          titleColor: 'black',
          onPress: () => {
            cbs.setString(groupInfo.modify.groupId);
            cbs.getString().then((text) => {
              console.log('test:openSheet:', text);
              toast.showToast(groupInfo.toast[3]!);
            });
          },
        },
      ],
    });
  };

  const onInvite = () => {
    navigation.push('ContactList', {
      params: {
        type: 'group_invite',
      },
    });
  };

  const onMembers = () => {
    navigation.push('ContactList', {
      params: {
        type: 'group_member',
      },
    });
  };

  return (
    <View style={styles.container}>
      <Pressable style={{ paddingHorizontal: sf(50) }} onPress={onHeader}>
        <View style={styles.top}>
          <Avatar uri="" size={sf(100)} radius={sf(50)} />
        </View>
        <View style={styles.top}>
          <Text style={styles.name}>{groupInfo.name(groupName)}</Text>
        </View>
        <View style={{ marginTop: sf(10) }}>
          <Text style={styles.id}>{id}</Text>
        </View>
        <View style={{ marginTop: sf(10) }}>
          <Text style={styles.description}>{groupInfo.groupDescription}</Text>
        </View>
      </Pressable>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 130,
        }}
      >
        <Pressable onPress={onInvite}>
          <View style={styles.chatButton}>
            <LocalIcon name="group_invite" size={sf(30)} />
          </View>
          <Text style={[styles.chat, { marginTop: sf(5) }]}>
            {groupInfo.invite}
          </Text>
        </Pressable>
        <View>
          <Pressable
            onPress={() => {
              navigation.navigate('Chat', {});
            }}
            style={styles.chatButton}
          >
            <LocalIcon name="tabbar_chats" size={sf(30)} />
          </Pressable>
          <Text style={[styles.chat, { marginTop: sf(5) }]}>
            {groupInfo.chat}
          </Text>
        </View>
      </View>
      <View style={{ height: sf(66) }} />
      <Pressable onPress={onMembers} style={styles.listItem}>
        <Text style={styles.listItemText1}>{groupInfo.members}</Text>
        <View
          style={{
            flexDirection: 'row',
            width: sf(20),
            justifyContent: 'space-between',
          }}
        >
          <Text style={styles.memberCount}>{memberCount}</Text>
          <View style={{ width: sf(5) }} />
          <LocalIcon name="go_small_black_mobile" size={sf(14)} />
        </View>
      </Pressable>
      <View style={styles.listItem}>
        <Text style={styles.listItemText1}>{groupInfo.mute}</Text>
        <Switch
          value={isMute}
          onChangeValue={function (val: boolean): void {
            setIsMute(val);
          }}
          size={sf(28)}
          thumbColor="white"
          inactiveThumbColor="white"
          inactiveTrackColor="rgba(216, 216, 216, 1)"
        />
      </View>
      <Pressable
        style={styles.listItem}
        onPress={() => {
          alert.openAlert({
            title: groupInfo.leaveAlert.title,
            message: groupInfo.leaveAlert.message,
            buttons: [
              {
                text: groupInfo.leaveAlert.cancelButton,
              },
              { text: groupInfo.leaveAlert.confirmButton },
            ],
          });
        }}
      >
        <Text style={styles.listItemText2}>{groupInfo.leave}</Text>
      </Pressable>
    </View>
  );
}

const styles = createStyleSheet({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: 'green',
  },
  top: { marginTop: 10 },
  name: {
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
  id: {
    fontWeight: '400',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 20,
    color: 'rgba(153, 153, 153, 1)',
  },
  description: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'center',
  },
  chat: {
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 18,
  },
  chatButton: {
    marginTop: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(228, 228, 228, 1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    // flex: 1,
    // flexGrow: 1,
    width: '90%',
    paddingVertical: 16,
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'space-between',
  },
  listItemText1: { fontSize: 15, fontWeight: '600', lineHeight: 20 },
  listItemText2: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    color: 'rgba(255, 20, 204, 1)',
  },
  memberCount: {
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
  },
});

export default function GroupInfoScreen({
  route,
  navigation,
}: Props): JSX.Element {
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <GroupInfoScreenInternal route={route} navigation={navigation} />
    </ScreenContainer>
  );
}
