export const getAsyncIterable = <T>(
  obj: Iterable<T> | AsyncIterable<T>,
): AsyncIterable<T> => {
  if (
    obj &&
    typeof (obj as AsyncIterable<T>)[Symbol.asyncIterator] === "function"
  ) {
    return obj as AsyncIterable<T>;
  }
  return new AsyncIterableObj(obj as Iterable<T>);
};

class AsyncIterableObj<T> implements AsyncIterable<T> {
  readonly #_data: Iterable<T>;
  constructor(data: Iterable<T>) {
    this.#_data = data;
  }
  [Symbol.asyncIterator](): AsyncIterator<T> {
    const iterator = this.#_data[Symbol.iterator]();
    return {
      next: async () => {
        return iterator.next();
      },
    };
  }
}
