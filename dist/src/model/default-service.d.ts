import { RemoteRenderClient, RemoteRenderServer, RemoteRenderHandler } from '../types/service';
import { Props } from '../types/base';
import { Transport } from '../types/transport';
export declare class DefaultRemoteRenderClient implements RemoteRenderClient {
    private nextId;
    private transport;
    private mountedComponents;
    constructor(transport: Transport);
    mountComponent(name: string, props: Props): number;
    updateComponent(id: number, props: Props): void;
    unmountComponent(id: number): void;
    private onRemoteFunctionCall(id, functionKey, params);
    private processProps(id, props);
}
export declare class DefaultRemoteRenderServer implements RemoteRenderServer {
    private handlers;
    private transport;
    constructor(transport: Transport);
    registerHandler(listener: RemoteRenderHandler): void;
    unregisterHandler(listener: RemoteRenderHandler): void;
    private tellHandlers(f);
    private onClientMessage;
    private processProps(id, props);
}
