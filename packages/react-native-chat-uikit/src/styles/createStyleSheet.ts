import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { DEFAULT_SCALE_FACTOR } from './createScaleFactor';

type NamedStyle = ViewStyle | TextStyle | ImageStyle;
type StylePreprocessor<T extends NamedStyle = NamedStyle> = {
  [key in keyof T]: (val: NonNullable<T[key]>) => typeof val;
};

const SCALE_FACTOR_WITH_STR = (val: string | number) =>
  typeof val === 'string' ? val : DEFAULT_SCALE_FACTOR(val);

const preProcessor: Partial<StylePreprocessor> = {
  fontSize: DEFAULT_SCALE_FACTOR,
  lineHeight: DEFAULT_SCALE_FACTOR,
  borderRadius: DEFAULT_SCALE_FACTOR,
  minWidth: SCALE_FACTOR_WITH_STR,
  minHeight: SCALE_FACTOR_WITH_STR,
  height: SCALE_FACTOR_WITH_STR,
  width: SCALE_FACTOR_WITH_STR,
  padding: SCALE_FACTOR_WITH_STR,
  paddingTop: SCALE_FACTOR_WITH_STR,
  paddingBottom: SCALE_FACTOR_WITH_STR,
  paddingLeft: SCALE_FACTOR_WITH_STR,
  paddingRight: SCALE_FACTOR_WITH_STR,
  margin: SCALE_FACTOR_WITH_STR,
  marginTop: SCALE_FACTOR_WITH_STR,
  marginBottom: SCALE_FACTOR_WITH_STR,
  marginLeft: SCALE_FACTOR_WITH_STR,
  marginRight: SCALE_FACTOR_WITH_STR,
  left: SCALE_FACTOR_WITH_STR,
  right: SCALE_FACTOR_WITH_STR,
  top: SCALE_FACTOR_WITH_STR,
  bottom: SCALE_FACTOR_WITH_STR,
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
        if (typeof f === typeof DEFAULT_SCALE_FACTOR) {
          const c = f as typeof DEFAULT_SCALE_FACTOR;
          const d = Object.getOwnPropertyDescriptor(style, key);
          if (d) {
            d.value = c(d.value as number);
            Object.defineProperty(style, key, d);
          }
        } else if (typeof f === typeof SCALE_FACTOR_WITH_STR) {
          const c = f as typeof SCALE_FACTOR_WITH_STR;
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
