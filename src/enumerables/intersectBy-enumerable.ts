import { AsyncEnumerable, Enumerable } from "../internal.ts";
import {
  EqualityComparer,
  EqualityComparerAsync,
} from "../comparer/equality-comparer.ts";
import type { TKeySelector, TKeySelectorAsync } from "../types/selectors.ts";
import type { AllIterable } from "../types/other.ts";
import { isUndefined } from "../helpers/utils.ts";
import {
  validateArgumentOrThrow,
  validateIterableOrThrow,
} from "../helpers/helpers.ts";

class IntersectByEnumerable<T, TKey> extends Enumerable<T> {
  readonly #_second: Iterable<TKey>;
  readonly #_keySelector: TKeySelector<T, TKey>;
  readonly #_comparer: EqualityComparer<TKey>;

  constructor(
    souce: Enumerable<T>,
    second: Iterable<TKey>,
    keySelector: TKeySelector<T, TKey>,
    comparer: EqualityComparer<TKey>,
  ) {
    super(souce);
    this.#_second = second;
    this.#_keySelector = keySelector;
    this.#_comparer = comparer;
  }
  override [Symbol.iterator](): Iterator<T> {
    const exist = new Set(this.#_second);
    const iterator = (this._source as Enumerable<T>).iterator();
    let current;
    if (this.#_comparer === EqualityComparer.default) {
      return {
        next: () => {
          current = iterator.next();
          while (current.done !== true) {
            const key = this.#_keySelector(current.value);
            if (exist.has(key)) {
              return current;
            }
            current = iterator.next();
          }
          return { value: current.value, done: true };
        },
      };
    } else {
      return {
        next: () => {
          current = iterator.next();
          while (current.done !== true) {
            const key = this.#_keySelector(current.value);
            const iteratorSet = exist[Symbol.iterator]();
            let currentSet = iteratorSet.next();
            while (currentSet.done !== true) {
              if (this.#_comparer.equals(key, currentSet.value)) {
                return current;
              }
              currentSet = iteratorSet.next();
            }
            current = iterator.next();
          }
          return { value: current.value, done: true };
        },
      };
    }
  }
}

export function intersectBy<T, TKey>(
  enumerable: Enumerable<T>,
  second: Iterable<TKey>,
  keySelector: TKeySelector<T, TKey>,
  comparer: EqualityComparer<TKey> = EqualityComparer.default,
): Enumerable<T> {
  validateIterableOrThrow(second, "second");
  validateArgumentOrThrow(keySelector, "keySelector", "function");
  return new IntersectByEnumerable(enumerable, second, keySelector, comparer);
}

class IntersectByAsyncEnumerable<T, TKey> extends AsyncEnumerable<T> {
  #_exist?: Set<TKey>;
  readonly #_second: AllIterable<TKey>;
  readonly #_keySelector: TKeySelectorAsync<T, TKey>;
  readonly #_comparer: EqualityComparerAsync<TKey>;

  constructor(
    souce: AsyncEnumerable<T>,
    second: AllIterable<TKey>,
    keySelector: TKeySelectorAsync<T, TKey>,
    comparer: EqualityComparerAsync<TKey>,
  ) {
    super(souce);
    this.#_second = second;
    this.#_keySelector = keySelector;
    this.#_comparer = comparer;
  }
  override [Symbol.asyncIterator](): AsyncIterator<T> {
    const iterator = (this._source as AsyncEnumerable<T>).iterator();
    let current;
    if (this.#_comparer === EqualityComparer.default) {
      return {
        next: async () => {
          if (isUndefined(this.#_exist)) {
            this.#_exist = await this._createSet();
          }
          current = await iterator.next();
          while (current.done !== true) {
            const key = await this.#_keySelector(current.value);
            if (this.#_exist.has(key)) {
              return { value: await current.value, done: false };
            }
            current = await iterator.next();
          }
          this.#_exist = undefined;
          return { value: undefined, done: true };
        },
      };
    } else {
      return {
        next: async () => {
          if (isUndefined(this.#_exist)) {
            this.#_exist = await this._createSet();
          }
          current = await iterator.next();
          while (current.done !== true) {
            const key = await this.#_keySelector(current.value);
            const iteratorSet = this.#_exist[Symbol.iterator]();
            let currentSet = iteratorSet.next();
            while (currentSet.done !== true) {
              if (await this.#_comparer.equals(key, currentSet.value)) {
                return { value: await current.value, done: false };
              }
              currentSet = iteratorSet.next();
            }
            current = await iterator.next();
          }
          this.#_exist = undefined;

          return { value: undefined, done: true };
        },
      };
    }
  }
  private async _createSet(): Promise<Set<TKey>> {
    const exists = new Set<TKey>();
    for await (const item of this.#_second) {
      exists.add(item);
    }
    return exists;
  }
}

export function intersectByAsync<T, TKey>(
  enumerable: AsyncEnumerable<T>,
  second: AllIterable<TKey>,
  keySelector: TKeySelectorAsync<T, TKey>,
  comparer: EqualityComparerAsync<TKey> = EqualityComparerAsync.default,
): AsyncEnumerable<T> {
  validateIterableOrThrow(second, "second", true);
  validateArgumentOrThrow(keySelector, "keySelector", "function");
  return new IntersectByAsyncEnumerable(
    enumerable,
    second,
    keySelector,
    comparer,
  );
}
