import { Enumerable } from "../../internal.ts";
import { Comparer } from "../../comparer/comparer.ts";
import type { IEnumerable } from "../../types/enumerable.interface.ts";
import type { IOrderedEnumerable } from "../../types/order.ts";
import type { TKeySelector } from "../../types/selectors.ts";
import { validateArgumentOrThrow } from "../../helpers/helpers.ts";

abstract class OrderedEnumerable<TElement>
  extends Enumerable<TElement>
  implements IOrderedEnumerable<TElement>
{
  protected sortedMap = (
    buffer: Array<TElement>,
    minIdx?: number,
    maxIdx?: number,
  ): Uint32Array =>
    this.getEnumerableSorter().sort(buffer, buffer.length, minIdx, maxIdx);

  abstract getEnumerableSorter(
    next?: EnumerableSorter<TElement>,
  ): EnumerableSorter<TElement>;
  abstract getComparer(
    childComparer?: CachingComparer<TElement>,
  ): CachingComparer<TElement>;

  createOrderdEnumerable<TKey>(
    keySelector: TKeySelector<TElement, TKey>,
    comparer?: Comparer<TKey>,
    descending = false,
  ): IOrderedEnumerable<TElement> {
    return new OrderedEnumerableKey<TElement, TKey>(
      this._source as IOrderedEnumerable<TElement>,
      keySelector,
      comparer,
      descending,
      this,
    );
  }

  public tryGetLast(predicate: (x: TElement) => boolean): TElement | undefined {
    const comparer: CachingComparer<TElement> = this.getComparer();
    const iterator = this.iterator();
    let value: TElement;
    let current;
    do {
      current = iterator.next();
      if (current.done === true) {
        return undefined;
      }
      value = current.value;
    } while (!predicate(value));
    comparer.setElement(value);
    current = iterator.next();
    while (current.done !== true) {
      const x = current.value;
      if (predicate(x) && comparer.compare(x, false) >= 0) {
        value = x;
      }
      current = iterator.next();
    }
    return value;
  }

  public thenBy<TKey>(
    keySelector: TKeySelector<TElement, TKey>,
    comparer?: Comparer<TKey>,
  ): IOrderedEnumerable<TElement> {
    validateArgumentOrThrow(keySelector, "keySelector", "function");
    return this.createOrderdEnumerable(keySelector, comparer, false);
  }

  public thenByDescending<TKey>(
    keySelector: TKeySelector<TElement, TKey>,
    comparer?: Comparer<TKey>,
  ): IOrderedEnumerable<TElement> {
    validateArgumentOrThrow(keySelector, "keySelector", "function");
    return this.createOrderdEnumerable(keySelector, comparer, true);
  }
}

export class OrderedEnumerableKey<T, TKey> extends OrderedEnumerable<T> {
  #_buffer?: Array<T>;
  #_map?: Uint32Array;
  readonly #_keySelector: TKeySelector<T, TKey>;
  readonly #_comparer: Comparer<TKey> = Comparer.default;
  readonly #_descending: boolean = false;
  readonly #_parent?: OrderedEnumerable<T>;

  constructor(
    source: IEnumerable<T>,
    keySelector: TKeySelector<T, TKey>,
    comparer: Comparer<TKey> = Comparer.default,
    descending = false,
    parent?: OrderedEnumerable<T>,
  ) {
    super(source);
    this.#_keySelector = keySelector;
    this.#_comparer = comparer;
    this.#_descending = descending;
    this.#_parent = parent;
  }

  override getEnumerableSorter(
    next?: EnumerableSorter<T>,
  ): EnumerableSorter<T> {
    let sorter = new EnumerableSorterKey<T, TKey>(
      this.#_keySelector,
      this.#_comparer,
      this.#_descending,
      next,
    ) as EnumerableSorter<T>;
    if (typeof this.#_parent !== "undefined") {
      sorter = this.#_parent.getEnumerableSorter(sorter);
    }
    return sorter;
  }

