import { Enumerable } from "../../internal.ts";
import { EqualityComparer } from "../../comparer/equality-comparer.ts";
import type {
  TElementSelector,
  TKeySelector,
  TResultSelector,
} from "../../types/selectors.ts";
import type { IGrouping } from "../../types/grouping.ts";
import type { IEnumerable } from "../../types/enumerable.interface.ts";
import { validateArgumentOrThrow } from "../../helpers/helpers.ts";

export class Grouping<TKey, T>
  extends Enumerable<T>
  implements IGrouping<TKey, T>
{
  readonly #_key: TKey;

  constructor(elements: Iterable<T>, key: TKey) {
    super(elements);
    this.#_key = key;
  }

  get key(): TKey {
    return this.#_key;
  }
}

abstract class GroupByEnumerable2<
  T,
  TKey,
  TElement = T,
  TResult = T,
> extends Enumerable<TResult | IGrouping<TKey, TElement>> {
  #_map?: Array<Grouping<TKey, TElement> | TResult>;
  readonly #_comparer: (a: TKey, b: TKey) => boolean;
  readonly #_keySelector: TKeySelector<T, TKey>;

  constructor(
    source: Enumerable<T>,
    keySelector: TKeySelector<T, TKey>,
    comparer: EqualityComparer<TKey> = EqualityComparer.default,
  ) {
    super(source as unknown as Enumerable<TResult | IGrouping<TKey, TElement>>);
    this.#_keySelector = keySelector;
    this.#_comparer =
      comparer === EqualityComparer.default
        ? (a: TKey, b: TKey) => a === b
        : comparer.equals;
  }

  get keySelector(): TKeySelector<T, TKey> {
    return this.#_keySelector;
  }

  get comparer(): (a: TKey, b: TKey) => boolean {
    return this.#_comparer;
  }

  override [Symbol.iterator]() {
    if (typeof this.#_map === "undefined") {
      this.#_map = this.createMap();
    }
    return this.#_map[Symbol.iterator]();
  }
  //TODO: change to protected
  abstract createMap(): Array<Grouping<TKey, TElement> | TResult>;
}

class GroupByEnumerableKey<T, TKey> extends GroupByEnumerable2<T, TKey> {
  createMap() {
    const map = new Map<TKey, Array<T>>();
    const iterator = (this._source as Enumerable<T>).iterator();
    let current = iterator.next();
    loop1: while (current.done !== true) {
      const key = this.keySelector(current.value);
      const iteratorMap = map[Symbol.iterator]();
      let currentMap = iteratorMap.next();
      while (currentMap.done !== true) {
        if (this.comparer(currentMap.value[0], key)) {
          currentMap.value[1].push(current.value);
          current = iterator.next();
          continue loop1;
        }
        currentMap = iteratorMap.next();
      }
      map.set(key, [current.value]);
      current = iterator.next();
    }
    const finalMap: Array<Grouping<TKey, T>> = [];
    for (const [k, v] of map) {
      finalMap.push(new Grouping(v, k));
    }
    return finalMap;
  }
}

class GroupByEnumerableElementSelector<
  T,
  TKey,
  TElement,
