import { AsyncEnumerable } from "../../async-enumerable.ts";
import { Comparer } from "../../comparer/comparer.ts";
import type { IAsyncEnumerable } from "../../types/async-enumerable.interface.ts";
import type { IOrderedAsyncEnumerable } from "../../types/order.ts";
import type { TKeySelectorAsync } from "../../types/selectors.ts";
import { Enumerable } from "../../enumerable.ts";
import { validateArgumentOrThrow } from "../../helpers/helpers.ts";

abstract class OrderedAsyncEnumerable<TElement>
  extends AsyncEnumerable<TElement>
  implements IOrderedAsyncEnumerable<TElement>
{
  protected sortedMap = (
    buffer: Array<TElement>,
    minIdx?: number,
    maxIdx?: number,
  ): Promise<Uint32Array> =>
    this.getEnumerableSorter().sort(buffer, buffer.length, minIdx, maxIdx);

  abstract getEnumerableSorter(
    next?: EnumerableSorterAsync<TElement>,
  ): EnumerableSorterAsync<TElement>;
  abstract getComparer(
    childComparer?: CachingComparerAsync<TElement>,
  ): CachingComparerAsync<TElement>;

  createOrderdEnumerable<TKey>(
    keySelector: TKeySelectorAsync<TElement, TKey>,
    comparer?: Comparer<TKey>,
    descending = false,
  ): IOrderedAsyncEnumerable<TElement> {
    return new OrderedAsyncEnumerableKey<TElement, TKey>(
      this._source as IOrderedAsyncEnumerable<TElement>,
      keySelector,
      comparer,
      descending,
      this,
    );
  }

  public thenBy<TKey>(
    keySelector: TKeySelectorAsync<TElement, TKey>,
    comparer?: Comparer<TKey>,
  ): IOrderedAsyncEnumerable<TElement> {
    validateArgumentOrThrow(keySelector, "keySelector", "function");
    return this.createOrderdEnumerable(keySelector, comparer, false);
  }

  public thenByDescending<TKey>(
    keySelector: TKeySelectorAsync<TElement, TKey>,
    comparer?: Comparer<TKey>,
  ): IOrderedAsyncEnumerable<TElement> {
    validateArgumentOrThrow(keySelector, "keySelector", "function");
    return this.createOrderdEnumerable(keySelector, comparer, true);
  }
}

export class OrderedAsyncEnumerableKey<
  T,
  TKey,
> extends OrderedAsyncEnumerable<T> {
  #_buffer?: Array<T>;
  #_map?: Uint32Array;
  readonly #_keySelector: TKeySelectorAsync<T, TKey>;
  readonly #_comparer: Comparer<TKey> = Comparer.default;
  readonly #_descending: boolean = false;
  readonly #_parent?: OrderedAsyncEnumerable<T>;

  constructor(
    source: IAsyncEnumerable<T>,
    keySelector: TKeySelectorAsync<T, TKey>,
    comparer: Comparer<TKey> = Comparer.default,
    descending = false,
    parent?: OrderedAsyncEnumerable<T>,
  ) {
    super(source);
    this.#_keySelector = keySelector;
    this.#_comparer = comparer;
    this.#_descending = descending;
    this.#_parent = parent;
  }

  override getEnumerableSorter(
    next?: EnumerableSorterAsync<T>,
  ): EnumerableSorterAsync<T> {
    let sorter = new EnumerableSorterAsyncKey<T, TKey>(
      this.#_keySelector,
      this.#_comparer,
      this.#_descending,
      next,
    ) as EnumerableSorterAsync<T>;
    if (typeof this.#_parent !== "undefined") {
      sorter = this.#_parent.getEnumerableSorter(sorter);
    }
    return sorter;
  }

  override getComparer(childComparer?: CachingComparerAsync<T>) {
    const cmp =
      typeof childComparer === "undefined"
        ? new CachingComparerKeyAsync<T, TKey>(
            this.#_keySelector,
            this.#_comparer,
            this.#_descending,
          )
        : new CachingComparerWithChildAsync<T, TKey>(
            this.#_keySelector,
            this.#_comparer,
            this.#_descending,
            childComparer,
          );
    return typeof this.#_parent !== "undefined"
      ? this.#_parent.getComparer(cmp)
      : cmp;
  }

  override [Symbol.asyncIterator](): AsyncIterator<T> {
    let _state = 0;
    let iterator: ArrayIterator<number>;
    return {
      next: async () => {
        switch (_state) {
          case 0:
            this.#_buffer ??= await this.createBuffer();
            if (this.#_buffer.length === 0) {
              _state = -1;
              return { done: true, value: undefined };
            }
            this.#_map = await this.sortedMap(this.#_buffer);
            _state = 1;
            iterator = this.#_map[Symbol.iterator]();
          // eslint-disable-next-line no-fallthrough
          case 1: {
            const current = iterator.next();
            if (current.done !== true) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              return { done: false, value: this.#_buffer![current.value] };
            }
            _state = -1;
          }
        }
        return { done: true, value: undefined };
      },
    };
  }

  private async createBuffer(): Promise<Array<T>> {
    const buffer = [];
    for await (const item of this._source) {
      buffer.push(item);
    }
    return buffer;
  }
}

