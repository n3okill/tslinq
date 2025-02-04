import type { IAsyncEnumerable } from "./async-enumerable.interface.ts";
import type { IEnumerable } from "./enumerable.interface.ts";

//#region Key Selector
/**
 * Represents a synchronous function that selects a key from an element.
 *
 * @typeparam T - The type of the source element.
 * @typeparam TKey - The type of the key to be selected.
 *
 * @remarks
 * Used in sorting, grouping, and other operations where a key needs to be extracted from an element.
 *
 * @example
 * ```typescript
 * // Select age as a key for sorting people
 * const ageSelector: TKeySelector<Person, number> = person => person.age;
 * const sortedPeople = people.orderBy(ageSelector);
 * ```
 */
export type TKeySelector<T, TKey> = (x: T) => TKey;

/**
 * Represents an asynchronous function that selects a key from an element.
 *
 * @typeparam T - The type of the source element.
 * @typeparam TKey - The type of the key to be selected.
 *
 * @remarks
 * Used in asynchronous sorting, grouping, and other operations where a key needs to be
 * extracted from an element, potentially involving async computation.
 *
 * @example
 * ```typescript
 * // Async key selector that fetches age from a database
 * const asyncAgeSelector: TKeySelectorAsync<Person, number> =
 *   async person => await person.fetchAge();
 * const sortedPeople = await asyncPeople.orderBy(asyncAgeSelector);
 * ```
 */
export type TKeySelectorAsync<T, TKey> = (x: T) => TKey | Promise<TKey>;
//#endregion

//#region Group Selectors
/**
 * Represents a synchronous function that selects an element from a source element.
 *
 * @typeparam T - The type of the source element.
 * @typeparam TElement - The type of the selected element.
 *
 * @remarks
 * Used in operations like grouping or transforming elements.
 *
 * @example
 * ```typescript
 * // Select name from a person object
 * const nameSelector: TElementSelector<Person, string> = person => person.name;
 * ```
 */
export type TElementSelector<T, TElement> = (x: T) => TElement;

/**
 * Represents a synchronous function that creates a result from a key and a group of elements.
 *
 * @typeparam TKey - The type of the grouping key.
 * @typeparam TElement - The type of elements in the group.
 * @typeparam TResult - The type of the result.
 *
 * @remarks
 * Used in group transformations to create a new result from a key and its associated elements.
 *
 * @example
 * ```typescript
 * // Create a summary for each age group
 * const resultSelector: TResultSelector<number, Person, string> =
 *   (age, peopleGroup) => `Age ${age}: ${peopleGroup.count()} people`;
 * ```
 */
export type TResultSelector<TKey, TElement, TResult> = (
  x: TKey,
  y: IEnumerable<TElement>,
) => TResult;

/**
 * Represents an asynchronous function that selects an element from a source element.
 *
 * @typeparam T - The type of the source element.
 * @typeparam TElement - The type of the selected element.
 *
 * @remarks
 * Used in async operations like grouping or transforming elements with potential async computation.
 *
 * @example
 * ```typescript
 * // Async name selector that might fetch from a database
 * const asyncNameSelector: TElementSelectorAsync<Person, string> =
 *   async person => await person.fetchDisplayName();
 * ```
 */
export type TElementSelectorAsync<T, TElement> = (
  x: T,
) => TElement | Promise<TElement>;

/**
 * Represents an asynchronous function that creates a result from a key and a group of async elements.
 *
 * @typeparam TKey - The type of the grouping key.
 * @typeparam TElement - The type of elements in the group.
 * @typeparam TResult - The type of the result.
 *
 * @remarks
 * Used in async group transformations to create a new result from a key and its associated async elements.
 *
 * @example
 * ```typescript
 * // Create an async summary for each age group
 * const asyncResultSelector: TResultSelectorAsync<number, Person, string> =
 *   async (age, peopleGroup) => {
 *     const count = await peopleGroup.countAsync();
 *     return `Age ${age}: ${count} people`;
 *   };
 * ```
 */
export type TResultSelectorAsync<TKey, TElement, TResult> = (
  x: TKey,
  y: IAsyncEnumerable<TElement>,
) => Promise<TResult>;
//#endregion

//#region join selectors
/**
 * Represents a synchronous function that creates a result from a key and an element during a join operation.
 *
 * @typeparam TKey - The type of the join key.
 * @typeparam TElement - The type of the element.
 * @typeparam TResult - The type of the result.
 *
 * @remarks
 * Used to transform elements during join operations.
 *
 * @example
 * ```typescript
 * // Combine order with customer details
 * const joinResultSelector: TResultSelectorJoin<number, Customer, OrderSummary> =
 *   (orderId, customer) => ({
 *     orderId,
 *     customerName: customer.name
 *   });
 * ```
 */
export type TResultSelectorJoin<TKey, TElement, TResult> = (
  x: TKey,
  y: TElement,
) => TResult;

/**
 * Represents an asynchronous function that creates a result from a key and an element during a join operation.
 *
 * @typeparam TKey - The type of the join key.
 * @typeparam TElement - The type of the element.
 * @typeparam TResult - The type of the result.
 *
 * @remarks
 * Used to transform elements during async join operations.
 *
 * @example
 * ```typescript
 * // Async combine of order with customer details
 * const asyncJoinResultSelector: TResultSelectorJoinAsync<number, Customer, OrderSummary> =
 *   async (orderId, customer) => ({
 *     orderId,
 *     customerName: await customer.fetchDisplayName()
 *   });
 * ```
 */
