import { ClientMessage, ServerMessage } from '../types/messages';
import { Transport, ClientMessageHandler, ServerMessageHandler } from '../types/transport';
export default class DummyTransport implements Transport {
    clientMessageHandlers: ClientMessageHandler[];
    serverMessageHandlers: ServerMessageHandler[];
    private mimicTransport<A>(value);
    sendClientMessage(msg: ClientMessage): void;
    sendServerMessage(msg: ServerMessage): void;
    onClientMessage(msgHandler: (msg: ClientMessage) => void): void;
    onServerMessage(msgHandler: (msg: ServerMessage) => void): void;
}
