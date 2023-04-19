import * as React from 'react';
import { Platform, View } from 'react-native';
import { createStyleSheet, ICON_ASSETS, Image } from 'react-native-chat-uikit';

type HeaderTitleProps = {
  name: 'Chats' | 'Contacts';
};

export default function HomeHeaderTitle(props: HeaderTitleProps): JSX.Element {
  console.log('test:HomeHeaderTitle:', props);
  const { name } = props;
  const _styles = (name: string) => {
    if (name === 'Chats') {
      return styles.chat;
    } else if (name === 'Contacts') {
      return styles.contact;
    }
    return null;
  };
  const resizeMode = Platform.select({
    ios: 'cover',
    android: 'center',
    default: 'cover',
  });

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={ICON_ASSETS[name]('2x')}
        resizeMode={resizeMode as any}
        style={_styles(name)}
        onLoad={(_) => {
          // console.log('test:getDefaultAvatar:', e);
        }}
        onError={(e) => {
          console.warn('test:HomeHeaderTitle:', e);
        }}
      />
    </View>
  );
}

const styles = createStyleSheet({
  chat: {
    height: 16.3,
    width: 60.65,
  },
  contact: {
    height: 15.43,
    width: 95.69,
  },
});
