import { ClientMessage, ServerMessage } from '../types/messages';
import {
  Transport,
  ClientMessageHandler,
  ServerMessageHandler
} from '../types/transport';

export default class DummyTransport implements Transport {
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
