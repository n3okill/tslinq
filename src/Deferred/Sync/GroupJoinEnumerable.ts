import { Enumerable, Types, Interfaces } from "../../internal";

export class GroupJoinEnumerable<TInner, TKey, TResult, T> extends Enumerable<TResult> {
  constructor(
    source: Enumerable<T>,
    private readonly _inner: Iterable<TInner>,
    private readonly _outerKeySelector: Types.TKeySelector<T, TKey>,
    private readonly _innerKeySelector: Types.TKeySelector<TInner, TKey>,
    private readonly _resultSelector: Types.TResultSelector<TKey, TInner, TResult>,
    private readonly _comparer: Interfaces.IEqualityComparer<TKey>,
  ) {
    super(source as unknown as Enumerable<TResult>);
  }

  override [Symbol.iterator](): Iterator<TResult> {
    return this._GroupJoin();
  }

  private *_GroupJoin() {
    const map = this._getKeyedMap();
    const iterator = this._source[Symbol.iterator]();
    for (let current = iterator.next(); current.done !== true; current = iterator.next()) {
      const key = this._outerKeySelector(current.value as unknown as T);
      const v = map.get(key) as Array<TInner>;
      yield this._resultSelector(key, new Enumerable(v));
    }
  }

  private _getKeyedMap(): Map<TKey, Array<T | TInner>> {
    const map = new Map<TKey, Array<T | TInner>>();
    const iterator = this._inner[Symbol.iterator]();
    let current = iterator.next();
    loop1: while (current.done !== true) {
      const key = this._innerKeySelector(current.value);
      const iteratorMap = map[Symbol.iterator]();
      let currentMap = iteratorMap.next();
      while (currentMap.done !== true) {
        if (this._comparer.Equals(currentMap.value[0], key)) {
          currentMap.value[1].push(current.value);
          current = iterator.next();
          continue loop1;
        }
        currentMap = iteratorMap.next();
      }
      map.set(key, [current.value]);
      current = iterator.next();
    }
    return map;
  }
}
