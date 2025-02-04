import { validateArgumentOrThrow } from "../helpers/helpers.ts";
import { AsyncEnumerable, Enumerable } from "../internal.ts";
import type { TParamPromise } from "../types/other.ts";

class TakeWhileEnumerable<T> extends Enumerable<T> {
  readonly #_predicate: (element: T, index: number) => boolean;

  constructor(
    source: Enumerable<T>,
    predicate: (element: T, index: number) => boolean,
  ) {
    super(source);
    this.#_predicate = predicate;
  }
  override [Symbol.iterator](): Iterator<T> {
    const iterator = (this._source as Enumerable<T>).iterator();
    let current;
    let index = 0;
    return {
      next: () => {
        current = iterator.next();
        if (
          current.done === true ||
          !this.#_predicate(current.value, index++)
        ) {
          return { done: true, value: undefined };
        }
        return current;
      },
    };
  }
}

export function takeWhile<T>(
  enumerable: Enumerable<T>,
  predicate: (element: T, index: number) => boolean,
): Enumerable<T> {
  validateArgumentOrThrow(predicate, "predicate", "function");
  return new TakeWhileEnumerable(enumerable, predicate);
}

class TakeWhileAsyncEnumerable<T> extends AsyncEnumerable<T> {
  readonly #_predicate: (element: T, index: number) => TParamPromise<boolean>;

  constructor(
    source: AsyncEnumerable<T>,
    predicate: (element: T, index: number) => TParamPromise<boolean>,
  ) {
    super(source);
    this.#_predicate = predicate;
  }
  override [Symbol.asyncIterator](): AsyncIterator<T> {
    const iterator = (this._source as AsyncEnumerable<T>).iterator();
    let current;
    let index = 0;
    return {
      next: async () => {
        current = await iterator.next();
        if (
          current.done === true ||
          !(await this.#_predicate(current.value, index++))
        ) {
          return { done: true, value: undefined };
        }
        return current;
      },
    };
  }
}

export function takeWhileAsync<T>(
  enumerable: AsyncEnumerable<T>,
  predicate: (element: T, index: number) => TParamPromise<boolean>,
): AsyncEnumerable<T> {
  validateArgumentOrThrow(predicate, "predicate", "function");
  return new TakeWhileAsyncEnumerable(enumerable, predicate);
}
