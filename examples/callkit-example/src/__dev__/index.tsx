import * as React from 'react';

import DevApp from './test_multi_call';

export default function dev(): JSX.Element {
  return (
    <React.StrictMode>
      <DevApp />
    </React.StrictMode>
  );
}
