import { RemoteRenderClient, RemoteRenderServer, RemoteRenderHandler } from '../types/service';
import { Props } from '../types/base';
export default class DummyRemoteRenderClient implements RemoteRenderClient, RemoteRenderServer {
    private handlers;
    private nextId;
    hasHandlers(): boolean;
    registerHandler(listener: RemoteRenderHandler): void;
    unregisterHandler(listener: RemoteRenderHandler): void;
    mountComponent(name: string, props: Props): number;
    updateComponent(id: number, props: Props): void;
    unmountComponent(id: number): void;
    private tellHandlers(f);
}
