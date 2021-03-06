import { Props } from './base';

export interface RemoteRenderClient {
  mountComponent(name: string, props: Props): number;
  updateComponent(id: number, props: Props);
  unmountComponent(id: number);
}

export interface RemoteRenderServer {
  registerHandler(listener: RemoteRenderHandler);
  unregisterHandler(listener: RemoteRenderHandler);
}

export interface RemoteRenderHandler {
  onComponentMount(id: number, name: string, props: Props);
  onComponentUpdate(id: number, props: Props);
  onComponentUnmount(id: number);
}
