import * as React from 'react';
import { Pressable, View } from 'react-native';

import { getScaleFactor } from '../styles/createScaleFactor';

export type RadioButtonProps = {
  size?: number;
  paddingColor?: string;
  enabledColor?: string;
  disabledColor?: string;
  borderColor?: string;
  checked?: boolean;
  onChecked?: (checked: boolean) => boolean;
  disabled?: boolean;
};

const sf = getScaleFactor();

export default function RadioButton(props: RadioButtonProps): JSX.Element {
  // console.log('test:RadioButton:');
  const {
    size,
    paddingColor,
    enabledColor,
    disabledColor,
    borderColor,
    checked,
    onChecked,
    disabled,
  } = props;
  const [_checked, setChecked] = React.useState(checked ?? false);
  // console.log('test:RadioButton:', _checked);
  const [hover, setHover] = React.useState(false);
  const delayTime = 1;
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
      enabledColor:
        disabled === true
          ? disabledColor
            ? disabledColor
            : 'grey'
          : enabledColor
          ? enabledColor
          : 'blue',
      disabledColor: disabledColor ? disabledColor : 'grey',
      borderColor: borderColor ? borderColor : 'white',
    };
  }, [paddingColor, disabled, disabledColor, enabledColor, borderColor]);

  const onCheck = () => {
    const c = !_checked;
    if (onChecked) {
      if (onChecked(c) === true) {
        setChecked(c);
      }
    } else {
      setChecked(c);
    }
  };

  return (
    <Pressable
      disabled={disabled}
      style={[
        {
          padding: cv.container.padding,
          backgroundColor: hover ? cc.paddingColor : undefined,
        },
      ]}
      onPress={onCheck}
      delayHoverIn={delayTime}
      delayHoverOut={delayTime}
      onHoverIn={() => {
        setHover(true);
      }}
      onHoverOut={() => {
        setHover(false);
      }}
      hitSlop={hitSlop}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: cv.outer.size,
          width: cv.outer.size,
          borderRadius: cv.outer.borderRadius,
          borderWidth: cv.outer.borderWidth,
          borderColor: _checked ? cc.enabledColor : cc.disabledColor,
          padding: cv.outer.padding,
          backgroundColor: cc.borderColor,
        }}
      >
        {_checked ? (
          <View
            style={{
              backgroundColor: _checked ? cc.enabledColor : undefined,
              height: cv.inner.size,
              width: cv.inner.size,
              borderRadius: cv.inner.borderRadius,
            }}
          />
        ) : undefined}
      </View>
    </Pressable>
  );
}
