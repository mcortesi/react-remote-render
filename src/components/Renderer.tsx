import * as React from 'react';
import { RemoteRenderServer, RemoteRenderHandler } from '../types/service';
import { ObjMap } from '../types/base';
import { Props } from '../types/base';
import { RemoteRenderComponent } from './withRemoteRender';

export interface ComponentState {
  id: number;
  name: string;
  props: Props;
}

export interface RendererProps {
  components: RemoteRenderComponent<any>[];
  server: RemoteRenderServer;
}

export interface RendererState {
  instances: ComponentState[];
}

export default class Renderer extends React.PureComponent<
  RendererProps,
  RendererState
> {
  state: RendererState = { instances: [] };
  private handler: RemoteRenderHandler;

  constructor(props: RendererProps) {
    super(props);

    this.handler = {
      onComponentMount: (id: number, name: string, props: Props) => {
        this.setState(prevState => ({
          instances: prevState.instances.concat([{ id, name, props }])
        }));
      },

      onUpdateComponent: (id: number, props: Props) => {
        this.setState(prevState => ({
          instances: prevState.instances.map(cState => {
            if (cState.id === id) {
              return { id, name: cState.name, props };
            } else {
              return cState;
            }
          })
        }));
      },

      onUnmountComponent: (id: number) => {
        this.setState(prevState => ({
          instances: prevState.instances.filter(cState => cState.id !== id)
        }));
      }
    };

    this.props.server.registerHandler(this.handler);
  }

  componentWillUnmount() {
    this.props.server.unregisterHandler(this.handler);
  }

  getComponent(name) {
    return this.props.components.find(c => c.externalName === name);
  }

  render() {
    return (
      <div>
        {this.state.instances.map(({ id, name, props }) => {
          const ExternalizedComponent = this.getComponent(
            name
          ) as RemoteRenderComponent<any>;
          if (ExternalizedComponent) {
            const Component = ExternalizedComponent.WrappedComponent;
            return (
              <Component
                key={id}
                {...ExternalizedComponent.deserializeProps(props)}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
    );
  }
}
