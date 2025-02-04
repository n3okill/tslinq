import { AsyncEnumerable, Enumerable } from "../internal.ts";
import {
  EqualityComparer,
  EqualityComparerAsync,
} from "../comparer/equality-comparer.ts";
import { isUndefined } from "../helpers/utils.ts";

class DistinctEnumerable<T> extends Enumerable<T> {
  readonly #_comparer?: EqualityComparer<T>;

  constructor(source: Enumerable<T>, comparer?: EqualityComparer<T>) {
    super(source);
    this.#_comparer = comparer;
  }
  override [Symbol.iterator](): Iterator<T> {
    const iterator = (this._source as Enumerable<T>).iterator();
    const exists = new Set<T>();
    let current;
    if (
      isUndefined(this.#_comparer) ||
      this.#_comparer === EqualityComparer.default
    ) {
      return {
        next: () => {
          current = iterator.next();
          while (current.done !== true) {
            if (!exists.has(current.value)) {
              exists.add(current.value);
              return current;
            }
            current = iterator.next();
          }
          return current;
        },
      };
    } else {
      return {
        next: () => {
          current = iterator.next();
          loop1: while (current.done !== true) {
            for (const item of exists) {
              if (this.#_comparer?.equals(item, current.value)) {
                current = iterator.next();
                continue loop1;
              }
            }
            exists.add(current.value);
            return current;
          }
          return current;
        },
      };
    }
  }
}

export function distinct<T>(
  enumerable: Enumerable<T>,
  comparer?: EqualityComparer<T>,
): Enumerable<T> {
  return new DistinctEnumerable(enumerable, comparer);
}

class DistinctAsyncEnumerable<T> extends AsyncEnumerable<T> {
  readonly #_comparer?: EqualityComparerAsync<T> | EqualityComparer<T>;

  constructor(
    source: AsyncEnumerable<T>,
    comparer?: EqualityComparerAsync<T> | EqualityComparer<T>,
  ) {
    super(source);
    this.#_comparer = comparer;
  }
  override [Symbol.asyncIterator](): AsyncIterator<T> {
    const iterator = (this._source as AsyncEnumerable<T>).iterator();
    const exists = new Set<T>();
    let current;
    if (
      isUndefined(this.#_comparer) ||
      this.#_comparer === EqualityComparer.default ||
      this.#_comparer === EqualityComparerAsync.default
    ) {
      return {
        next: async () => {
          current = await iterator.next();
          while (current.done !== true) {
            if (!exists.has(current.value)) {
              exists.add(current.value);
              return current;
            }
            current = await iterator.next();
          }
          return current;
        },
      };
    } else {
      return {
        next: async () => {
          current = await iterator.next();
          loop1: while (current.done !== true) {
            for (const item of exists) {
              if (await this.#_comparer?.equals(item, current.value)) {
                current = await iterator.next();
                continue loop1;
              }
            }
            exists.add(current.value);
            return current;
          }
          return current;
        },
      };
    }
  }
}

export function distinctAsync<T>(
  enumerable: AsyncEnumerable<T>,
  comparer?: EqualityComparerAsync<T> | EqualityComparer<T>,
): AsyncEnumerable<T> {
  return new DistinctAsyncEnumerable(enumerable, comparer);
}
