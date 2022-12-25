import type { MaterialBottomTabScreenProps } from '@react-navigation/material-bottom-tabs';
import * as React from 'react';
import { Placeholder } from 'react-native-chat-uikit';

import type { RootParamsList } from '../routes';

type Props = MaterialBottomTabScreenProps<RootParamsList, 'MySetting'>;

export default function MySettingScreen(_props: Props): JSX.Element {
  return <Placeholder content={`${MySettingScreen.name}`} />;
}
