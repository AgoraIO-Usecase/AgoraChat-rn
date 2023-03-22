import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import Image from './Image';
import { IconName, LocalIcon } from './LocalIcon';

type SubComponents = {};

const AVATAR_SIZE = 56;

type AvatarProps = {
  uri: string;
  uriOnError?: IconName | undefined;
  size?: number | undefined;
  radius?: number | undefined;
  containerStyle?: StyleProp<ViewStyle> | undefined;
};

export const Avatar: ((props: AvatarProps) => JSX.Element) & SubComponents = ({
  uri,
  uriOnError,
  size = AVATAR_SIZE,
  radius = AVATAR_SIZE / 2,
  containerStyle,
}): JSX.Element => {
  const [loadDefault, setLoadDefault] = React.useState(false);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: 'white',
        },
        containerStyle,
      ]}
    >
      {loadDefault ? (
        <LocalIcon name={uriOnError ?? 'default_avatar'} size={size * 1.0} />
      ) : (
        <Image
          onError={() => setLoadDefault(true)}
          source={{ uri }}
          resizeMode="cover"
          style={[StyleSheet.absoluteFill, { width: size, height: size }]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
