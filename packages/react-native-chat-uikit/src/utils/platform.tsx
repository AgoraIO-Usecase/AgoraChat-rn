import { Platform } from 'react-native';

export function autoFocus(): boolean {
  return Platform.select({
    ios: false,
    android: false,
    default: false,
  });
}
