import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { defaultScaleFactor as scaleFactor } from './createScaleFactor';

type NamedStyle = ViewStyle | TextStyle | ImageStyle;
type StylePreprocessor<T extends NamedStyle = NamedStyle> = {
  [key in keyof T]: (val: NonNullable<T[key]>) => typeof val;
};

const scaleFactor2 = (val: string | number) =>
  typeof val === 'string' ? val : scaleFactor(val);

const preProcessor: Partial<StylePreprocessor> = {
  fontSize: scaleFactor,
  lineHeight: scaleFactor,
  borderRadius: scaleFactor,
  minWidth: scaleFactor2,
  minHeight: scaleFactor2,
  height: scaleFactor2,
  width: scaleFactor2,
  padding: scaleFactor2,
  paddingTop: scaleFactor2,
  paddingBottom: scaleFactor2,
  paddingLeft: scaleFactor2,
  paddingRight: scaleFactor2,
  margin: scaleFactor2,
  marginTop: scaleFactor2,
  marginBottom: scaleFactor2,
  marginLeft: scaleFactor2,
  marginRight: scaleFactor2,
  left: scaleFactor2,
  right: scaleFactor2,
  top: scaleFactor2,
  bottom: scaleFactor2,
};

const preProcessorKeys = Object.keys(
  preProcessor
) as (keyof typeof preProcessor)[];
const preProcessorLength = preProcessorKeys.length;

/**
 * Create StyleSheet with customized pre-processor
 * Return a StyleSheet that pre-processed
 * @param styles
 * @returns StyleSheet
 * */
export default function createStyleSheet<
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>
>(styles: T | StyleSheet.NamedStyles<T>): T {
  Object.values(styles).forEach((style) => {
    const styleKeys = Object.keys(style) as (keyof NamedStyle)[];
    const styleLength = styleKeys.length;
    const keys =
      styleLength < preProcessorLength ? styleKeys : preProcessorKeys;
    keys.forEach((key) => {
      if (preProcessor.hasOwnProperty(key) && style.hasOwnProperty(key)) {
        const f = preProcessor[key as keyof typeof preProcessor];
        if (typeof f === typeof scaleFactor) {
          const c = f as typeof scaleFactor;
          const d = Object.getOwnPropertyDescriptor(style, key);
          if (d) {
            d.value = c(d.value as number);
            Object.defineProperty(style, key, d);
          }
        } else if (typeof f === typeof scaleFactor2) {
          const c = f as typeof scaleFactor2;
          const d = Object.getOwnPropertyDescriptor(style, key);
          if (d) {
            d.value = c(d.value as string | number);
            Object.defineProperty(style, key, d);
          }
        }
      }
    });
  });

  return StyleSheet.create<T>(styles);
}
