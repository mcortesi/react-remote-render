export declare enum ClientMessageKind {
    Mount = "Mount",
    Update = "Update",
    Unmount = "Unmount",
}
export declare type ClientMessage = MountMessage | UpdateMessage | UnmountMessage;
export declare type ServerMessage = FunctionCallMessage;
export interface FunctionCallMessage {
    id: number;
    functionKey: string;
    params: any[];
}
export declare type PropsForTransport = {
    simpleProps: {
        [key: string]: any;
    };
    functionProps: string[];
};
export interface MountMessage {
    kind: ClientMessageKind.Mount;
    id: number;
    name: string;
    props: PropsForTransport;
}
export interface UpdateMessage {
    kind: ClientMessageKind.Update;
    id: number;
    props: PropsForTransport;
}
export interface UnmountMessage {
    kind: ClientMessageKind.Unmount;
    id: number;
}
