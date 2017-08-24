import * as React from 'react';
import { messageLogger } from '../.storybook/msg-logger';

import RemoteRenderProvider from '../src/components/RemoteRenderProvider';
import withRemoteRender, { RemoteRenderComponent } from '../src/components/withRemoteRender';
import Renderer from '../src/components/Renderer';
import { DefaultRemoteRenderClient, DefaultRemoteRenderServer } from '../src/model/default-service';
import DummyTransport from '../src/model/dummy-transport';

export const Section = ({ title, children, style = {} }) => (
  <div style={{ display: 'flex', alignItems: 'center', height: '8em', marginBottom: '2em' }}>
    <h4 style={{ width: 100, paddingLeft: '1em', paddingRight: '3em'}}>{title}</h4>
    <div style={{ borderLeft: 'solid 1px grey', padding: '2em', height: '4em' }}>
      {children}
    </div>
  </div>
)

export interface TestScenarioProps {
  supportedComponents: RemoteRenderComponent<any>[]
}

export class TestScenario extends React.Component<TestScenarioProps> {
  state: { proxy: DefaultRemoteRenderClient, proxyServer: DefaultRemoteRenderServer };

  constructor(props) {
    super(props);

    const transport = new DummyTransport();

    transport.onClientMessage(messageLogger('client-msg'));
    transport.onServerMessage(messageLogger('server-msg'));

    this.state = {
      proxy: new DefaultRemoteRenderClient(transport),
      proxyServer: new DefaultRemoteRenderServer(transport)
    }
  }

  render() {
    return (
      <div>
        <Section title="In your APP" >
          <RemoteRenderProvider remoteProxy={this.state.proxy}>
            {this.props.children}
          </RemoteRenderProvider>
        </Section>
        <Section title="Somewhere outside..." >
          <Renderer
            server={this.state.proxyServer}
            components={this.props.supportedComponents}
          />
        </Section>
      </div>
    );
  }
}