  override getComparer(childComparer?: CachingComparer<T>) {
    const cmp =
      typeof childComparer === "undefined"
        ? new CachingComparerKey<T, TKey>(
            this.#_keySelector,
            this.#_comparer,
            this.#_descending,
          )
        : new CachingComparerWithChild<T, TKey>(
            this.#_keySelector,
            this.#_comparer,
            this.#_descending,
            childComparer,
          );
    return typeof this.#_parent !== "undefined"
      ? this.#_parent.getComparer(cmp)
      : cmp;
  }

  override [Symbol.iterator](): Iterator<T> {
    this.#_buffer ??= Array.from(this._source);
    if (this.#_buffer.length !== 0) {
      this.#_map ??= this.sortedMap(this.#_buffer);
    } else {
      return {
        next: () => {
          return { done: true, value: undefined };
        },
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const iterator = this.#_map![Symbol.iterator]();
    let current;
    return {
      next: () => {
        current = iterator.next();
        if (current.done !== true) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return { done: false, value: this.#_buffer![current.value] };
        }
        return { done: true, value: undefined };
      },
    };
  }
}

/// <summary>An ordered enumerable used by Order/OrderDescending for Ts that are bitwise indistinguishable for any considered equal 'number'.</summary>
export class ImplicitlyStableOrderedEnumerable<T> extends OrderedEnumerable<T> {
  #_buffer?: Array<T>;
  readonly #_descending: boolean;
  readonly #_comparer: Comparer<T>;

  constructor(
    source: IEnumerable<T>,
    descending = false,
    comparer: Comparer<T>,
  ) {
    super(source);
    this.#_descending = descending;
    this.#_comparer = comparer;
  }

  override getComparer(
    childComparer?: CachingComparer<T> | undefined,
  ): CachingComparer<T> {
    return typeof childComparer === "undefined"
      ? new CachingComparerKey<T, T>(
          EnumerableSorter.identityFunc,
          this.#_comparer,
          this.#_descending,
        )
      : new CachingComparerWithChild<T, T>(
          EnumerableSorter.identityFunc,
          this.#_comparer,
          this.#_descending,
          childComparer,
        );
  }

  override getEnumerableSorter(
    next?: EnumerableSorter<T> | undefined,
  ): EnumerableSorter<T> {
    return new EnumerableSorterKey<T, T>(
      EnumerableSorter.identityFunc,
      this.#_comparer,
      this.#_descending,
      next,
    );
  }

  override [Symbol.iterator](): Iterator<T> {
    if (typeof this.#_buffer === "undefined") {
      this.#_buffer = Array.from(this._source);
      if (this.#_buffer.length !== 0) {
        this.#_buffer.sort((a, b) =>
          this.#_descending
            ? this.#_comparer.compare(b, a)
            : this.#_comparer.compare(a, b),
        );
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const iterator = this.#_buffer![Symbol.iterator]();
    return {
      next: () => iterator.next(),
    };
  }
}

// A comparer that chains comparisons, and pushes through the last element found to be
// lower or higher (depending on use), so as to represent the sort of comparisons
// done by orderBy().thenBy() combinations.
abstract class CachingComparer<T> {
  abstract compare(element: T, cacheLower: boolean): number;
  abstract setElement(element: T): void;
}

class CachingComparerKey<T, TKey> extends CachingComparer<T> {
  protected _lastKey?: TKey;
  readonly #_keySelector: (x: T) => TKey;
  readonly #_comparer: Comparer<TKey>;
  readonly #_descending: boolean;

  constructor(
    keySelector: (x: T) => TKey,
    comparer: Comparer<TKey>,
    descending: boolean,
  ) {
    super();
    this.#_keySelector = keySelector;
    this.#_comparer = comparer;
    this.#_descending = descending;
  }

  get keySelector(): (x: T) => TKey {
    return this.#_keySelector;
  }

  get comparer(): Comparer<TKey> {
    return this.#_comparer;
  }

  get descending(): boolean {
    return this.#_descending;
  }

  override compare(element: T, cacheLower: boolean): number {
    const key = this.#_keySelector(element);
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

  override setElement(element: T): void {
    this._lastKey = this.#_keySelector(element);
  }
}

class CachingComparerWithChild<T, TKey> extends CachingComparerKey<T, TKey> {
  readonly #_child: CachingComparer<T>;

  constructor(
    keySelector: (x: T) => TKey,
    comparer: Comparer<TKey>,
    descending: boolean,
    child: CachingComparer<T>,
  ) {
    super(keySelector, comparer, descending);
    this.#_child = child;
  }

  override compare(element: T, cacheLower: boolean): number {
    const key = this.keySelector(element);
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
      this.#_child.setElement(element);
    }
    return cmp;
  }

  override setElement(element: T): void {
    super.setElement(element);
    this.#_child.setElement(element);
  }
}

export abstract class EnumerableSorter<T> {
  static identityFunc = <T>(e: T) => e;
  abstract computeKeys(elements: Array<T>, count: number): void;
  abstract compareAnyKeys(index1: number, index2: number): number;
  computeMap(elements: Array<T>, count: number): Uint32Array {
    this.computeKeys(elements, count);
    const map = new Uint32Array(Enumerable.range(0, count));
    return map;
  }

  sort(
    elements: Array<T>,
    count: number,
    minIdx?: number,
    maxIdx?: number,
  ): Uint32Array {
    const map = this.computeMap(elements, count);
    if (typeof minIdx === "number" && typeof maxIdx === "number") {
      this.partialQuickSort(map, 0, count - 1, minIdx, maxIdx);
    } else {
      this.quickSort(map);
    }
    return map;
  }

  elementAt(elements: Array<T>, count: number, idx: number): T {
    const map = this.computeMap(elements, count);
    return idx === 0
      ? elements[this.min(map, count)]
      : elements[this.quickSelect(map, count - 1, idx)];
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
  ): void;

  // Finds the element that would be at idx if the collection was sorted.
  // Time complexity: O(n) best and average case. O(n^2) worse case.
  protected abstract quickSelect(
    map: Uint32Array,
    right: number,
    idx: number,
  ): number;

  protected abstract min(map: Uint32Array, count: number): number;
}

class EnumerableSorterKey<TElement, TKey> extends EnumerableSorter<TElement> {
  #_keys: Array<TKey> = [];
  readonly #_keySelector: (element: TElement) => TKey;
  readonly #_comparer: Comparer<TKey> = Comparer.default;
  readonly #_descending: boolean = false;
  readonly #_next?: EnumerableSorter<TElement>;

  constructor(
    keySelector: (element: TElement) => TKey,
    comparer: Comparer<TKey> = Comparer.default,
    descending = false,
    next?: EnumerableSorter<TElement>,
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

  override computeKeys(elements: Array<TElement>, count: number): void {
    if (this.#_keySelector === EnumerableSorterKey.identityFunc) {
      // The key selector is our known identity function, which means we don't
      // need to invoke the key selector for every element.  Further, we can just
      // use the original array as the keys (even if count is smaller, as the additional
      // values will just be ignored).
      this.#_keys = elements as unknown as Array<TKey>;
    } else {
      this.#_keys = Array.from({ length: count }, (v, i) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.#_keySelector(elements.at(i)!),
      );
    }
    this.#_next?.computeKeys(elements, count);
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

  override quickSort(keys: Uint32Array): void {
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
  protected override partialQuickSort(
    map: Uint32Array,
    left: number,
    right: number,
    minIdx: number,
    maxIdx: number,
  ): void {
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
          this.partialQuickSort(map, left, j, minIdx, maxIdx);
        }

        left = i;
      } else {
        if (i < right) {
          this.partialQuickSort(map, i, right, minIdx, maxIdx);
        }

        right = j;
      }
    } while (left < right);
  }

  // Finds the element that would be at idx if the collection was sorted.
  // Time complexity: O(n) best and average case. O(n^2) worse case.
  override quickSelect(map: Uint32Array, right: number, idx: number): number {
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

  override min(map: Uint32Array, count: number) {
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
