import { validateArgumentOrThrow } from "../helpers/helpers.ts";
import { AsyncEnumerable, Enumerable } from "../internal.ts";
import type { TParamPromise } from "../types/other.ts";

class SelectEnumerable<T, TResult> extends Enumerable<TResult> {
  readonly #_selector: (x: T, index: number) => TResult;

  constructor(
    source: Enumerable<T>,
    selector: (x: T, index: number) => TResult,
  ) {
    super(source as unknown as Enumerable<TResult>);
    this.#_selector = selector;
  }
  override [Symbol.iterator](): Iterator<TResult> {
    const iterator = (this._source as Enumerable<T>).iterator();
    let current;
    let index = -1;
    return {
      next: () => {
        current = iterator.next();
        index++;
        if (current.done !== true) {
          return { done: false, value: this.#_selector(current.value, index) };
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function select<T, TResult>(
  enumerable: Enumerable<T>,
  selector: (x: T, index?: number) => TResult,
) {
  validateArgumentOrThrow(selector, "selector", "function");
  return new SelectEnumerable(enumerable, selector);
}

class SelectAsyncEnumerable<T, TResult> extends AsyncEnumerable<TResult> {
  readonly #_selector: (x: T, index: number) => TParamPromise<TResult>;

  constructor(
    source: AsyncEnumerable<T>,
    selector: (x: T, index: number) => TParamPromise<TResult>,
  ) {
    super(source as unknown as AsyncEnumerable<TResult>);
    this.#_selector = selector;
  }
  override [Symbol.asyncIterator](): AsyncIterator<TResult> {
    const iterator = (this._source as AsyncEnumerable<T>).iterator();
    let current;
    let index = -1;
    return {
      next: async () => {
        current = await iterator.next();
        index++;
        if (current.done !== true) {
          return {
            done: false,
            value: await this.#_selector(current.value, index),
          };
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function selectAsync<T, TResult>(
  enumerable: AsyncEnumerable<T>,
  selector: (x: T, index?: number) => TParamPromise<TResult>,
) {
  validateArgumentOrThrow(selector, "selector", "function");
  return new SelectAsyncEnumerable(enumerable, selector);
}
