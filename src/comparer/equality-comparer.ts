/**
 * Abstract base class for synchronous equality comparison operations.
 *
 * @typeparam T - The type of elements being compared for equality.
 *
 * @remarks
 * Provides a standard interface for comparing two elements of the same type for equality.
 * Implementations can define custom equality logic for different types.
 *
 * @example
 * ```typescript
 * // Create a custom equality comparer for complex objects
 * class PersonEqualityComparer extends EqualityComparer<Person> {
 *   equals(x: Person, y: Person): boolean {
 *     return x.id === y.id;  // Compare by unique identifier
 *   }
 * }
 * ```
 */
export abstract class EqualityComparer<T> {
  /** Cached default equality comparer instance */
  static #_defaultComparer?: EqualityComparer<unknown>;

  /**
   * Gets the default equality comparer for standard types.
   *
   * @returns A default comparer that uses standard equality comparison.
   */
  static get default() {
    if (typeof EqualityComparer.#_defaultComparer === "undefined") {
      EqualityComparer.#_defaultComparer = new DefaultEqualityComparer();
    }
    return EqualityComparer.#_defaultComparer;
  }

  /**
   * Determines whether two elements are considered equal.
   *
   * @param x - The first element to compare.
   * @param y - The second element to compare.
   * @returns A boolean indicating whether the elements are equal.
   */
  abstract equals(x: T, y: T): boolean;
}

/**
 * Default implementation of EqualityComparer for standard types.
 *
 * @typeparam T - The type of elements being compared for equality.
 *
 * @remarks
 * Provides standard equality comparison using strict equality (===) operator.
 * Works well for primitive types and object references.
 *
 * @example
 * ```typescript
 * const comparer = new DefaultEqualityComparer();
 * console.log(comparer.equals(5, 5));        // Returns true
 * console.log(comparer.equals('a', 'a'));    // Returns true
 * console.log(comparer.equals(5, '5'));      // Returns false
 * ```
 */
export class DefaultEqualityComparer<T> extends EqualityComparer<T> {
  /**
   * Compares two values for strict equality.
   *
   * @param x - The first value to compare.
   * @param y - The second value to compare.
   * @returns A boolean indicating whether the values are strictly equal.
   */
  override equals(x: T, y: T): boolean {
    return x === y;
  }
}

/**
 * Abstract base class for asynchronous equality comparison operations.
 *
 * @typeparam T - The type of elements being compared for equality.
 *
 * @remarks
 * Provides a standard interface for asynchronous equality comparison of two elements.
 * Useful when equality check may involve async operations like database lookups.
 *
 * @example
 * ```typescript
 * // Create a custom async equality comparer for complex objects
 * class AsyncUserEqualityComparer extends EqualityComparerAsync<User> {
 *   async equals(x: User, y: User): Promise<boolean> {
 *     const xDetails = await x.fetchDetails();
 *     const yDetails = await y.fetchDetails();
 *     return xDetails.uniqueIdentifier === yDetails.uniqueIdentifier;
 *   }
 * }
 * ```
 */
export abstract class EqualityComparerAsync<T> {
  /** Cached default async equality comparer instance */
  static #_defaultComparer?: EqualityComparerAsync<unknown>;

  /**
   * Gets the default async equality comparer for standard types.
   *
   * @returns A default async comparer that uses standard equality comparison.
   */
  static get default() {
    if (typeof EqualityComparerAsync.#_defaultComparer === "undefined") {
      EqualityComparerAsync.#_defaultComparer =
        new DefaultEqualityComparerAsync();
    }
    return EqualityComparerAsync.#_defaultComparer;
  }

  /**
   * Determines whether two elements are considered equal asynchronously.
   *
   * @param x - The first element to compare.
   * @param y - The second element to compare.
   * @returns A Promise resolving to a boolean indicating whether the elements are equal.
   */
  abstract equals(x: T, y: T): boolean | Promise<boolean>;
}

/**
 * Default implementation of EqualityComparerAsync for standard types.
 *
 * @typeparam T - The type of elements being compared for equality.
 *
 * @remarks
 * Provides standard asynchronous equality comparison using strict equality (===) operator.
 * Returns a Promise to maintain async interface, even though comparison is synchronous.
 *
 * @example
 * ```typescript
 * const asyncComparer = new DefaultEqualityComparerAsync();
 * const result = await asyncComparer.equals(5, 5);  // Returns Promise<true>
 * const result2 = await asyncComparer.equals(5, '5');  // Returns Promise<false>
 * ```
 */
export class DefaultEqualityComparerAsync<T> extends EqualityComparerAsync<T> {
  /**
   * Compares two values for strict equality asynchronously.
   *
   * @param x - The first value to compare.
   * @param y - The second value to compare.
   * @returns A Promise resolving to a boolean indicating whether the values are strictly equal.
   */
  override async equals(x: T, y: T): Promise<boolean> {
    return x === y;
  }
}
