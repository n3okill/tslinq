import { Comparer, ComparerAsync } from "../comparer/comparer.ts";
import type { IAsyncEnumerable } from "./async-enumerable.interface.ts";
import type { IEnumerable } from "./enumerable.interface.ts";
import type { TKeySelector, TKeySelectorAsync } from "./selectors.ts";

/**
 * Represents a synchronous ordered enumerable collection with additional sorting methods.
 *
 * @typeparam T - The type of elements in the collection.
 *
 * @remarks
 * This interface extends IEnumerable and provides methods for performing secondary sorting
 * operations on an already sorted collection. It allows chaining multiple sorting criteria
 * to create complex sorting logic.
 *
 * @example
 * ```typescript
 * // Sort first by age, then by name
 * const sortedPeople = people
 *   .orderBy(p => p.age)
 *   .thenBy(p => p.name);
 * ```
 */
export interface IOrderedEnumerable<out T> extends IEnumerable<T> {
  /**
   * Performs a subsequent ordering of the elements in ascending order based on a key.
   *
   * @typeparam TKey - The type of the key used for sorting.
   * @param keySelector - A function to extract the key for sorting from each element.
   * @param comparer - Optional custom comparer to define sorting logic.
   * @returns A new IOrderedEnumerable with additional sorting applied.
   */
  thenBy<TKey>(
    keySelector: TKeySelector<T, TKey>,
    comparer?: Comparer<TKey>,
  ): IOrderedEnumerable<T>;

  /**
   * Performs a subsequent ordering of the elements in descending order based on a key.
   *
   * @typeparam TKey - The type of the key used for sorting.
   * @param keySelector - A function to extract the key for sorting from each element.
   * @param comparer - Optional custom comparer to define sorting logic.
   * @returns A new IOrderedEnumerable with additional sorting applied.
   */
  thenByDescending<TKey>(
    keySelector: TKeySelector<T, TKey>,
    comparer?: Comparer<TKey>,
  ): IOrderedEnumerable<T>;
}

/**
 * Represents an asynchronous ordered enumerable collection with additional sorting methods.
 *
 * @typeparam T - The type of elements in the collection.
 *
 * @remarks
 * This interface extends IAsyncEnumerable and provides methods for performing secondary
 * sorting operations on an already sorted asynchronous collection. It allows chaining
 * multiple asynchronous sorting criteria to create complex sorting logic.
 *
 * @example
 * ```typescript
 * // Sort first by age asynchronously, then by name
 * const sortedPeople = await asyncPeople
 *   .orderBy(async p => await p.getAge())
 *   .thenBy(async p => await p.getName());
 * ```
 */
export interface IOrderedAsyncEnumerable<out T> extends IAsyncEnumerable<T> {
  /**
   * Performs a subsequent ordering of the elements in ascending order based on an asynchronous key.
   *
   * @typeparam TKey - The type of the key used for sorting.
   * @param keySelector - An async function to extract the key for sorting from each element.
   * @param comparer - Optional async custom comparer to define sorting logic.
   * @returns A new IOrderedAsyncEnumerable with additional sorting applied.
   */
  thenBy<TKey>(
    keySelector: TKeySelectorAsync<T, TKey>,
    comparer?: ComparerAsync<TKey>,
  ): IOrderedAsyncEnumerable<T>;

  /**
   * Performs a subsequent ordering of the elements in descending order based on an asynchronous key.
   *
   * @typeparam TKey - The type of the key used for sorting.
   * @param keySelector - An async function to extract the key for sorting from each element.
   * @param comparer - Optional async custom comparer to define sorting logic.
   * @returns A new IOrderedAsyncEnumerable with additional sorting applied.
   */
  thenByDescending<TKey>(
    keySelector: TKeySelectorAsync<T, TKey>,
    comparer?: ComparerAsync<TKey>,
  ): IOrderedAsyncEnumerable<T>;
}