/// <summary>An ordered enumerable used by Order/OrderDescending for Ts that are bitwise indistinguishable for any considered equal 'number'.</summary>
export class ImplicitlyStableOrderedAsyncEnumerable<
  T,
> extends OrderedAsyncEnumerable<T> {
  #_buffer?: Array<T>;
  readonly #_descending: boolean;
  readonly #_comparer: Comparer<T>;

  constructor(
    source: IAsyncEnumerable<T>,
    descending = false,
    comparer: Comparer<T>,
  ) {
    super(source);
    this.#_descending = descending;
    this.#_comparer = comparer;
  }

  override getComparer(
    childComparer?: CachingComparerAsync<T> | undefined,
  ): CachingComparerAsync<T> {
    return typeof childComparer === "undefined"
      ? new CachingComparerKeyAsync<T, T>(
          EnumerableSorterAsync.identityFunc,
          this.#_comparer,
          this.#_descending,
        )
      : new CachingComparerWithChildAsync<T, T>(
          EnumerableSorterAsync.identityFunc,
          this.#_comparer,
          this.#_descending,
          childComparer,
        );
  }

  override getEnumerableSorter(
    next?: EnumerableSorterAsync<T> | undefined,
  ): EnumerableSorterAsync<T> {
    return new EnumerableSorterAsyncKey<T, T>(
      EnumerableSorterAsync.identityFunc,
      this.#_comparer,
      this.#_descending,
      next,
    );
  }

  override [Symbol.asyncIterator](): AsyncIterator<T> {
    let _state = 0;
    let iterator: ArrayIterator<T>;
    return {
      next: async () => {
        switch (_state) {
          case 0:
            this.#_buffer ??= await this.createBuffer();
            if (this.#_buffer.length === 0) {
              _state = -1;
              return { done: true, value: undefined };
            } else {
              this.#_buffer.sort((a, b) =>
                this.#_descending
                  ? this.#_comparer.compare(b, a)
                  : this.#_comparer.compare(a, b),
              );
            }
            _state = 1;
            iterator = this.#_buffer[Symbol.iterator]();
          // eslint-disable-next-line no-fallthrough
          case 1: {
            const current = iterator.next();
            if (current.done !== true) {
              return { done: false, value: current.value };
            }
            _state = -1;
          }
        }
        return { done: true, value: undefined };
      },
    };
  }

  private async createBuffer(): Promise<Array<T>> {
    const buffer = [];
    for await (const item of this._source) {
      buffer.push(item);
    }
    return buffer;
  }
}

// A comparer that chains comparisons, and pushes through the last element found to be
// lower or higher (depending on use), so as to represent the sort of comparisons
// done by orderBy().thenBy() combinations.
abstract class CachingComparerAsync<T> {
  abstract compare(element: T, cacheLower: boolean): Promise<number>;
  abstract setElement(element: T): Promise<void>;
}

class CachingComparerKeyAsync<T, TKey> extends CachingComparerAsync<T> {
  protected _lastKey?: TKey;
  readonly #_keySelector: TKeySelectorAsync<T, TKey>;
  readonly #_comparer: Comparer<TKey>;
  readonly #_descending: boolean;

  constructor(
    keySelector: TKeySelectorAsync<T, TKey>,
    comparer: Comparer<TKey>,
    descending: boolean,
  ) {
    super();
    this.#_keySelector = keySelector;
    this.#_comparer = comparer;
    this.#_descending = descending;
  }

  get keySelector(): TKeySelectorAsync<T, TKey> {
    return this.#_keySelector;
  }

  get comparer(): Comparer<TKey> {
    return this.#_comparer;
  }

  get descending(): boolean {
    return this.#_descending;
  }

  override async compare(element: T, cacheLower: boolean): Promise<number> {
    const key = await this.#_keySelector(element);
    const cmp = this.#_descending
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.#_comparer.compare(this._lastKey!, key)
      : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.#_comparer.compare(key, this._lastKey!);
    if (cacheLower === cmp < 0) {
      this._lastKey = key;
    }
    return cmp;
  }

