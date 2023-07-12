/* eslint-disable react/no-unstable-nested-components */
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter } from 'react-native';
import {
  ChatMessage,
  ChatMessageChatType,
  ChatMessageStatus,
} from 'react-native-chat-sdk';
import {
  ContactChatSdkEvent,
  ContactChatSdkEventType,
  DataEventType,
  MessageChatSdkEvent,
  MessageChatSdkEventType,
} from 'react-native-chat-uikit';
import { MD3LightTheme, MD3Theme } from 'react-native-paper';

import TabBarIcon from '../components/TabBarIcon';
import { useAppChatSdkContext } from '../contexts/AppImSdkContext';
import type { BizEventType, DataActionEventType } from '../events';
import { sendEvent, type sendEventProps } from '../events/sendEvent';
import type { RootParamsList } from '../routes';
import ContactScreen from './Contact';
import ConversationList from './ConversationList';
import MySetting from './MySetting';

const sendEventFromHome = (
  params: Omit<sendEventProps, 'senderId' | 'timestamp' | 'eventBizType'>
) => {
  sendEvent({
    ...params,
    senderId: 'Home',
    eventBizType: 'message',
  } as sendEventProps);
};

const Home = createMaterialBottomTabNavigator<RootParamsList>();

type HomeScreenInternalProps = {
  contactFlag: React.RefObject<boolean>;
};

const HomeScreenInternal = React.memo((props: HomeScreenInternalProps) => {
  console.log('test:HomeScreenInternal:', props);
  const { contactFlag } = props;
  const { client, currentId } = useAppChatSdkContext();
  const theme = {
    ...MD3LightTheme,
    colors: { ...MD3LightTheme.colors, secondaryContainer: 'white' }, // for test
  } as MD3Theme;

  const [convBarState, setConvBarState] = React.useState<
    number | boolean | undefined
  >(undefined);
  const [contactBarState, setContactBarState] = React.useState<
    number | boolean | undefined
  >(contactFlag.current ?? undefined);
  const [settingBarState] = React.useState<number | boolean | undefined>(
    undefined
  );

  const addListeners = React.useCallback(() => {
    const sub = DeviceEventEmitter.addListener(MessageChatSdkEvent, (event) => {
      const eventType = event.type as MessageChatSdkEventType;
      const eventParams = event.params as { messages: ChatMessage[] };
      switch (eventType) {
        case 'onMessagesRecalled': {
          const messages = eventParams.messages;
          for (const msg of messages) {
            const content =
              msg.from === currentId
                ? `You have recall a message`
                : `${msg.from} has recall a message`;
            const tip = { ...msg } as ChatMessage;
            tip.attributes = {
              type: 'recall',
              recall_from: msg.from,
              recall_content: content,
            };
            tip.status = ChatMessageStatus.SUCCESS;
            client.chatManager
              .insertMessage(tip)
              .then(() => {
                sendEventFromHome({
                  eventType: 'DataEvent',
                  action: 'on_recall_message',
                  params: { tip },
                });
              })
              .catch((e) => {
                console.log('test:insertMessage:', e);
              });
          }

          break;
        }
        default:
          break;
      }
    });
    const sub2 = DeviceEventEmitter.addListener(
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
          case 'update_all_count':
            {
              const eventParams = params as {
                count: number;
              };
              setConvBarState(eventParams.count);
            }
            break;
          case 'update_request_notification_flag':
            {
              const eventParams = params as {
                unread: boolean;
              };
              setContactBarState(eventParams.unread);
            }
            break;

          default:
            break;
        }
      }
    );
    return () => {
      sub.remove();
      sub2.remove();
    };
  }, [client.chatManager, currentId]);

  React.useEffect(() => {
    console.log('test:useEffect:', addListeners);
    const load = () => {
      console.log('test:load:', HomeScreen.name);
      const unsubscribe = addListeners();
      return {
        unsubscribe: unsubscribe,
      };
    };
    const unload = (params: { unsubscribe: () => void }) => {
      console.log('test:unload:', HomeScreen.name);
      params.unsubscribe();
    };

    const res = load();
    return () => unload(res);
  }, [addListeners]);

  const shifting = true;
  return (
    <Home.Navigator
      initialRouteName="ConversationList"
      shifting={shifting}
      labeled={false}
      activeColor="blue"
      inactiveColor="black"
      barStyle={{ backgroundColor: 'white' }}
      theme={theme}
    >
      <Home.Screen
        name="ConversationList"
        options={() => {
          return {
            tabBarIcon: ({ focused, color }) => {
              return (
                <TabBarIcon
                  focused={focused}
                  color={color}
                  type="ConversationList"
                  state={convBarState}
                />
              );
            },
          };
        }}
        component={ConversationList}
      />
      <Home.Screen
        name="Contact"
        options={{
          tabBarIcon: ({ focused, color }) => {
            return (
              <TabBarIcon
                focused={focused}
                color={color}
                type="Contact"
                state={contactBarState}
              />
            );
          },
        }}
        component={ContactScreen}
      />
      <Home.Screen
        name="MySetting"
        options={{
          tabBarIcon: ({ focused, color }) => {
            return (
              <TabBarIcon
                focused={focused}
                color={color}
                type="MySetting"
                state={settingBarState}
              />
            );
          },
        }}
        component={MySetting}
      />
    </Home.Navigator>
  );
});

