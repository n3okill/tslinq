import { AsyncEnumerable } from "../../internal.ts";
import { EqualityComparerAsync } from "../../comparer/equality-comparer.ts";
import type {
  TElementSelectorAsync,
  TKeySelectorAsync,
  TResultSelectorAsync,
} from "../../types/selectors.ts";
import type { IGrouping } from "../../types/grouping.ts";
import type { IAsyncEnumerable } from "../../types/async-enumerable.interface.ts";
import { Grouping } from "./groupBy-enumerable.ts";
import { validateArgumentOrThrow } from "../../helpers/helpers.ts";

abstract class GroupByAsyncEnumerable<
  T,
  TKey,
  TElement = T,
  TResult = T,
> extends AsyncEnumerable<TResult | IGrouping<TKey, TElement>> {
  #_map?: Array<Grouping<TKey, TElement> | TResult>;
  readonly #_comparer: (a: TKey, b: TKey) => Promise<boolean> | boolean;
  readonly #_keySelector: TKeySelectorAsync<T, TKey>;

  constructor(
    source: AsyncEnumerable<T>,
    keySelector: TKeySelectorAsync<T, TKey>,
    comparer: EqualityComparerAsync<TKey> = EqualityComparerAsync.default,
  ) {
    super(
      source as unknown as AsyncEnumerable<TResult | IGrouping<TKey, TElement>>,
    );
    this.#_keySelector = keySelector;
    this.#_comparer =
      comparer === EqualityComparerAsync.default
        ? (a: TKey, b: TKey) => Promise.resolve(a === b)
        : comparer.equals;
  }

  get keySelector(): TKeySelectorAsync<T, TKey> {
    return this.#_keySelector;
  }
  get comparer(): (a: TKey, b: TKey) => Promise<boolean> | boolean {
    return this.#_comparer;
  }
  override [Symbol.asyncIterator]() {
    let _state = 0;
    let iterator: Iterator<Grouping<TKey, TElement> | TResult>;
    return {
      next: async (): Promise<
        IteratorResult<TResult | IGrouping<TKey, TElement>>
      > => {
        switch (_state) {
          case 0:
            this.#_map ??= await this.createMap();
            iterator = this.#_map[Symbol.iterator]();
            _state = 1;
          // eslint-disable-next-line no-fallthrough
          case 1: {
            const current = iterator.next();
            if (current.done !== true) {
              return current;
            }
            _state = -1;
          }
        }
        return { done: true, value: undefined };
      },
    };
  }
  protected abstract createMap(): Promise<
    Array<Grouping<TKey, TElement> | TResult>
  >;
}

class GroupByAsyncEnumerableKey<T, TKey> extends GroupByAsyncEnumerable<
  T,
  TKey
> {
  override async createMap() {
    const map = new Map<TKey, Array<T>>();
    const iterator = (this._source as AsyncEnumerable<T>).enumeratorSource[
      Symbol.asyncIterator
    ]();
    let current = await iterator.next();
    loop1: while (current.done !== true) {
      const key = await this.keySelector(current.value);
      const iteratorMap = map[Symbol.iterator]();
      let currentMap = iteratorMap.next();
      while (currentMap.done !== true) {
        if (await this.comparer(currentMap.value[0], key)) {
          currentMap.value[1].push(current.value);
          current = await iterator.next();
          continue loop1;
        }
        currentMap = iteratorMap.next();
      }
      map.set(key, [current.value]);
      current = await iterator.next();
    }
    const finalMap: Array<Grouping<TKey, T>> = [];
    for (const [k, v] of map) {
      finalMap.push(new Grouping(v, k));
    }
    return finalMap;
  }
}

class GroupByAsyncEnumerableElementSelector<
  T,
  TKey,
  TElement,
