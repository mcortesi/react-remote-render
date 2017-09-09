import {
  RemoteRenderClient,
  RemoteRenderServer,
  RemoteRenderHandler
} from '../types/service';
import { Props } from '../types/base';
import { Transport } from '../types/transport';
import {
  PropsForTransport,
  ClientMessageKind,
  ClientMessage
} from '../types/messages';
import { fromPairs } from '../utils';

export class DefaultRemoteRenderClient implements RemoteRenderClient {
  private nextId = 0;
  private transport: Transport;
  private mountedComponents: Map<number, Map<string, Function>> = new Map();

  constructor(transport: Transport) {
    this.transport = transport;

    this.transport.onServerMessage(msg => {
      this.onRemoteFunctionCall(msg.id, msg.functionKey, msg.params);
    });
  }

  mountComponent(name: string, props: Props): number {
    const id = this.nextId++;
    this.transport.sendClientMessage({
      kind: ClientMessageKind.Mount,
      id,
      name,
      props: this.processProps(id, props)
    });
    return id;
  }

  updateComponent(id: number, props: Props) {
    this.transport.sendClientMessage({
      kind: ClientMessageKind.Update,
      id,
      props: this.processProps(id, props)
    });
  }

  unmountComponent(id: number) {
    this.transport.sendClientMessage({
      kind: ClientMessageKind.Unmount,
      id
    });
    this.mountedComponents.delete(id);
  }

  private onRemoteFunctionCall(id: number, functionKey: string, params: any[]) {
    if (
      this.mountedComponents.has(id) &&
      this.mountedComponents.get(id)!.has(functionKey)
    ) {
      this.mountedComponents.get(id)!.get(functionKey)!(...params);
    } else {
      console.error(
        `Tried to call unmounted/unexistent function component:${id} fn:${functionKey}`
      );
    }
  }

  private processProps(id: number, props: Props): PropsForTransport {
    const functionProps: string[] = [];
    const simpleProps: Props = {};
    const savedFunctions: Map<string, Function> = new Map();

    Object.keys(props).forEach(propKey => {
      if (typeof props[propKey] === 'function') {
        functionProps.push(propKey);
        savedFunctions.set(propKey, props[propKey]);
      } else {
        simpleProps[propKey] = props[propKey];
      }
    });

    this.mountedComponents.set(id, savedFunctions);

    return { simpleProps, functionProps };
  }
}

export class DefaultRemoteRenderServer implements RemoteRenderServer {
  private handlers: RemoteRenderHandler[] = [];
  private transport: Transport;

  constructor(transport: Transport) {
    this.transport = transport;

    this.transport.onClientMessage(this.onClientMessage);
  }

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

  private onClientMessage = (msg: ClientMessage) => {
    switch (msg.kind) {
      case ClientMessageKind.Mount: {
        const parsedProps = this.processProps(msg.id, msg.props);
        this.tellHandlers(h =>
          h.onComponentMount(msg.id, msg.name, parsedProps)
        );
        break;
      }
      case ClientMessageKind.Update: {
        const parsedProps = this.processProps(msg.id, msg.props);
        this.tellHandlers(h => h.onUpdateComponent(msg.id, parsedProps));
        break;
      }
      case ClientMessageKind.Unmount: {
        this.tellHandlers(h => h.onUnmountComponent(msg.id));
        break;
      }
      default: {
        throw new Error(`unknown message kind ${msg}`);
      }
    }
  };

  private processProps(id: number, props: PropsForTransport): Props {
    const functionProxy = functionKey => (...params) =>
      this.transport.sendServerMessage({ id, functionKey, params });
    const functionProps = fromPairs(
      props.functionProps.map(
        key => [key, functionProxy(key)] as [string, Function]
      )
    );

    return Object.assign({}, props.simpleProps, functionProps);
  }
}
