import { Enumerable, Interfaces } from "../../internal";

export class DistinctEnumerable<T> extends Enumerable<T> {
  constructor(
    source: Enumerable<T>,
    private readonly _comparer: Interfaces.IEqualityComparer<T>,
  ) {
    super(source);
  }
  override [Symbol.iterator](): Iterator<T> {
    return this._Distinct();
  }

  private *_Distinct() {
    const exists = new Set<T>();
    const iterator = this._source[Symbol.iterator]();
    let current = iterator.next();
    loop1: while (current.done !== true) {
      const iteratorSet = exists[Symbol.iterator]();
      let currentSet = iteratorSet.next();
      while (currentSet.done !== true) {
        if (this._comparer.Equals(currentSet.value, current.value)) {
          current = iterator.next();
          continue loop1;
        }
        currentSet = iteratorSet.next();
      }
      exists.add(current.value);
      yield current.value;
      current = iterator.next();
    }
  }
}
