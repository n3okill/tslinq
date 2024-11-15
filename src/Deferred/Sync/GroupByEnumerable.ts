import { Enumerable, Types, Interfaces } from "../../internal";

export class GroupByEnumerable<T, TKey, TResult, TElement> extends Enumerable<TResult> {
  constructor(
    source: Enumerable<T>,
    private _keySelector: Types.TKeySelector<T, TKey>,
    private _elementSelector: Types.TElementSelector<T, TElement>,
    private _resultSelector: Types.TResultSelector<TKey, TElement, TResult>,
    private _comparer: Interfaces.IEqualityComparer<TKey>,
  ) {
    super(source as unknown as Enumerable<TResult>);
  }

  override [Symbol.iterator](): Iterator<TResult> {
    return this._GroupBy();
  }

  private *_GroupBy() {
    const iterator = this._getKeyedMap()[Symbol.iterator]();
    let current = iterator.next();
    while (current.done !== true) {
      yield this._resultSelector(current.value[0], new Enumerable(current.value[1]));
      current = iterator.next();
    }
  }

  private _getKeyedMap(): Map<TKey, Array<TElement>> {
    const map = new Map<TKey, Array<TElement>>();
    const iterator = this._source[Symbol.iterator]() as Iterator<T>;
    let current = iterator.next();
    loop1: while (current.done !== true) {
      const key = this._keySelector(current.value);
      const iteratorMap = map[Symbol.iterator]();
      let currentMap = iteratorMap.next();
      while (currentMap.done !== true) {
        if (this._comparer.Equals(currentMap.value[0], key)) {
          currentMap.value[1].push(this._elementSelector(current.value));
          current = iterator.next();
          continue loop1;
        }
        currentMap = iteratorMap.next();
      }
      map.set(key, [this._elementSelector(current.value)]);
      current = iterator.next();
    }
    return map;
  }
}
