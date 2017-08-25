import { RemoteRenderClient, RemoteRenderServer, RemoteRenderHandler } from '../types/service';
import { Props } from '../types/base';
export default class DummyRemoteProxy implements RemoteRenderClient, RemoteRenderServer {
    private handlers;
    private nextId;
    registerHandler(listener: RemoteRenderHandler): void;
    unregisterHandler(listener: RemoteRenderHandler): void;
    private tellHandlers(f);
    mountComponent(name: string, props: Props): number;
    updateComponent(id: number, props: Props): void;
    unmountComponent(id: number): void;
}
