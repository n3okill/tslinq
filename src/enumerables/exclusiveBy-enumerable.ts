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

class ExclusiveByEnumerable<T, TKey> extends Enumerable<T> {
  readonly #_second: Iterable<T>;
  readonly #_keySelector: TKeySelector<T, TKey>;
  readonly #_comparer: EqualityComparer<TKey>;

  constructor(
    souce: Enumerable<T>,
    second: Iterable<T>,
    keySelector: TKeySelector<T, TKey>,
    comparer: EqualityComparer<TKey>,
  ) {
    super(souce);
    this.#_second = second;
    this.#_keySelector = keySelector;
    this.#_comparer = comparer;
  }
  override [Symbol.iterator](): Iterator<T> {
    let iterator = (this._source as Enumerable<T>).iterator();
    let current;
    let _state = 1;
    return {
      next: () => {
        switch (_state) {
          case 1:
            current = iterator.next();
            while (current.done !== true) {
              const key = this.#_keySelector(current.value);
              const iteratorSecond = this.#_second[Symbol.iterator]();
              let exists = false;
              let currentSecond = iteratorSecond.next();
              while (currentSecond.done !== true) {
                if (
                  this.#_comparer.equals(
                    key,
                    this.#_keySelector(currentSecond.value),
                  )
                ) {
                  exists = true;
                  break;
                }
                currentSecond = iteratorSecond.next();
              }
              if (!exists) {
                return current;
              }
              current = iterator.next();
            }
            _state = 2;
            iterator = this.#_second[Symbol.iterator]();
          // eslint-disable-next-line no-fallthrough
          case 2:
            current = iterator.next();
            while (current.done !== true) {
              const key = this.#_keySelector(current.value);
              const iteratorSecond = (this._source as Enumerable<T>).iterator();
              let exists = false;
              let currentSecond = iteratorSecond.next();
              while (currentSecond.done !== true) {
                if (
                  this.#_comparer.equals(
                    key,
                    this.#_keySelector(currentSecond.value),
                  )
                ) {
                  exists = true;
                  break;
                }
                currentSecond = iteratorSecond.next();
              }
              if (!exists) {
                return current;
              }
              current = iterator.next();
            }
            _state = 0;
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function exclusiveBy<T, TKey>(
  enumerable: Enumerable<T>,
  second: Iterable<T>,
  keySelector: TKeySelector<T, TKey>,
  comparer: EqualityComparer<TKey> = EqualityComparer.default,
): Enumerable<T> {
  validateIterableOrThrow(second, "second");
  validateArgumentOrThrow(keySelector, "keySelector", "function");
  return new ExclusiveByEnumerable(enumerable, second, keySelector, comparer);
}

class ExclusiveByAsyncEnumerable<T, TKey> extends AsyncEnumerable<T> {
  readonly #_second: AllIterable<T>;
  readonly #_keySelector: TKeySelectorAsync<T, TKey>;
  readonly #_comparer: EqualityComparerAsync<TKey>;

  constructor(
    souce: AsyncEnumerable<T>,
    second: AllIterable<T>,
    keySelector: TKeySelectorAsync<T, TKey>,
    comparer: EqualityComparerAsync<TKey>,
  ) {
    super(souce);
    this.#_second = second;
    this.#_keySelector = keySelector;
    this.#_comparer = comparer;
  }
  override [Symbol.asyncIterator](): AsyncIterator<T> {
    let iterator = (this._source as AsyncEnumerable<T>).iterator();
    let current;
    let _state = 1;
    return {
      next: async () => {
        switch (_state) {
          case 1:
            current = await iterator.next();
            while (current.done !== true) {
              const key = await this.#_keySelector(current.value);
              const iteratorSecond = isIterable(this.#_second)
                ? this.#_second[Symbol.iterator]()
                : this.#_second[Symbol.asyncIterator]();
              let exists = false;
              let currentSecond = await iteratorSecond.next();
              while (currentSecond.done !== true) {
                if (
                  await this.#_comparer.equals(
                    key,
                    await this.#_keySelector(currentSecond.value),
                  )
                ) {
                  exists = true;
                  break;
                }
                currentSecond = await iteratorSecond.next();
              }
              if (!exists) {
                return current;
              }
              current = await iterator.next();
            }
            _state = 2;
            iterator = isIterable(this.#_second)
              ? (this.#_second[
                  Symbol.iterator
                ]() as unknown as AsyncIterator<T>)
              : this.#_second[Symbol.asyncIterator]();
          // eslint-disable-next-line no-fallthrough
          case 2:
            current = await iterator.next();
            while (current.done !== true) {
              const key = await this.#_keySelector(current.value);
              const iteratorSecond = (
                this._source as AsyncEnumerable<T>
              ).enumeratorSource[Symbol.asyncIterator]();
              let exists = false;
              let currentSecond = await iteratorSecond.next();
              while (currentSecond.done !== true) {
                if (
                  await this.#_comparer.equals(
                    key,
                    await this.#_keySelector(currentSecond.value),
                  )
                ) {
                  exists = true;
                  break;
                }
                currentSecond = await iteratorSecond.next();
              }
              if (!exists) {
                return current;
              }
              current = await iterator.next();
            }
            _state = 0;
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function exclusiveByAsync<T, TKey>(
  enumerable: AsyncEnumerable<T>,
  second: AllIterable<T>,
  keySelector: TKeySelectorAsync<T, TKey>,
  comparer: EqualityComparerAsync<TKey> = EqualityComparerAsync.default,
): AsyncEnumerable<T> {
  validateIterableOrThrow(second, "second", true);
  validateArgumentOrThrow(keySelector, "keySelector", "function");
  return new ExclusiveByAsyncEnumerable(
    enumerable,
    second,
    keySelector,
    comparer,
  );
}
