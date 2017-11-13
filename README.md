# react-remote-render

A HOC that let’s you render your components elsewhere (in another iframe,
browser, wherever over the wire). 

**It’s like a Portal, but more powerful.** A Portal can only render your component within the same browser window, or within the visibility scope of your running application.

## Demo

**Storybook**: https://mcortesi.github.io/react-remote-render/

code in `stories/` folder

## Why?

It’s not common, that’s true. And probably 90% of the times, you only need a portal. But there are some situations where you might need it.

The original use case for it, was to render in another iframe, sibling of the app iframe. Why such a strange configuration? Imagine your application is to be embebbed in other pages with partial ownershipt of the page real estate; and imagine you want to open a modal, but modals occupy the whole viewport dimension, not just the part your iframe/app lives in. So, in order to solve this, you have another iframe controlled from outside that only renders modals and occupy the whole viewport. To communicate both iframes is why react-remote-render was born. The master iframe (the app), wants to render a component (the modal) in the slave iframe (the modal's iframe). Thanks to the react-remote-render abstraction, the app doesn't really need to know that it's rendering the modal outside.

I guess, any other master-slave configuration can benefit from this component. You could control what another screen renders from the master application in the main screen.

Still, I wouldn’t recommend this solution from a master-master configuration, that is, where both “nodes” are independent. If you need both app to communicate there, probably sending redux-action it’s a better way to handle it.

## Usage

There are 3 parts:

1. `withRemoteRender()` higher order component to mark a component to be remotely rendered. So, it won’t render in place, it will only render on the remote space.
2. `RemoteRenderProvider` it provides a context for `withRemoteRender()` decorated components with the remote configuration.
3. `Renderer` responsible of actually rendering the remote components.

Let’s see an example

First, we decorate components that we want to be render outside:
```js

const ShareModal = ({ text, onShare }) => (...);
const RRShareModal = withRemoteRender({ name: 'ShareModal'})(ShareModal);

const QuestionModal = ({ onAnswer, question }) => (...);
const RRQuestionModal = withRemoteRender({ name: 'QuestionModal'})(QuestionModal);
```

Second, we wrap our app with the `RemoteRenderProvider`
```js
// The transport is the one that sends & recieves messages between the remote components (Renderer) and the local components (RRQuestionModal & RRShareModal in our case).
const iframeTransport = new IframeTransport();

ReactDOM.render(
  <RemoteRenderProvider transport={iframeTransport}>
    <App/>
  </RemoteRenderProvider>,
  document.getElementById('root')
);
```

Finally, in another app, another iframe, another place, you set the renderer.
```js
const iframeTransport = new IframeTransport();

ReactDOM.render(
  <Renderer
    transport={iframeTransport}
    components={[
      RRShareModal,
      RRQuestionModal
    ]}
  />,
  document.getElementById('root')
);
```

So, whenever you render a RRShareModal or RRQuestionModal within your app, it will be rendered as a child of `Renderer` wherever it might live. Lifecycle events as mount, unmount & update will be sent using the transport.

Also, when within ShareModal & QuestionModal the function `onShare` & `onAnswer` are called. The call will actually happen in the origin (the main app), not in the slave (where the renderer lives). The only constraint there, is that parameters **MUST** be serializable.

## Implementing a Transport

Useful transports are not included in the library. The reason is that the transport primarely depends on the use case, and might me something custom for each app. But any suggestions on transports that
can be reused is welcome, and we can implement them.

A transport is just a class that implements:

```js
export type ClientMessageHandler = (msg: ClientMessage) => void;
export type ServerMessageHandler = (msg: ServerMessage) => void;

export interface Transport {
  sendClientMessage(msg: ClientMessage);
  sendServerMessage(msg: ServerMessage);
  onClientMessage(msgHandler: ClientMessageHandler);
  onServerMessage(msgHandler: ServerMessageHandler);
}
```

where `CientMessage` & `ServerMessage` are:

```js
export enum ClientMessageKind {
  Mount = 'Mount',
  Update = 'Update',
  Unmount = 'Unmount'
}

export type ClientMessage = MountMessage | UpdateMessage | UnmountMessage;
export type ServerMessage = FunctionCallMessage;

export interface FunctionCallMessage {
  id: number;
  functionKey: string;
  params: any[];
}

export type PropsForTransport = {
  simpleProps: { [key: string]: any };
  functionProps: string[];
};

export interface MountMessage {
  kind: ClientMessageKind.Mount;
  id: number;
  name: string;
  props: PropsForTransport;
}

export interface UpdateMessage {
  kind: ClientMessageKind.Update;
  id: number;
  props: PropsForTransport;
}

export interface UnmountMessage {
  kind: ClientMessageKind.Unmount;
  id: number;
}
```

But you don't really have to know the details on the message to implement a transport, probably the implementation just need to serialize the messages (`JSON.stringifiy` will suffice) and send them over the wire.

For example, the `DummyTransport` is use for the examples is:

```js
class DummyTransport implements Transport {
  clientMessageHandlers: ClientMessageHandler[] = [];
  serverMessageHandlers: ServerMessageHandler[] = [];

  sendClientMessage(msg: ClientMessage) {
    const receievedMsg = this.mimicTransport(msg);
    this.clientMessageHandlers.forEach(handler => {
      handler(receievedMsg);
    });
  }

  sendServerMessage(msg: ServerMessage) {
    const receievedMsg = this.mimicTransport(msg);
    this.serverMessageHandlers.forEach(handler => {
      handler(receievedMsg);
    });
  }

  onClientMessage(msgHandler: (msg: ClientMessage) => void) {
    this.clientMessageHandlers.push(msgHandler);
  }
  onServerMessage(msgHandler: (msg: ServerMessage) => void) {
    this.serverMessageHandlers.push(msgHandler);
  }

  private mimicTransport<A>(value: A): A {
    const asString = JSON.stringify(value);
    return JSON.parse(asString);
  }
}
```

In a real app, `mimicTransport` would be replaced by an HTTP request or a `window.postMessage()` call.


