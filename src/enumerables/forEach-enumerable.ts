import { validateArgumentOrThrow } from "../helpers/helpers.ts";
import { AsyncEnumerable, Enumerable } from "../internal.ts";
import type { TParamPromise } from "../types/other.ts";

class ForEachEnumerable<T, TResult> extends Enumerable<TResult> {
  readonly #_action: (x: T) => TResult;
  constructor(source: Enumerable<T>, action: (x: T) => TResult) {
    super(source as unknown as Enumerable<TResult>);
    this.#_action = action;
  }
  override [Symbol.iterator](): Iterator<TResult> {
    const iterator = (this._source as Enumerable<T>).iterator();
    let current;
    return {
      next: (): IteratorResult<TResult> => {
        current = iterator.next();
        if (current.done !== true) {
          return { done: false, value: this.#_action(current.value) };
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function forEach<T, TResult>(
  enumerable: Enumerable<T>,
  action: (x: T) => TResult,
) {
  validateArgumentOrThrow(action, "action", "function");
  return new ForEachEnumerable(enumerable, action);
}

class ForEachAsyncEnumerable<T, TResult> extends AsyncEnumerable<TResult> {
  readonly #_action: (x: T) => TParamPromise<TResult>;

  constructor(
    source: AsyncEnumerable<T>,
    action: (x: T) => TParamPromise<TResult>,
  ) {
    super(source as unknown as AsyncEnumerable<TResult>);
    this.#_action = action;
  }
  override [Symbol.asyncIterator](): AsyncIterator<TResult> {
    const iterator = (this._source as AsyncEnumerable<T>).iterator();
    let current;
    return {
      next: async () => {
        current = await iterator.next();
        if (current.done !== true) {
          return { done: false, value: await this.#_action(current.value) };
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function forEachAsync<T, TResult>(
  enumerable: AsyncEnumerable<T>,
  action: (x: T) => TParamPromise<TResult>,
) {
  validateArgumentOrThrow(action, "action", "function");
  return new ForEachAsyncEnumerable(enumerable, action);
}