export default function HomeScreen(
  _: NativeStackScreenProps<RootParamsList, 'Home'>
): JSX.Element {
  console.log('test:HomeScreen:');
  const { client, getCurrentId, getAllUnreadCount } = useAppChatSdkContext();
  const contactFlag = React.useRef(false);

  const saveRequest = React.useCallback(
    (params: { from: string; convId: string }) => {
      const msg = ChatMessage.createCustomMessage(
        params.convId,
        'ContactInvitation',
        ChatMessageChatType.PeerChat,
        {
          params: {
            from: params.from,
            type: 'ContactInvitation',
          },
        }
      );
      client.chatManager
        .insertMessage(msg)
        .then((result) => {
          console.log('test:insertMessage:success:', result);
          sendEventFromHome({
            eventType: 'DataEvent',
            action: 'exec_forward_notify_message',
            params: { msg },
          });
        })
        .catch((error) => {
          console.warn('test:insertMessage:fail:', error);
        });
    },
    [client.chatManager]
  );

  const addListeners = React.useCallback(() => {
    const sub = DeviceEventEmitter.addListener(
      ContactChatSdkEvent,
      async (event) => {
        const eventType = event.type as ContactChatSdkEventType;
        const eventParams = event.params as { id: string; error: string };
        switch (eventType) {
          case 'onContactInvited':
            contactFlag.current = true;
            sendEventFromHome({
              eventType: 'DataEvent',
              action: 'update_request_notification_flag',
              params: { unread: true },
            });
            saveRequest({ from: eventParams.id, convId: getCurrentId() });
            break;
          default:
            break;
        }
      }
    );
    return () => {
      sub.remove();
    };
  }, [getCurrentId, saveRequest]);

  const init = React.useCallback(() => {
    console.log('test:HomeScreen:init:');
  }, []);

  const unInit = React.useCallback(() => {
    console.log('test:HomeScreen:unInit:');
  }, []);

  const initContactFlag = React.useCallback(async () => {
    const currentId = getCurrentId();
    if (currentId === undefined || currentId.length === 0) {
      return;
    }
    getAllUnreadCount({
      currentId: currentId,
      onResult: ({ unread, error }) => {
        if (error) {
          console.warn('test:error:', error);
        }
        contactFlag.current = unread;
        sendEventFromHome({
          eventType: 'DataEvent',
          action: 'update_request_notification_flag',
          params: { unread: unread },
        });
      },
    });
  }, [getAllUnreadCount, getCurrentId]);

  React.useEffect(() => {
    console.log('test:useEffect:', addListeners, init);
    const load = () => {
      console.log('test:load:', HomeScreen.name);
      const unsubscribe = addListeners();
      init();
      initContactFlag();
      return () => {
        unsubscribe();
        unInit();
      };
    };
    const unload = (destroy: () => void) => {
      console.log('test:unload:', HomeScreen.name);
      destroy();
    };

    const destroy = load();
    return () => unload(destroy);
  }, [addListeners, init, initContactFlag, unInit]);

  return <HomeScreenInternal contactFlag={contactFlag} />;
}
