/// <reference types="react" />
import * as React from 'react';
import { RemoteRenderClient } from '../types/service';
import { Transport } from '../types/transport';
export interface RemoteRenderProviderProps {
    client?: RemoteRenderClient;
    transport?: Transport;
}
export default class RemoteRenderProvider extends React.Component<RemoteRenderProviderProps> {
    static childContextTypes: {
        client: any;
    };
    static propTypes: {
        client: any;
        transport: any;
        children: any;
    };
    private client;
    constructor(props: any);
    getChildContext(): {
        client: RemoteRenderClient;
    };
    render(): React.ReactElement<any>;
}
