import type { ImageProps as RNImageProps } from 'react-native';
import { NativeModules } from 'react-native';

export type ImageProps = Omit<RNImageProps, 'onLoad' | 'onError'> & {
  onLoad?: (event: { width: number; height: number }) => void;
  onError?: (event: { error?: unknown }) => void;
  tintColor?: string;
};

export type ImageComponent = (props: ImageProps) => JSX.Element;

export function getImageComponent(
  useFastImage: boolean = true
): ImageComponent {
  const hasFastImage = Boolean(NativeModules.FastImageView);
  if (hasFastImage && useFastImage === true) {
    try {
      return require('./FastImage').default;
    } catch (e) {
      console.warn('getImageComponent:', e);
      return require('./Image').default;
    }
  } else {
    return require('./Image').default;
  }
}

export default getImageComponent();
