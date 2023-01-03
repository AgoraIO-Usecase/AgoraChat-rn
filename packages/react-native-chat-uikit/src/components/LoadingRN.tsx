import * as React from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';

type LoadingProps = ActivityIndicatorProps;

export default function LoadingRN(props: LoadingProps): JSX.Element {
  return <ActivityIndicator {...props} />;
}
