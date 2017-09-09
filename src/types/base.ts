export interface Props {
  [name: string]: any;
}

export type Shape<T, B> = { [k in keyof T]: B };

export type ObjMap<A> = {
  [k: string]: A;
};