  override async setElement(element: T): Promise<void> {
    this._lastKey = await this.#_keySelector(element);
  }
}

class CachingComparerWithChildAsync<T, TKey> extends CachingComparerKeyAsync<
  T,
  TKey
> {
  readonly #_child: CachingComparerAsync<T>;

  constructor(
    keySelector: TKeySelectorAsync<T, TKey>,
    comparer: Comparer<TKey>,
    descending: boolean,
    child: CachingComparerAsync<T>,
  ) {
    super(keySelector, comparer, descending);
    this.#_child = child;
  }

  override async compare(element: T, cacheLower: boolean): Promise<number> {
    const key = await this.keySelector(element);
    const cmp = this.descending
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.comparer.compare(this._lastKey!, key)
      : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.comparer.compare(key, this._lastKey!);
    if (cmp === 0) {
      return this.#_child.compare(element, cacheLower);
    }
    if (cacheLower === cmp < 0) {
      this._lastKey = key;
      await this.#_child.setElement(element);
    }
    return cmp;
  }

  override async setElement(element: T): Promise<void> {
    await super.setElement(element);
    await this.#_child.setElement(element);
  }
}

export abstract class EnumerableSorterAsync<T> {
  static identityFunc = <T>(e: T) => e;
  abstract computeKeys(elements: Array<T>, count: number): Promise<void>;
  abstract compareAnyKeys(index1: number, index2: number): number;
  async computeMap(elements: Array<T>, count: number): Promise<Uint32Array> {
    await this.computeKeys(elements, count);
    const map = new Uint32Array(Enumerable.range(0, count));
    return map;
  }

  async sort(
    elements: Array<T>,
    count: number,
    minIdx?: number,
    maxIdx?: number,
  ): Promise<Uint32Array> {
    const map = await this.computeMap(elements, count);
    if (typeof minIdx === "number" && typeof maxIdx === "number") {
      await this.partialQuickSort(map, 0, count - 1, minIdx, maxIdx);
    } else {
      this.quickSort(map);
    }
    return map;
  }

  async elementAt(elements: Array<T>, count: number, idx: number): Promise<T> {
    const map = await this.computeMap(elements, count);
    return idx === 0
      ? elements[await this.min(map, count)]
      : elements[await this.quickSelect(map, count - 1, idx)];
  }
  protected abstract quickSort(map: Uint32Array): void;

  // Sorts the k elements between minIdx and maxIdx without sorting all elements
  // Time complexity: O(n + k log k) best and average case. O(n^2) worse case.
  protected abstract partialQuickSort(
    map: Uint32Array,
    left: number,
    right: number,
    minIdx: number,
    maxIdx: number,
  ): Promise<void>;

  // Finds the element that would be at idx if the collection was sorted.
  // Time complexity: O(n) best and average case. O(n^2) worse case.
  protected abstract quickSelect(
    map: Uint32Array,
    right: number,
    idx: number,
  ): Promise<number>;

  protected abstract min(map: Uint32Array, count: number): Promise<number>;
}

class EnumerableSorterAsyncKey<
  TElement,
  TKey,
