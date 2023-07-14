import React from 'react';

import { hashCode } from '../utils/function';
import Avatar, { AvatarProps } from './Avatar';
import { IconName, localLocalIcon } from './Icon/LocalIcon';

const AVATAR_ASSETS = [
  'agora_avatar_1',
  'agora_avatar_2',
  'agora_avatar_3',
  'agora_avatar_4',
  'agora_avatar_5',
  'agora_avatar_6',
  'agora_avatar_7',
  'agora_avatar_8',
  'agora_avatar_9',
  'agora_avatar_10',
  'agora_avatar_11',
  'agora_avatar_12',
];

export function DefaultAvatar(
  props: Omit<AvatarProps, 'uri' | 'uriOnError'> & {
    id: string;
    avatar?: string;
  }
): JSX.Element {
  const { id, avatar, ...others } = props;
  const i = hashCode(id);
  const index = Math.abs(i) % AVATAR_ASSETS.length;
  const name = AVATAR_ASSETS[index] as IconName;
  const source = localLocalIcon(name) as number;
  return <Avatar uri={avatar ?? source} {...others} />;
}

export const DefaultAvatarMemo = React.memo(DefaultAvatar);
