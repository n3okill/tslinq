import { Enumerable, Interfaces } from "../../internal";

export class IntersectEnumerable<T> extends Enumerable<T> {
  constructor(
    souce: Enumerable<T>,
    private readonly _second: Iterable<T>,
    private readonly _comparer: Interfaces.IEqualityComparer<T>,
  ) {
    super(souce);
  }
  override [Symbol.iterator](): Iterator<T> {
    return this._Intersect();
  }

  private *_Intersect() {
    const exist = new Set(this._second);
    const iterator = this._source[Symbol.iterator]();
    let current = iterator.next();
    loop1: while (current.done !== true) {
      const iteratorSet = exist[Symbol.iterator]();
      let currentSet = iteratorSet.next();
      while (currentSet.done !== true) {
        if (this._comparer.Equals(current.value, currentSet.value)) {
          exist.delete(currentSet.value);
          yield current.value;
          current = iterator.next();
          continue loop1;
        }
        currentSet = iteratorSet.next();
      }
      current = iterator.next();
    }
  }
}
