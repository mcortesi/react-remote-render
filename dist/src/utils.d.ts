import { Shape, ObjMap } from './types/base';
export declare function fromPairs<A>(arr: Array<[string, A]>): ObjMap<A>;
export declare function mapObject<A, B, C extends ObjMap<A>>(obj: C, mapper: (val: A, key: keyof C) => B): Shape<C, B>;
