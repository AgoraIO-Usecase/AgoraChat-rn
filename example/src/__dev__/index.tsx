import * as React from 'react';

import DevApp from './test_message_list';

export default function dev(): JSX.Element {
  return (
    <React.StrictMode>
      <DevApp />
    </React.StrictMode>
  );
}
