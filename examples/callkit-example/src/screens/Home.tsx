import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ListRenderItemInfo, Text, View } from 'react-native';
import {
  CallEndReason,
  CallError,
  CallListener,
  CallType,
  useCallkitSdkContext,
} from 'react-native-chat-callkit';
import { Button, RadioButton } from 'react-native-chat-uikit';
import { FlatList } from 'react-native-gesture-handler';

import { useAppChatSdkContext } from '../contexts/AppImSdkContext';
import { sendEvent, sendEventProps } from '../events/sendEvent';
import type { RootParamsList } from '../routes';

let gid: string = '';
let gps: string = '';
let gt = 'agora' as 'agora' | 'easemob';

try {
  const env = require('../env');
  gid = env.id ?? '';
  gps = env.ps ?? '';
  gt = env.accountType ?? 'agora';
} catch (e) {
  console.warn('test:', e);
}

const sendHomeEvent = (
  params: Omit<sendEventProps, 'senderId' | 'timestamp' | 'eventBizType'>
) => {
  sendEvent({
    ...params,
    senderId: 'Home',
    eventBizType: 'others',
  } as sendEventProps);
};

type DataType = {
  userId: string;
  userName?: string;
  isSelected?: boolean;
  onChecked?: ((checked: boolean) => void) | undefined;
};
const FlatListRenderItem = (
  info: ListRenderItemInfo<DataType>
): React.ReactElement | null => {
  const { item } = info;
  return (
    <View
      style={{
        height: 30,
        backgroundColor: '#e6e6fa',
        marginHorizontal: 20,
        justifyContent: 'center',
        marginVertical: 1,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 18 }}>{item.userId}</Text>
        <RadioButton onChecked={item.onChecked} />
      </View>
    </View>
  );
};
type ContactListRef = {
  showSingleCall: (params: {
    callType: CallType;
    isInviter: boolean;
    inviterId?: string;
  }) => void;
  hideSingleCall: () => void;
};
type ContactListProps = {
  propsRef?: React.RefObject<ContactListRef>;
};
const ContactList = React.memo((props: ContactListProps) => {
  console.log('test:ContactList:', props);
  const { currentId } = useAppChatSdkContext();
  const { propsRef } = props;
  const { client } = useAppChatSdkContext();
  const data = React.useMemo(() => [] as DataType[], []);
  const [_data, setData] = React.useState(data);

  if (propsRef?.current) {
    propsRef.current.showSingleCall = (params: {
      callType: CallType;
      isInviter: boolean;
      inviterId?: string;
    }) => {
      console.log('test:showSingleCall:', params);
      const l = [] as string[];
      for (const i of _data) {
        if (i.isSelected === true) {
          l.push(i.userId);
        }
      }
      sendHomeEvent({
        eventType: 'VoiceStateEvent',
        action: 'show_single_call',
        params: {
          appKey: client.options?.appKey ?? '',
          isInviter: params.isInviter,
          inviterId: params.isInviter === true ? currentId : params.inviterId!,
          currentId: currentId,
          inviteeIds: params.isInviter === true ? l : [currentId],
          callType: params.callType,
        },
      });
    };
    propsRef.current.hideSingleCall = () => {
      sendHomeEvent({
        eventType: 'VoiceStateEvent',
        action: 'hide_single_call',
        params: {},
      });
    };
  }

  const init = React.useCallback(() => {
    console.log('test:ContactList:init:');
    client.contactManager
      .getAllContactsFromServer()
      .then((result) => {
        console.log('test:ContactList:init:result:', result);
        data.length = 0;
        for (const i of result) {
          data.push({
            userId: i,
            userName: i,
            onChecked: (checked: boolean) => {
              for (const j of data) {
                if (j.userId === i) {
                  j.isSelected = checked;
                }
              }
            },
          } as DataType);
        }
        setData([...data]);
      })
      .catch((error) => {
        console.log('test:', error);
      });
  }, [client.contactManager, data]);
  React.useEffect(() => {
    init();
    // initApi();
  }, [init]);
  return (
    <FlatList data={_data} extraData={_data} renderItem={FlatListRenderItem} />
  );
});

export default function HomeScreen({
  navigation,
}: NativeStackScreenProps<RootParamsList, 'Home'>): JSX.Element {
  console.log('test:HomeScreen:');
  const contactListRef = React.useRef<ContactListRef>({} as any);
  const { logout: logoutAction } = useAppChatSdkContext();
  const { call } = useCallkitSdkContext();

  const addListener = React.useCallback(() => {
    const listener = {
      onCallEnded: (params: {
        channelId: string;
        callType: CallType;
        endReason: CallEndReason;
        elapsed: number;
      }) => {
        console.log('onCallEnded:', params);
      },
      onCallReceived: (params: {
        channelId: string;
        inviterId: string;
        callType: CallType;
        extension?: any;
      }) => {
        console.log('onCallReceived:', params);
        contactListRef.current.showSingleCall({
          callType: params.callType,
          isInviter: false,
          inviterId: params.inviterId,
        });
      },
      onCallOccurError: (params: { channelId: string; error: CallError }) => {
        console.log('onCallOccurError:', params);
      },
    } as CallListener;
    call.addListener(listener);
    return () => {
      call.removeListener(listener);
    };
  }, [call]);

  React.useEffect(() => {
    const sub = addListener();
    return () => {
      sub();
    };
  }, [addListener]);

  const tools = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginVertical: 20,
          flexWrap: 'wrap',
        }}
      >
        <Button
          onPress={() => {
            logoutAction({
              onResult: ({ result, error }) => {
                if (error) {
                  console.warn('test:error:', error, result);
                  throw new Error('Failed to log out. Procedure');
                }
                navigation.navigate('Login', {
                  params: { id: gid, pass: gps, accountType: gt },
                });
              },
            });
          }}
        >
          logout
        </Button>
        <Button
          onPress={() => {
            contactListRef.current.showSingleCall({
              callType: CallType.Video1v1,
              isInviter: true,
            });
          }}
        >
          singleV
        </Button>
        <Button
          onPress={() => {
            contactListRef.current.showSingleCall({
              callType: CallType.Audio1v1,
              isInviter: true,
            });
          }}
        >
          singleA
        </Button>
        <Button>multi</Button>
        <Button>navi</Button>
        <Button
          onPress={() => {
            contactListRef.current.hideSingleCall();
          }}
        >
          close
        </Button>
      </View>
    );
  };
  const list = () => {
    return (
      <View
        style={{
          flex: 1,
          marginBottom: 100,
          // backgroundColor: 'red',
        }}
      >
        <ContactList propsRef={contactListRef} />
      </View>
    );
  };
  return (
    <View style={{ top: 44, flex: 1 }}>
      {tools()}
      {list()}
    </View>
  );
}
