import { Queue } from "../helpers/queue.ts";
import { getAsyncIterable } from "../helpers/async-iterable.ts";
import { AsyncEnumerable, Enumerable } from "../internal.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";
import { validateArgumentOrThrow } from "../helpers/helpers.ts";

class TakeLastEnumerable<T> extends Enumerable<T> {
  readonly #_count: number;
  constructor(source: Enumerable<T>, count: number) {
    super(source);
    this.#_count = count;
  }
  override [Symbol.iterator](): Iterator<T> {
    if (Array.isArray((this._source as Enumerable<T>).enumeratorSource)) {
      const arr = (this._source as Enumerable<T>).enumeratorSource as Array<T>;
      if (arr.length <= this.#_count) {
        return arr[Symbol.iterator]();
      }
      let length = arr.length - this.#_count;
      if (length < 0) {
        return {
          next: () => {
            return { done: true, value: undefined };
          },
        };
      }
      const finalLength = arr.length;
      return {
        next: () => {
          if (length < finalLength) {
            return { done: false, value: arr[length++] };
          }
          return { done: true, value: undefined };
        },
      };
    }
    const iterator = (this._source as Enumerable<T>).iterator();
    const result = new Queue<T>();
    let current;
    while ((current = iterator.next()) && current.done !== true) {
      if (result.length < this.#_count) {
        result.enqueue(current.value);
      } else {
        do {
          result.dequeue() as T;
          result.enqueue(current.value);
        } while ((current = iterator.next()) && current.done !== true);
        break;
      }
    }
    return result[Symbol.iterator]();
  }
}

export function takeLast<T>(
  enumerable: Enumerable<T>,
  count: number,
): IEnumerable<T> {
  validateArgumentOrThrow(count, "count", "number");
  if (count <= 0) {
    return new Enumerable<T>([]);
  }
  return new TakeLastEnumerable(enumerable, count);
}

class TakeLastAsyncEnumerable<T> extends AsyncEnumerable<T> {
  readonly #_count: number;
  constructor(source: AsyncEnumerable<T>, count: number) {
    super(source);
    this.#_count = count;
  }
  override [Symbol.asyncIterator](): AsyncIterator<T> {
    const iterator = (this._source as AsyncEnumerable<T>).iterator();
    const result = new Queue<T>();
    let current;
    let _state = 0;
    let iteratorResult: Iterator<T>;
    return {
      next: async () => {
        switch (_state) {
          case 0:
            while ((current = await iterator.next()) && current.done !== true) {
              if (result.length < this.#_count) {
                result.enqueue(current.value);
              } else {
                do {
                  result.dequeue() as T;
                  result.enqueue(current.value);
                } while (
                  (current = await iterator.next()) &&
                  current.done !== true
                );
                break;
              }
            }
            iteratorResult = result[Symbol.iterator]();
            _state = 1;
          // eslint-disable-next-line no-fallthrough
          case 1:
            return iteratorResult.next();
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function takeLastAsync<T>(
  enumerable: AsyncEnumerable<T>,
  count: number,
): IAsyncEnumerable<T> {
  validateArgumentOrThrow(count, "count", "number");
  if (count <= 0) {
    return new AsyncEnumerable<T>(getAsyncIterable([]));
  }
  return new TakeLastAsyncEnumerable(enumerable, count);
}
