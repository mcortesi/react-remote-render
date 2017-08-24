import { RemoteRenderClient, RemoteRenderServer, RemoteRenderHandler } from '../types/service';
import { Props } from '../types/base';

export default class DummyRemoteProxy implements RemoteRenderClient, RemoteRenderServer {
  private handlers: RemoteRenderHandler[] = [];
  private nextId = 0;

  registerHandler(listener: RemoteRenderHandler) {
    this.handlers.push(listener);
  }

  unregisterHandler(listener: RemoteRenderHandler) {
    this.handlers = this.handlers.filter(handler => handler !== listener);
  }

  private tellHandlers(f: (h: RemoteRenderHandler) => void): void {
    for (const h of this.handlers) {
      try {
        f(h);
      } catch (err) {
        console.error(err);
        // continue
      }
    }
  }

  mountComponent(name: string, props: Props): number {
    const id = this.nextId++;
    this.tellHandlers(h => { console.log('sending onComponentMount to', id); h.onComponentMount(id, name, props)});
    return id;
  }

  updateComponent(id: number, props: Props) {
    this.tellHandlers(h => { console.log('sending onUpdateComponent to', id); h.onUpdateComponent(id, props)});
  }

  unmountComponent(id: number) {
    this.tellHandlers(h => { console.log('sending onUnmountComponent to', id); h.onUnmountComponent(id)});
  }
}