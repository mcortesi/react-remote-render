/// <reference types="react" />
import * as React from 'react';
import { RemoteRenderServer } from '../types/service';
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
    components: ComponentState[];
}
export default class Renderer extends React.PureComponent<RendererProps, RendererState> {
    state: RendererState;
    private mappings;
    private proxyHandler;
    constructor(props: RendererProps);
    componentWillUnmount(): void;
    render(): JSX.Element;
}
