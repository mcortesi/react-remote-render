import { fromPairs, mapObject } from '../src/utils';

describe('fromPairs()', () => {
  it('should create object from pairs', () => {
    expect(fromPairs<any>([['a', 1], ['b', 'hola']])).toEqual({
      a: 1,
      b: 'hola'
    });
  });
});

describe('mapObject', () => {
  it('should map object values', () => {
    expect(mapObject({ a: 1, b: 2 }, (x: number) => 2 * x)).toEqual({
      a: 2,
      b: 4
    });
  });
});
