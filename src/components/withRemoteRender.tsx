import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Shape } from '../types/base';
import { RemoteRenderClient } from '../types/service';
import { mapObject } from '../utils';

export type CustomSerializers<T> = {
  readonly [P in keyof T]?: {
    serialize: (value: T[P]) => any;
    deserialize: (value: any) => T[P];
  }
}

export type Options<Props> = {
  name?: string;
  customSerializers?: CustomSerializers<Props>;
}

export type RemoteRenderComponent<OProps> = React.ComponentClass<OProps> & RemoteRenderComponentStatic<OProps>

export interface RemoteRenderComponentStatic<Props> {
  WrappedComponent: React.ComponentType<Props>;
  externalName: string;
  serializeProps: (props: Props) => Shape<Props, any>;
  deserializeProps: (props: Shape<Props, any>) => Props;
}

const getDisplayName = Component => {
  if (typeof Component === 'string') {
    return Component
  }

  if (!Component) {
    return undefined
  }

  return Component.displayName || Component.name || 'Component'
}

/**
 * Creates an Remote Render Component.
 * This means the component won't render itself where it's mounted, but instead it will be rendered elsewhere in a <Renderer/>.
 * The renderer is probably in a different iframe/frame/process/browser/etc.
 *
 * Some important considerations for this to work:
 *  * All props must be "serializable" with JSON.stringify. if not, define pass customSerializers to make it so
 *  * Props that are functions, will be replaced so to work "on the wire". They are restricted. All parameters they receive
 *    MUST be serializable. Function return type must be *void*.
 *  * Since children prop is not serializable, is not supported. So, only works with component with no children prop.
 *
 */
export default function withRemoteRender<OProps extends {}>(options: Options<OProps>): (Component: React.ComponentType<OProps>) => RemoteRenderComponent<OProps>  {

  const serializer = options.customSerializers == null ? (p) => p :
    (props: OProps) => mapObject(props, (value, key) => {
      if (options.customSerializers![key]) {
        return options.customSerializers![key]!.serialize(value);
      } else {
        return value;
      }
    })

  const deserializer = options.customSerializers == null ? (p) => p :
    (props) => mapObject(props, (value, key) => {
      if (options.customSerializers![key]) {
        return options.customSerializers![key]!.deserialize(value);
      } else {
        return value;
      }
    })


  return (Component: React.ComponentType<OProps>) => {
    const externalName = (options.name || getDisplayName(Component)) as string;
    if (externalName == null) {
      throw new Error('Need an external name for externalized component');
    }

    class ExternalizedComponent extends React.PureComponent<OProps> {

      static WrappedComponent = Component;
      static externalName = externalName;

      static serializeProps = serializer;
      static deserializeProps = deserializer;


      static contextTypes = {
        client: PropTypes.object
      }

      private id: number;
      context: { client?: RemoteRenderClient };

      componentDidMount() {
        if (this.context.client) {
          this.id = this.context.client.mountComponent(externalName, serializer(this.props));
        }
      }

      componentDidUpdate() {
        if (this.context.client) {
          this.context.client.updateComponent(this.id, serializer(this.props));
        }
      }

      componentWillUnmount() {
        if (this.context.client) {
          this.context.client.unmountComponent(this.id);
        }
      }

      render() {
        return null;
      }
    }

    (ExternalizedComponent as React.ComponentClass<OProps>).displayName = `Externalized(${getDisplayName(Component)})`;

    return ExternalizedComponent;
  };
}