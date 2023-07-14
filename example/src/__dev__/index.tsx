import * as React from 'react';

import DevApp from './test_avatar_preview';

export default function dev(): JSX.Element {
  return (
    <React.StrictMode>
      <DevApp />
    </React.StrictMode>
  );
}
