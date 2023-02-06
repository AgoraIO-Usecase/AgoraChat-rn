import * as React from 'react';
import { View } from 'react-native';
import { getScaleFactor, ICON_ASSETS, Image } from 'react-native-chat-uikit';

type HeaderTitleProps = {
  name: string;
};

export default function HeaderTitle(_: HeaderTitleProps): JSX.Element {
  const sf = getScaleFactor();
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={ICON_ASSETS['Chats']('2x')}
        resizeMode="cover"
        style={{ height: sf(16.3), width: sf(60.65) }}
        onLoad={(_) => {
          // console.log('test:getDefaultAvatar:', e);
        }}
        onError={(e) => {
          console.warn('test:HeaderTitle:', e);
        }}
      />
    </View>
  );
}
