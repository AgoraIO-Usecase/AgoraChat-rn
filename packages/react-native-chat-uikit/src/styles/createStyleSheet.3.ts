import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import {
  defaultScaleFactor as scaleFactor,
  defaultScaleFactorS as scaleFactorS,
} from './createScaleFactor';

type NamedStyle = ViewStyle | TextStyle | ImageStyle;
type StylePreprocessor<T extends NamedStyle = NamedStyle> = {
  [key in keyof T]: (val: NonNullable<T[key]>) => typeof val;
};

const preProcessor: Partial<StylePreprocessor> = {
  fontSize: scaleFactor,
  lineHeight: scaleFactor,
  borderRadius: scaleFactor,
  minWidth: scaleFactorS,
  minHeight: scaleFactorS,
  height: scaleFactorS,
  width: scaleFactorS,
  padding: scaleFactorS,
  paddingTop: scaleFactorS,
  paddingBottom: scaleFactorS,
  paddingLeft: scaleFactorS,
  paddingRight: scaleFactorS,
  margin: scaleFactorS,
  marginTop: scaleFactorS,
  marginBottom: scaleFactorS,
  marginLeft: scaleFactorS,
  marginRight: scaleFactorS,
  left: scaleFactorS,
  right: scaleFactorS,
  top: scaleFactorS,
  bottom: scaleFactorS,
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
        } else if (typeof f === typeof scaleFactorS) {
          const c = f as typeof scaleFactorS;
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

type Return<T> = T | StyleSheet.NamedStyles<T>;
type F<T, P> = (p: P) => Return<T>;

export function createStyleSheetP<
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>,
  P
>(f: F<T, P>, p: P): T {
  // console.log('test:', f, typeof f);
  // console.log('test:f:', f(p));
  let styles: StyleSheet.NamedStyles<any> | StyleSheet.NamedStyles<T> = f(p);
  return createStyleSheet(styles);
}
