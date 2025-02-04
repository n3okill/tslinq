import { AsyncEnumerable, Enumerable } from "../internal.ts";

class IndexEnumerable<T> extends Enumerable<[number, T]> {
  constructor(source: Enumerable<T>) {
    super(source as unknown as Enumerable<[number, T]>);
  }
  override [Symbol.iterator](): Iterator<[number, T]> {
    const iterator = (this._source as Enumerable<T>).iterator();
    let current;
    let index = 0;
    return {
      next: () => {
        current = iterator.next();
        if (current.done !== true) {
          return { done: false, value: [index++, current.value] };
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function index<T>(enumerable: Enumerable<T>) {
  return new IndexEnumerable(enumerable);
}

class IndexAsyncEnumerable<T> extends AsyncEnumerable<[number, T]> {
  constructor(source: AsyncEnumerable<T>) {
    super(source as unknown as AsyncEnumerable<[number, T]>);
  }
  override [Symbol.asyncIterator](): AsyncIterator<[number, T]> {
    const iterator = (this._source as AsyncEnumerable<T>).iterator();
    let current;
    let index = 0;
    return {
      next: async () => {
        current = await iterator.next();
        if (current.done !== true) {
          return { done: false, value: [index++, current.value] };
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function indexAsync<T>(enumerable: AsyncEnumerable<T>) {
  return new IndexAsyncEnumerable(enumerable);
}
