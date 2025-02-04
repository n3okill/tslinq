import { AsyncEnumerable, Enumerable } from "../internal.ts";
import {
  EqualityComparer,
  EqualityComparerAsync,
} from "../comparer/equality-comparer.ts";
import type { AllIterable } from "../types/other.ts";
import { isIterable } from "../helpers/utils.ts";
import { validateIterableOrThrow } from "../helpers/helpers.ts";

class ExclusiveEnumerable<T> extends Enumerable<T> {
  readonly #_second: Iterable<T>;
  readonly #_comparer: EqualityComparer<T>;

  constructor(
    souce: Enumerable<T>,
    second: Iterable<T>,
    comparer: EqualityComparer<T>,
  ) {
    super(souce);
    this.#_second = second;
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
              const iteratorSecond = this.#_second[Symbol.iterator]();
              let exists = false;
              let currentSecond = iteratorSecond.next();
              while (currentSecond.done !== true) {
                if (
                  this.#_comparer.equals(current.value, currentSecond.value)
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
              const iteratorSecond = (this._source as Enumerable<T>).iterator();
              let exists = false;
              let currentSecond = iteratorSecond.next();
              while (currentSecond.done !== true) {
                if (
                  this.#_comparer.equals(current.value, currentSecond.value)
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

export function exclusive<T>(
  enumerable: Enumerable<T>,
  second: Iterable<T>,
  comparer: EqualityComparer<T> = EqualityComparer.default,
): Enumerable<T> {
  validateIterableOrThrow(second, "second");
  return new ExclusiveEnumerable(enumerable, second, comparer);
}

class ExclusiveAsyncEnumerable<T> extends AsyncEnumerable<T> {
  readonly #_second: AllIterable<T>;
  readonly #_comparer: EqualityComparerAsync<T>;

  constructor(
    souce: AsyncEnumerable<T>,
    second: AllIterable<T>,
    comparer: EqualityComparerAsync<T>,
  ) {
    super(souce);
    this.#_second = second;
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
              const iteratorSecond = isIterable(this.#_second)
                ? this.#_second[Symbol.iterator]()
                : this.#_second[Symbol.asyncIterator]();
              let exists = false;
              let currentSecond = await iteratorSecond.next();
              while (currentSecond.done !== true) {
                if (
                  await this.#_comparer.equals(
                    current.value,
                    currentSecond.value,
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
              const iteratorSecond = (
                this._source as AsyncEnumerable<T>
              ).enumeratorSource[Symbol.asyncIterator]();
              let exists = false;
              let currentSecond = await iteratorSecond.next();
              while (currentSecond.done !== true) {
                if (
                  await this.#_comparer.equals(
                    current.value,
                    currentSecond.value,
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

export function exclusiveAsync<T>(
  enumerable: AsyncEnumerable<T>,
  second: AllIterable<T>,
  comparer: EqualityComparerAsync<T> = EqualityComparerAsync.default,
): AsyncEnumerable<T> {
  validateIterableOrThrow(second, "second", true);
  return new ExclusiveAsyncEnumerable(enumerable, second, comparer);
}
