import { AsyncEnumerable, Enumerable } from "../internal.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";
import type {
  TZipResult,
  TZipResultSelector,
  TZipResultSelectorAsync,
} from "../types/selectors.ts";
import type { TParamPromise } from "../types/other.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { AllIterable } from "../types/other.ts";
import { isIterable, isUndefined } from "../helpers/utils.ts";
import { validateIterableOrThrow } from "../helpers/helpers.ts";

class ZipEnumerable<T, TSecond, TThird, TResult> extends Enumerable<
  [T, TSecond] | [T, TSecond, TThird] | TResult
> {
  readonly #_second: Iterable<TSecond>;
  readonly #_third?: Iterable<TThird>;
  readonly #_resultSelector?: TZipResultSelector<T, TSecond, TResult>;

  constructor(
    source: Enumerable<T>,
    second: Iterable<TSecond>,
    third?: Iterable<TThird>,
    resultSelector?: TZipResultSelector<T, TSecond, TResult>,
  ) {
    super(
      source as unknown as Enumerable<
        [T, TSecond] | [T, TSecond, TThird] | TResult
      >,
    );
    this.#_second = second;
    this.#_third = third;
    this.#_resultSelector = resultSelector;
  }
  override [Symbol.iterator](): Iterator<
    [T, TSecond] | [T, TSecond, TThird] | TResult
  > {
    const iterator = (this._source as Enumerable<T>).iterator();
    const iteratorSecond = this.#_second[Symbol.iterator]();
    let current;
    let currentSecond;
    if (!this.#_third) {
      if (isUndefined(this.#_resultSelector)) {
        return {
          next: () => {
            current = iterator.next();
            currentSecond = iteratorSecond.next();
            while (current.done !== true && currentSecond.done !== true) {
              return {
                done: false,
                value: [current.value, currentSecond.value] as [T, TSecond],
              };
            }
            return { done: true, value: undefined };
          },
        };
      } else {
        return {
          next: () => {
            current = iterator.next();
            currentSecond = iteratorSecond.next();
            while (current.done !== true && currentSecond.done !== true) {
              return {
                done: false,
                value: (
                  this.#_resultSelector as TZipResultSelector<
                    T,
                    TSecond,
                    TResult
                  >
                )(current.value, currentSecond.value),
              };
            }
            return { done: true, value: undefined };
          },
        };
      }
    } else {
      const iteratorThird = this.#_third[Symbol.iterator]();
      let currentThird;
      return {
        next: () => {
          current = iterator.next();
          currentSecond = iteratorSecond.next();
          currentThird = iteratorThird.next();
          while (
            current.done !== true &&
            currentSecond.done !== true &&
            currentThird.done !== true
          ) {
            return {
              done: false,
              value: [
                current.value,
                currentSecond.value,
                currentThird.value,
              ] as [T, TSecond, TThird],
            };
          }
          return { done: true, value: undefined };
        },
      };
    }
  }
}

export function zip<T, TSecond, TThird, TResult>(
  enumerable: Enumerable<T>,
  second: Iterable<TSecond>,
  thirdOrResultSelector?: Iterable<TThird> | ((x: T, y: TSecond) => TResult),
): IEnumerable<TZipResult<T, TSecond, TThird, TResult>> {
  validateIterableOrThrow(second, "second");
  const third =
    typeof thirdOrResultSelector === "function"
      ? undefined
      : thirdOrResultSelector;
  const resultSelector =
    typeof thirdOrResultSelector === "function"
      ? thirdOrResultSelector
      : undefined;

  if (!isUndefined(thirdOrResultSelector) && isUndefined(resultSelector)) {
    validateIterableOrThrow(third, "third");
  }
  return new ZipEnumerable(enumerable, second, third, resultSelector);
}

class ZipAsyncEnumerable<T, TSecond, TThird, TResult> extends AsyncEnumerable<
  [T, TSecond] | [T, TSecond, TThird] | TResult
> {
  readonly #_second: AllIterable<TSecond>;
  readonly #_third?: AllIterable<TThird>;
  readonly #_resultSelector?: TZipResultSelectorAsync<T, TSecond, TResult>;

  constructor(
    source: AsyncEnumerable<T>,
    second: AllIterable<TSecond>,
    third?: AllIterable<TThird>,
    resultSelector?: TZipResultSelectorAsync<T, TSecond, TResult>,
  ) {
    super(
      source as unknown as AsyncEnumerable<
        [T, TSecond] | [T, TSecond, TThird] | TResult
      >,
    );
    this.#_second = second;
    this.#_third = third;
    this.#_resultSelector = resultSelector;
  }
  override [Symbol.asyncIterator](): AsyncIterator<
    [T, TSecond] | [T, TSecond, TThird] | TResult
  > {
    const iterator = (this._source as AsyncEnumerable<T>).iterator();
    const iteratorSecond = isIterable(this.#_second)
      ? this.#_second[Symbol.iterator]()
      : this.#_second[Symbol.asyncIterator]();
    let current;
    let currentSecond;
    if (!this.#_third) {
      if (isUndefined(this.#_resultSelector)) {
        return {
          next: async () => {
            current = await iterator.next();
            currentSecond = await iteratorSecond.next();
            while (current.done !== true && currentSecond.done !== true) {
              return {
                done: false,
                value: [current.value, currentSecond.value] as [T, TSecond],
              };
            }
            return { done: true, value: undefined };
          },
        };
      } else {
        return {
          next: async () => {
            current = await iterator.next();
            currentSecond = await iteratorSecond.next();
            while (current.done !== true && currentSecond.done !== true) {
              return {
                done: false,
                value: await (
                  this.#_resultSelector as TZipResultSelectorAsync<
                    T,
                    TSecond,
                    TResult
                  >
                )(current.value, currentSecond.value),
              };
            }
            return { done: true, value: undefined };
          },
        };
      }
    } else {
      const iteratorThird = isIterable(this.#_third)
        ? this.#_third[Symbol.iterator]()
        : this.#_third[Symbol.asyncIterator]();
      let currentThird;
      return {
        next: async () => {
          current = await iterator.next();
          currentSecond = await iteratorSecond.next();
          currentThird = await iteratorThird.next();
          while (
            current.done !== true &&
            currentSecond.done !== true &&
            currentThird.done !== true
          ) {
            return {
              done: false,
              value: [
                current.value,
                currentSecond.value,
                currentThird.value,
              ] as [T, TSecond, TThird],
            };
          }
          return { done: true, value: undefined };
        },
      };
    }
  }
}

export function zipAsync<T, TSecond, TThird, TResult>(
  enumerable: AsyncEnumerable<T>,
  second: AllIterable<TSecond>,
  thirdOrResultSelector?:
    | AllIterable<TThird>
    | ((x: T, y: TSecond) => TParamPromise<TResult>),
): IAsyncEnumerable<TZipResult<T, TSecond, TThird, TResult>> {
  validateIterableOrThrow(second, "second", true);
  const third =
    typeof thirdOrResultSelector === "function"
      ? undefined
      : thirdOrResultSelector;
  const resultSelector =
    typeof thirdOrResultSelector === "function"
      ? thirdOrResultSelector
      : undefined;
  if (!isUndefined(thirdOrResultSelector) && isUndefined(resultSelector)) {
    validateIterableOrThrow(third, "third", true);
  }
  return new ZipAsyncEnumerable(enumerable, second, third, resultSelector);
}
