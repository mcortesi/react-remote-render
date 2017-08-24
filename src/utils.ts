import { Shape, ObjMap } from './types/base';

export function fromPairs<A>(arr: Array<[string, A]>): ObjMap<A> {
  return arr.reduce((acc, [key, val]) => {
    acc[key] = val;
    return acc;
  }, {});
}

export function mapObject<A, B, C extends ObjMap<A>>(obj: C, mapper: (val: A, key: string) => B ): Shape<C,B> {
  return fromPairs(Object.keys(obj).map(key =>
    [key, mapper(obj[key] as A, key)] as [string, B]
  )) as any;
}