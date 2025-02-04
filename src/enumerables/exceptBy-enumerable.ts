import { AsyncEnumerable, Enumerable } from "../internal.ts";
import {
  EqualityComparer,
  EqualityComparerAsync,
} from "../comparer/equality-comparer.ts";
import type { TKeySelector, TKeySelectorAsync } from "../types/selectors.ts";
import type { AllIterable } from "../types/other.ts";
import { isUndefined } from "../helpers/utils.ts";
import {
  validateArgumentOrThrow,
  validateIterableOrThrow,
} from "../helpers/helpers.ts";

class ExceptByEnumerable<T, TKey> extends Enumerable<T> {
  readonly #_second: Iterable<TKey>;
  readonly #_keySelector: TKeySelector<T, TKey>;
  readonly #_comparer?: EqualityComparer<TKey>;

  constructor(
    source: Enumerable<T>,
    second: Iterable<TKey>,
    keySelector: TKeySelector<T, TKey>,
    comparer?: EqualityComparer<TKey>,
  ) {
    super(source);
    this.#_second = second;
    this.#_keySelector = keySelector;
    this.#_comparer = comparer;
  }
  override [Symbol.iterator](): Iterator<T> {
    const exists = new Set(this.#_second);
    const iterator = (this._source as Enumerable<T>).iterator();
    let current;
    return {
      next: () => {
        current = iterator.next();
        loop1: while (current.done !== true) {
          const key = this.#_keySelector(current.value);
          if (typeof this.#_comparer === "undefined") {
            if (exists.has(key)) {
              current = iterator.next();
              continue loop1;
            }
          } else {
            for (const value of exists) {
              if (this.#_comparer.equals(value, key)) {
                current = iterator.next();
                continue loop1;
              }
            }
          }
          exists.add(key);
          return current;
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function exceptBy<T, TKey>(
  enumerable: Enumerable<T>,
  second: Iterable<TKey>,
  keySelector: TKeySelector<T, TKey>,
  comparer?: EqualityComparer<TKey>,
): Enumerable<T> {
  validateIterableOrThrow(second, "second");
  validateArgumentOrThrow(keySelector, "keySelector", "function");
  return new ExceptByEnumerable(enumerable, second, keySelector, comparer);
}

class ExceptByAsyncEnumerable<T, TKey> extends AsyncEnumerable<T> {
  private _exists?: Set<TKey>;
  readonly #_second: AllIterable<TKey>;
  readonly #_keySelector: TKeySelectorAsync<T, TKey>;
  readonly #_comparer: EqualityComparerAsync<TKey>;

  constructor(
    source: AsyncEnumerable<T>,
    second: AllIterable<TKey>,
    keySelector: TKeySelectorAsync<T, TKey>,
    comparer: EqualityComparerAsync<TKey>,
  ) {
    super(source);
    this.#_second = second;
    this.#_keySelector = keySelector;
    this.#_comparer = comparer;
  }
  override [Symbol.asyncIterator](): AsyncIterator<T> {
    const iterator = (this._source as AsyncEnumerable<T>).iterator();
    let current;
    if (this.#_comparer === EqualityComparerAsync.default) {
      return {
        next: async () => {
          if (isUndefined(this._exists)) {
            this._exists = await this._createSet();
          }
          current = await iterator.next();
          loop1: while (current.done !== true) {
            const key = await this.#_keySelector(current.value);
            if (this._exists.has(key)) {
              current = await iterator.next();
              continue loop1;
            }
            this._exists.add(key);
            return current;
          }
          this._exists = undefined;
          return current;
        },
      };
    } else {
      return {
        next: async () => {
          if (isUndefined(this._exists)) {
            this._exists = await this._createSet();
          }
          current = await iterator.next();
          loop1: while (current.done !== true) {
            const key = await this.#_keySelector(current.value);

            for (const value of this._exists) {
              if (await this.#_comparer.equals(value, key)) {
                current = await iterator.next();
                continue loop1;
              }
            }

            this._exists.add(key);
            return current;
          }
          this._exists = undefined;
          return current;
        },
      };
    }
  }

  private async _createSet(): Promise<Set<TKey>> {
    const exists = new Set<TKey>();
    for await (const item of this.#_second) {
      exists.add(item);
    }
    return exists;
  }
}

export function exceptByAsync<T, TKey>(
  enumerable: AsyncEnumerable<T>,
  second: AllIterable<TKey>,
  keySelector: TKeySelectorAsync<T, TKey>,
  comparer: EqualityComparerAsync<TKey> = EqualityComparerAsync.default,
): AsyncEnumerable<T> {
  validateIterableOrThrow(second, "second", true);
  validateArgumentOrThrow(keySelector, "keySelector", "function");
  return new ExceptByAsyncEnumerable(enumerable, second, keySelector, comparer);
}
