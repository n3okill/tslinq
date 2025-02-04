import { InvalidArgumentException } from "../exceptions/InvalidArgumentException.ts";
import { OutOfRangeException } from "../exceptions/OutOfRangeException.ts";
import { validateArgumentOrThrow } from "../helpers/helpers.ts";
import { AsyncEnumerable, Enumerable } from "../internal.ts";

class RangeEnumerable<T> extends Enumerable<T> {
  readonly #_isString: boolean;
  readonly #_begin: number;
  readonly #_startElement: T;
  readonly #_count: number;

  constructor(startElement: T, count: number) {
    super([] as unknown as Iterable<T>);
    this.#_startElement = startElement;
    this.#_count = count;
    this.#_isString = typeof this.#_startElement === "string";
    this.#_begin = this.#_isString
      ? (this.#_startElement as string).charCodeAt(0)
      : (this.#_startElement as number);
  }
  override [Symbol.iterator](): Iterator<T> {
    let length = this.#_count;
    let begin = this.#_begin - 1;
    return {
      next: () => {
        if (length > 0) {
          length--;
          begin++;
          return {
            done: false,
            value: (this.#_isString ? String.fromCharCode(begin) : begin) as T,
          };
        }
        return { value: undefined, done: true };
      },
    };
  }
}

export function range<T>(startElement: T, count: number) {
  if (typeof startElement !== "string" && typeof startElement !== "number") {
    throw new InvalidArgumentException(
      `'startElement' is invalid, it must be a 'string' or 'number'`,
    );
  }
  validateArgumentOrThrow(count, "count", "number");
  if (count < 0) {
    throw new OutOfRangeException("count");
  }
  return new RangeEnumerable(startElement, count);
}

class RangeAsyncEnumerable<T> extends AsyncEnumerable<T> {
  readonly #_isString: boolean;
  readonly #_begin: number;
  readonly #_startElement: T;
  readonly #_count: number;

  constructor(startElement: T, count: number) {
    super([] as unknown as AsyncIterable<T>);
    this.#_startElement = startElement;
    this.#_count = count;
    this.#_isString = typeof this.#_startElement === "string";
    this.#_begin = this.#_isString
      ? (this.#_startElement as string).charCodeAt(0)
      : (this.#_startElement as number);
  }
  override [Symbol.asyncIterator](): AsyncIterator<T> {
    let length = this.#_count;
    let begin = this.#_begin - 1;
    return {
      next: async () => {
        if (length > 0) {
          length--;
          begin++;
          return {
            done: false,
            value: (this.#_isString ? String.fromCharCode(begin) : begin) as T,
          };
        }
        return { value: undefined, done: true };
      },
    };
  }
}

export function rangeAsync<T>(startElement: T, count: number) {
  if (typeof startElement !== "string" && typeof startElement !== "number") {
    throw new InvalidArgumentException(
      `'startElement' is invalid, it must be a 'string' or 'number'`,
    );
  }
  validateArgumentOrThrow(count, "count", "number");
  if (count < 0) {
    throw new OutOfRangeException("count");
  }
  return new RangeAsyncEnumerable(startElement, count);
}
