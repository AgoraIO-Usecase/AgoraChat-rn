import * as React from 'react';

import DevApp from './test_tabs_prototype';

export default function dev(): JSX.Element {
  return (
    <React.StrictMode>
      <DevApp />
    </React.StrictMode>
  );
}
