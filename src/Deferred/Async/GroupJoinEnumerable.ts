import { EnumerableAsync, Types, Helpers, Enumerable } from "../../internal";
import { isAsyncFunction } from "../../utils";

export class GroupJoinEnumerable<TInner, TKey, TResult, T> extends EnumerableAsync<TResult> {
  private readonly _inner: AsyncIterable<TInner>;
  constructor(
    source: EnumerableAsync<T>,
    inner: AsyncIterable<TInner> | Iterable<TInner>,
    private readonly _outerKeySelector: Types.TKeySelectorAsync<T, TKey>,
    private readonly _innerKeySelector: Types.TKeySelectorAsync<TInner, TKey>,
    private readonly _resultSelector: Types.TResultSelectorAsync<TKey, TInner, TResult>,
    private readonly _comparer: Types.TIAsyncEqualityComparer<TKey>,
  ) {
    super(source as unknown as EnumerableAsync<TResult>);
    this._inner = Helpers.asAsyncIterable(inner);
  }

  override [Symbol.asyncIterator](): AsyncIterator<TResult> {
    return this._GroupJoin();
  }

  private async *_GroupJoin() {
    const map = await this._getKeyedMap();
    const iterator = this._source[Symbol.asyncIterator]();
    const isResultSelectorAsync = isAsyncFunction(this._resultSelector);
    let current = await iterator.next();
    while (current.done !== true) {
      const key = await this._outerKeySelector(current.value as unknown as T);
      const v = map.get(key) as Array<TInner>;
      if (isResultSelectorAsync) {
        yield await this._resultSelector(key, new EnumerableAsync(Helpers.asAsyncIterable(v)));
      } else {
        yield this._resultSelector(key, new Enumerable(v));
      }
      current = await iterator.next();
    }
  }

  private async _getKeyedMap(): Promise<Map<TKey, Array<T | TInner>>> {
    const map = new Map<TKey, Array<T | TInner>>();
    const iterator = this._inner[Symbol.asyncIterator]();
    let current = await iterator.next();
    loop1: while (current.done !== true) {
      const key = await this._innerKeySelector(current.value);
      const iteratorMap = map[Symbol.iterator]();
      let currentMap = iteratorMap.next();
      while (currentMap.done !== true) {
        if (await this._comparer.Equals(currentMap.value[0], key)) {
          currentMap.value[1].push(current.value);
          current = await iterator.next();
          continue loop1;
        }
        currentMap = iteratorMap.next();
      }
      map.set(key, [current.value]);
      current = await iterator.next();
    }
    return map;
  }
}
