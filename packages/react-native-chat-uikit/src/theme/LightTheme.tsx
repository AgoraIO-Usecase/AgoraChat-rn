import type { Theme } from '../types';
import BaseTheme from './BaseTheme';

const LightTheme: Theme = {
  scheme: 'light',
  colors: {
    primary: 'rgb(0, 122, 255)',
    background: 'rgb(242, 242, 242)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(216, 216, 216)',
    card: 'rgb(255, 255, 255)',
    mask: 'rgba(200, 200, 200, 0.6)',
  },
  fonts: BaseTheme.fonts!,
};

export default LightTheme;
