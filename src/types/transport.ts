import { ClientMessage, ServerMessage } from './messages';

export type ClientMessageHandler = (msg: ClientMessage) => void;
export type ServerMessageHandler = (msg: ServerMessage) => void;

export interface Transport {
  sendClientMessage(msg: ClientMessage);
  sendServerMessage(msg: ServerMessage);
  onClientMessage(msgHandler: ClientMessageHandler);
  onServerMessage(msgHandler: ServerMessageHandler);
}
