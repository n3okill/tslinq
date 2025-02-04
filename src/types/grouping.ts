import type { IAsyncEnumerable } from "./async-enumerable.interface.ts";
import type { IEnumerable } from "./enumerable.interface.ts";

/**
 * Represents a group of elements with a common key in a synchronous enumeration.
 *
 * @typeparam TKey - The type of the key used to group elements.
 * @typeparam TElement - The type of elements in the group.
 *
 * @remarks
 * This interface extends IEnumerable, allowing synchronous iteration over grouped elements
 * while providing access to the key that defines the group.
 *
 * @example
 * ```typescript
 * // Example of using IGrouping in a groupBy operation
 * const groupedNumbers = numbers.groupBy(num => num % 2 === 0);
 * // groupedNumbers is an array of IGrouping<boolean, number>
 * ```
 */
export interface IGrouping<TKey, TElement> extends IEnumerable<TElement> {
  /**
   * Gets the key that defines this group.
   *
   * @returns The key used to group the elements.
   */
  get key(): TKey;
}

/**
 * Represents a group of elements with a common key in an asynchronous enumeration.
 *
 * @typeparam TKey - The type of the key used to group elements.
 * @typeparam TElement - The type of elements in the group.
 *
 * @remarks
 * This interface extends IAsyncEnumerable, allowing asynchronous iteration over grouped elements
 * while providing access to the key that defines the group.
 *
 * @example
 * ```typescript
 * // Example of using IAsyncGrouping in an async groupBy operation
 * const asyncGroupedNumbers = asyncNumbers.groupBy(async num => num % 2 === 0);
 * // asyncGroupedNumbers is an async iterable of IAsyncGrouping<boolean, number>
 * ```
 */
export interface IAsyncGrouping<TKey, TElement>
  extends IAsyncEnumerable<TElement> {
  /**
   * Gets the key that defines this group.
   *
   * @returns The key used to group the elements.
   */
  get key(): TKey;
}
