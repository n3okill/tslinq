import { AsyncEnumerable, Enumerable } from "../internal.ts";
import {
  EqualityComparer,
  EqualityComparerAsync,
} from "../comparer/equality-comparer.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import { validateIterableOrThrow } from "../helpers/helpers.ts";

class ExceptEnumerable<T> extends Enumerable<T> {
  readonly #_second: Iterable<T>;
  readonly #_comparer: EqualityComparer<T>;

  constructor(
    source: Enumerable<T>,
    second: Iterable<T>,
    comparer: EqualityComparer<T>,
  ) {
    super(source);
    this.#_second = second;
    this.#_comparer = comparer;
  }

  override [Symbol.iterator]() {
    const exists = new Set(this.#_second);
    const iterator = (this._source as Enumerable<T>).iterator();
    let current;
    if (this.#_comparer === EqualityComparer.default) {
      return {
        next: (): IteratorResult<T> => {
          current = iterator.next();
          loop1: while (current.done !== true) {
            if (exists.has(current.value)) {
              current = iterator.next();
              continue loop1;
            }
            exists.add(current.value);
            return current;
          }
          return { done: true, value: undefined };
        },
      };
    } else {
      return {
        next: (): IteratorResult<T> => {
          current = iterator.next();
          loop1: while (current.done !== true) {
            for (const value of exists) {
              if (this.#_comparer.equals(value, current.value)) {
                current = iterator.next();
                continue loop1;
              }
            }
            exists.add(current.value);
            return current;
          }
          return { done: true, value: undefined };
        },
      };
    }
  }
}

export function except<T>(
  enumerable: Enumerable<T>,
  second: Iterable<T>,
  comparer: EqualityComparer<T> = EqualityComparer.default,
): Enumerable<T> {
  validateIterableOrThrow(second, "second");
  return new ExceptEnumerable(enumerable, second, comparer);
}

class ExceptAsyncEnumerable<T> extends AsyncEnumerable<T> {
  readonly #_second: Iterable<T> | AsyncIterable<T>;
  readonly #_comparer: EqualityComparerAsync<T> | EqualityComparer<T>;

  constructor(
    source: AsyncEnumerable<T>,
    second: Iterable<T> | AsyncIterable<T>,
    comparer: EqualityComparerAsync<T> | EqualityComparer<T>,
  ) {
    super(source);
    this.#_second = second;
    this.#_comparer = comparer;
  }

  override [Symbol.asyncIterator]() {
    return this._asyncIterator();
  }
  private async *_asyncIterator() {
    const exists = await this._createSet();
    const iterator = (this._source as AsyncEnumerable<T>).iterator();
    let current = await iterator.next();
    loop1: while (current.done !== true) {
      const iteratorSet = exists[Symbol.iterator]();
      let currentSet = iteratorSet.next();
      while (currentSet.done !== true) {
        if (await this.#_comparer.equals(currentSet.value, current.value)) {
          current = await iterator.next();
          continue loop1;
        }
        currentSet = iteratorSet.next();
      }
      exists.add(current.value);
      yield current.value;
      current = await iterator.next();
    }
  }

  private async _createSet(): Promise<Set<T>> {
    const exists = new Set<T>();
    for await (const item of this.#_second) {
      exists.add(item);
    }
    return exists;
  }
}

export function exceptAsync<T>(
  enumerable: AsyncEnumerable<T>,
  second: Iterable<T> | AsyncIterable<T>,
  comparer:
    | EqualityComparerAsync<T>
    | EqualityComparer<T> = EqualityComparerAsync.default,
): IAsyncEnumerable<T> {
  validateIterableOrThrow(second, "second", true);
  return new ExceptAsyncEnumerable(enumerable, second, comparer);
}
