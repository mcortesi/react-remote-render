import * as React from 'react';
import addons from '@storybook/addons';
import { CHANNEL_ID, PANEL_ID } from './constants';

const styles: {[k:string]: React.CSSProperties} = {
  notesPanel: {
    margin: 10,
    fontFamily: 'Arial',
    fontSize: 14,
    color: '#444',
    width: '100%',
    overflow: 'auto',
  },
  msgItem: {
    fontSize: 10
  }
};

interface MessagesProps {
  channel: any;
  api: any;
}

class Messages extends React.Component<MessagesProps, { messages: any[] }> {
  state: { messages: any[] } = { messages: [] };
  private stopListeningOnStory?: Function

  onNewMessage = (msg) => {
    this.setState(({ messages }) => ({
      messages: messages.concat(msg)
    }));
  }

  clearPanel = () => this.setState({ messages: [] });

  componentDidMount() {
    const { channel, api } = this.props;
    channel.on(CHANNEL_ID, this.onNewMessage);
    this.stopListeningOnStory = api.onStory(this.clearPanel);
  }

  // This is some cleanup tasks when the Notes panel is unmounting.
  componentWillUnmount() {
    if (this.stopListeningOnStory) {
      this.stopListeningOnStory();
    }

    const { channel, api } = this.props;
    channel.removeListener(CHANNEL_ID, this.onNewMessage);
  }

  render() {
    const { messages } = this.state;
    return (
      <div style={styles.notesPanel}>
        {messages.map((msg, idx) => (
          <pre style={styles.msgItem} key={idx}>{JSON.stringify(msg, null, 2)}</pre>
        ))}
      </div>
    );
  }

}

// Register the addon with a unique name.
addons.register('storybook/msg-logger', (api) => {
  // Also need to set a unique name to the panel.
  addons.addPanel(PANEL_ID, {
    title: 'Transport Logger',
    render: () => (
      <Messages channel={addons.getChannel()} api={api} />
    ),
  })
})