import * as React from 'react';

import { calllog } from '../call/CallConst';

export abstract class BasicCall<Props, State> extends React.Component<
  Props,
  State
> {
  componentDidMount(): void {
    calllog.log('BasicCall:componentDidMount:');
  }
  componentWillUnmount(): void {
    calllog.log('BasicCall:componentWillUnmount:');
  }

  protected renderBody(): React.ReactNode {
    throw new Error('You need a subclass implementation.');
  }

  render(): React.ReactNode {
    return this.renderBody();
  }
}
