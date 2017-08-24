import * as React from 'react';
import { RemoteRenderServer, RemoteRenderHandler } from '../types/service';
import { ObjMap } from '../types/base';
import { Props } from '../types/base';
import { RemoteRenderComponent } from './withRemoteRender';

export interface ComponentState {
  id: number;
  name: string;
  props: Props
}

export interface RendererProps {
  components: RemoteRenderComponent<any>[];
  server: RemoteRenderServer;
}

export interface RendererState {
  components: ComponentState[]
}

export default class Renderer extends React.PureComponent<RendererProps, RendererState> {
  state: RendererState = { components: [] }
  private mappings: ObjMap<React.ComponentClass>;
  private proxyHandler: RemoteRenderHandler;

  constructor(props: RendererProps) {
    super(props);

    this.mappings = props.components.reduce((acc, component) => {
      acc[component.externalName] = component;
      return acc;
    }, {});

    this.proxyHandler = {
      onComponentMount: (id: number, name: string, props: Props) => {
        this.setState((prevState) => ({
          components: prevState.components.concat([{ id, name, props }])
        }));
      },

      onUpdateComponent: (id: number, props: Props) => {
        this.setState((prevState) => ({
          components: prevState.components.map(cState => {
            if (cState.id === id) {
              return { id, name: cState.name, props };
            } else {
              return cState;
            }
          })
        }));
      },

      onUnmountComponent: (id: number) => {
        this.setState((prevState) => ({
          components: prevState.components.filter(cState => cState.id === id)
        }));
      }
    };


    this.props.server.registerHandler(this.proxyHandler);
  }

  componentWillUnmount() {
    this.props.server.unregisterHandler(this.proxyHandler);
  }

  render() {
    return (
      <div>
        {this.state.components.map(({ id, name, props }) => {
          const ExternalizedComponent = this.mappings[name] as RemoteRenderComponent<any>;
          const Component = ExternalizedComponent.WrappedComponent;
          return <Component key={id} {...ExternalizedComponent.deserializeProps(props)} />
        })}
      </div>
    );
  }


}