import { validateArgumentOrThrow } from "../helpers/helpers.ts";
import { Queue } from "../helpers/queue.ts";
import { AsyncEnumerable, Enumerable } from "../internal.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";

class SkipLastEnumerable<T> extends Enumerable<T> {
  readonly #_count: number;
  constructor(source: Enumerable<T>, count: number) {
    super(source);
    this.#_count = count;
  }
  override [Symbol.iterator](): Iterator<T> {
    if (Array.isArray((this._source as Enumerable<T>).enumeratorSource)) {
      const arr = (this._source as Enumerable<T>).enumeratorSource as Array<T>;
      const length = arr.length - this.#_count;
      let i = 0;
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
    const result = new Queue<T>();
    let current = iterator.next();
    do {
      if (current.done !== true) {
        result.enqueue(current.value);
        current = iterator.next();
      }
    } while (current.done !== true && result.length < this.#_count);

    return {
      next: () => {
        if (current.done !== true) {
          result.enqueue(current.value);
          current = iterator.next();
          return { value: result.dequeue() as T, done: false };
        } else {
          if (result.length > this.#_count) {
            return { value: result.dequeue(), done: false };
          }
        }
        return { value: undefined, done: true };
      },
    };
  }
}

export function skipLast<T>(
  enumerable: Enumerable<T>,
  count: number,
): IEnumerable<T> {
  validateArgumentOrThrow(count, "count", "number");
  if (count <= 0) {
    return enumerable;
  }
  return new SkipLastEnumerable(enumerable, count);
}

class SkipLastAsyncEnumerable<T> extends AsyncEnumerable<T> {
  readonly #_count: number;
  constructor(source: AsyncEnumerable<T>, count: number) {
    super(source);
    this.#_count = count;
  }
  override [Symbol.asyncIterator](): AsyncIterator<T> {
    const iterator = (this._source as AsyncEnumerable<T>).iterator();
    const result = new Queue<T>();
    let current: IteratorResult<T>;
    let _state = 0;
    return {
      next: async () => {
        switch (_state) {
          case 0:
            current = await iterator.next();
            do {
              if (current.done !== true) {
                result.enqueue(current.value);
                current = await iterator.next();
              }
            } while (current.done !== true && result.length < this.#_count);
            _state = 1;
          // eslint-disable-next-line no-fallthrough
          case 1:
            if (current.done !== true) {
              result.enqueue(current.value);
              current = await iterator.next();
              return { value: result.dequeue() as T, done: false };
            } else {
              if (result.length > this.#_count) {
                return { value: result.dequeue(), done: false };
              }
            }

            _state = -1;
        }
        return { value: undefined, done: true };
      },
    };
  }
}

export function skipLastAsync<T>(
  enumerable: AsyncEnumerable<T>,
  count: number,
): IAsyncEnumerable<T> {
  validateArgumentOrThrow(count, "count", "number");
  if (count <= 0) {
    return enumerable;
  }
  return new SkipLastAsyncEnumerable(enumerable, count);
}
