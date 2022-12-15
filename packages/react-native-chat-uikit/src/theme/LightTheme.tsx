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
    button: {
      enabled: {
        background: 'rgba(10, 132, 255, 1)',
        content: 'rgba(242, 242, 242, 1)',
      },
      disabled: {
        background: 'rgba(180, 180, 180, 1)',
        content: 'rgba(211, 211, 211, 1)',
      },
      pressed: {
        background: 'rgba(0, 71, 179, 1)',
        content: 'rgba(211, 211, 211, 1)',
      },
    },
  },
  fonts: BaseTheme.fonts!,
};

export default LightTheme;
