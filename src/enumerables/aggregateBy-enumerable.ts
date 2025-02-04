import type { IEnumerable } from "../types/enumerable.interface.ts";
import type {
  AggregateFunctionSeedSelector,
  AggregateFunctionSeedSelectorAsync,
  AggregateFunctionType,
  AggregateFunctionTypeAsync,
} from "../types/aggregate.ts";
import type { TKeySelector, TKeySelectorAsync } from "../types/selectors.ts";
import {
  EqualityComparer,
  EqualityComparerAsync,
} from "../comparer/equality-comparer.ts";
import { AsyncEnumerable, Enumerable } from "../internal.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import { validateArgumentOrThrow } from "../helpers/helpers.ts";

class AggregateByEnumerable<T, TKey, TAccumulate> extends Enumerable<
  [TKey, TAccumulate]
> {
  #_map?: Map<TKey, TAccumulate>;
  readonly #_keySelector: TKeySelector<T, TKey>;
  readonly #_seed:
    | TAccumulate
    | AggregateFunctionSeedSelector<TKey, TAccumulate>;
  readonly #_func: AggregateFunctionType<T, TAccumulate>;
  readonly #_comparer: EqualityComparer<TKey>;
  constructor(
    source: IEnumerable<T>,
    keySelector: TKeySelector<T, TKey>,
    seed: TAccumulate | AggregateFunctionSeedSelector<TKey, TAccumulate>,
    func: AggregateFunctionType<T, TAccumulate>,
    comparer: EqualityComparer<TKey>,
  ) {
    super(source as IEnumerable<[TKey, TAccumulate]>);
    this.#_keySelector = keySelector;
    this.#_seed = seed;
    this.#_func = func;
    this.#_comparer = comparer;
  }

  override [Symbol.iterator](): Iterator<[TKey, TAccumulate]> {
    this.#_map ??= this._createMap();
    const iterator = this.#_map[Symbol.iterator]();
    return {
      next: () => {
        return iterator.next();
      },
    };
  }

  private _createMap() {
    const map = new Map<TKey, TAccumulate>();
    const iterator = (this._source as IEnumerable<T>).iterator();
    let current = iterator.next();
    loop1: while (current.done !== true) {
      const key = this.#_keySelector(current.value);
      for (const [k, v] of map) {
        if (this.#_comparer.equals(k, key)) {
          map.set(k, this.#_func(v, current.value));
          current = iterator.next();
          continue loop1;
        }
      }

      map.set(
        key,
        this.#_func(
          typeof this.#_seed === "function"
            ? (this.#_seed as CallableFunction)(key)
            : this.#_seed,
          current.value,
        ),
      );
      current = iterator.next();
    }
    return map;
  }
}

export function aggregateBy<T, TKey, TAccumulate>(
  enumerable: IEnumerable<T>,
  keySelector: TKeySelector<T, TKey>,
  seed: TAccumulate | AggregateFunctionSeedSelector<TKey, TAccumulate>,
  func: AggregateFunctionType<T, TAccumulate>,
  comparer: EqualityComparer<TKey> = EqualityComparer.default,
): IEnumerable<[TKey, TAccumulate]> {
  validateArgumentOrThrow(keySelector, "keySelector", "function");
  validateArgumentOrThrow(func, "func", "function");
  return new AggregateByEnumerable(
    enumerable,
    keySelector,
    seed,
    func,
    comparer,
  );
}

class AggregateByEnumerableAsync<T, TKey, TAccumulate> extends AsyncEnumerable<
  [TKey, TAccumulate]
> {
  #_map?: Map<TKey, TAccumulate>;
  readonly #_keySelector: TKeySelectorAsync<T, TKey>;
  readonly #_seed:
    | TAccumulate
    | AggregateFunctionSeedSelectorAsync<TKey, TAccumulate>;
  readonly #_func: AggregateFunctionTypeAsync<T, TAccumulate>;
  readonly #_comparer: EqualityComparerAsync<TKey> | EqualityComparer<TKey>;
  constructor(
    source: IAsyncEnumerable<T>,
    keySelector: TKeySelectorAsync<T, TKey>,
    seed: TAccumulate | AggregateFunctionSeedSelectorAsync<TKey, TAccumulate>,
    func: AggregateFunctionTypeAsync<T, TAccumulate>,
    comparer: EqualityComparerAsync<TKey> | EqualityComparer<TKey>,
  ) {
    super(source as IAsyncEnumerable<[TKey, TAccumulate]>);
    this.#_keySelector = keySelector;
    this.#_seed = seed;
    this.#_func = func;
    this.#_comparer = comparer;
  }

  override [Symbol.asyncIterator](): AsyncIterator<[TKey, TAccumulate]> {
    let iterator: MapIterator<[TKey, TAccumulate]>;
    let _state = 0;
    return {
      next: async (): Promise<IteratorResult<[TKey, TAccumulate]>> => {
        switch (_state) {
          case 0:
            this.#_map ??= await this._createMap();
            _state = 1;
            iterator = this.#_map[Symbol.iterator]();
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

  private async _createMap() {
    const map = new Map<TKey, TAccumulate>();
    const iterator = (this._source as IAsyncEnumerable<T>).iterator();
    let current = await iterator.next();
    loop1: while (current.done !== true) {
      const key = await this.#_keySelector(current.value);
      for (const [k, v] of map) {
        if (await this.#_comparer.equals(k, key)) {
          map.set(k, await this.#_func(v, current.value));
          current = await iterator.next();
          continue loop1;
        }
      }

      map.set(
        key,
        await this.#_func(
          typeof this.#_seed === "function"
            ? await (this.#_seed as CallableFunction)(key)
            : this.#_seed,
          current.value,
        ),
      );
      current = await iterator.next();
    }
    return map;
  }
}

export function aggregateByAsync<T, TKey, TAccumulate>(
  enumerable: IAsyncEnumerable<T>,
  keySelector: TKeySelectorAsync<T, TKey>,
  seed: TAccumulate | AggregateFunctionSeedSelectorAsync<TKey, TAccumulate>,
  func: AggregateFunctionTypeAsync<T, TAccumulate>,
  comparer:
    | EqualityComparer<TKey>
    | EqualityComparerAsync<TKey> = EqualityComparerAsync.default,
): IAsyncEnumerable<[TKey, TAccumulate]> {
  validateArgumentOrThrow(keySelector, "keySelector", "function");
  validateArgumentOrThrow(func, "func", "function");
  return new AggregateByEnumerableAsync(
    enumerable,
    keySelector,
    seed,
    func,
    comparer,
  );
}
