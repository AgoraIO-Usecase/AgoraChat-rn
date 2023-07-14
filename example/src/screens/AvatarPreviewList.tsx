/* eslint-disable react/no-unstable-nested-components */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import * as React from 'react';
import {
  DeviceEventEmitter,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  DataEventType,
  LocalIcon,
  LocalIconName,
} from 'react-native-chat-uikit';
import { ScrollView } from 'react-native-gesture-handler';

import { useAppChatSdkContext } from '../contexts/AppImSdkContext';
import type { BizEventType, DataActionEventType } from '../events';
import { sendEvent } from '../events/sendEvent';
import type { RootScreenParamsList } from '../routes';

export const AVATAR_ASSETS = [
  'agora_avatar_1',
  'agora_avatar_2',
  'agora_avatar_3',
  'agora_avatar_4',
  'agora_avatar_5',
  'agora_avatar_6',
  'agora_avatar_7',
  'agora_avatar_8',
  'agora_avatar_9',
  'agora_avatar_10',
  'agora_avatar_11',
  'agora_avatar_12',
];

function RightButton(_props: HeaderButtonProps): JSX.Element {
  const [selected, setSelected] = React.useState<number | undefined>(undefined);
  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      'DataEvent' as DataEventType,
      (event) => {
        const { action, params } = event as {
          eventBizType: BizEventType;
          action: DataActionEventType;
          senderId: string;
          params: any;
          timestamp?: number;
        };
        switch (action) {
          case 'select_avatar_index':
            setSelected(params.index);
            break;

          default:
            break;
        }
      }
    );
    return () => {
      sub.remove();
    };
  }, []);
  return (
    <TouchableOpacity
      disabled={selected === undefined}
      onPress={() => {
        sendEvent({
          eventType: 'DataEvent',
          action: 'select_avatar_index_result',
          params: { index: selected },
          eventBizType: 'avatar',
          senderId: 'AvatarPreviewList',
        });
      }}
    >
      <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
        done
      </Text>
    </TouchableOpacity>
  );
}

type Props = NativeStackScreenProps<RootScreenParamsList, 'AvatarPreviewList'>;

export default function AvatarPreviewListScreen({
  route,
  navigation,
}: Props): JSX.Element {
  // const rp = route.params as any;
  // const params = rp?.params as any;
  // const _currentAvatar = params.avatar;
  const { width } = useWindowDimensions();
  const getSize = () => {
    return width / 2;
  };
  const getItemSize = getSize() * 0.9;
  const getSpaceSize = getSize() * 0.1;
  const [selected, setSelected] = React.useState<number | undefined>(undefined);
  const { client } = useAppChatSdkContext();

  const onSelected = (index: number) => {
    setSelected(index);
    sendEvent({
      eventType: 'DataEvent',
      action: 'select_avatar_index',
      params: { index: index },
      eventBizType: 'avatar',
      senderId: 'AvatarPreviewList',
    });
  };

  const onDone = React.useCallback(
    (index: number | undefined) => {
      route.params.params?.onResult(index ?? 0);
      navigation.goBack();
    },
    [navigation, route.params.params]
  );

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.setOptions({
        headerBackVisible: true,
        headerRight: (props) => <RightButton {...props} />,
        headerTitle: () => (
          <Text
            style={{ color: 'white', fontSize: 16, fontWeight: '600' }}
            children={'Profile Picture'}
          />
        ),
        headerShadowVisible: true,
        headerBackTitleVisible: true,
        headerBackground: () => (
          <View style={{ backgroundColor: 'black', flex: 1 }} />
        ),
        headerTintColor: 'white',
      });
    });
    return unsubscribe;
  }, [navigation, route.params.params, selected]);

  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      'DataEvent' as DataEventType,
      (event) => {
        const { action, params } = event as {
          eventBizType: BizEventType;
          action: DataActionEventType;
          senderId: string;
          params: any;
          timestamp?: number;
        };
        switch (action) {
          case 'select_avatar_index_result':
            onDone(params.index);
            break;

          default:
            break;
        }
      }
    );
    return () => {
      sub.remove();
    };
  }, [onDone]);

  React.useEffect(() => {
    client.userManager
      .fetchOwnInfo()
      .then((result) => {
        if (result) {
          const avatar = result.avatarUrl;
          try {
            if (avatar) {
              const index = Number.parseInt(avatar, 10);
              if (index >= 0 && index < 12) {
                setSelected(index);
              }
            }
          } catch (error) {}
        }
      })
      .catch((error) => {
        console.warn('fetchOwnInfo:error:', error);
      });
  }, [client.userManager]);
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: 'black',
      }}
    >
      <View
        style={{
          flex: 1,
          marginVertical: getSpaceSize,
          backgroundColor: 'black',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignContent: 'space-between',
          justifyContent: 'space-evenly',
          height: (AVATAR_ASSETS.length / 2) * getSize() * 0.95,
        }}
      >
        {AVATAR_ASSETS.map((_, index) => {
          return (
            <View
              style={{
                width: getItemSize,
                height: getItemSize,
                // backgroundColor: 'yellow',
                borderRadius: 8,
                overflow: 'hidden',
              }}
              onTouchEnd={() => {
                onSelected(index);
              }}
            >
              <LocalIcon
                name={AVATAR_ASSETS[index] as LocalIconName}
                size={getItemSize}
              />
              {selected === index ? (
                <LocalIcon
                  containerStyle={{
                    position: 'absolute',
                  }}
                  name={'avatar_selected'}
                  size={getItemSize}
                />
              ) : null}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
