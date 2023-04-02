import * as React from 'react';

import DevApp from './test_animated_scale';

export default function dev(): JSX.Element {
  return (
    <React.StrictMode>
      <DevApp />
    </React.StrictMode>
  );
}
