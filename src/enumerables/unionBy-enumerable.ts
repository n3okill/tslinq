import { AsyncEnumerable, Enumerable } from "../internal.ts";
import {
  EqualityComparer,
  EqualityComparerAsync,
} from "../comparer/equality-comparer.ts";
import type { TKeySelector, TKeySelectorAsync } from "../types/selectors.ts";
import type { AllIterable } from "../types/other.ts";
import { isIterable } from "../helpers/utils.ts";
import {
  validateArgumentOrThrow,
  validateIterableOrThrow,
} from "../helpers/helpers.ts";

class UnionByEnumerable<T, TKey> extends Enumerable<T> {
  readonly #_second: Iterable<T>;
  readonly #_keySelector: TKeySelector<T, TKey>;
  readonly #_comparer: EqualityComparer<TKey>;

  constructor(
    first: Enumerable<T>,
    second: Iterable<T>,
    keySelector: TKeySelector<T, TKey>,
    comparer: EqualityComparer<TKey>,
  ) {
    super(first);
    this.#_second = second;
    this.#_keySelector = keySelector;
    this.#_comparer = comparer;
  }

  override [Symbol.iterator](): Iterator<T> {
    let iterator = (this._source as Enumerable<T>).iterator();
    let _state = 1;
    const returned = new Set<TKey>();
    return {
      next: () => {
        switch (_state) {
          case 1: {
            const [done, value] = this.runIterator(iterator, returned);
            if (done === true) {
              _state = 2;
              iterator = this.#_second[Symbol.iterator]();
            } else {
              return { done, value };
            }
          }
          // eslint-disable-next-line no-fallthrough
          case 2: {
            const [done, value] = this.runIterator(iterator, returned);
            if (done === true) {
              _state = 0;
            } else {
              return { done, value };
            }
          }
        }
        return { done: true, value: undefined };
      },
    };
  }
  private runIterator(
    iterator: Iterator<T>,
    returned: Set<TKey>,
  ): [boolean, T] {
    let current = iterator.next();
    loop1: while (current.done !== true) {
      const key = this.#_keySelector(current.value);
      for (const item of returned) {
        if (this.#_comparer.equals(item, key)) {
          current = iterator.next();
          continue loop1;
        }
      }
      returned.add(key);
      return [false, current.value];
    }
    return [true, undefined as T];
  }
}

export function unionBy<T, TKey>(
  enumerable: Enumerable<T>,
  second: Iterable<T>,
  keySelector: TKeySelector<T, TKey>,
  comparer: EqualityComparer<TKey> = EqualityComparer.default,
): Enumerable<T> {
  validateIterableOrThrow(second, "second");
  validateArgumentOrThrow(keySelector, "keySelector", "function");
  return new UnionByEnumerable(enumerable, second, keySelector, comparer);
}

class UnionByAsyncEnumerable<T, TKey> extends AsyncEnumerable<T> {
  readonly #_second: AllIterable<T>;
  readonly #_keySelector: TKeySelectorAsync<T, TKey>;
  readonly #_comparer: EqualityComparerAsync<TKey>;

  constructor(
    first: AsyncEnumerable<T>,
    second: AllIterable<T>,
    keySelector: TKeySelectorAsync<T, TKey>,
    comparer: EqualityComparerAsync<TKey>,
  ) {
    super(first);
    this.#_second = second;
    this.#_keySelector = keySelector;
    this.#_comparer = comparer;
  }

  override [Symbol.asyncIterator](): AsyncIterator<T> {
    let iterator = (this._source as AsyncEnumerable<T>).iterator();
    let _state = 1;
    const returned = new Set<TKey>();
    return {
      next: async () => {
        switch (_state) {
          case 1: {
            const [done, value] = await this.runIterator(iterator, returned);
            if (done === true) {
              _state = 2;
              iterator = isIterable(this.#_second)
                ? (this.#_second[
                    Symbol.iterator
                  ]() as unknown as AsyncIterator<T>)
                : this.#_second[Symbol.asyncIterator]();
            } else {
              return { done, value };
            }
          }
          // eslint-disable-next-line no-fallthrough
          case 2: {
            const [done, value] = await this.runIterator(iterator, returned);
            if (done === true) {
              _state = 0;
            } else {
              return { done, value };
            }
          }
        }
        return { done: true, value: undefined };
      },
    };
  }
  private async runIterator(
    iterator: AsyncIterator<T>,
    returned: Set<TKey>,
  ): Promise<[boolean, T]> {
    let current = await iterator.next();
    loop1: while (current.done !== true) {
      const key = await this.#_keySelector(current.value);
      for (const item of returned) {
        if (await this.#_comparer.equals(item, key)) {
          current = await iterator.next();
          continue loop1;
        }
      }
      returned.add(key);
      return [false, current.value];
    }
    return [true, undefined as T];
  }
}

export function unionByAsync<T, TKey>(
  enumerable: AsyncEnumerable<T>,
  second: AllIterable<T>,
  keySelector: TKeySelectorAsync<T, TKey>,
  comparer: EqualityComparerAsync<TKey> = EqualityComparerAsync.default,
): AsyncEnumerable<T> {
  validateIterableOrThrow(second, "second", true);
  validateArgumentOrThrow(keySelector, "keySelector", "function");
  return new UnionByAsyncEnumerable(enumerable, second, keySelector, comparer);
}
