import * as React from 'react';
import { Image } from 'react-native';

import type { ImageComponent } from './index';

const ImageWrapper: ImageComponent = ({
  onLoad,
  onError,
  style,
  tintColor,
  ...props
}) => {
  return (
    <Image
      {...props}
      style={[style, { tintColor }]}
      onError={onError && ((e) => onError(e.nativeEvent))}
      onLoad={onLoad && ((e) => onLoad(e.nativeEvent.source))}
    />
  );
};

export default ImageWrapper;