export type TResultSelectorJoinAsync<TKey, TElement, TResult> = (
  x: TKey,
  y: TElement,
) => TResult | Promise<TResult>;
//#endregion

//#region Zip selectors
/**
 * Represents a synchronous function that creates a result by combining two elements.
 *
 * @typeparam T - The type of the first element.
 * @typeparam TSecond - The type of the second element.
 * @typeparam TResult - The type of the result.
 *
 * @remarks
 * Used in zip operations to combine elements from two collections.
 *
 * @example
 * ```typescript
 * // Combine names and ages
 * const zipResultSelector: TZipResultSelector<string, number, Person> =
 *   (name, age) => ({ name, age });
 * ```
 */
export type TZipResultSelector<T, TSecond, TResult> = (
  x: T,
  y: TSecond,
) => TResult;

/**
 * Represents a flexible result type for zip operations, supporting tuples or custom results.
 *
 * @typeparam T - The type of the first element.
 * @typeparam TSecond - The type of the second element.
 * @typeparam TThird - Optional type of a third element.
 * @typeparam TResult - The type of a custom result.
 *
 * @remarks
 * Allows returning either a tuple of elements or a custom transformed result.
 *
 * @example
 * ```typescript
 * // Can be a tuple or a custom result
 * const zipResult1: TZipResult<string, number, null, Person> = ['John', 30];
 * const zipResult2: TZipResult<string, number, null, Person> = { name: 'John', age: 30 };
 * ```
 */
export type TZipResult<T, TSecond, TThird, TResult> =
  | [T, TSecond]
  | [T, TSecond, TThird]
  | TResult;

/**
 * Represents an asynchronous function that creates a result by combining two elements.
 *
 * @typeparam T - The type of the first element.
 * @typeparam TSecond - The type of the second element.
 * @typeparam TResult - The type of the result.
 *
 * @remarks
 * Used in async zip operations to combine elements from two collections with potential async computation.
 *
 * @example
 * ```typescript
 * // Async combine of names and ages
 * const asyncZipResultSelector: TZipResultSelectorAsync<string, number, Person> =
 *   async (name, age) => {
 *     const formattedName = await formatName(name);
 *     return { name: formattedName, age };
 *   };
 * ```
 */
export type TZipResultSelectorAsync<T, TSecond, TResult> = (
  x: T,
  y: TSecond,
) => TResult | Promise<TResult>;
//#endregion

//#region SelectMany selectors
/**
 * Represents a synchronous function that selects a collection from an element during a SelectMany operation.
 *
 * @typeparam T - The type of the source element.
 * @typeparam TCollection - The type of elements in the selected collection.
 *
 * @remarks
 * Used to flatten a collection by selecting a subcollection from each element.
 *
 * @example
 * ```typescript
 * // Select tags from a blog post
 * const selectManySelector: SelectManySelector<BlogPost, string> =
 *   post => post.tags;
 * ```
 */
export type SelectManySelector<T, TCollection> = (
  x: T,
  y: number,
) => Iterable<TCollection>;

/**
 * Represents a synchronous function that transforms an element and its selected collection.
 *
 * @typeparam T - The type of the source element.
 * @typeparam TCollection - The type of elements in the selected collection.
 * @typeparam TResult - The type of the result.
 *
 * @remarks
 * Used to transform elements during a SelectMany operation.
 *
 * @example
 * ```typescript
 * // Transform blog post and its tags
 * const selectManyResultSelector: SelectManyResultSelector<BlogPost, string, TagInfo> =
 *   (post, tag) => ({ postTitle: post.title, tag });
 * ```
 */
export type SelectManyResultSelector<T, TCollection, TResult> = (
  x: T,
  y: TCollection,
) => TResult;

/**
 * Represents an asynchronous function that selects a collection from an element during an async SelectMany operation.
 *
 * @typeparam T - The type of the source element.
 * @typeparam TCollection - The type of elements in the selected collection.
 *
 * @remarks
 * Used to flatten a collection by selecting a subcollection from each element with potential async computation.
 *
 * @example
 * ```typescript
 * // Async select tags from a blog post
 * const asyncSelectManySelector: SelectManySelectorAsync<BlogPost, string> =
 *   async post => await post.fetchTags();
 * ```
 */
export type SelectManySelectorAsync<T, TCollection> = (
  x: T,
  y: number,
) =>
  | AsyncIterable<TCollection>
  | Promise<AsyncIterable<TCollection>>
  | Iterable<TCollection>
  | Promise<Iterable<TCollection>>;

/**
 * Represents an asynchronous function that transforms an element and its selected collection.
 *
 * @typeparam T - The type of the source element.
 * @typeparam TCollection - The type of elements in the selected collection.
 * @typeparam TResult - The type of the result.
 *
 * @remarks
 * Used to transform elements during an async SelectMany operation.
 *
 * @example
 * ```typescript
 * // Async transform of blog post and its tags
 * const asyncSelectManyResultSelector: SelectManyResultSelectorAsync<BlogPost, string, TagInfo> =
 *   async (post, tag) => {
 *     const processedTag = await processTag(tag);
 *     return { postTitle: post.title, tag: processedTag };
 *   };
 * ```
 */
export type SelectManyResultSelectorAsync<T, TCollection, TResult> = (
  x: T,
  y: TCollection,
) => TResult | Promise<TResult>;
//#endregion
