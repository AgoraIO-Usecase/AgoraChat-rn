import React from 'react';
import {
  ImageStyle,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { useThemeContext } from '../contexts';
import { getScaleFactor } from '../styles/createScaleFactor';
import type { ButtonStateColor } from '../types';
import Button from './Button';
import Loading from './Loading';

type LoadingButtonProps = {
  iconStyle?: StyleProp<ImageStyle>;
  disabled?: boolean | undefined;
  style?: StyleProp<ViewStyle> | undefined;
  color?: Partial<ButtonStateColor> | undefined;
  font?: StyleProp<TextStyle> | undefined;
  content?: string | undefined;
  state: 'loading' | 'stop';
  onChangeState?: (currentState: 'loading' | 'stop') => void;
};
export default function LoadingButton({
  iconStyle,
  disabled,
  style,
  color,
  font,
  content,
  state,
  onChangeState,
}: LoadingButtonProps): JSX.Element {
  const { colors } = useThemeContext();
  const sf = getScaleFactor();
  const [height, setHeight] = React.useState(0);
  const [width, setWidth] = React.useState(0);
  let iconSize = sf(28);
  if (iconStyle && typeof (iconStyle as ImageStyle).height === 'number') {
    iconSize = (iconStyle as ImageStyle).height as number;
  }
  return (
    <View>
      <Button
        onLayout={(event) => {
          setHeight(sf(event.nativeEvent.layout.height));
          setWidth(sf(event.nativeEvent.layout.width));
        }}
        style={style}
        disabled={state === 'loading' ? true : disabled}
        onPress={() => {
          onChangeState?.(state);
        }}
        color={{
          ...color,
          disabled:
            state === 'loading'
              ? colors.button.enabled
              : colors.button.disabled,
        }}
        font={font}
        children={state === 'loading' ? '' : content}
      />
      {state === 'loading' ? (
        <Loading
          style={[
            {
              position: 'absolute',
              left: width / 2 - iconSize / 2,
              top: height / 2 - iconSize / 2,
            },
            iconStyle,
          ]}
          color="white"
          size={iconSize}
        />
      ) : null}
    </View>
  );
}
