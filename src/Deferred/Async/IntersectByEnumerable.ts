import { EnumerableAsync, Helpers, Types } from "../../internal";

export class IntersectByEnumerable<T, TKey> extends EnumerableAsync<T> {
  private readonly _second: AsyncIterable<TKey>;
  constructor(
    souce: EnumerableAsync<T>,
    second: AsyncIterable<TKey> | Iterable<TKey>,
    private readonly _keySelector: Types.TKeySelectorAsync<T, TKey>,
    private readonly _comparer: Types.TIAsyncEqualityComparer<TKey>,
  ) {
    super(souce);
    this._second = Helpers.asAsyncIterable(second);
  }
  override [Symbol.asyncIterator](): AsyncIterator<T> {
    return this._Intersect();
  }

  private async *_Intersect() {
    const exist = new Set<TKey>();
    const iteratorSecond = this._second[Symbol.asyncIterator]();
    let currentSecond = await iteratorSecond.next();
    while (currentSecond.done !== true) {
      exist.add(currentSecond.value);
      currentSecond = await iteratorSecond.next();
    }
    const iterator = this._source[Symbol.asyncIterator]();
    let current = await iterator.next();
    loop1: while (current.done !== true) {
      const iteratorSet = exist[Symbol.iterator]();
      let currentSet = iteratorSet.next();
      const key = await this._keySelector(current.value);
      while (currentSet.done !== true) {
        if (this._comparer.Equals(key, currentSet.value)) {
          yield current.value;
          exist.delete(currentSet.value);
          current = await iterator.next();
          continue loop1;
        }
        currentSet = iteratorSet.next();
      }
      current = await iterator.next();
    }
  }
}
