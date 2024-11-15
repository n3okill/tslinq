import { Enumerable, Interfaces, Types } from "../../internal";

export class ExceptByEnumerable<T, TKey> extends Enumerable<T> {
  constructor(
    source: Enumerable<T>,
    private readonly _second: Iterable<TKey>,
    private readonly _keySelector: Types.TKeySelector<T, TKey>,
    private readonly _comparer: Interfaces.IEqualityComparer<TKey>,
  ) {
    super(source);
  }
  override [Symbol.iterator](): Iterator<T> {
    return this._ExceptBy();
  }
  private *_ExceptBy() {
    const exists = new Set(this._second);
    const iterator = this._source[Symbol.iterator]();
    let current = iterator.next();
    loop1: while (current.done !== true) {
      const iteratorSet = exists[Symbol.iterator]();
      let currentSet = iteratorSet.next();
      const key = this._keySelector(current.value);
      while (currentSet.done !== true) {
        if (this._comparer.Equals(currentSet.value, key)) {
          current = iterator.next();
          continue loop1;
        }
        currentSet = iteratorSet.next();
      }
      exists.add(key);
      yield current.value;
      current = iterator.next();
    }
  }
}