> extends GroupByAsyncEnumerable<T, TKey, TElement> {
  readonly #_elementSelector: TElementSelectorAsync<T, TElement>;

  constructor(
    source: AsyncEnumerable<T>,
    keySelector: TKeySelectorAsync<T, TKey>,
    elementSelector: TElementSelectorAsync<T, TElement>,
    comparer?: EqualityComparerAsync<TKey>,
  ) {
    super(source, keySelector, comparer);
    this.#_elementSelector = elementSelector;
  }

  override async createMap() {
    const map = new Map<TKey, Array<TElement>>();
    const iterator = (this._source as AsyncEnumerable<T>).enumeratorSource[
      Symbol.asyncIterator
    ]();
    let current = await iterator.next();
    loop1: while (current.done !== true) {
      const key = await this.keySelector(current.value);
      const iteratorMap = map[Symbol.iterator]();
      let currentMap = iteratorMap.next();
      while (currentMap.done !== true) {
        if (await this.comparer(currentMap.value[0], key)) {
          currentMap.value[1].push(await this.#_elementSelector(current.value));
          current = await iterator.next();
          continue loop1;
        }
        currentMap = iteratorMap.next();
      }
      map.set(key, [await this.#_elementSelector(current.value)]);
      current = await iterator.next();
    }
    const finalMap: Array<Grouping<TKey, TElement>> = [];
    for (const [k, v] of map) {
      finalMap.push(new Grouping(v, k));
    }
    return finalMap;
  }
}

class GroupByAsyncEnumerableResultSelector<
  T,
  TKey,
  TResult,
> extends GroupByAsyncEnumerable<T, TKey, T, TResult> {
  readonly #_resultSelector: TResultSelectorAsync<TKey, T, TResult>;

  constructor(
    source: AsyncEnumerable<T>,
    _keySelector: TKeySelectorAsync<T, TKey>,
    resultSelector: TResultSelectorAsync<TKey, T, TResult>,
    _comparer?: EqualityComparerAsync<TKey>,
  ) {
    super(source, _keySelector, _comparer);
    this.#_resultSelector = resultSelector;
  }

  override async createMap() {
    const map = new Map<TKey, Array<T>>();
    const iterator = (this._source as AsyncEnumerable<T>).enumeratorSource[
      Symbol.asyncIterator
    ]();
    let current = await iterator.next();
    loop1: while (current.done !== true) {
      const key = await this.keySelector(current.value);
      const iteratorMap = map[Symbol.iterator]();
      let currentMap = iteratorMap.next();
      while (currentMap.done !== true) {
        if (await this.comparer(currentMap.value[0], key)) {
          currentMap.value[1].push(current.value);
          current = await iterator.next();
          continue loop1;
        }
        currentMap = iteratorMap.next();
      }
      map.set(key, [current.value]);
      current = await iterator.next();
    }
    const finalMap: Array<TResult> = [];
    for (const [k, v] of map) {
      finalMap.push(await this.#_resultSelector(k, AsyncEnumerable.create(v)));
    }
    return finalMap;
  }
}

class GroupByAsyncEnumerableElementResultSelector<
  T,
  TKey,
  TElement,
  TResult,
> extends GroupByAsyncEnumerable<T, TKey, TElement, TResult> {
  readonly #_elementSelector: TElementSelectorAsync<T, TElement>;
  readonly #_resultSelector: TResultSelectorAsync<TKey, TElement, TResult>;

  constructor(
    source: AsyncEnumerable<T>,
    keySelector: TKeySelectorAsync<T, TKey>,
    elementSelector: TElementSelectorAsync<T, TElement>,
    resultSelector: TResultSelectorAsync<TKey, TElement, TResult>,
    comparer?: EqualityComparerAsync<TKey>,
  ) {
    super(source, keySelector, comparer);
    this.#_elementSelector = elementSelector;
    this.#_resultSelector = resultSelector;
  }

  override async createMap() {
    const map = new Map<TKey, Array<TElement>>();
    const iterator = (this._source as AsyncEnumerable<T>).enumeratorSource[
      Symbol.asyncIterator
    ]();
    let current = await iterator.next();
    loop1: while (current.done !== true) {
      const key = await this.keySelector(current.value);
      const iteratorMap = map[Symbol.iterator]();
      let currentMap = iteratorMap.next();
      while (currentMap.done !== true) {
        if (await this.comparer(currentMap.value[0], key)) {
          currentMap.value[1].push(await this.#_elementSelector(current.value));
          current = await iterator.next();
          continue loop1;
        }
        currentMap = iteratorMap.next();
      }
      map.set(key, [await this.#_elementSelector(current.value)]);
      current = await iterator.next();
    }
    const finalMap: Array<TResult> = [];
    for (const [k, v] of map) {
      finalMap.push(await this.#_resultSelector(k, AsyncEnumerable.create(v)));
    }
    return finalMap;
  }
}

export function groupByAsync<T, TKey, TElement = T, TResult = T>(
  enumerable: AsyncEnumerable<T>,
  keySelector: TKeySelectorAsync<T, TKey>,
  elementSelectorOrComparer?:
    | TElementSelectorAsync<T, TElement>
    | EqualityComparerAsync<TKey>,
  resultSelectorOrComparer?:
    | TResultSelectorAsync<TKey, T | TElement, TResult>
    | EqualityComparerAsync<TKey>,
  comparer?: EqualityComparerAsync<TKey>,
) {
  validateArgumentOrThrow(keySelector, "keySelector", "function");

  if (typeof elementSelectorOrComparer !== "undefined") {
    if (elementSelectorOrComparer instanceof EqualityComparerAsync) {
      return new GroupByAsyncEnumerableKey(
        enumerable,
        keySelector,
        elementSelectorOrComparer,
      ) as IAsyncEnumerable<IGrouping<TKey, T>>;
    }
    if (typeof resultSelectorOrComparer !== "undefined") {
      if (resultSelectorOrComparer instanceof EqualityComparerAsync) {
        return new GroupByAsyncEnumerableElementSelector(
          enumerable,
          keySelector,
          elementSelectorOrComparer,
          resultSelectorOrComparer,
        ) as IAsyncEnumerable<IGrouping<TKey, TElement>>;
      }

      validateArgumentOrThrow(
        resultSelectorOrComparer,
        "resultSelector",
        "function",
      );
      return new GroupByAsyncEnumerableElementResultSelector(
        enumerable,
        keySelector,
        elementSelectorOrComparer,
        resultSelectorOrComparer,
        comparer,
      ) as IAsyncEnumerable<TResult>;
    }
    validateArgumentOrThrow(
      elementSelectorOrComparer,
      "elementSelector",
      "function",
    );

    return new GroupByAsyncEnumerableElementSelector(
      enumerable,
      keySelector,
      elementSelectorOrComparer,
    ) as IAsyncEnumerable<IGrouping<TKey, TElement>>;
  }
  if (
    typeof resultSelectorOrComparer !== "undefined" &&
    !(resultSelectorOrComparer instanceof EqualityComparerAsync)
  ) {
    validateArgumentOrThrow(
      resultSelectorOrComparer,
      "resultSelector",
      "function",
    );
    return new GroupByAsyncEnumerableResultSelector(
      enumerable,
      keySelector,
      resultSelectorOrComparer,
      comparer,
    ) as IAsyncEnumerable<TResult>;
  }
  return new GroupByAsyncEnumerableKey(
    enumerable,
    keySelector,
  ) as IAsyncEnumerable<IGrouping<TKey, T>>;
}
