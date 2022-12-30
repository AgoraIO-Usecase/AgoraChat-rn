import * as React from 'react';
import { View } from 'react-native';
import { Badge, LocalIcon } from 'react-native-chat-uikit';

type TabBarIconProps = {
  focused?: boolean | undefined;
  color: string;
  type: 'ConversationList' | 'Contact' | 'MySetting';
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
        : MySetting()}
    </View>
  );
}
