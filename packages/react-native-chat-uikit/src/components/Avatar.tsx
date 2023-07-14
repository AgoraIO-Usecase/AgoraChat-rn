import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useThemeContext } from '../contexts/ThemeContext';
import { getScaleFactor } from '../styles/createScaleFactor';
import createStyleSheet from '../styles/createStyleSheet';
import { LocalIcon, LocalIconName } from './Icon';
import { getImageComponent } from './Image';

type SubComponents = {};

const sf = getScaleFactor();

const AVATAR_SIZE = sf(56);

type AvatarStateProps = {
  stateUri: LocalIconName;
  stateSize?: number | undefined;
  stateRadius?: number | undefined;
  stateOverflow?: 'visible' | 'hidden' | 'scroll' | undefined;
};

export type AvatarProps = {
  uri: string | number;
  uriOnError?: LocalIconName | undefined;
  size?: number | undefined;
  radius?: number | undefined;
  containerStyle?: StyleProp<ViewStyle> | undefined;
  state?: AvatarStateProps | undefined;
  useFastImage?: boolean;
};

const Avatar: ((props: AvatarProps) => JSX.Element) & SubComponents = ({
  uri,
  uriOnError,
  size = AVATAR_SIZE,
  radius = AVATAR_SIZE / 2,
  containerStyle,
  state,
  useFastImage,
}): JSX.Element => {
  const { colors } = useThemeContext();
  const [loadDefault, setLoadDefault] = React.useState(false);
  const uriS = typeof uri === 'number' ? uri : { uri: uri };
  const Image = getImageComponent(useFastImage);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: colors.background,
        },
        containerStyle,
      ]}
    >
      {loadDefault ? (
        <LocalIcon name={uriOnError ?? 'default_avatar'} size={size * 1.0} />
      ) : (
        <Image
          onError={() => {
            setLoadDefault(true);
          }}
          source={uriS}
          resizeMode="cover"
          style={[StyleSheet.absoluteFill, { width: size, height: size }]}
        />
      )}
      {state && (
        <StateAvatar
          stateSize={state.stateSize ? state.stateSize : size / 2}
          stateUri={state.stateUri ? state.stateUri : 'Icon_Image'}
          stateRadius={state.stateRadius ? state.stateRadius : size / 4}
          stateOverflow={state.stateOverflow}
        />
      )}
    </View>
  );
};

const StateAvatar = ({
  stateUri,
  stateSize,
  stateRadius,
  stateOverflow,
}: AvatarStateProps) => {
  const { colors } = useThemeContext();
  return (
    <View
      style={[
        styles.state_container,
        StyleSheet.absoluteFill,
        stateOverflow ? { overflow: stateOverflow } : null,
      ]}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: colors.primary,
            opacity: 0.0,
            borderRadius: stateRadius,
          },
        ]}
      />
      <LocalIcon
        color={colors.primary}
        name={stateUri ?? 'alert_default'}
        size={stateSize}
      />
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  state_container: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
});

export default Avatar;
