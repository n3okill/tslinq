import { AsyncEnumerable, Enumerable } from "../internal.ts";

class ReverseEnumerable<T> extends Enumerable<T> {
  override [Symbol.iterator](): Iterator<T> {
    const result = (this._source as Enumerable<T>).toArray();
    let length = result.length;
    return {
      next: () => {
        if (length > 0) {
          length--;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return { value: result.at(length)!, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }
}

export function reverse<T>(enumerable: Enumerable<T>): Enumerable<T> {
  return new ReverseEnumerable(enumerable);
}

class ReverseAsyncEnumerable<T> extends AsyncEnumerable<T> {
  #_result?: Array<T>;
  #_length?: number;

  override [Symbol.asyncIterator](): AsyncIterator<T> {
    this.dispose();
    return {
      next: async () => {
        if (this.#_result === undefined) {
          this.#_result = await (this._source as AsyncEnumerable<T>).toArray();
          this.#_length = this.#_result.length;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (this.#_length! > 0) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.#_length!--;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return { value: await this.#_result[this.#_length!], done: false };
        }

        return { value: undefined, done: true };
      },
    };
  }

  private dispose(): void {
    this.#_result = undefined;
    this.#_length = undefined;
  }
}

export function reverseAsync<T>(
  enumerable: AsyncEnumerable<T>,
): AsyncEnumerable<T> {
  return new ReverseAsyncEnumerable(enumerable);
}
