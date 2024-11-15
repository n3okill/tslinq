import { Enumerable, Interfaces, Types } from "../../internal";

export class OrderEnumerable<T, TKey> extends Enumerable<T> implements Interfaces.IOrderedEnumerable<T> {
  constructor(
    source: Enumerable<T>,
    private readonly _keySelector: Types.TKeySelector<T, TKey>,
    private readonly _comparer: Interfaces.ICompareTo<TKey>,
    private readonly _isDescending: boolean = false,
    private readonly _parent?: OrderEnumerable<T, TKey>,
  ) {
    super(source);
  }
  override [Symbol.iterator](): Iterator<T> {
    return this._Order();
  }

  private *_Order() {
    yield* this._GetEnumerableSorter().Sort(this._parent ? this._parent : this._source);
  }

  private _GetEnumerableSorter(_next?: EnumerableSorter<T, TKey>): EnumerableSorter<T, TKey> {
    let sorter = new EnumerableSorter(this._keySelector, this._comparer, this._isDescending, _next);
    if (this._parent) {
      sorter = this._parent._GetEnumerableSorter(sorter);
    }
    return sorter;
  }

  public thenBy<TKey>(
    keySelector: Types.TKeySelector<T, TKey>,
    comparer: Interfaces.ICompareTo<TKey> = new Interfaces.DefaultCompareTo<TKey>(),
  ): Interfaces.IOrderedEnumerable<T> {
    return new OrderEnumerable(this, keySelector, comparer, false, this as unknown as OrderEnumerable<T, TKey>);
  }

  public thenByDescending<TKey>(
    keySelector: Types.TKeySelector<T, TKey>,
    comparer: Interfaces.ICompareTo<TKey> = new Interfaces.DefaultCompareTo<TKey>(),
  ): Interfaces.IOrderedEnumerable<T> {
    return new OrderEnumerable(this, keySelector, comparer, true, this as unknown as OrderEnumerable<T, TKey>);
  }
}

type SorterKey<T, TKey> = { index: number; key: TKey; element: T };

class EnumerableSorter<T, TKey> {
  private _keys?: Array<SorterKey<T, TKey>>;
  constructor(
    private readonly _keySelector: Types.TKeySelector<T, TKey>,
    private readonly _comparer: Interfaces.ICompareTo<TKey>,
    private readonly _isDescending: boolean = false,
    private readonly _next?: EnumerableSorter<T, TKey>,
  ) {}

  public ComputeKeys(elements: Iterable<T>): void {
    this._keys = [];
    const iterator = elements[Symbol.iterator]();
    let current = iterator.next();
    let index = 0;
    while (current.done !== true) {
      this._keys.push({ index: index++, key: this._keySelector(current.value), element: current.value });
      current = iterator.next();
    }
    this._next?.ComputeKeys(elements);
  }

  public CompareKeys(index1: number, index2: number): number {
    const c = this._comparer.CompareTo(
      // eslint-disable-next-line security/detect-object-injection
      (this._keys as Array<SorterKey<T, TKey>>)[index1].key,
      // eslint-disable-next-line security/detect-object-injection
      (this._keys as Array<SorterKey<T, TKey>>)[index2].key,
    );
    if (c === 0) {
      if (!this._next) {
        return index1 - index2;
      }
      return this._next?.CompareKeys(index1, index2);
    }
    return this._isDescending !== c > 0 ? 1 : -1;
  }
  public Sort(elements: Iterable<T>): Array<T> {
    this.ComputeKeys(elements);
    const result = (this._keys as Array<SorterKey<T, TKey>>).sort((a, b) => this.CompareKeys(a.index, b.index));
    return result.map((item) => item.element);
  }
}
