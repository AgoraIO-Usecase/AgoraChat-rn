import React from 'react';
import { View } from 'react-native';
import { Image } from 'react-native-chat-uikit';

import { ICON_ASSETS } from '../assets/icons';

export function getLogo({
  size,
  radius,
}: {
  size: number;
  radius: number;
}): JSX.Element {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={ICON_ASSETS['logo']()}
        resizeMode="cover"
        style={{ height: size, width: size, borderRadius: radius }}
        onLoad={(e) => {
          console.log(e);
        }}
        onError={(e) => {
          console.log(e);
        }}
      />
    </View>
  );
}
