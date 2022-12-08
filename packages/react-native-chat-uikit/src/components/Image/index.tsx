import type { ImageProps as RNImageProps } from 'react-native';
import { NativeModules } from 'react-native';

export interface ImageProps extends Omit<RNImageProps, 'onLoad' | 'onError'> {
  onLoad?: (event: { width: number; height: number }) => void;
  onError?: (event: { error?: unknown }) => void;
  tintColor?: string;
}

export type ImageComponent = (props: ImageProps) => JSX.Element;

function getImageComponent(): ImageComponent {
  const hasFastImage = Boolean(NativeModules.FastImageView);
  console.log('hasFastImage:', hasFastImage);
  if (hasFastImage) {
    try {
      return require('./FastImage').default;
    } catch (e) {
      console.warn(e);
      return require('./Image').default;
    }
  } else {
    return require('./Image').default;
  }
}

export default getImageComponent();
