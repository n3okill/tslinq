import { AsyncEnumerable, Enumerable } from "../internal.ts";
import {
  EqualityComparer,
  EqualityComparerAsync,
} from "../comparer/equality-comparer.ts";
import type {
  TKeySelector,
  TKeySelectorAsync,
  TResultSelectorJoin,
  TResultSelectorJoinAsync,
} from "../types/selectors.ts";
import type { AllIterable } from "../types/other.ts";
import { isIterable } from "../helpers/utils.ts";
import {
  validateArgumentOrThrow,
  validateIterableOrThrow,
} from "../helpers/helpers.ts";

class JoinEnumerable<TKey, TInner, TResult, T> extends Enumerable<TResult> {
  readonly #_inner: Iterable<TInner>;
  readonly #_outerKeySelector: TKeySelector<T, TKey>;
  readonly #_innerKeySelector: TKeySelector<TInner, TKey>;
  readonly #_resultSelector: TResultSelectorJoin<T, TInner, TResult>;
  readonly #_comparer: EqualityComparer<TKey>;

  constructor(
    source: Enumerable<T>,
    inner: Iterable<TInner>,
    outerKeySelector: TKeySelector<T, TKey>,
    innerKeySelector: TKeySelector<TInner, TKey>,
    resultSelector: TResultSelectorJoin<T, TInner, TResult>,
    comparer: EqualityComparer<TKey>,
  ) {
    super(source as unknown as Enumerable<TResult>);
    this.#_inner = inner;
    this.#_outerKeySelector = outerKeySelector;
    this.#_innerKeySelector = innerKeySelector;
    this.#_resultSelector = resultSelector;
    this.#_comparer = comparer;
  }

  override [Symbol.iterator](): Iterator<TResult> {
    const iteratorSource = (this._source as Enumerable<T>).iterator();
    let current: IteratorResult<T> = { done: false } as IteratorResult<T>;
    let _state = 0;
    let keySource: TKey;
    let iteratorInner: Iterator<TInner>;
    let currentInner: IteratorResult<TInner>;
    return {
      next: () => {
        case0: while (current.done !== true) {
          switch (_state) {
            case 0:
              current = iteratorSource.next();
              if (current.done === true) {
                _state = -1;
                continue case0;
              }
              _state = 1;
              keySource = this.#_outerKeySelector(current.value);
              iteratorInner = this.#_inner[Symbol.iterator]();
              currentInner = { done: false } as IteratorResult<TInner>;
            // eslint-disable-next-line no-fallthrough
            case 1:
              case1: while (currentInner.done !== true) {
                currentInner = iteratorInner.next();
                if (currentInner.done === true) {
                  _state = 0;
                  continue case0;
                }
                if (
                  this.#_comparer.equals(
                    keySource,
                    this.#_innerKeySelector(currentInner.value),
                  )
                ) {
                  return {
                    done: false,
                    value: this.#_resultSelector(
                      current.value,
                      currentInner.value,
                    ),
                  };
                }
                continue case1;
              }
          }
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function join<T, TInner, TKey, TResult>(
  enumerable: Enumerable<T>,
  inner: Iterable<TInner>,
  outerKeySelector: TKeySelector<T, TKey>,
  innerKeySelector: TKeySelector<TInner, TKey>,
  resultSelector: TResultSelectorJoin<T, TInner, TResult>,
  comparer: EqualityComparer<TKey> = EqualityComparer.default,
): Enumerable<TResult> {
  validateIterableOrThrow(inner, "inner");
  validateArgumentOrThrow(outerKeySelector, "outerKeySelector", "function");
  validateArgumentOrThrow(innerKeySelector, "innerKeySelector", "function");
  validateArgumentOrThrow(resultSelector, "resultSelector", "function");
  return new JoinEnumerable(
    enumerable,
    inner,
    outerKeySelector,
    innerKeySelector,
    resultSelector,
    comparer,
  );
}

class JoinAsyncEnumerable<
  TKey,
  TInner,
  TResult,
  T,
> extends AsyncEnumerable<TResult> {
  readonly #_inner: AllIterable<TInner>;
  readonly #_outerKeySelector: TKeySelectorAsync<T, TKey>;
  readonly #_innerKeySelector: TKeySelectorAsync<TInner, TKey>;
  readonly #_resultSelector: TResultSelectorJoinAsync<T, TInner, TResult>;
  readonly #_comparer: EqualityComparerAsync<TKey>;

  constructor(
    source: AsyncEnumerable<T>,
    inner: AllIterable<TInner>,
    outerKeySelector: TKeySelectorAsync<T, TKey>,
    innerKeySelector: TKeySelectorAsync<TInner, TKey>,
    resultSelector: TResultSelectorJoinAsync<T, TInner, TResult>,
    comparer: EqualityComparerAsync<TKey>,
  ) {
    super(source as unknown as AsyncEnumerable<TResult>);
    this.#_inner = inner;
    this.#_outerKeySelector = outerKeySelector;
    this.#_innerKeySelector = innerKeySelector;
    this.#_resultSelector = resultSelector;
    this.#_comparer = comparer;
  }

  override [Symbol.asyncIterator](): AsyncIterator<TResult> {
    const iteratorSource = (this._source as AsyncEnumerable<T>).iterator();
    let current: IteratorResult<T> = { done: false } as IteratorResult<T>;
    let _state = 0;
    let keySource: TKey;
    let iteratorInner: AsyncIterator<TInner>;
    let currentInner: IteratorResult<TInner>;
    return {
      next: async () => {
        case0: while (current.done !== true) {
          switch (_state) {
            case 0:
              current = await iteratorSource.next();
              if (current.done === true) {
                _state = -1;
                continue case0;
              }
              _state = 1;
              keySource = await this.#_outerKeySelector(current.value);
              iteratorInner = isIterable(this.#_inner)
                ? (this.#_inner[
                    Symbol.iterator
                  ]() as unknown as AsyncIterator<TInner>)
                : this.#_inner[Symbol.asyncIterator]();
              currentInner = { done: false } as IteratorResult<TInner>;
            // eslint-disable-next-line no-fallthrough
            case 1:
              case1: while (currentInner.done !== true) {
                currentInner = await iteratorInner.next();
                if (currentInner.done === true) {
                  _state = 0;
                  continue case0;
                }
                if (
                  await this.#_comparer.equals(
                    keySource,
                    await this.#_innerKeySelector(currentInner.value),
                  )
                ) {
                  return {
                    done: false,
                    value: await this.#_resultSelector(
                      current.value,
                      currentInner.value,
                    ),
                  };
                }
                continue case1;
              }
          }
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function joinAsync<T, TInner, TKey, TResult>(
  enumerable: AsyncEnumerable<T>,
  inner: AllIterable<TInner>,
  outerKeySelector: TKeySelectorAsync<T, TKey>,
  innerKeySelector: TKeySelectorAsync<TInner, TKey>,
  resultSelector: TResultSelectorJoinAsync<T, TInner, TResult>,
  comparer: EqualityComparerAsync<TKey> = EqualityComparerAsync.default,
): AsyncEnumerable<TResult> {
  validateIterableOrThrow(inner, "inner");
  validateArgumentOrThrow(outerKeySelector, "outerKeySelector", "function");
  validateArgumentOrThrow(innerKeySelector, "innerKeySelector", "function");
  validateArgumentOrThrow(resultSelector, "resultSelector", "function");
  return new JoinAsyncEnumerable(
    enumerable,
    inner,
    outerKeySelector,
    innerKeySelector,
    resultSelector,
    comparer,
  );
}
