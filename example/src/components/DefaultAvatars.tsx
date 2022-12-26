import React from 'react';
import { View } from 'react-native';
import { Image, timestamp } from 'react-native-chat-uikit';

import { AVATAR_ASSETS } from '../assets/images';

export function getDefaultAvatar({
  size,
  radius,
}: {
  size: number;
  radius: number;
}): JSX.Element {
  const mod = ((timestamp('second') % 12) + 1) as keyof typeof AVATAR_ASSETS;
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={AVATAR_ASSETS[mod]()}
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
