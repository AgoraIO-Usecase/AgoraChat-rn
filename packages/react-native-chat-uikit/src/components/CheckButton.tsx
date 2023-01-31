import * as React from 'react';
import { Pressable } from 'react-native';

import { getScaleFactor } from '../styles/createScaleFactor';
import { LocalIcon } from './Icon';

export type RadioButtonProps = {
  size?: number;
  paddingColor?: string;
  enabledColor?: string;
  disabledColor?: string;
  borderColor?: string;
  checked?: boolean;
  onChecked?: (checked: boolean) => void;
};

const sf = getScaleFactor();

export default function CheckButton(props: RadioButtonProps): JSX.Element {
  // console.log('test:CheckButton:');
  const {
    size,
    paddingColor,
    enabledColor,
    disabledColor,
    borderColor,
    checked,
    onChecked,
  } = props;
  const [_checked, setChecked] = React.useState(checked ?? false);
  // console.log('test:CheckButton:', _checked);
  const [hover, setHover] = React.useState(false);
  const _delayTime = 1;
  const hitSlop = 1;

  const cv = React.useMemo(() => {
    return {
      container: {
        padding: size ? sf((6 / 20) * size) : sf(6),
      },
      outer: {
        size: size ? sf(size) : sf(20),
        borderRadius: size ? sf(size / 2) : sf(10),
        borderWidth: size ? sf(size / 10) : sf(2),
        padding: size ? sf((6 / 20) * size) : sf(6),
      },
      inner: {
        size: size ? sf((12 / 20) * size) : sf(12),
        borderRadius: size ? sf((6 / 20) * size) : sf(6),
      },
    };
  }, [size]);

  const cc = React.useMemo(() => {
    return {
      paddingColor: paddingColor ? paddingColor : 'rgba(5, 95, 255, 0.1)',
      enabledColor: enabledColor ? enabledColor : 'blue',
      disabledColor: disabledColor ? disabledColor : 'grey',
      borderColor: borderColor ? borderColor : 'white',
    };
  }, [paddingColor, enabledColor, disabledColor, borderColor]);

  const _onCheck = () => {
    const c = !_checked;
    setChecked(c);
    onChecked?.(c);
  };

  return (
    <Pressable
      style={[
        {
          padding: cv.container.padding,
          backgroundColor: hover ? cc.paddingColor : undefined,
        },
      ]}
      onPress={_onCheck}
      delayHoverIn={_delayTime}
      delayHoverOut={_delayTime}
      onHoverIn={() => {
        setHover(true);
      }}
      onHoverOut={() => {
        setHover(false);
      }}
      hitSlop={hitSlop}
    >
      <LocalIcon
        name={_checked ? 'check_enabled' : 'check_disabled'}
        size={sf(cv.outer.size)}
      />
    </Pressable>
  );
}
