import * as React from 'react';

export abstract class BasicCall<Props, State> extends React.Component<
  Props,
  State
> {
  protected renderBody(): React.ReactNode {
    throw new Error('You need a subclass implementation.');
  }

  render(): React.ReactNode {
    return this.renderBody();
  }
}
