import { ClientMessage, ServerMessage } from './messages';
export declare type ClientMessageHandler = (msg: ClientMessage) => void;
export declare type ServerMessageHandler = (msg: ServerMessage) => void;
export interface Transport {
    sendClientMessage(msg: ClientMessage): any;
    sendServerMessage(msg: ServerMessage): any;
    onClientMessage(msgHandler: ClientMessageHandler): any;
    onServerMessage(msgHandler: ServerMessageHandler): any;
}