> extends EnumerableSorterAsync<TElement> {
  #_keys: Array<TKey> = [];
  readonly #_keySelector: TKeySelectorAsync<TElement, TKey>;
  readonly #_comparer: Comparer<TKey> = Comparer.default;
  readonly #_descending: boolean = false;
  readonly #_next?: EnumerableSorterAsync<TElement>;

  constructor(
    keySelector: TKeySelectorAsync<TElement, TKey>,
    comparer: Comparer<TKey> = Comparer.default,
    descending = false,
    next?: EnumerableSorterAsync<TElement>,
  ) {
    super();
    this.#_keySelector = keySelector;
    this.#_comparer = comparer;
    this.#_descending = descending;
    this.#_next = next;
  }

  private compareKeys(index1: number, index2: number): number {
    return index1 === index2 ? 0 : this.compareAnyKeys(index1, index2);
  }

  override async computeKeys(
    elements: Array<TElement>,
    count: number,
  ): Promise<void> {
    if (this.#_keySelector === EnumerableSorterAsyncKey.identityFunc) {
      // The key selector is our known identity function, which means we don't
      // need to invoke the key selector for every element.  Further, we can just
      // use the original array as the keys (even if count is smaller, as the additional
      // values will just be ignored).
      this.#_keys = elements as unknown as Array<TKey>;
    } else {
      this.#_keys = await Promise.all(
        Array.from(
          { length: count },
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          async (v, i) => await this.#_keySelector(elements.at(i)!),
        ),
      );
      /*const keys = new Array<TKey>(count);
            for (let i = 0; i < count; i++) {
                keys[i] = await this.#_keySelector(elements.at(i)!);
            }
            this.#_keys = keys;*/
    }
    await this.#_next?.computeKeys(elements, count);
  }

  override compareAnyKeys(index1: number, index2: number): number {
    const keys = this.#_keys;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const c = this.#_comparer.compare(keys.at(index1)!, keys.at(index2)!);
    if (c === 0) {
      if (typeof this.#_next === "undefined") {
        return index1 - index2; // ensure stability of sort
      }
      return this.#_next.compareAnyKeys(index1, index2);
    }
    // -c will result in a negative value for int.MinValue (-int.MinValue == int.MinValue).
    // Flipping keys earlier is more likely to trigger something strange in a comparer,
    // particularly as it comes to the sort being stable.
    return this.#_descending !== c > 0 ? 1 : -1;
  }

  private compareAnyKeys_DefaultComparer_NoNext_Ascending(
    index1: number,
    index2: number,
  ): number {
    const c = this.#_comparer.compare(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.#_keys.at(index1)!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.#_keys.at(index2)!,
    );
    return c === 0 ? index1 - index2 : c; // ensure stability of sort
  }

  private compareAnyKeys_DefaultComparer_NoNext_Descending(
    index1: number,
    index2: number,
  ): number {
    const c = this.#_comparer.compare(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.#_keys.at(index2)!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.#_keys.at(index1)!,
    );
    return c === 0 ? index1 - index2 : c; // ensure stability of sort
  }

  override async quickSort(keys: Uint32Array): Promise<void> {
    let comparer;

    if (!this.#_next && this.#_comparer === Comparer.default) {
      if (!this.#_descending) {
        comparer = this.compareAnyKeys_DefaultComparer_NoNext_Ascending;
      } else {
        comparer = this.compareAnyKeys_DefaultComparer_NoNext_Descending;
      }
    } else {
      comparer = this.compareAnyKeys;
    }
    keys.sort(comparer.bind(this));
  }

  // Sorts the k elements between minIdx and maxIdx without sorting all elements
  // Time complexity: O(n + k log k) best and average case. O(n^2) worse case.
  protected override async partialQuickSort(
    map: Uint32Array,
    left: number,
    right: number,
    minIdx: number,
    maxIdx: number,
  ): Promise<void> {
    do {
      let i = left;
      let j = right;
      const x = map[i + ((j - i) >> 1)];
      const mapLength = map.length;
      do {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        while (i < mapLength && this.compareKeys(x, map.at(i)!) > 0) {
          i++;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        while (j >= 0 && this.compareKeys(x, map.at(j)!) < 0) {
          j--;
        }

        if (i > j) {
          break;
        }

        if (i < j) {
          // eslint-disable-next-line security/detect-object-injection
          [map[i], map[j]] = [map[j], map[i]];
        }

        i++;
        j--;
      } while (i <= j);

      if (minIdx >= i) {
        left = i + 1;
      } else if (maxIdx <= j) {
        right = j - 1;
      }

      if (j - left <= right - i) {
        if (left < j) {
          await this.partialQuickSort(map, left, j, minIdx, maxIdx);
        }

        left = i;
      } else {
        if (i < right) {
          await this.partialQuickSort(map, i, right, minIdx, maxIdx);
        }

        right = j;
      }
    } while (left < right);
  }

  // Finds the element that would be at idx if the collection was sorted.
  // Time complexity: O(n) best and average case. O(n^2) worse case.
  override async quickSelect(
    map: Uint32Array,
    right: number,
    idx: number,
  ): Promise<number> {
    let left = 0;
    do {
      let i = left;
      let j = right;
      const x = map[i + ((j - i) >> 1)];
      do {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        while (i < map.length && this.compareKeys(x, map.at(i)!) > 0) {
          i++;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        while (j >= 0 && this.compareKeys(x, map.at(j)!) < 0) {
          j--;
        }
        if (i > j) {
          break;
        }
        if (i < j) {
          // eslint-disable-next-line security/detect-object-injection
          [map[i], map[j]] = [map[j], map[i]];
        }
        i++;
        j--;
      } while (i <= j);
      if (i <= idx) {
        left = i + 1;
      } else {
        right = j - 1;
      }

      if (j - left <= right - i) {
        if (left < j) {
          right = j;
        }

        left = i;
      } else {
        if (i < right) {
          left = i;
        }

        right = j;
      }
    } while (left < right);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return map.at(idx)!;
  }

  override async min(map: Uint32Array, count: number) {
    let index = 0;
    for (let i = 1; i < count; i++) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (this.compareKeys(map.at(i)!, map.at(index)!) < 0) {
        index = i;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return map.at(index)!;
  }
}
