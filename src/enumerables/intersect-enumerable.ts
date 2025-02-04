import { AsyncEnumerable, Enumerable } from "../internal.ts";
import {
  EqualityComparer,
  EqualityComparerAsync,
} from "../comparer/equality-comparer.ts";
import type { AllIterable } from "../types/other.ts";
import { isUndefined } from "../helpers/utils.ts";
import { validateIterableOrThrow } from "../helpers/helpers.ts";

class IntersectEnumerable<T> extends Enumerable<T> {
  readonly #_second: Iterable<T>;
  readonly #_comparer: EqualityComparer<T>;

  constructor(
    souce: Enumerable<T>,
    second: Iterable<T>,
    comparer: EqualityComparer<T>,
  ) {
    super(souce);
    this.#_second = second;
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
            if (exist.has(current.value)) {
              return current;
            }
            current = iterator.next();
          }
          return current;
        },
      };
    } else {
      return {
        next: () => {
          current = iterator.next();
          while (current.done !== true) {
            const iteratorSet = exist[Symbol.iterator]();
            let currentSet = iteratorSet.next();
            while (currentSet.done !== true) {
              if (this.#_comparer.equals(current.value, currentSet.value)) {
                return current;
              }
              currentSet = iteratorSet.next();
            }
            current = iterator.next();
          }
          return current;
        },
      };
    }
  }
}

export function intersect<T>(
  enumerable: Enumerable<T>,
  second: Iterable<T>,
  comparer: EqualityComparer<T> = EqualityComparer.default,
): Enumerable<T> {
  validateIterableOrThrow(second, "second");
  return new IntersectEnumerable(enumerable, second, comparer);
}

class IntersectAsyncEnumerable<T> extends AsyncEnumerable<T> {
  #_exist?: Set<T>;
  readonly #_second: AllIterable<T>;
  readonly #_comparer: EqualityComparerAsync<T>;

  constructor(
    souce: AsyncEnumerable<T>,
    second: AllIterable<T>,
    comparer: EqualityComparerAsync<T>,
  ) {
    super(souce);
    this.#_second = second;
    this.#_comparer = comparer;
  }
  override [Symbol.asyncIterator](): AsyncIterator<T> {
    const iterator = (this._source as AsyncEnumerable<T>).iterator();
    let current;
    if (this.#_comparer === EqualityComparerAsync.default) {
      return {
        next: async () => {
          if (isUndefined(this.#_exist)) {
            this.#_exist = await this._createSet();
          }
          current = await iterator.next();
          while (current.done !== true) {
            if (this.#_exist.has(current.value)) {
              return current;
            }
            current = await iterator.next();
          }
          this.#_exist = undefined;
          return current;
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
            const iteratorSet = this.#_exist[Symbol.iterator]();
            let currentSet = iteratorSet.next();
            while (currentSet.done !== true) {
              if (
                await this.#_comparer.equals(current.value, currentSet.value)
              ) {
                return current;
              }
              currentSet = iteratorSet.next();
            }
            current = await iterator.next();
          }
          this.#_exist = undefined;

          return current;
        },
      };
    }
  }
  private async _createSet(): Promise<Set<T>> {
    const exists = new Set<T>();
    for await (const item of this.#_second) {
      exists.add(item);
    }
    return exists;
  }
}

export function intersectAsync<T>(
  enumerable: AsyncEnumerable<T>,
  second: AllIterable<T>,
  comparer: EqualityComparerAsync<T> = EqualityComparerAsync.default,
): AsyncEnumerable<T> {
  validateIterableOrThrow(second, "second", true);
  return new IntersectAsyncEnumerable(enumerable, second, comparer);
}
