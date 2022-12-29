import React from 'react';
import { View } from 'react-native';
import { Avatar, Image, timestamp } from 'react-native-chat-uikit';

// import { Avatar } from 'react-native-paper';
import { AVATAR_ASSETS } from '../assets/images';

type AvatarProps = {
  size: number;
  radius: number;
};

export function getDefaultAvatar({ size, radius }: AvatarProps): JSX.Element {
  const mod = ((timestamp('second') % 12) + 1) as keyof typeof AVATAR_ASSETS;
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={AVATAR_ASSETS[mod]()}
        resizeMode="cover"
        style={{ height: size, width: size, borderRadius: radius }}
        onLoad={(e) => {
          console.log('test:getDefaultAvatar:', e);
        }}
        onError={(e) => {
          console.log('test:getDefaultAvatar:', e);
        }}
      />
    </View>
  );
}

export function getDefaultAvatar2({ size, radius }: AvatarProps): JSX.Element {
  const mod = ((timestamp('second') % 12) + 1) as keyof typeof AVATAR_ASSETS;
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Avatar uri={AVATAR_ASSETS[mod]()} size={size} radius={radius} />
    </View>
  );
}
