import { validateArgumentOrThrow } from "../helpers/helpers.ts";
import { AsyncEnumerable, Enumerable } from "../internal.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";
import type { TParamPromise } from "../types/other.ts";

class SkipWhileEnumerable<T> extends Enumerable<T> {
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
    let current = iterator.next();
    let index = 0;
    let sendFirst = true;
    while (current.done !== true && this.#_predicate(current.value, index++)) {
      current = iterator.next();
    }
    if (current.done === true) {
      return {
        next: () => ({ done: true, value: undefined }),
      };
    }
    return {
      next: () => {
        if (sendFirst) {
          sendFirst = false;
          return current;
        }
        return iterator.next();
      },
    };
  }
}

export function skipWhile<T>(
  enumerable: Enumerable<T>,
  predicate: (element: T, index: number) => boolean,
): IEnumerable<T> {
  validateArgumentOrThrow(predicate, "predicate", "function");
  return new SkipWhileEnumerable(enumerable, predicate);
}

class SkipWhileAsyncEnumerable<T> extends AsyncEnumerable<T> {
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
    let sendFirst = true;
    let _state = 0;
    return {
      next: async () => {
        current = await iterator.next();
        switch (_state) {
          case 0:
            while (
              current.done !== true &&
              (await this.#_predicate(current.value, index++))
            ) {
              current = await iterator.next();
            }
            if (current.done === true) {
              _state = -1;
              return { done: true, value: undefined };
            }
            _state = 1;
          // eslint-disable-next-line no-fallthrough
          case 1:
            if (sendFirst) {
              sendFirst = false;
              return current;
            }
            if (current.done === true) {
              _state = -1;
            }
            return current;
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function skipWhileAsync<T>(
  enumerable: AsyncEnumerable<T>,
  predicate: (element: T, index: number) => TParamPromise<boolean>,
): IAsyncEnumerable<T> {
  validateArgumentOrThrow(predicate, "predicate", "function");
  return new SkipWhileAsyncEnumerable(enumerable, predicate);
}
