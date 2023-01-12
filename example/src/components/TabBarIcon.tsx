import * as React from 'react';
import { Text, View } from 'react-native';
import { Badge, LocalIcon } from 'react-native-chat-uikit';

type TabBarIconProps = {
  focused?: boolean | undefined;
  color: string;
  type:
    | 'ConversationList'
    | 'Contact'
    | 'MySetting'
    | 'TopRequestList'
    | 'TopContacts'
    | 'TopGroups';
};

export default function TabBarIcon({
  focused,
  color,
  type,
}: TabBarIconProps): JSX.Element {
  console.log('test:TabBarIcon:', focused, type);
  const ConversationList = (): JSX.Element => {
    return (
      <React.Fragment>
        <LocalIcon name="tabbar_chats" color={color} size={32} />
        <Badge
          count={999}
          badgeColor="rgba(255, 20, 204, 1)"
          textColor="white"
          style={{
            position: 'absolute',
            right: -16,
            top: -6,
            borderColor: 'white',
            borderWidth: 1,
          }}
        />
      </React.Fragment>
    );
  };
  const Contact = (): JSX.Element => {
    return (
      <React.Fragment>
        <LocalIcon name="tabbar_contacts" color={color} size={32} />
        <LocalIcon
          name="contact_request_hint"
          size={14}
          style={{
            position: 'absolute',
            right: -8,
            top: -20,
            borderColor: 'white',
            borderWidth: 1,
          }}
        />
      </React.Fragment>
    );
  };
  const MySetting = (): JSX.Element => {
    return (
      <React.Fragment>
        <LocalIcon name="tabbar_setting" color={color} size={32} />
      </React.Fragment>
    );
  };
  const TopBarRequestList = (): JSX.Element => {
    return (
      <React.Fragment>
        <View style={{ width: 70 }}>
          <Text
            style={{
              top: 5,
              fontSize: 16,
              fontWeight: '600',
              color: color,
            }}
          >
            Requests
          </Text>
        </View>
        <LocalIcon
          name="contact_request_hint"
          size={16}
          style={{
            position: 'absolute',
            right: -15,
            top: -10,
            borderColor: 'white',
            borderWidth: 1,
          }}
        />
      </React.Fragment>
    );
  };
  const TopBarContacts = (): JSX.Element => {
    return (
      <React.Fragment>
        <View style={{ width: 70 }}>
          <Text
            style={{
              top: 5,
              fontSize: 16,
              fontWeight: '600',
              color: color,
            }}
          >
            Contacts
          </Text>
        </View>
      </React.Fragment>
    );
  };
  const TopBarGroups = (): JSX.Element => {
    return (
      <React.Fragment>
        <View style={{ width: 70 }}>
          <Text
            style={{
              top: 5,
              fontSize: 16,
              fontWeight: '600',
              color: color,
            }}
          >
            Groups
          </Text>
        </View>
      </React.Fragment>
    );
  };
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}
    >
      {type === 'ConversationList'
        ? ConversationList()
        : type === 'Contact'
        ? Contact()
        : type === 'TopRequestList'
        ? TopBarRequestList()
        : type === 'TopContacts'
        ? TopBarContacts()
        : type === 'TopGroups'
        ? TopBarGroups()
        : MySetting()}
    </View>
  );
}
