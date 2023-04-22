import * as React from 'react';
import type {
  ColorValue,
  ImageStyle,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { LocalIcon } from './Icon';
import type { IconName } from './Icon/LocalIcon';

export type SimulateGifProps = {
  names: IconName[];
  color?: ColorValue | undefined;
  size?: number | undefined;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  interval?: number;
};
export default function SimulateGif(props: SimulateGifProps): JSX.Element {
  // console.log('SimulateGif:', props);
  const { names, interval } = props;
  const count = names.length;
  const [name, setName] = React.useState<IconName>(names[0] as IconName);
  const index = React.useRef(0);
  React.useEffect(() => {
    const init = () => {
      // console.log('SimulateGif:init:');
      return setInterval(() => {
        // console.log('SimulateGif:setInterval:');
        setName(names[index.current % count] as IconName);
        index.current += 1;
      }, interval ?? 500);
    };
    const ret = init();
    return () => {
      clearInterval(ret);
    };
  }, [count, interval, names]);
  return <LocalIcon {...props} name={name} />;
}
