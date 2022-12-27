import React from 'react';
import { View } from 'react-native';
import { Avatar, Image } from 'react-native-chat-uikit';

import { ICON_ASSETS } from '../assets/icons';

type LogoProps = {
  size: number;
  radius: number;
};

export function getLogo({ size, radius }: LogoProps): JSX.Element {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={ICON_ASSETS['login_icon'](
          size < 24 ? '' : size < 96 ? '2x' : '3x'
        )}
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

export function getLogo2({ size, radius }: LogoProps): JSX.Element {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Avatar
        uri={ICON_ASSETS['login_icon'](
          size < 24 ? '' : size < 96 ? '2x' : '3x'
        )}
        size={size}
        radius={radius}
      />
    </View>
  );
}
