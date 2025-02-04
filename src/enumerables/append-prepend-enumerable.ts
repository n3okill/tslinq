import { AsyncEnumerable, Enumerable } from "../internal.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";

class AppendPrependEnumerable<T> extends Enumerable<T> {
  readonly #_appendItems: Array<T>;
  readonly #_preppendItems: Array<T>;

  constructor(
    source: Enumerable<T>,
    appendItems: Array<T>,
    preppendItems: Array<T>,
  ) {
    super(source);
    this.#_appendItems = appendItems;
    this.#_preppendItems = preppendItems;
  }
  override [Symbol.iterator]() {
    let _state = 1;
    let _enumerator: Iterator<T> = this.#_preppendItems[Symbol.iterator]();

    let current;

    return {
      next: (): IteratorResult<T> => {
        switch (_state) {
          case 1:
            current = _enumerator.next();
            if (current.done !== true) {
              return current;
            }
            _enumerator = (this._source as IEnumerable<T>).iterator();
            _state = 2;
          // eslint-disable-next-line no-fallthrough
          case 2:
            current = _enumerator.next();
            if (current.done !== true) {
              return current;
            }

            _enumerator = this.#_appendItems[Symbol.iterator]();
            _state = 3;
          // eslint-disable-next-line no-fallthrough
          case 3:
            current = _enumerator.next();
            if (current.done !== true) {
              return current;
            }
            _state = 0;
            break;
        }

        return { done: true, value: null };
      },
    };
  }

  override append(item: T): IEnumerable<T> {
    return new AppendPrependEnumerable(
      this._source as Enumerable<T>,
      [...this.#_appendItems, item],
      [...this.#_preppendItems],
    );
  }

  override prepend(item: T): IEnumerable<T> {
    return new AppendPrependEnumerable(
      this._source as Enumerable<T>,
      [...this.#_appendItems],
      [item, ...this.#_preppendItems],
    );
  }
}

export function append<T>(enumerable: Enumerable<T>, item: T): IEnumerable<T> {
  return new AppendPrependEnumerable(enumerable, [item], []);
}

export function prepend<T>(enumerable: Enumerable<T>, item: T): IEnumerable<T> {
  return new AppendPrependEnumerable(enumerable, [], [item]);
}

class AppendPrependAsyncEnumerable<T> extends AsyncEnumerable<T> {
  readonly #_appendItems: Array<T>;
  readonly #_preppendItems: Array<T>;
  constructor(
    source: AsyncEnumerable<T>,
    appendItems: Array<T>,
    preppendItems: Array<T>,
  ) {
    super(source);
    this.#_appendItems = appendItems;
    this.#_preppendItems = preppendItems;
  }
  override [Symbol.asyncIterator]() {
    let _state = 1;
    let _enumerator: Iterator<T> | AsyncIterator<T> =
      this.#_preppendItems[Symbol.iterator]();

    let current;

    return {
      next: async (): Promise<IteratorResult<T>> => {
        switch (_state) {
          case 1:
            current = await _enumerator.next();
            if (current.done !== true) {
              return current;
            }
            _enumerator = (this._source as AsyncEnumerable<T>).iterator();
            _state = 2;
          // eslint-disable-next-line no-fallthrough
          case 2:
            current = await _enumerator.next();
            if (current.done !== true) {
              return current;
            }

            _enumerator = this.#_appendItems[Symbol.iterator]();
            _state = 3;
          // eslint-disable-next-line no-fallthrough
          case 3:
            current = await _enumerator.next();
            if (current.done !== true) {
              return current;
            }
            _state = 0;
            break;
        }

        return { done: true, value: null };
      },
    };
  }

  override append(item: T): IAsyncEnumerable<T> {
    return new AppendPrependAsyncEnumerable(
      this._source as AsyncEnumerable<T>,
      [...this.#_appendItems, item],
      [...this.#_preppendItems],
    );
  }

  override prepend(item: T): IAsyncEnumerable<T> {
    return new AppendPrependAsyncEnumerable(
      this._source as AsyncEnumerable<T>,
      [...this.#_appendItems],
      [item, ...this.#_preppendItems],
    );
  }
}

export function appendAsync<T>(
  enumerable: AsyncEnumerable<T>,
  item: T,
): IAsyncEnumerable<T> {
  return new AppendPrependAsyncEnumerable(enumerable, [item], []);
}

export function prependAsync<T>(
  enumerable: AsyncEnumerable<T>,
  item: T,
): IAsyncEnumerable<T> {
  return new AppendPrependAsyncEnumerable(enumerable, [], [item]);
}
