import * as React from 'react';

import DevApp from './test_twitter_moji';

export default function dev(): JSX.Element {
  return (
    <React.StrictMode>
      <DevApp />
    </React.StrictMode>
  );
}
