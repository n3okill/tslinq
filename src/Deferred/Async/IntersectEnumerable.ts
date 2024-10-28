import { EnumerableAsync, Interfaces, Helpers } from "../../internal";

export class IntersectEnumerable<T> extends EnumerableAsync<T> {
  private readonly _second: AsyncIterable<T>;
  constructor(
    souce: EnumerableAsync<T>,
    second: AsyncIterable<T> | Iterable<T>,
    private readonly _comparer: Interfaces.IEqualityComparer<T>,
  ) {
    super(souce);
    this._second = Helpers.asAsyncIterable(second);
  }
  override [Symbol.asyncIterator](): AsyncIterator<T> {
    return this._Intersect();
  }

  private async *_Intersect() {
    const exist = new Set<T>();
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
      while (currentSet.done !== true) {
        if (this._comparer.Equals(current.value, currentSet.value)) {
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
