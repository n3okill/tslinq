import { EnumerableAsync, Interfaces, Types } from "../../internal";

export class OrderEnumerable<T, TKey> extends EnumerableAsync<T> implements Interfaces.IAsyncOrderedEnumerable<T> {
  constructor(
    source: EnumerableAsync<T>,
    private readonly _keySelector: Types.TKeySelectorAsync<T, TKey>,
    private readonly _comparer: Interfaces.ICompareTo<TKey>,
    private readonly _isDescending: boolean = false,
    private readonly _parent?: OrderEnumerable<T, TKey>,
  ) {
    super(source);
  }
  override [Symbol.asyncIterator](): AsyncIterator<T> {
    return this._Order();
  }

  private async *_Order() {
    yield* await this._GetEnumerableSorter().Sort(this._parent ? this._parent : this._source);
  }

  private _GetEnumerableSorter(_next?: EnumerableSorter<T, TKey>): EnumerableSorter<T, TKey> {
    let sorter = new EnumerableSorter(this._keySelector, this._comparer, this._isDescending, _next);
    if (this._parent) {
      sorter = this._parent._GetEnumerableSorter(sorter);
    }
    return sorter;
  }

  public thenBy<TKey>(
    keySelector: Types.TKeySelectorAsync<T, TKey>,
    comparer: Interfaces.ICompareTo<TKey> = new Interfaces.DefaultCompareTo<TKey>(),
  ): Interfaces.IAsyncOrderedEnumerable<T> {
    return new OrderEnumerable(this, keySelector, comparer, false, this as unknown as OrderEnumerable<T, TKey>);
  }

  public thenByDescending<TKey>(
    keySelector: Types.TKeySelectorAsync<T, TKey>,
    comparer: Interfaces.ICompareTo<TKey> = new Interfaces.DefaultCompareTo<TKey>(),
  ): Interfaces.IAsyncOrderedEnumerable<T> {
    return new OrderEnumerable(this, keySelector, comparer, true, this as unknown as OrderEnumerable<T, TKey>);
  }
}

type SorterKey<T, TKey> = { index: number; key: TKey; element: T };

class EnumerableSorter<T, TKey> {
  private _keys?: Array<SorterKey<T, TKey>>;
  constructor(
    private readonly _keySelector: Types.TKeySelectorAsync<T, TKey>,
    private readonly _comparer: Interfaces.ICompareTo<TKey>,
    private readonly _isDescending: boolean = false,
    private readonly _next?: EnumerableSorter<T, TKey>,
  ) {}

  public async ComputeKeys(elements: AsyncIterable<T>): Promise<void> {
    this._keys = [];
    const iterator = elements[Symbol.asyncIterator]();
    let current = await iterator.next();
    let index = 0;
    while (current.done !== true) {
      this._keys.push({ index: index++, key: await this._keySelector(current.value), element: current.value });
      current = await iterator.next();
    }
    await this._next?.ComputeKeys(elements);
  }

  public CompareKeys(index1: number, index2: number): number {
    const c = this._comparer.CompareTo(
      (this._keys as Array<SorterKey<T, TKey>>)[index1].key,
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
  public async Sort(elements: AsyncIterable<T>): Promise<Array<T>> {
    await this.ComputeKeys(elements);
    const result = (this._keys as Array<SorterKey<T, TKey>>).sort((a, b) => this.CompareKeys(a.index, b.index));
    return result.map((item) => item.element);
  }
}
