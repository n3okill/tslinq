import { validateArgumentOrThrow } from "../helpers/helpers.ts";
import { isIterable } from "../helpers/utils.ts";
import { AsyncEnumerable, Enumerable } from "../internal.ts";
import type {
  SelectManyResultSelector,
  SelectManyResultSelectorAsync,
  SelectManySelector,
  SelectManySelectorAsync,
} from "../types/selectors.ts";

class SelectManyEnumerable<
  T,
  TResult,
  TCollection,
> extends Enumerable<TResult> {
  readonly #_selector: SelectManySelector<T, TCollection>;
  readonly #_resultSelector?: SelectManyResultSelector<T, TCollection, TResult>;

  constructor(
    source: Enumerable<T>,
    selector: SelectManySelector<T, TCollection>,
    resultSelector?: SelectManyResultSelector<T, TCollection, TResult>,
  ) {
    super(source as unknown as Enumerable<TResult>);
    this.#_selector = selector;
    this.#_resultSelector = resultSelector;
  }
  override [Symbol.iterator](): Iterator<TResult> {
    const iterator = (this._source as Enumerable<T>).iterator();
    let _state = 0;
    let current: IteratorResult<T> = { done: false } as IteratorResult<T>;
    let index = -1;
    let selectorIterator: Iterator<TCollection>;
    let currentSelector;

    if (typeof this.#_resultSelector !== "function") {
      return {
        next: () => {
          case0: while (current.done !== true) {
            switch (_state) {
              case 0:
                current = iterator.next();
                if (current.done === true) {
                  _state = -1;
                  continue case0;
                }
                _state = 1;
                index++;
                selectorIterator = this.#_selector(current.value, index)[
                  Symbol.iterator
                ]();
              // eslint-disable-next-line no-fallthrough
              case 1:
                currentSelector = selectorIterator.next();
                if (currentSelector.done === true) {
                  _state = 0;
                  continue case0;
                }
                return {
                  done: false,
                  value: currentSelector.value as unknown as TResult,
                };
            }
          }
          return { done: true, value: undefined };
        },
      };
    } else {
      return {
        next: () => {
          case0: while (current.done !== true) {
            switch (_state) {
              case 0:
                current = iterator.next();
                if (current.done === true) {
                  _state = -1;
                  continue case0;
                }
                _state = 1;
                index++;
                selectorIterator = this.#_selector(current.value, index)[
                  Symbol.iterator
                ]();
              // eslint-disable-next-line no-fallthrough
              case 1:
                currentSelector = selectorIterator.next();
                if (currentSelector.done === true) {
                  _state = 0;
                  continue case0;
                }
                return {
                  done: false,
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  value: this.#_resultSelector!(
                    current.value,
                    currentSelector.value,
                  ),
                };
            }
          }
          return { done: true, value: undefined };
        },
      };
    }
  }
}

export function selectMany<T, TCollection, TResult>(
  enumerable: Enumerable<T>,
  selector: SelectManySelector<T, TCollection>,
  resultSelector?: SelectManyResultSelector<T, TCollection, TResult>,
) {
  validateArgumentOrThrow(selector, "selector", "function");
  return new SelectManyEnumerable(enumerable, selector, resultSelector);
}

class SelectManyAsyncEnumerable<
  T,
  TResult,
  TCollection,
> extends AsyncEnumerable<TResult> {
  readonly #_selector: SelectManySelectorAsync<T, TCollection>;
  readonly #_resultSelector?: SelectManyResultSelectorAsync<
    T,
    TCollection,
    TResult
  >;

  constructor(
    source: AsyncEnumerable<T>,
    selector: SelectManySelectorAsync<T, TCollection>,
    resultSelector?: SelectManyResultSelectorAsync<T, TCollection, TResult>,
  ) {
    super(source as unknown as AsyncEnumerable<TResult>);
    this.#_selector = selector;
    this.#_resultSelector = resultSelector;
  }
  override [Symbol.asyncIterator](): AsyncIterator<TResult> {
    const iterator = (this._source as AsyncEnumerable<T>).iterator();
    let _state = 0;
    let current: IteratorResult<T> = { done: false } as IteratorResult<T>;
    let index = -1;
    let selectorIterator: AsyncIterator<TCollection>;
    let currentSelector;

    if (typeof this.#_resultSelector !== "function") {
      return {
        next: async () => {
          case0: while (current.done !== true) {
            switch (_state) {
              case 0: {
                current = await iterator.next();
                if (current.done === true) {
                  _state = -1;
                  continue case0;
                }
                _state = 1;
                index++;
                const selector = await this.#_selector(current.value, index);
                selectorIterator = isIterable(selector)
                  ? (selector[
                      Symbol.iterator
                    ]() as unknown as AsyncIterator<TCollection>)
                  : selector[Symbol.asyncIterator]();
              }
              // eslint-disable-next-line no-fallthrough
              case 1:
                currentSelector = await selectorIterator.next();
                if (currentSelector.done === true) {
                  _state = 0;
                  continue case0;
                }
                return {
                  done: false,
                  value: currentSelector.value as unknown as TResult,
                };
            }
          }
          return { done: true, value: undefined };
        },
      };
    } else {
      return {
        next: async () => {
          case0: while (current.done !== true) {
            switch (_state) {
              case 0: {
                current = await iterator.next();
                if (current.done === true) {
                  _state = -1;
                  continue case0;
                }
                _state = 1;
                index++;
                const selector = await this.#_selector(current.value, index);
                selectorIterator = isIterable(selector)
                  ? (selector[
                      Symbol.iterator
                    ]() as unknown as AsyncIterator<TCollection>)
                  : selector[Symbol.asyncIterator]();
              }
              // eslint-disable-next-line no-fallthrough
              case 1:
                currentSelector = await selectorIterator.next();
                if (currentSelector.done === true) {
                  _state = 0;
                  continue case0;
                }
                return {
                  done: false,
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  value: await this.#_resultSelector!(
                    current.value,
                    currentSelector.value,
                  ),
                };
            }
          }
          return { done: true, value: undefined };
        },
      };
    }
  }
}

export function selectManyAsync<T, TCollection, TResult>(
  enumerable: AsyncEnumerable<T>,
  selector: SelectManySelectorAsync<T, TCollection>,
  resultSelector?: SelectManyResultSelectorAsync<T, TCollection, TResult>,
) {
  validateArgumentOrThrow(selector, "selector", "function");
  return new SelectManyAsyncEnumerable(enumerable, selector, resultSelector);
}
