import { AsyncEnumerable } from "../async-enumerable.ts";
import { Enumerable } from "../enumerable.ts";
import { validateIterableOrThrow } from "../helpers/helpers.ts";
import { isIterable } from "../helpers/utils.ts";
import { type IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import { type IEnumerable } from "../types/enumerable.interface.ts";

class ConcatEnumerable<T> extends Enumerable<T> {
  #_second: Iterable<T>;

  constructor(source: Enumerable<T>, second: Iterable<T>) {
    super(source);
    this.#_second = second;
  }
  override [Symbol.iterator](): Iterator<T> {
    let _state = 1;
    let _enumerator: Iterator<T> = (this._source as Enumerable<T>).iterator();
    let current;

    return {
      next: (): IteratorResult<T> => {
        switch (_state) {
          case 1:
            current = _enumerator.next();
            if (current.done !== true) {
              return current;
            }
            _enumerator = this.#_second[Symbol.iterator]();
            _state = 2;
          // eslint-disable-next-line no-fallthrough
          case 2:
            current = _enumerator.next();
            if (current.done !== true) {
              return current;
            }
            _state = 0;
            break;
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function concat<T>(
  enumerable: Enumerable<T>,
  second: Iterable<T>,
): IEnumerable<T> {
  validateIterableOrThrow(second, "second");
  return new ConcatEnumerable(enumerable, second);
}

class ConcatAsyncEnumerable<T> extends AsyncEnumerable<T> {
  #_second: Iterable<T> | AsyncIterable<T>;
  constructor(
    source: AsyncEnumerable<T>,
    second: Iterable<T> | AsyncIterable<T>,
  ) {
    super(source);
    this.#_second = second;
  }

  //TODO: change this into iterator not generator
  override [Symbol.asyncIterator](): AsyncIterator<T> {
    let _state = 1;
    let _enumerator: AsyncIterator<T> = (
      this._source as AsyncEnumerable<T>
    ).iterator();
    let current;

    return {
      next: async () => {
        switch (_state) {
          case 1:
            current = await _enumerator.next();
            if (current.done !== true) {
              return current;
            }
            _enumerator = isIterable(this.#_second)
              ? (this.#_second[
                  Symbol.iterator
                ]() as unknown as AsyncIterator<T>)
              : this.#_second[Symbol.asyncIterator]();
            _state = 2;
          // eslint-disable-next-line no-fallthrough
          case 2:
            current = await _enumerator.next();
            if (current.done !== true) {
              return current;
            }
            _state = 0;
            break;
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function concatAsync<T>(
  enumerable: AsyncEnumerable<T>,
  second: Iterable<T> | AsyncIterable<T>,
): IAsyncEnumerable<T> {
  validateIterableOrThrow(second, "second", true);
  return new ConcatAsyncEnumerable(enumerable, second);
}
