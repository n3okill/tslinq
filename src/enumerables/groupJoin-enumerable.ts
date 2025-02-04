import { AsyncEnumerable, Enumerable } from "../internal.ts";
import {
  EqualityComparer,
  EqualityComparerAsync,
} from "../comparer/equality-comparer.ts";
import type {
  TKeySelector,
  TKeySelectorAsync,
  TResultSelector,
  TResultSelectorAsync,
} from "../types/selectors.ts";
import type { AllIterable } from "../types/other.ts";
import { isIterable } from "../helpers/utils.ts";
import {
  validateArgumentOrThrow,
  validateIterableOrThrow,
} from "../helpers/helpers.ts";

class GroupJoinEnumerable<
  T,
  TKey,
  TInner = T,
  TResult = T,
> extends Enumerable<TResult> {
  #_map?: Map<TKey, Array<TInner>>;
  readonly #_comparer: (a: TKey, b: TKey) => boolean;
  readonly #_inner: Iterable<TInner>;
  readonly #_outerKeySelector: TKeySelector<T, TKey>;
  readonly #_innerKeySelector: TKeySelector<TInner, TKey>;
  readonly #_resultSelector: TResultSelector<TKey, TInner, TResult>;

  constructor(
    source: Enumerable<T>,
    inner: Iterable<TInner>,
    outerKeySelector: TKeySelector<T, TKey>,
    innerKeySelector: TKeySelector<TInner, TKey>,
    resultSelector: TResultSelector<TKey, TInner, TResult>,
    comparer: EqualityComparer<TKey>,
  ) {
    super(source as unknown as Enumerable<TResult>);
    this.#_inner = inner;
    this.#_outerKeySelector = outerKeySelector;
    this.#_innerKeySelector = innerKeySelector;
    this.#_resultSelector = resultSelector;
    this.#_comparer =
      comparer === EqualityComparer.default
        ? (a, b) => a === b
        : comparer.equals;
  }

  override [Symbol.iterator]() {
    if (typeof this.#_map === "undefined") {
      this.#_map = this.createMap();
    }
    const iterator = (this._source as Enumerable<T>).iterator();
    let current;
    return {
      next: (): IteratorResult<TResult> => {
        current = iterator.next();
        if (current.done !== true) {
          const key = this.#_outerKeySelector(current.value);
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const iteratorMap = this.#_map![Symbol.iterator]();
          let currentMap = iteratorMap.next();
          while (!currentMap.done) {
            if (this.#_comparer(currentMap.value[0], key)) {
              return {
                done: false,
                value: this.#_resultSelector(
                  key,
                  Enumerable.create(currentMap.value[1]),
                ),
              };
            }
            currentMap = iteratorMap.next();
          }
          return {
            done: false,
            value: this.#_resultSelector(key, Enumerable.create([])),
          };
        }
        return { done: true, value: undefined };
      },
    };
  }

  private createMap() {
    const map = new Map<TKey, Array<TInner>>();
    const iterator = this.#_inner[Symbol.iterator]();
    let current = iterator.next();
    loop1: while (current.done !== true) {
      const key = this.#_innerKeySelector(current.value);
      const iteratorMap = map[Symbol.iterator]();
      let currentMap = iteratorMap.next();
      while (currentMap.done !== true) {
        if (this.#_comparer(currentMap.value[0], key)) {
          currentMap.value[1].push(current.value);
          current = iterator.next();
          continue loop1;
        }
        currentMap = iteratorMap.next();
      }
      map.set(key, [current.value]);
      current = iterator.next();
    }
    return map;
  }
}

export function groupJoin<T, TInner, TKey, TResult>(
  enumerable: Enumerable<T>,
  inner: Iterable<TInner>,
  outerKeySelector: TKeySelector<T, TKey>,
  innerKeySelector: TKeySelector<TInner, TKey>,
  resultSelector: TResultSelector<TKey, TInner, TResult>,
  comparer: EqualityComparer<TKey> = EqualityComparer.default,
): Enumerable<TResult> {
  validateIterableOrThrow(inner, "inner");
  validateArgumentOrThrow(outerKeySelector, "outerKeySelector", "function");
  validateArgumentOrThrow(innerKeySelector, "innerKeySelector", "function");
  validateArgumentOrThrow(resultSelector, "resultSelector", "function");
  return new GroupJoinEnumerable(
    enumerable,
    inner,
    outerKeySelector,
    innerKeySelector,
    resultSelector,
    comparer,
  );
}

