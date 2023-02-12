import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter, Pressable, Text, View } from 'react-native';
import {
  Avatar,
  createStyleSheet,
  getScaleFactor,
  LocalIcon,
  Switch,
  useAlert,
  useToastContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppI18nContext } from '../contexts/AppI18nContext';
import { useAppChatSdkContext } from '../contexts/AppImSdkContext';
import { useStyleSheet } from '../hooks/useStyleSheet';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

const sf = getScaleFactor();

export default function ContactInfoScreen({
  route,
  navigation,
}: Props): JSX.Element {
  //   console.log('test:ConversationListScreen:', route.params, navigation);
  //   return <Placeholder content={`${ContactInfoScreen.name}`} />;
  const rp = route.params as any;
  const params = rp?.params as { userId: string };
  const { contactInfo } = useAppI18nContext();
  const { client } = useAppChatSdkContext();
  const [isMute, setIsMute] = React.useState(false);
  const alert = useAlert();
  const toast = useToastContext();
  const userId = params.userId;
  console.log('test:ContactInfoScreen:', params);

  const removeContact = (
    userId: string,
    onResult: (result: boolean) => void
  ) => {
    client.contactManager
      .deleteContact(userId)
      .then((result) => {
        console.log('test:deleteContact:success:', result);
        onResult?.(true);
      })
      .catch((error) => {
        onResult?.(false);
        console.warn('test:deleteContact:fail:', error);
      });
  };
  const blockContact = (
    userId: string,
    onResult: (result: boolean) => void
  ) => {
    client.contactManager
      .addUserToBlockList(userId)
      .then((result) => {
        console.log('test:addUserToBlockList:success:', result);
        onResult?.(true);
      })
      .catch((error) => {
        onResult?.(false);
        console.warn('test:addUserToBlockList:fail:', error);
      });
  };

  const addListeners = React.useCallback(() => {
    console.log('test:ContactInfoScreen:addListeners:');
    const sub1 = DeviceEventEmitter.addListener(
      'manual_block_contact',
      (event) => {
        console.log('test:manual_block_contact:', event);
        toast.showToast(contactInfo.toast[0]!);
      }
    );
    const sub2 = DeviceEventEmitter.addListener(
      'manual_remove_contact',
      (event) => {
        console.log('test:manual_remove_contact:', event);
        toast.showToast(contactInfo.toast[1]!);
        navigation.goBack();
      }
    );
    return () => {
      sub1.remove();
      sub2.remove();
    };
  }, [contactInfo.toast, navigation, toast]);

  React.useEffect(() => {
    const load = () => {
      console.log('test:load:', ContactInfoScreen.name);
      const unsubscribe = addListeners();
      return {
        unsubscribe: unsubscribe,
      };
    };
    const unload = (params: { unsubscribe: () => void }) => {
      console.log('test:unload:', ContactInfoScreen.name);
      params.unsubscribe();
    };

    const res = load();
    return () => unload(res);
  }, [addListeners]);

  return (
    <SafeAreaView
      mode="padding"
      style={useStyleSheet().safe}
      edges={['right', 'left', 'bottom']}
    >
      <View style={styles.container}>
        <View style={styles.top}>
          <Avatar uri="" size={sf(100)} radius={sf(50)} />
        </View>
        <View style={styles.top}>
          <Text style={styles.name}>{contactInfo.name('NickName')}</Text>
        </View>
        <View style={{ marginTop: sf(10) }}>
          <Text style={styles.id}>{userId}</Text>
        </View>
        <Pressable
          onPress={() => {
            navigation.navigate('Chat', {});
          }}
          style={styles.chatButton}
        >
          <LocalIcon name="tabbar_chats" size={sf(30)} />
        </Pressable>
        <View style={{ marginTop: sf(10) }}>
          <Text style={styles.chat}>{contactInfo.chat}</Text>
        </View>
        <View style={{ height: sf(66) }} />
        <View style={styles.listItem}>
          <Text style={styles.listItemText1}>{contactInfo.mute}</Text>
          <Switch
            value={isMute}
            onChangeValue={function (val: boolean): void {
              console.log('test:Switch:', val);
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
              title: contactInfo.blockAlert.title,
              message: contactInfo.blockAlert.message,
              buttons: [
                {
                  text: contactInfo.blockAlert.cancelButton,
                },
                {
                  text: contactInfo.blockAlert.confirmButton,
                  onPress: () => {
                    blockContact(userId, (result) => {
                      if (result === true) {
                        // toast.showToast(contactInfo.toast[0]!); // !!! dead lock
                        DeviceEventEmitter.emit('manual_block_contact', userId);
                      }
                    });
                  },
                },
              ],
            });
          }}
        >
          <Text style={styles.listItemText1}>{contactInfo.block}</Text>
        </Pressable>
        <Pressable
          style={styles.listItem}
          onPress={() => {
            alert.openAlert({
              title: contactInfo.deleteAlert.title,
              message: contactInfo.deleteAlert.message,
              buttons: [
                {
                  text: contactInfo.deleteAlert.cancelButton,
                },
                {
                  text: contactInfo.deleteAlert.confirmButton,
                  onPress: () => {
                    removeContact(userId, (result) => {
                      if (result === true) {
                        // toast.showToast(contactInfo.toast[1]!); // !!! dead lock
                        DeviceEventEmitter.emit(
                          'manual_remove_contact',
                          userId
                        );
                      }
                    });
                  },
                },
              ],
            });
          }}
        >
          <Text style={styles.listItemText2}>{contactInfo.delete}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
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
});
