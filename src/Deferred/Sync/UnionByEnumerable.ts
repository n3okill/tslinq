import { Enumerable, Interfaces, Types } from "../../internal";

export class UnionByEnumerable<T, TKey> extends Enumerable<T> {
  constructor(
    first: Enumerable<T>,
    private readonly _second: Iterable<TKey>,
    private readonly _keySelector: Types.TKeySelector<T, TKey>,
    private readonly _comparer: Interfaces.IEqualityComparer<TKey>,
  ) {
    super(first);
  }
  override [Symbol.iterator](): Iterator<T> {
    return this._Union();
  }

  private *_Union() {
    const returned = new Set<TKey>();
    yield* this._UnionAux(this._source[Symbol.iterator](), returned);
    yield* this._UnionAux(this._second[Symbol.iterator](), returned);
  }

  private *_UnionAux(iterator: Iterator<T | TKey>, returned: Set<TKey>) {
    let current = iterator.next();
    loop1: while (current.done !== true) {
      const iteratorSet = returned[Symbol.iterator]();
      let currentSet = iteratorSet.next();
      const key = this._keySelector(current.value as T);
      while (currentSet.done !== true) {
        if (this._comparer.Equals(currentSet.value, key)) {
          current = iterator.next();
          continue loop1;
        }
        currentSet = iteratorSet.next();
      }
      returned.add(key);
      yield current.value as T;
      current = iterator.next();
    }
  }
}
