import type { Theme } from '../types';
import BaseTheme from './BaseTheme';

const DarkTheme: Theme = {
  scheme: 'dark',
  colors: {
    primary: 'rgb(10, 132, 255)',
    background: 'rgb(1, 1, 1)',
    text: 'rgb(229, 229, 231)',
    border: 'rgb(39, 39, 41)',
    card: 'rgb(18, 18, 18)',
    mask: 'rgba(18, 18, 18, 0.6)',
    button: {
      enabled: {
        background: 'rgba(3, 169, 244, 1)',
        content: 'rgba(242, 242, 242, 1)',
      },
      disabled: {
        background: 'rgba(211, 211, 211, 1)',
        content: 'rgba(242, 242, 242, 1)',
      },
      pressed: {
        background: 'rgba(0, 71, 179, 1)',
        content: 'rgba(211, 211, 211, 1)',
      },
    },
  },
  fonts: BaseTheme.fonts!,
};

export default DarkTheme;
