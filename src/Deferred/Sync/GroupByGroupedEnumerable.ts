import { Enumerable, Interfaces, Types } from "../../internal";

class Grouping<TKey, T> extends Enumerable<T> implements Interfaces.IGrouping<TKey, T> {
  constructor(
    source: Iterable<T>,
    public Key: TKey,
  ) {
    super(source);
  }
}

export class GroupByGroupedEnumerable<T, TKey, TElement> extends Enumerable<Grouping<TKey, TElement>> {
  constructor(
    first: Enumerable<T>,
    private readonly _keySelector: Types.TKeySelector<T, TKey>,
    private readonly _elementSelector: Types.TElementSelector<T, TElement>,
    private readonly _comparer: Interfaces.IEqualityComparer<TKey>,
  ) {
    super(first as unknown as Enumerable<Grouping<TKey, TElement>>);
  }
  override [Symbol.iterator](): Iterator<Grouping<TKey, TElement>> {
    return this._GroupByGrouped();
  }

  private *_GroupByGrouped(): Generator<Grouping<TKey, TElement>> {
    const iterator = this._getKeyedMap()[Symbol.iterator]();
    let current = iterator.next();
    while (current.done !== true) {
      yield new Grouping(current.value[1], current.value[0]);
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

  public override toMap<K, V>(): Map<K, Array<V>> {
    const result = new Map<K, Array<V>>();
    for (const value of this) {
      result.set(value.Key as unknown as K, Array.from(value) as unknown as Array<V>);
    }
    return result;
  }

  public override toArray<K>(): Array<K> {
    return Array.from(this.toMap()) as unknown as Array<K>;
  }
}
