export interface Props {
    [name: string]: any;
}
export declare type Shape<T, B> = {
    [k in keyof T]: B;
};
export declare type ObjMap<A> = {
    [k: string]: A;
};
