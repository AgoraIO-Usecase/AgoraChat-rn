import React from 'react';
import { View } from 'react-native';
import { Avatar } from 'react-native-chat-uikit';

import { ICON_ASSETS } from '../assets/icons';

type Name = keyof typeof ICON_ASSETS;

type LogoProps = {
  name: Name;
  size: number;
  radius: number;
};

export function getAppIcon({ name, size, radius }: LogoProps): JSX.Element {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Avatar
        uri={ICON_ASSETS[name](size < 24 ? '' : size < 96 ? '2x' : '3x')}
        size={size}
        radius={radius}
      />
    </View>
  );
}
