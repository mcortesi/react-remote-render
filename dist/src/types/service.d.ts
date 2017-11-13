import { Props } from './base';
export interface RemoteRenderClient {
    mountComponent(name: string, props: Props): number;
    updateComponent(id: number, props: Props): any;
    unmountComponent(id: number): any;
}
export interface RemoteRenderServer {
    registerHandler(listener: RemoteRenderHandler): any;
    unregisterHandler(listener: RemoteRenderHandler): any;
}
export interface RemoteRenderHandler {
    onComponentMount(id: number, name: string, props: Props): any;
    onComponentUpdate(id: number, props: Props): any;
    onComponentUnmount(id: number): any;
}
