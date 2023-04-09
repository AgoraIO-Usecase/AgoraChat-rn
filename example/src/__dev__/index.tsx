import * as React from 'react';

import DevApp from './test_speaker3';

export default function dev(): JSX.Element {
  return (
    <React.StrictMode>
      <DevApp />
    </React.StrictMode>
  );
}
