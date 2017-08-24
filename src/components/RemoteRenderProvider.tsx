import * as React from 'react';
import * as PropTypes from 'prop-types';
import { RemoteRenderClient } from '../types/service';

export interface RemoteRenderProviderProps {
  remoteProxy: RemoteRenderClient;
}

export default class RemoteRenderProvider extends React.Component<RemoteRenderProviderProps> {
  static childContextTypes = {
    remoteProxy: PropTypes.object
  }

  getChildContext(): { remoteProxy: RemoteRenderClient} {
    return { remoteProxy: this.props.remoteProxy };
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}