class GroupJoinAsyncEnumerable<
  T,
  TKey,
  TInner = T,
  TResult = T,
> extends AsyncEnumerable<TResult> {
  #_map?: Map<TKey, Array<TInner>>;
  readonly #_comparer: (a: TKey, b: TKey) => boolean | Promise<boolean>;
  readonly #_inner: AllIterable<TInner>;
  readonly #_outerKeySelector: TKeySelectorAsync<T, TKey>;
  readonly #_innerKeySelector: TKeySelectorAsync<TInner, TKey>;
  readonly #_resultSelector: TResultSelectorAsync<TKey, TInner, TResult>;

  constructor(
    source: AsyncEnumerable<T>,
    inner: AllIterable<TInner>,
    outerKeySelector: TKeySelectorAsync<T, TKey>,
    innerKeySelector: TKeySelectorAsync<TInner, TKey>,
    resultSelector: TResultSelectorAsync<TKey, TInner, TResult>,
    comparer: EqualityComparerAsync<TKey>,
  ) {
    super(source as unknown as AsyncEnumerable<TResult>);
    this.#_inner = inner;
    this.#_outerKeySelector = outerKeySelector;
    this.#_innerKeySelector = innerKeySelector;
    this.#_resultSelector = resultSelector;
    this.#_comparer =
      comparer === EqualityComparerAsync.default
        ? (a, b) => a === b
        : comparer.equals;
  }

  override [Symbol.asyncIterator]() {
    const iterator = (this._source as AsyncEnumerable<T>).iterator();
    let current;
    let _state = 0;
    return {
      next: async (): Promise<IteratorResult<TResult>> => {
        switch (_state) {
          case 0:
            this.#_map ??= await this.createMap();
            _state = 1;
          // eslint-disable-next-line no-fallthrough
          case 1:
            current = await iterator.next();
            if (current.done !== true) {
              const key = await this.#_outerKeySelector(current.value);
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const iteratorMap = this.#_map![Symbol.iterator]();
              let currentMap = iteratorMap.next();
              while (!currentMap.done) {
                if (this.#_comparer(currentMap.value[0], key)) {
                  return {
                    done: false,
                    value: await this.#_resultSelector(
                      key,
                      AsyncEnumerable.create(currentMap.value[1]),
                    ),
                  };
                }
                currentMap = iteratorMap.next();
              }
              return {
                done: false,
                value: await this.#_resultSelector(
                  key,
                  AsyncEnumerable.create([]),
                ),
              };
            }
            _state = -1;
        }
        return { done: true, value: undefined };
      },
    };
  }

  private async createMap() {
    const map = new Map<TKey, Array<TInner>>();
    const iterator = isIterable(this.#_inner)
      ? this.#_inner[Symbol.iterator]()
      : this.#_inner[Symbol.asyncIterator]();
    let current = await iterator.next();
    loop1: while (current.done !== true) {
      const key = await this.#_innerKeySelector(current.value);
      const iteratorMap = map[Symbol.iterator]();
      let currentMap = iteratorMap.next();
      while (currentMap.done !== true) {
        if (await this.#_comparer(currentMap.value[0], key)) {
          currentMap.value[1].push(current.value);
          current = await iterator.next();
          continue loop1;
        }
        currentMap = iteratorMap.next();
      }
      map.set(key, [current.value]);
      current = await iterator.next();
    }
    return map;
  }
}

export function groupJoinAsync<T, TInner, TKey, TResult>(
  enumerable: AsyncEnumerable<T>,
  inner: AllIterable<TInner>,
  outerKeySelector: TKeySelectorAsync<T, TKey>,
  innerKeySelector: TKeySelectorAsync<TInner, TKey>,
  resultSelector: TResultSelectorAsync<TKey, TInner, TResult>,
  comparer: EqualityComparerAsync<TKey> = EqualityComparerAsync.default,
): AsyncEnumerable<TResult> {
  validateIterableOrThrow(inner, "inner", true);
  validateArgumentOrThrow(outerKeySelector, "outerKeySelector", "function");
  validateArgumentOrThrow(innerKeySelector, "innerKeySelector", "function");
  validateArgumentOrThrow(resultSelector, "resultSelector", "function");
  return new GroupJoinAsyncEnumerable(
    enumerable,
    inner,
    outerKeySelector,
    innerKeySelector,
    resultSelector,
    comparer,
  );
}
