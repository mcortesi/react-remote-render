import { storiesOf } from '@storybook/react';
import * as React from 'react';
import RemoteRenderProvider from '../src/components/RemoteRenderProvider';
import withRemoteRender, { RemoteRenderComponent } from '../src/components/withRemoteRender';
import Renderer from '../src/components/Renderer';
import DummyService from '../src/model/dummy-service';

const stories = storiesOf('With Dummy Service', module);

interface DummyProxyTestProps {
  externalizedComponents: RemoteRenderComponent<any>[]
}
class DummyProxyTest extends React.Component<DummyProxyTestProps> {
  state: { proxy: DummyService };

  constructor(props) {
    super(props);

    this.state = {
      proxy: new DummyService()
    }
  }

  render() {
    return (
      <div>
        <section>
          <h4>The main flow (provider)</h4>
          <RemoteRenderProvider remoteProxy={this.state.proxy}>
            {this.props.children}
          </RemoteRenderProvider>
        </section>
        <section>
          <h4>The RemoteProxy Renderer</h4>
          <Renderer
            server={this.state.proxy}
            components={this.props.externalizedComponents}
          />
        </section>
      </div>
    );
  }
}

const Paragraph: React.SFC<{ text: string }> = ({ text }) => (<p>{text}</p>);
const ExternalizedParagraph = withRemoteRender<{ text: string }>({ name: 'Paragraph'})(Paragraph);

const Button: React.SFC<{ onClick: Function }> = ({ onClick }) => (
  <button onClick={e => onClick()}>Click Me</button>
);
const ExternalizedButton = withRemoteRender<{ onClick: Function }>({ name: 'Button'})(Button);

class ButtonText extends React.Component {
  state: { clicks: number } = { clicks: 0 }

  incrementClicks = () => {
    this.setState({ clicks: this.state.clicks + 1 });
  }

  render() {
    return (
      <div>
        <ExternalizedButton onClick={this.incrementClicks} />
        <ExternalizedParagraph text={`${this.state.clicks} clicks`} />
      </div>
    );
  }
}

stories.add('Simple Example', () => (
  <DummyProxyTest externalizedComponents={[ExternalizedParagraph]} >
    <ExternalizedParagraph text="Hola bebe!" />
    <ExternalizedParagraph text="adios mundo cruel" />
  </DummyProxyTest>
));

stories.add('Calling Action in externalized components', () => (
  <DummyProxyTest externalizedComponents={[ExternalizedParagraph, ExternalizedButton]} >
    <ButtonText />
  </DummyProxyTest>
));
