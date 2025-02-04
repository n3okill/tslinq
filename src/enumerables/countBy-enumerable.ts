import { AsyncEnumerable, Enumerable } from "../internal.ts";
import {
  EqualityComparer,
  EqualityComparerAsync,
} from "../comparer/equality-comparer.ts";
import type { TKeySelector, TKeySelectorAsync } from "../types/selectors.ts";
import { validateArgumentOrThrow } from "../helpers/helpers.ts";

class CountByEnumerable<T, TKey> extends Enumerable<[TKey, number]> {
  readonly #_keySelector: TKeySelector<T, TKey>;
  readonly #_comparer: EqualityComparer<TKey>;

  constructor(
    source: Enumerable<T>,
    keySelector: TKeySelector<T, TKey>,
    comparer: EqualityComparer<TKey>,
  ) {
    super(source as unknown as Enumerable<[TKey, number]>);
    this.#_keySelector = keySelector;
    this.#_comparer = comparer;
  }
  override [Symbol.iterator](): Iterator<[TKey, number]> {
    return this._CountBy();
  }
  private *_CountBy() {
    const counter = new Map();
    const iterator = (this._source as Enumerable<T>).iterator();
    let current = iterator.next();
    loop1: while (current.done !== true) {
      const key = this.#_keySelector(current.value);
      for (const [k, value] of counter) {
        if (this.#_comparer.equals(key, k)) {
          counter.set(k, value + 1);
          current = iterator.next();
          continue loop1;
        }
      }
      counter.set(key, 1);
      current = iterator.next();
    }
    yield* counter;
  }
}

export function countBy<T, TKey>(
  enumerable: Enumerable<T>,
  keySelector: TKeySelector<T, TKey> = (x) => x as unknown as TKey,
  comparer: EqualityComparer<TKey> = EqualityComparer.default,
) {
  validateArgumentOrThrow(keySelector, "keySelector", "function");
  return new CountByEnumerable<T, TKey>(enumerable, keySelector, comparer);
}

class CountByAsyncEnumerable<T, TKey> extends AsyncEnumerable<[TKey, number]> {
  readonly #_keySelector: TKeySelectorAsync<T, TKey> | TKeySelector<T, TKey>;
  readonly #_comparer: EqualityComparer<TKey> | EqualityComparerAsync<TKey>;

  constructor(
    source: AsyncEnumerable<T>,
    keySelector: TKeySelectorAsync<T, TKey> | TKeySelector<T, TKey>,
    comparer: EqualityComparer<TKey> | EqualityComparerAsync<TKey>,
  ) {
    super(source as unknown as AsyncEnumerable<[TKey, number]>);
    this.#_keySelector = keySelector;
    this.#_comparer = comparer;
  }
  override [Symbol.asyncIterator](): AsyncIterator<[TKey, number]> {
    return this._CountBy();
  }
  private async *_CountBy() {
    const counter = new Map();
    const iterator = (this._source as AsyncEnumerable<T>).iterator();
    let current = await iterator.next();
    loop1: while (current.done !== true) {
      const key = await this.#_keySelector(current.value);
      for (const [k, value] of counter) {
        if (await this.#_comparer.equals(key, k)) {
          counter.set(k, value + 1);
          current = await iterator.next();
          continue loop1;
        }
      }
      counter.set(key, 1);
      current = await iterator.next();
    }
    yield* counter;
  }
}

export function countByAsync<T, TKey>(
  enumerable: AsyncEnumerable<T>,
  keySelector: TKeySelector<T, TKey> | TKeySelectorAsync<T, TKey> = (x) =>
    x as unknown as TKey,
  comparer:
    | EqualityComparer<TKey>
    | EqualityComparerAsync<TKey> = EqualityComparerAsync.default,
) {
  validateArgumentOrThrow(keySelector, "keySelector", "function");
  return new CountByAsyncEnumerable<T, TKey>(enumerable, keySelector, comparer);
}
