import * as React from 'react';
import { Image as RNImage } from 'react-native';

import type { ImageComponent } from './index';

const ImageWrapper: ImageComponent = ({
  onLoad,
  onError,
  style,
  tintColor,
  ...props
}) => {
  return (
    <RNImage
      {...props}
      style={[style, { tintColor }]}
      onError={onError && ((e) => onError(e.nativeEvent))}
      onLoad={onLoad && ((e) => onLoad(e.nativeEvent.source))}
    />
  );
};

export default ImageWrapper;
