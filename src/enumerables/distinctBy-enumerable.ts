import { AsyncEnumerable, Enumerable } from "../internal.ts";
import {
  EqualityComparer,
  EqualityComparerAsync,
} from "../comparer/equality-comparer.ts";
import type { TKeySelector, TKeySelectorAsync } from "../types/selectors.ts";
import type { AllEqualityComparer } from "../types/other.ts";
import { validateArgumentOrThrow } from "../helpers/helpers.ts";
import { isUndefined } from "../helpers/utils.ts";

class DistinctByEnumerable<T, TKey> extends Enumerable<T> {
  readonly #_keySelector: TKeySelector<T, TKey>;
  readonly #_comparer?: EqualityComparer<TKey>;

  constructor(
    source: Enumerable<T>,
    keySelector: TKeySelector<T, TKey>,
    comparer?: EqualityComparer<TKey>,
  ) {
    super(source);
    this.#_keySelector = keySelector;
    this.#_comparer = comparer;
  }
  override [Symbol.iterator](): Iterator<T> {
    const iterator = (this._source as Enumerable<T>).iterator();
    const exists = new Set<TKey>();
    let current;
    if (
      isUndefined(this.#_comparer) ||
      this.#_comparer === EqualityComparer.default
    ) {
      return {
        next: () => {
          current = iterator.next();
          while (current.done !== true) {
            const key = this.#_keySelector(current.value);
            if (!exists.has(key)) {
              exists.add(key);
              return current;
            }
            current = iterator.next();
          }
          return {
            value: undefined,
            done: true,
          };
        },
      };
    } else {
      return {
        next: () => {
          current = iterator.next();
          loop1: while (current.done !== true) {
            const key = this.#_keySelector(current.value);
            for (const item of exists) {
              if (this.#_comparer?.equals(item, key)) {
                current = iterator.next();
                continue loop1;
              }
            }
            exists.add(key);
            return current;
          }
          return {
            value: undefined,
            done: true,
          };
        },
      };
    }
  }
}

export function distinctBy<T, TKey>(
  enumerable: Enumerable<T>,
  keySelector: TKeySelector<T, TKey>,
  comparer?: EqualityComparer<TKey>,
): Enumerable<T> {
  validateArgumentOrThrow(keySelector, "keySelector", "function");
  return new DistinctByEnumerable(enumerable, keySelector, comparer);
}

class DistinctByAsyncEnumerable<T, TKey> extends AsyncEnumerable<T> {
  readonly #_keySelector: TKeySelectorAsync<T, TKey>;
  readonly #_comparer: AllEqualityComparer<TKey>;

  constructor(
    source: AsyncEnumerable<T>,
    keySelector: TKeySelectorAsync<T, TKey>,
    comparer: AllEqualityComparer<TKey>,
  ) {
    super(source);
    this.#_keySelector = keySelector;
    this.#_comparer = comparer;
  }
  override [Symbol.asyncIterator](): AsyncIterator<T> {
    const iterator = (this._source as AsyncEnumerable<T>).iterator();
    const exists = new Set<TKey>();
    let current;
    if (
      isUndefined(this.#_comparer) ||
      this.#_comparer === EqualityComparerAsync.default ||
      this.#_comparer === EqualityComparer.default
    ) {
      return {
        next: async () => {
          current = await iterator.next();
          while (current.done !== true) {
            const key = await this.#_keySelector(current.value);
            if (!exists.has(key)) {
              exists.add(key);
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
            const key = await this.#_keySelector(current.value);
            for (const item of exists) {
              if (await this.#_comparer?.equals(item, key)) {
                current = await iterator.next();
                continue loop1;
              }
            }
            exists.add(key);
            return current;
          }
          return current;
        },
      };
    }
  }
}

export function distinctByAsync<T, TKey>(
  enumerable: AsyncEnumerable<T>,
  keySelector: TKeySelectorAsync<T, TKey>,
  comparer: AllEqualityComparer<TKey> = EqualityComparerAsync.default,
): AsyncEnumerable<T> {
  validateArgumentOrThrow(keySelector, "keySelector", "function");
  return new DistinctByAsyncEnumerable(enumerable, keySelector, comparer);
}
