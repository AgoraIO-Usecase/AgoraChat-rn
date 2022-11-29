import * as React from 'react';

import Placeholder from '../screens/Placeholder';

export type IMSDKOption = {
  appKey: string;
  autoLogin: boolean;
};

export type IMUIKitContainerProps = React.PropsWithChildren<{
  option: {
    version: string;
    name: string;
  };
  localization: {};
  theme: {};
  context: {};
  hook: {};
  service: {};
  sdkOption: IMSDKOption;
}>;

export default function IMUIKitContainer({
  option,
  localization,
  theme,
  context,
  hook,
  service,
  sdkOption,
}: IMUIKitContainerProps): JSX.Element {
  console.log(option, localization, theme, context, hook, service, sdkOption);
  return <Placeholder content="being developed..." />;
}
