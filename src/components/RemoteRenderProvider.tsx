import * as React from 'react';
import * as PropTypes from 'prop-types';
import { DefaultRemoteRenderClient } from '../model/default-service';
import { RemoteRenderClient } from '../types/service';
import { Transport } from '../types/transport';

export interface RemoteRenderProviderProps {
  client?: RemoteRenderClient;
  transport?: Transport;
}

export default class RemoteRenderProvider extends React.Component<RemoteRenderProviderProps> {
  static childContextTypes = {
    client: PropTypes.object
  }

  static propTypes = {
    client: PropTypes.object,
    transport: PropTypes.object,
    children: PropTypes.element.isRequired,
  }

  private client: RemoteRenderClient;

  constructor(props) {
    super(props);

    if (this.props.client && this.props.transport) {
      throw new Error('can\'t set transport & client props at the same time');
    } else if (this.props.client == null && this.props.transport == null) {
      throw new Error('At least a transport or a client prop must be given');
    }

    this.client = this.props.transport ? new DefaultRemoteRenderClient(this.props.transport) : (this.props.client as RemoteRenderClient);
  }

  getChildContext(): { client: RemoteRenderClient} {
    return { client: this.client };
  }

  render() {
    return React.Children.only(this.props.children)
  }
}