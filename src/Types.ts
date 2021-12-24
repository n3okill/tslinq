import { Interfaces } from "./internal";

export type AggregateFunctionType<TSource, TAccumulate> = (result: TSource | TAccumulate, current: TSource) => TAccumulate;
export type AggregateResultType<TAccumulate, TResult> = (result: TAccumulate) => TResult;
export type AggregateFunctionTypeAsync<TSource, TAccumulate> = (result: TSource | TAccumulate, current: TSource) => TAccumulate | Promise<TAccumulate>;
export type AggregateResultTypeAsync<TAccumulate, TResult> = (result: TAccumulate) => TResult | Promise<TResult>;

export type TKeySelector<T, TKey> = (x: T) => TKey;
export type TElementSelector<T, TElement> = (x: T) => TElement;
export type TResultSelector<TKey, TElement, TResult> = (x: TKey, y: Interfaces.IEnumerable<TElement>) => TResult;

export type TResultSelectorJoin<TKey, TElement, TResult> = (x: TKey, y: TElement) => TResult;

export type SelectManySelector<T, TCollection> = (x: T, y: number) => Iterable<TCollection>;
export type SelectManyResultSelector<T, TCollection, TResult> = (x: T, y: TCollection) => TResult;

export type SelectManySelectorAsync<T, TCollection> = (x: T, y: number) => AsyncIterable<TCollection> | Promise<AsyncIterable<TCollection>> | Iterable<TCollection> | Promise<Iterable<TCollection>>;
export type SelectManyResultSelectorAsync<T, TCollection, TResult> = (x: T, y: TCollection) => TResult | Promise<TResult>;

export type TIAsyncEqualityComparer<T> = Interfaces.IEqualityComparer<T> | Interfaces.IAsyncEqualityComparer<T>;
export type TICompareTo<T> = Interfaces.ICompareTo<T> | Interfaces.IAsyncCompareTo<T>;

export type TKeySelectorAsync<T, TKey> = (x: T) => TKey | Promise<TKey>;
export type TElementSelectorAsync<T, TElement> = (x: T) => TElement | Promise<TElement>;
export type TResultSelectorAsync<TKey, TElement, TResult> = (x: TKey, y: Interfaces.IAsyncEnumerable<TElement> | Interfaces.IEnumerable<TElement>) => TResult | Promise<TResult>;

export type TResultSelectorJoinAsync<TKey, TElement, TResult> = (x: TKey, y: TElement) => TResult | Promise<TResult>;

export type ZipResultSelectorAsync<T, TSecond, TThird, TResult> = (x: T, y: TSecond, z?: TThird) => TResult | Promise<TResult>;
