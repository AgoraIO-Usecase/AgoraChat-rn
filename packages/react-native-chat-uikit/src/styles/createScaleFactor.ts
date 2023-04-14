import { Dimensions, PixelRatio } from 'react-native';

import type { ScaleFactor, ScaleFactorS } from '../types';

const { width, height } = Dimensions.get('window');

const DESIGNED_DEVICE_WIDTH = 375;

function createScaleFactor(deviceWidth = DESIGNED_DEVICE_WIDTH) {
  const ratio = Math.min(width, height) / deviceWidth;
  let rangedRatio = Math.min(Math.max(0.85, ratio), 1.25);
  console.log('createScaleFactor:', ratio, rangedRatio);
  rangedRatio = 1;
  return {
    scaleFactor: (dp: number) =>
      PixelRatio.roundToNearestPixel(dp * rangedRatio),
    ratio: rangedRatio,
  };
}

// createScaleFactor.updateScaleFactor = (
//   scaleFactor: (dp: number) => number,
//   ratio: number
// ) => {
//   console.warn('test:ratio:', ratio);
//   defaultScaleFactor = scaleFactor;
// };

export let defaultRatio = createScaleFactor().ratio;
export let defaultScaleFactor = createScaleFactor().scaleFactor;
export const defaultScaleFactorS = (val: string | number) =>
  typeof val === 'string' ? val : defaultScaleFactor(val);

export function updateScaleFactor(params: {
  scaleFactor: (dp: number) => number;
  ratio: number;
}) {
  // console.warn('test:ratio:', params.ratio);
  defaultScaleFactor = params.scaleFactor;
  defaultRatio = params.ratio;
}

export function getScaleFactor(): ScaleFactor {
  return defaultScaleFactor;
}

export function getScaleFactorS(): ScaleFactorS {
  return defaultScaleFactorS;
}
