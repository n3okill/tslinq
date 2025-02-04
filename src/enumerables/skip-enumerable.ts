import { validateArgumentOrThrow } from "../helpers/helpers.ts";
import { AsyncEnumerable, Enumerable } from "../internal.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";

class SkipEnumerable<T> extends Enumerable<T> {
  readonly #_count: number;

  constructor(source: Enumerable<T>, count: number) {
    super(source);
    this.#_count = count;
  }
  override [Symbol.iterator](): Iterator<T> {
    if (Array.isArray((this._source as Enumerable<T>).enumeratorSource)) {
      const arr = (this._source as Enumerable<T>).enumeratorSource as Array<T>;
      const length = arr.length;
      let i = this.#_count;
      return {
        next: () => {
          if (i < length) {
            return { done: false, value: arr[i++] };
          }
          return { done: true, value: undefined };
        },
      };
    }
    const iterator = (this._source as Enumerable<T>).iterator();
    let count = this.#_count;
    while (count > 0 && !iterator.next().done) count--;
    return {
      next: () => {
        if (count <= 0) {
          return iterator.next();
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function skip<T>(
  enumerable: Enumerable<T>,
  count: number,
): IEnumerable<T> {
  validateArgumentOrThrow(count, "count", "number");
  if (count <= 0) {
    return enumerable;
  }
  return new SkipEnumerable(enumerable, count);
}

class SkipAsyncEnumerable<T> extends AsyncEnumerable<T> {
  readonly #_count: number;
  constructor(source: AsyncEnumerable<T>, count: number) {
    super(source);
    this.#_count = count;
  }
  override [Symbol.asyncIterator](): AsyncIterator<T> {
    const iterator = (this._source as AsyncEnumerable<T>).iterator();
    let count = this.#_count;
    let _state = 0;
    return {
      next: async () => {
        switch (_state) {
          case 0:
            while (count > 0 && !(await iterator.next()).done) count--;
            _state = 1;
          // eslint-disable-next-line no-fallthrough
          case 1:
            if (count <= 0) {
              return await iterator.next();
            }

            _state = -1;
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function skipAsync<T>(
  enumerable: AsyncEnumerable<T>,
  count: number,
): IAsyncEnumerable<T> {
  validateArgumentOrThrow(count, "count", "number");
  if (count <= 0) {
    return enumerable;
  }
  return new SkipAsyncEnumerable(enumerable, count);
}
