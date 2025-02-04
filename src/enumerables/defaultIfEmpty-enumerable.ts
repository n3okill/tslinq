import { AsyncEnumerable, Enumerable } from "../internal.ts";

class DefaultIfEmptyEnumerable<T> extends Enumerable<T> {
  readonly #_defaultValue?: T;

  constructor(source: Enumerable<T>, defaultValue?: T) {
    super(source);
    this.#_defaultValue = defaultValue;
  }
  override [Symbol.iterator](): Iterator<T> {
    let _state = 1;
    const iterator = (this._source as Enumerable<T>).iterator();
    let current;
    return {
      next: () => {
        switch (_state) {
          case 1:
            current = iterator.next();
            if (current.done !== true) {
              _state = 2;
              return current;
            } else {
              _state = 0;
              return { done: false, value: this.#_defaultValue as T };
            }
          case 2:
            return iterator.next();
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function defaultIfEmpty<T>(
  enumerable: Enumerable<T>,
  defaultValue?: T,
): Enumerable<T> {
  return new DefaultIfEmptyEnumerable(enumerable, defaultValue);
}

class DefaultIfEmptyAsyncEnumerable<T> extends AsyncEnumerable<T> {
  readonly #_defaultValue?: T;

  constructor(source: AsyncEnumerable<T>, defaultValue?: T) {
    super(source);
    this.#_defaultValue = defaultValue;
  }
  override [Symbol.asyncIterator](): AsyncIterator<T> {
    let _state = 1;
    const iterator = (this._source as AsyncEnumerable<T>).iterator();
    let current;
    return {
      next: async () => {
        switch (_state) {
          case 1:
            current = await iterator.next();
            if (current.done !== true) {
              _state = 2;
              return current;
            } else {
              _state = -1;
              return { done: false, value: this.#_defaultValue as T };
            }
          case 2:
            return iterator.next();
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function defaultIfEmptyAsync<T>(
  enumerable: AsyncEnumerable<T>,
  defaultValue?: T,
): AsyncEnumerable<T> {
  return new DefaultIfEmptyAsyncEnumerable(enumerable, defaultValue);
}
