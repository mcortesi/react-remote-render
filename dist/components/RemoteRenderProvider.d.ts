/// <reference types="react" />
import * as React from 'react';
import { RemoteRenderClient } from '../types/service';
export interface RemoteRenderProviderProps {
    remoteProxy: RemoteRenderClient;
}
export default class RemoteRenderProvider extends React.Component<RemoteRenderProviderProps> {
    static childContextTypes: {
        remoteProxy: any;
    };
    getChildContext(): {
        remoteProxy: RemoteRenderClient;
    };
    render(): JSX.Element;
}
