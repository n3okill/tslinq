import { getAsyncIterable } from "../helpers/async-iterable.ts";
import { validateArgumentOrThrow } from "../helpers/helpers.ts";
import { AsyncEnumerable, Enumerable } from "../internal.ts";

class TakeEnumerable<T> extends Enumerable<T> {
  readonly #_count: number;

  constructor(source: Enumerable<T>, count: number) {
    super(source);
    this.#_count = count;
  }

  override [Symbol.iterator](): Iterator<T> {
    const iterator = (this._source as Enumerable<T>).iterator();
    let index = this.#_count;
    return {
      next: () => {
        if (index-- > 0) {
          return iterator.next();
        } else {
          return { done: true, value: undefined };
        }
      },
    };
  }
}

export function take<T>(
  enumerable: Enumerable<T>,
  count: number,
): Enumerable<T> {
  validateArgumentOrThrow(count, "count", "number");
  if (count <= 0) {
    return new Enumerable<T>([]);
  }
  return new TakeEnumerable(enumerable, count);
}

class TakeAsyncEnumerable<T> extends AsyncEnumerable<T> {
  readonly #_count: number;
  constructor(source: AsyncEnumerable<T>, count: number) {
    super(source);
    this.#_count = count;
  }

  override [Symbol.asyncIterator](): AsyncIterator<T> {
    const iterator = (this._source as AsyncEnumerable<T>).iterator();
    let index = this.#_count;
    return {
      next: async () => {
        if (index-- > 0) {
          return iterator.next();
        } else {
          return { done: true, value: undefined };
        }
      },
    };
  }
}

export function takeAsync<T>(
  enumerable: AsyncEnumerable<T>,
  count: number,
): AsyncEnumerable<T> {
  validateArgumentOrThrow(count, "count", "number");
  if (count <= 0) {
    return new AsyncEnumerable<T>(getAsyncIterable([]));
  }
  return new TakeAsyncEnumerable(enumerable, count);
}
