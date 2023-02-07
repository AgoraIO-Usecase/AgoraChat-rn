import type { MaterialBottomTabScreenProps } from '@react-navigation/material-bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import * as React from 'react';
import { Linking, Pressable, TouchableOpacity, View } from 'react-native';
import {
  createStyleSheet,
  Divider,
  getScaleFactor,
  LocalIcon,
  Services,
  useAlert,
  useBottomSheet,
  usePrompt,
  useThemeContext,
  useToastContext,
} from 'react-native-chat-uikit';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  MaterialBottomTabScreenProps<BottomTabScreenParamsList, 'MySetting'>,
  NativeStackScreenProps<RootScreenParamsListOnly>
>;

export default function MySettingScreen({ navigation }: Props): JSX.Element {
  const sf = getScaleFactor();
  const theme = useThemeContext();
  const toast = useToastContext();
  const alert = useAlert();
  const sheet = useBottomSheet();
  const prompt = usePrompt();
  const { settings } = useAppI18nContext();
  const cbs = Services.cbs;
  const ms = Services.ms;
  const bounces = false;
  const memberCount = 5;
  const name = 'NickName';
  const id = 'Agora ID: xx';
  const sdkVersion = 'AgoraChat v1.0.0';
  const uiVersion = 'AgoraChat v1.0.0';
  const urlName = 'agora.io';
  // console.log('test:MySettingScreen:', ms);

  const Intervallum = ({ content }: { content: string }) => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'flex-start',
          height: sf(32),
          backgroundColor: '#FAFAFA',
        }}
      >
        <Text
          style={{
            paddingLeft: sf(20),
            fontSize: sf(12),
            fontWeight: '400',
            lineHeight: sf(18),
            color: 'rgba(153, 153, 153, 1)',
          }}
        >
          {content}
        </Text>
      </View>
    );
  };

  const D = () => (
    <Divider
      color="rgba(248, 245, 250, 1)"
      height={sf(0.5)}
      marginLeft={sf(20)}
      marginRight={sf(20)}
    />
  );

  const _openUrl = React.useCallback(
    async (url: string) => {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        // Alert.alert(`Don't know how to open this URL: ${url}`);
        toast.showToast('test');
      }
    },
    [toast]
  );

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.getParent()?.setOptions({
        headerBackVisible: false,
        headerRight: undefined,
        headerTitle: () => <Text />,
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      });
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView
      mode="padding"
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={['right', 'left']}
    >
      <ScrollView bounces={bounces}>
        <Pressable
          onPress={() => {
            sheet.openSheet({
              sheetItems: [
                {
                  title: 'Change Profile Picture',
                  titleColor: 'black',
                  onPress: () => {
                    ms.openMediaLibrary({
                      selectionLimit: 1,
                      onFailed: (result) => {
                        console.warn('test:openMediaLibrary:', result);
                      },
                    })
                      .then((result) => {
                        console.log('test:openMediaLibrary:', result);
                      })
                      .catch((error) => {
                        console.warn('test:openMediaLibrary:', error);
                      });
                  },
                },
                {
                  title: 'Change NickName',
                  titleColor: 'black',
                  onPress: () => {
                    prompt.openPrompt({
                      title: 'Change NickName',
                      placeholder: 'name',
                      submitLabel: 'Confirm',
                      cancelLabel: 'Cancel',
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
                  title: 'Copy Agora ID',
                  titleColor: 'black',
                  onPress: () => {
                    cbs.setString(id);
                    toast.showToast('ID Copied');
                  },
                },
              ],
            });
          }}
          style={{ paddingVertical: sf(10), paddingTop: sf(20) }}
        >
          <LocalIcon name="default_avatar" size={sf(100)} />
        </Pressable>
        <TouchableOpacity onPress={() => {}} style={{ paddingVertical: sf(0) }}>
          <Text style={styles.name}>{name}</Text>
        </TouchableOpacity>
        <Pressable onPress={() => {}} style={{ paddingVertical: sf(5) }}>
          <Text style={styles.id}>{id}</Text>
        </Pressable>
        <View style={{ height: sf(40) }} />
        <Intervallum content={settings.privacy} />
        <Pressable
          onPress={() => {
            navigation.navigate('ContactList', {
              params: { type: 'block_contact' },
            });
          }}
          style={styles.listItem}
        >
          <Text style={styles.listItemText1}>{settings.blockedList}</Text>
          <View style={{ flexDirection: 'row', width: sf(20) }}>
            <Text style={styles.memberCount}>{memberCount}</Text>
            <View style={{ width: sf(5) }} />
            <LocalIcon
              name="go_small_black_mobile"
              size={sf(14)}
              color="#A9A9A9"
            />
          </View>
        </Pressable>
        <Intervallum content={settings.about} />
        <Pressable
          onPress={() => {
            cbs.setString('Agora v1.0.0');
            toast.showToast('SDK Version Copied');
          }}
          style={styles.listItem}
        >
          <Text style={styles.listItemText1}>{settings.sdkVersion}</Text>
          <Text style={styles.listItemText3}>{sdkVersion}</Text>
        </Pressable>
        <D />
        <Pressable
          onPress={() => {
            cbs.setString('Agora v1.0.0');
            toast.showToast('UI Version Copied');
          }}
          style={styles.listItem}
        >
          <Text style={styles.listItemText1}>{settings.uiVersion}</Text>
          <Text style={styles.listItemText3}>{uiVersion}</Text>
        </Pressable>
        <D />
        <Pressable onPress={() => {}} style={styles.listItem}>
          <Text style={styles.listItemText1}>{settings.policy}</Text>
          <LocalIcon
            name="go_small_black_mobile"
            size={sf(14)}
            color="#A9A9A9"
          />
        </Pressable>
        <D />
        <Pressable onPress={() => {}} style={styles.listItem}>
          <Text style={styles.listItemText1}>{settings.more}</Text>
          <TouchableOpacity
            onPress={() => {
              _openUrl('https://www.agora.io/en/');
            }}
          >
            <Text style={styles.listItemText4}>{urlName}</Text>
          </TouchableOpacity>
        </Pressable>
        <Intervallum content={settings.logins} />
        <Pressable onPress={() => {}} style={styles.listItem}>
          <TouchableOpacity
            onPress={() => {
              alert.openAlert({
                title: 'Sure to logout',
                buttons: [
                  {
                    text: 'Cancel',
                    onPress: () => {},
                  },
                  {
                    text: 'Confirm',
                    onPress: () => {
                      navigation.navigate('SignIn', {});
                    },
                  },
                ],
              });
            }}
          >
            <Text style={[styles.listItemText1, { color: '#114EFF' }]}>
              {settings.logout}
            </Text>
          </TouchableOpacity>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = createStyleSheet({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
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
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    height: 53,
  },
  listItemText1: { fontSize: 15, fontWeight: '600', lineHeight: 20 },
  listItemText3: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    color: 'rgba(102, 102, 102, 1)',
  },
  listItemText4: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    color: '#114EFF',
    textDecorationLine: 'underline',
  },
  memberCount: {
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
    color: '#666666',
  },
});
