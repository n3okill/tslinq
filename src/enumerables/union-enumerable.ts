import { AsyncEnumerable, Enumerable } from "../internal.ts";
import {
  EqualityComparer,
  EqualityComparerAsync,
} from "../comparer/equality-comparer.ts";
import type { AllIterable } from "../types/other.ts";
import { isIterable } from "../helpers/utils.ts";
import { validateIterableOrThrow } from "../helpers/helpers.ts";

class UnionEnumerable<T> extends Enumerable<T> {
  readonly #_second: Iterable<T>;
  readonly #_comparer: EqualityComparer<T>;

  constructor(
    first: Enumerable<T>,
    second: Iterable<T>,
    comparer: EqualityComparer<T>,
  ) {
    super(first);
    this.#_second = second;
    this.#_comparer = comparer;
  }

  override [Symbol.iterator](): Iterator<T> {
    let iterator = (this._source as Enumerable<T>).iterator();
    let _state = 1;
    const returned = new Set<T>();
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
  private runIterator(iterator: Iterator<T>, returned: Set<T>): [boolean, T] {
    let current = iterator.next();
    loop1: while (current.done !== true) {
      for (const item of returned) {
        if (this.#_comparer.equals(item, current.value)) {
          current = iterator.next();
          continue loop1;
        }
      }
      returned.add(current.value);
      return [false, current.value];
    }
    return [true, undefined as T];
  }
}

export function union<T>(
  enumerable: Enumerable<T>,
  second: Iterable<T>,
  comparer: EqualityComparer<T> = EqualityComparer.default,
): Enumerable<T> {
  validateIterableOrThrow(second, "second");
  return new UnionEnumerable<T>(enumerable, second, comparer);
}

class UnionAsyncEnumerable<T> extends AsyncEnumerable<T> {
  readonly #_second: AllIterable<T>;
  readonly #_comparer: EqualityComparerAsync<T>;

  constructor(
    first: AsyncEnumerable<T>,
    second: AllIterable<T>,
    comparer: EqualityComparerAsync<T>,
  ) {
    super(first);
    this.#_second = second;
    this.#_comparer = comparer;
  }

  override [Symbol.asyncIterator](): AsyncIterator<T> {
    let iterator = (this._source as AsyncEnumerable<T>).iterator();
    let _state = 1;
    const returned = new Set<T>();
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
    returned: Set<T>,
  ): Promise<[boolean, T]> {
    let current = await iterator.next();
    loop1: while (current.done !== true) {
      for (const item of returned) {
        if (await this.#_comparer.equals(item, current.value)) {
          current = await iterator.next();
          continue loop1;
        }
      }
      returned.add(current.value);
      return [false, current.value];
    }
    return [true, undefined as T];
  }
}

export function unionAsync<T>(
  enumerable: AsyncEnumerable<T>,
  second: AllIterable<T>,
  comparer: EqualityComparerAsync<T> = EqualityComparerAsync.default,
): AsyncEnumerable<T> {
  validateIterableOrThrow(second, "second", true);
  return new UnionAsyncEnumerable<T>(enumerable, second, comparer);
}
