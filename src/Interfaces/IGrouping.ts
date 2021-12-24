import { Interfaces } from "../internal";

/**
 * Represents a grouping based on a key
 */
export interface IGrouping<TKey, TElement> extends Interfaces.IEnumerable<TElement> {
    readonly Key: TKey;
}

export interface IAsyncGrouping<TKey, TElement> extends Interfaces.IAsyncEnumerable<TElement> {
    readonly Key: TKey;
}