> extends GroupByEnumerable2<T, TKey, TElement> {
  readonly #_elementSelector: TElementSelector<T, TElement>;

  constructor(
    source: Enumerable<T>,
    keySelector: TKeySelector<T, TKey>,
    elementSelector: TElementSelector<T, TElement>,
    comparer?: EqualityComparer<TKey>,
  ) {
    super(source, keySelector, comparer);
    this.#_elementSelector = elementSelector;
  }

  createMap() {
    const map = new Map<TKey, Array<TElement>>();
    const iterator = (this._source as Enumerable<T>).iterator();
    let current = iterator.next();
    loop1: while (current.done !== true) {
      const key = this.keySelector(current.value);
      const iteratorMap = map[Symbol.iterator]();
      let currentMap = iteratorMap.next();
      while (currentMap.done !== true) {
        if (this.comparer(currentMap.value[0], key)) {
          currentMap.value[1].push(this.#_elementSelector(current.value));
          current = iterator.next();
          continue loop1;
        }
        currentMap = iteratorMap.next();
      }
      map.set(key, [this.#_elementSelector(current.value)]);
      current = iterator.next();
    }
    const finalMap: Array<Grouping<TKey, TElement>> = [];
    for (const [k, v] of map) {
      finalMap.push(new Grouping(v, k));
    }
    return finalMap;
  }
}

class GroupByEnumerableResultSelector<
  T,
  TKey,
  TResult,
> extends GroupByEnumerable2<T, TKey, T, TResult> {
  readonly #_resultSelector: TResultSelector<TKey, T, TResult>;

  constructor(
    source: Enumerable<T>,
    keySelector: TKeySelector<T, TKey>,
    resultSelector: TResultSelector<TKey, T, TResult>,
    comparer?: EqualityComparer<TKey>,
  ) {
    super(source, keySelector, comparer);
    this.#_resultSelector = resultSelector;
  }

  createMap() {
    const map = new Map<TKey, Array<T>>();
    const iterator = (this._source as Enumerable<T>).iterator();
    let current = iterator.next();
    loop1: while (current.done !== true) {
      const key = this.keySelector(current.value);
      const iteratorMap = map[Symbol.iterator]();
      let currentMap = iteratorMap.next();
      while (currentMap.done !== true) {
        if (this.comparer(currentMap.value[0], key)) {
          currentMap.value[1].push(current.value);
          current = iterator.next();
          continue loop1;
        }
        currentMap = iteratorMap.next();
      }
      map.set(key, [current.value]);
      current = iterator.next();
    }
    const finalMap: Array<TResult> = [];
    for (const [k, v] of map) {
      finalMap.push(this.#_resultSelector(k, Enumerable.create(v)));
    }
    return finalMap;
  }
}

class GroupByEnumerableElementResultSelector<
  T,
  TKey,
  TElement,
  TResult,
> extends GroupByEnumerable2<T, TKey, TElement, TResult> {
  readonly #_elementSelector: TElementSelector<T, TElement>;
  readonly #_resultSelector: TResultSelector<TKey, TElement, TResult>;

  constructor(
    source: Enumerable<T>,
    keySelector: TKeySelector<T, TKey>,
    elementSelector: TElementSelector<T, TElement>,
    resultSelector: TResultSelector<TKey, TElement, TResult>,
    comparer?: EqualityComparer<TKey>,
  ) {
    super(source, keySelector, comparer);
    this.#_elementSelector = elementSelector;
    this.#_resultSelector = resultSelector;
  }

  createMap() {
    const map = new Map<TKey, Array<TElement>>();
    const iterator = (this._source as Enumerable<T>).iterator();
    let current = iterator.next();
    loop1: while (current.done !== true) {
      const key = this.keySelector(current.value);
      const iteratorMap = map[Symbol.iterator]();
      let currentMap = iteratorMap.next();
      while (currentMap.done !== true) {
        if (this.comparer(currentMap.value[0], key)) {
          currentMap.value[1].push(this.#_elementSelector(current.value));
          current = iterator.next();
          continue loop1;
        }
        currentMap = iteratorMap.next();
      }
      map.set(key, [this.#_elementSelector(current.value)]);
      current = iterator.next();
    }
    const finalMap: Array<TResult> = [];
    for (const [k, v] of map) {
      finalMap.push(this.#_resultSelector(k, Enumerable.create(v)));
    }
    return finalMap;
  }
}

export function groupBy<T, TKey, TElement = T, TResult = T>(
  enumerable: Enumerable<T>,
  keySelector: TKeySelector<T, TKey>,
  elementSelectorOrComparer?:
    | TElementSelector<T, TElement>
    | EqualityComparer<TKey>,
  resultSelectorOrComparer?:
    | TResultSelector<TKey, T | TElement, TResult>
    | EqualityComparer<TKey>,
  comparer?: EqualityComparer<TKey>,
) {
  validateArgumentOrThrow(keySelector, "keySelector", "function");

  if (typeof elementSelectorOrComparer !== "undefined") {
    if (elementSelectorOrComparer instanceof EqualityComparer) {
      return new GroupByEnumerableKey(
        enumerable,
        keySelector,
        elementSelectorOrComparer,
      ) as IEnumerable<IGrouping<TKey, T>>;
    }
    if (typeof resultSelectorOrComparer !== "undefined") {
      if (resultSelectorOrComparer instanceof EqualityComparer) {
        return new GroupByEnumerableElementSelector(
          enumerable,
          keySelector,
          elementSelectorOrComparer,
          resultSelectorOrComparer,
        ) as IEnumerable<IGrouping<TKey, TElement>>;
      }
      validateArgumentOrThrow(
        resultSelectorOrComparer,
        "resultSelector",
        "function",
      );

      return new GroupByEnumerableElementResultSelector(
        enumerable,
        keySelector,
        elementSelectorOrComparer,
        resultSelectorOrComparer,
        comparer,
      ) as IEnumerable<TResult>;
    }
    validateArgumentOrThrow(
      elementSelectorOrComparer,
      "elementSelector",
      "function",
    );

    return new GroupByEnumerableElementSelector(
      enumerable,
      keySelector,
      elementSelectorOrComparer,
    ) as IEnumerable<IGrouping<TKey, TElement>>;
  }
  if (
    typeof resultSelectorOrComparer !== "undefined" &&
    !(resultSelectorOrComparer instanceof EqualityComparer)
  ) {
    validateArgumentOrThrow(
      resultSelectorOrComparer,
      "resultSelector",
      "function",
    );

    return new GroupByEnumerableResultSelector(
      enumerable,
      keySelector,
      resultSelectorOrComparer,
      comparer,
    ) as IEnumerable<TResult>;
  }
  return new GroupByEnumerableKey(enumerable, keySelector) as IEnumerable<
    IGrouping<TKey, T>
  >;
}
