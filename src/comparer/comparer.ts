/**
 * Abstract base class for synchronous comparison operations.
 *
 * @typeparam T - The type of elements being compared.
 *
 * @remarks
 * Provides a standard interface for comparing two elements of the same type.
 * Implementations define custom comparison logic for different types.
 *
 * @example
 * ```typescript
 * // Create a custom comparer for complex objects
 * class PersonComparer extends Comparer<Person> {
 *   compare(x: Person, y: Person): number {
 *     return x.age - y.age;  // Compare by age
 *   }
 * }
 * ```
 */
export abstract class Comparer<T> {
  /** Cached default comparer instance */
  static #_defaultComparer?: Comparer<unknown>;

  /** Cached default string comparer instance */
  static #_defaultStringComparer?: Comparer<unknown>;

  /**
   * Gets the default comparer for numeric or comparable types.
   *
   * @returns A default comparer that uses standard comparison logic.
   */
  static get default() {
    if (typeof Comparer.#_defaultComparer === "undefined") {
      Comparer.#_defaultComparer = new DefaultComparer();
    }
    return Comparer.#_defaultComparer;
  }

  /**
   * Gets the default comparer for string types.
   *
   * @returns A default comparer that uses locale-aware string comparison.
   */
  static get defaultString() {
    if (typeof Comparer.#_defaultStringComparer === "undefined") {
      Comparer.#_defaultStringComparer = new DefaultStringComparer();
    }
    return Comparer.#_defaultStringComparer;
  }

  /**
   * Compares two elements of the same type.
   *
   * @param x - The first element to compare.
   * @param y - The second element to compare.
   * @returns A number indicating the relative order:
   * - Negative if x should be sorted before y
   * - Zero if x and y are considered equal
   * - Positive if x should be sorted after y
   */
  abstract compare(x: T, y: T): number;
}

/**
 * Default implementation of Comparer for numeric types.
 *
 * @typeparam A - The type of elements being compared (defaults to number).
 *
 * @remarks
 * Provides standard comparison logic for numeric values using
 * greater than, less than, and equality checks.
 *
 * @example
 * ```typescript
 * const comparer = new DefaultComparer();
 * console.log(comparer.compare(5, 10));  // Returns -1
 * console.log(comparer.compare(10, 5));  // Returns 1
 * console.log(comparer.compare(5, 5));   // Returns 0
 * ```
 */
export class DefaultComparer extends Comparer<number> {
  /**
   * Compares two numeric values.
   *
   * @param x - The first value to compare.
   * @param y - The second value to compare.
   * @returns -1, 0, or 1 based on the comparison result.
   */
  override compare(x: number, y: number): -1 | 0 | 1 {
    if (x > y) {
      return 1;
    } else if (x < y) {
      return -1;
    } else {
      return 0;
    }
  }
}

/**
 * Default implementation of Comparer for string types.
 *
 * @typeparam A - The type of elements being compared (defaults to string).
 *
 * @remarks
 * Provides locale-aware string comparison using Intl.Collator.
 * This ensures proper sorting of strings across different languages and locales.
 *
 * @example
 * ```typescript
 * const comparer = new DefaultStringComparer();
 * console.log(comparer.compare('apple', 'banana'));  // Locale-aware comparison
 * console.log(comparer.compare('café', 'cafe'));     // Handles accents correctly
 * ```
 */
export class DefaultStringComparer extends Comparer<string> {
  /** Intl.Collator for locale-aware string comparison */
  readonly #_collator = new Intl.Collator();

  /**
   * Compares two string values using locale-aware comparison.
   *
   * @param x - The first string to compare.
   * @param y - The second string to compare.
   * @returns A number indicating the relative order of the strings.
   */
  override compare(x: string, y: string): number {
    return this.#_collator.compare(x as string, y as string);
  }
}

/**
 * Abstract base class for asynchronous comparison operations.
 *
 * @typeparam T - The type of elements being compared.
 *
 * @remarks
 * Provides a standard interface for asynchronous comparison of two elements.
 * Useful when comparison may involve async operations like database lookups.
 *
 * @example
 * ```typescript
 * // Create a custom async comparer for complex objects
 * class AsyncPersonComparer extends ComparerAsync<Person> {
 *   async compare(x: Person, y: Person): Promise<number> {
 *     const xScore = await x.calculateScore();
 *     const yScore = await y.calculateScore();
 *     return xScore - yScore;
 *   }
 * }
 * ```
 */
export abstract class ComparerAsync<T> {
  /** Cached default async comparer instance */
  static #_defaultComparer?: ComparerAsync<unknown>;

  /**
   * Gets the default async comparer for numeric or comparable types.
   *
   * @returns A default async comparer that uses standard async comparison logic.
   */
  static get default() {
    if (typeof ComparerAsync.#_defaultComparer === "undefined") {
      ComparerAsync.#_defaultComparer = new DefaultComparerAsync();
    }
    return ComparerAsync.#_defaultComparer;
  }

  /**
   * Compares two elements of the same type asynchronously.
   *
   * @param x - The first element to compare.
   * @param y - The second element to compare.
   * @returns A Promise resolving to a number indicating the relative order:
   * - Negative if x should be sorted before y
   * - Zero if x and y are considered equal
   * - Positive if x should be sorted after y
   */
  abstract compare(x: T, y: T): number | Promise<number>;
}

/**
 * Default implementation of ComparerAsync for numeric types.
 *
 * @typeparam A - The type of elements being compared (defaults to number).
 *
 * @remarks
 * Provides standard asynchronous comparison logic for numeric values.
 * Returns a Promise to maintain async interface, even though comparison is synchronous.
 *
 * @example
 * ```typescript
 * const asyncComparer = new DefaultComparerAsync();
 * const result = await asyncComparer.compare(5, 10);  // Returns Promise<-1>
 * ```
 */
export class DefaultComparerAsync extends ComparerAsync<number> {
  /**
   * Compares two numeric values asynchronously.
   *
   * @param x - The first value to compare.
   * @param y - The second value to compare.
   * @returns A Promise resolving to -1, 0, or 1 based on the comparison result.
   */
  override compare(x: number, y: number): Promise<-1 | 0 | 1> {
    if (x > y) {
      return Promise.resolve(1);
    } else if (x < y) {
      return Promise.resolve(-1);
    } else {
      return Promise.resolve(0);
    }
  }
}
