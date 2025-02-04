import { OutOfRangeException } from "../exceptions/OutOfRangeException.ts";
import { validateArgumentOrThrow } from "../helpers/helpers.ts";
import { AsyncEnumerable, Enumerable } from "../internal.ts";

class RepeatEnumerable<T> extends Enumerable<T> {
  readonly #_element: T;
  readonly #_count: number;

  constructor(element: T, count: number) {
    super([]);
    this.#_element = element;
    this.#_count = count;
  }
  override [Symbol.iterator](): Iterator<T> {
    let length = this.#_count;
    return {
      next: () => {
        if (length > 0) {
          length--;
          return { value: this.#_element, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }
}

export function repeat<T>(element: T, count: number) {
  validateArgumentOrThrow(count, "count", "number");
  if (count < 0) {
    throw new OutOfRangeException("count");
  }
  return new RepeatEnumerable(element, count);
}

class RepeatAsyncEnumerable<T> extends AsyncEnumerable<T> {
  readonly #_element: T;
  readonly #_count: number;

  constructor(element: T, count: number) {
    super([] as unknown as AsyncIterable<T>);
    this.#_element = element;
    this.#_count = count;
  }
  override [Symbol.asyncIterator](): AsyncIterator<T> {
    let length = this.#_count;
    return {
      next: async () => {
        if (length > 0) {
          length--;
          return { value: this.#_element, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }
}

export function repeatAsync<T>(element: T, count: number) {
  validateArgumentOrThrow(count, "count", "number");
  if (count < 0) {
    throw new OutOfRangeException("count");
  }
  return new RepeatAsyncEnumerable(element, count);
}
