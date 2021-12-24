import { Interfaces, Types } from "../internal";

/**
 * Ordered Iterable type with methods from LINQ.
 */
export interface IOrderedEnumerable<TSource> extends Interfaces.IEnumerable<TSource> {
    thenBy<TKey>(keySelector: Types.TKeySelector<TSource, TKey>, comparer?: Interfaces.ICompareTo<TKey>): IOrderedEnumerable<TSource>;
    thenByDescending<TKey>(keySelector: Types.TKeySelector<TSource, TKey>, comparer?: Interfaces.ICompareTo<TKey>): IOrderedEnumerable<TSource>;
}

export interface IAsyncOrderedEnumerable<TSource> extends Interfaces.IAsyncEnumerable<TSource> {
    thenBy<TKey>(keySelector: Types.TKeySelectorAsync<TSource, TKey>, comparer?: Interfaces.ICompareTo<TKey>): IAsyncOrderedEnumerable<TSource>;
    thenByDescending<TKey>(keySelector: Types.TKeySelectorAsync<TSource, TKey>, comparer?: Interfaces.ICompareTo<TKey>): IAsyncOrderedEnumerable<TSource>;
}
