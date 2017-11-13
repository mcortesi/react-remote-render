/// <reference types="react" />
import * as React from 'react';
import { RemoteRenderServer } from '../types/service';
import { Transport } from '../types/transport';
import { Props } from '../types/base';
import { RemoteRenderComponent } from './withRemoteRender';
export interface ComponentState {
    id: number;
    name: string;
    props: Props;
}
export interface RendererProps {
    components: RemoteRenderComponent<any>[];
    server?: RemoteRenderServer;
    transport?: Transport;
}
export interface RendererState {
    instances: ComponentState[];
}
export default class Renderer extends React.PureComponent<RendererProps, RendererState> {
    state: RendererState;
    private server;
    private handler;
    constructor(props: RendererProps);
    componentWillUnmount(): void;
    getComponent(name: any): RemoteRenderComponent<any> | undefined;
    render(): JSX.Element;
}
