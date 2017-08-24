import { storiesOf } from '@storybook/react';
import { messageLogger } from '../.storybook/msg-logger';
import * as React from 'react';
import withRemoteRender, { RemoteRenderComponent } from '../src/components/withRemoteRender';
import { TestScenario } from './utils';

const stories = storiesOf('With DefaultService', module);

type ParagraphProps = { text: string };
const Paragraph: React.SFC<ParagraphProps> = ({ text }) => (<p>{text}</p>);


type ButtonProps = { onClick: Function, n: number };
const Button: React.SFC<ButtonProps> = ({ onClick, n }) => (
  <button onClick={e => onClick(n)}>Increment by {n}</button>
);

const RRParagraph = withRemoteRender<ParagraphProps>({ name: 'Paragraph'})(Paragraph);
const RRButton = withRemoteRender<ButtonProps>({ name: 'Button'})(Button);

class ButtonText extends React.Component {
  state: { clicks: number } = { clicks: 0 }

  incrementClicks = (n) => {
    this.setState({ clicks: this.state.clicks + n });
  }

  render() {
    return (
      <div>
        <RRButton onClick={this.incrementClicks} n={-1}/>
        <RRButton onClick={this.incrementClicks} n={2}/>
        <RRParagraph text={`${this.state.clicks} clicks`} />
      </div>
    );
  }
}

stories.add('Simple Example', () => (
  <TestScenario supportedComponents={[RRParagraph]} >
    <RRParagraph text="Hola bebe!" />
    <RRParagraph text="adios mundo cruel" />
  </TestScenario>
));

stories.add('Calling Action in externalized components', () => (
  <TestScenario supportedComponents={[RRParagraph, RRButton]} >
    <ButtonText />
  </TestScenario>
));
