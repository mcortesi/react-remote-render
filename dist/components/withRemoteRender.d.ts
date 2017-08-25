/// <reference types="react" />
import * as React from 'react';
import { Shape } from '../types/base';
export declare type CustomSerializers<T> = {
    readonly [P in keyof T]?: {
        serialize: (value: T[P]) => any;
        deserialize: (value: any) => T[P];
    };
};
export declare type Options<Props> = {
    name?: string;
    customSerializers?: CustomSerializers<Props>;
};
export declare type RemoteRenderComponent<OProps> = React.ComponentClass<OProps> & RemoteRenderComponentStatic<OProps>;
export interface RemoteRenderComponentStatic<Props> {
    WrappedComponent: React.ComponentType<Props>;
    externalName: string;
    serializeProps: (props: Props) => Shape<Props, any>;
    deserializeProps: (props: Shape<Props, any>) => Props;
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
export default function withRemoteRender<OProps extends {}>(options: Options<OProps>): (Component: React.ComponentType<OProps>) => RemoteRenderComponent<OProps>;
