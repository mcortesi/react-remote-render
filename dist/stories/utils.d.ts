/// <reference types="react" />
import * as React from 'react';
import { RemoteRenderComponent } from '../src/components/withRemoteRender';
import { DefaultRemoteRenderClient, DefaultRemoteRenderServer } from '../src/model/default-service';
export declare const Section: ({title, children, style}: {
    title: any;
    children: any;
    style?: {};
}) => JSX.Element;
export interface TestScenarioProps {
    supportedComponents: RemoteRenderComponent<any>[];
}
export declare class TestScenario extends React.Component<TestScenarioProps> {
    state: {
        proxy: DefaultRemoteRenderClient;
        proxyServer: DefaultRemoteRenderServer;
    };
    constructor(props: any);
    render(): JSX.Element;
}
