import * as React from 'react';

import DevApp from './test_auto_height';

export default function dev(): JSX.Element {
  return (
    <React.StrictMode>
      <DevApp />
    </React.StrictMode>
  );
}
