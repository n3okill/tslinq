import type {
  EqualityComparer,
  EqualityComparerAsync,
} from "../comparer/equality-comparer.ts";

/**
 * Represents a type that can be either a direct value or a Promise resolving to that value.
 *
 * @typeparam T - The type of the value or promised value.
 *
 * @remarks
 * This type allows functions to accept either synchronous or asynchronous inputs,
 * providing flexibility in handling different types of computations.
 *
 * @example
 * ```typescript
 * // Can be used with both sync and async functions
 * function processValue(value: TParamPromise<number>) {
 *   // Works with both number and Promise<number>
 * }
 *
 * processValue(42);  // Synchronous
 * processValue(Promise.resolve(42));  // Asynchronous
 * ```
 *
 * @internal
 */
export type TParamPromise<T> = T | Promise<T>;

/**
 * Represents an iterable collection that can be either synchronous or asynchronous.
 *
 * @typeparam T - The type of elements in the iterable.
 *
 * @remarks
 * This type allows working with both standard JavaScript iterables and async iterables,
 * providing a unified way to handle different types of collections.
 *
 * @example
 * ```typescript
 * // Can be used with both sync and async iterables
 * function processCollection(collection: AllIterable<number>) {
 *   // Works with both Iterable<number> and AsyncIterable<number>
 * }
 *
 * processCollection([1, 2, 3]);  // Synchronous iterable
 * processCollection(asyncNumberGenerator());  // Asynchronous iterable
 * ```
 *
 * @internal
 */
export type AllIterable<T> = AsyncIterable<T> | Iterable<T>;

/**
 * Represents an equality comparer that can be either synchronous or asynchronous.
 *
 * @typeparam T - The type of elements being compared.
 *
 * @remarks
 * This type allows using either standard synchronous equality comparers or
 * asynchronous equality comparers, providing flexibility in comparison logic.
 *
 * @example
 * ```typescript
 * // Can be used with both sync and async equality comparers
 * function compareElements(comparer: AllEqualityComparer<string>) {
 *   // Works with both sync and async comparison functions
 * }
 *
 * // Synchronous comparer
 * compareElements((a, b) => a.toLowerCase() === b.toLowerCase());
 *
 * // Asynchronous comparer
 * compareElements(async (a, b) => await normalizeString(a) === await normalizeString(b));
 * ```
 *
 * @internal
 */
export type AllEqualityComparer<T> =
  | EqualityComparer<T>
  | EqualityComparerAsync<T>;
