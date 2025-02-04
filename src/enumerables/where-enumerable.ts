import { validateArgumentOrThrow } from "../helpers/helpers.ts";
import { AsyncEnumerable, Enumerable } from "../internal.ts";
import type { TParamPromise } from "../types/other.ts";

class WhereEnumerable<T> extends Enumerable<T> {
  readonly #_predicate: (x: T, index: number) => boolean;

  constructor(
    source: Enumerable<T>,
    predicate: (x: T, index: number) => boolean,
  ) {
    super(source);
    this.#_predicate = predicate;
  }

  override [Symbol.iterator](): Iterator<T> {
    const iterator = (this._source as Enumerable<T>).iterator();
    let index = -1;
    let current;
    return {
      next: () => {
        current = iterator.next();
        while (current.done !== true) {
          index++;
          if (this.#_predicate(current.value, index)) {
            return current;
          }
          current = iterator.next();
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function where<T>(
  enumerable: Enumerable<T>,
  predicate: (x: T, index: number) => boolean,
): Enumerable<T> {
  validateArgumentOrThrow(predicate, "predicate", "function");
  return new WhereEnumerable(enumerable, predicate);
}

class WhereAsyncEnumerable<T> extends AsyncEnumerable<T> {
  readonly #_predicate: (x: T, index: number) => TParamPromise<boolean>;

  constructor(
    source: AsyncEnumerable<T>,
    predicate: (x: T, index: number) => TParamPromise<boolean>,
  ) {
    super(source);
    this.#_predicate = predicate;
  }

  override [Symbol.asyncIterator](): AsyncIterator<T> {
    const iterator = (this._source as AsyncEnumerable<T>).iterator();
    let index = -1;
    let current;
    return {
      next: async () => {
        current = await iterator.next();
        while (current.done !== true) {
          index++;
          if (await this.#_predicate(current.value, index)) {
            return current;
          }
          current = await iterator.next();
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function whereAsync<T>(
  enumerable: AsyncEnumerable<T>,
  predicate: (x: T, index: number) => TParamPromise<boolean>,
): AsyncEnumerable<T> {
  validateArgumentOrThrow(predicate, "predicate", "function");
  return new WhereAsyncEnumerable(enumerable, predicate);
}
