import type {
  AggregateFunctionType,
  AggregateResultType,
  AggregateFunctionSeedSelector,
} from "./aggregate.ts";
import { EqualityComparer } from "../comparer/equality-comparer.ts";
import type { IGrouping } from "./grouping.ts";
import type { OfType } from "./infer.ts";
import type {
  TElementSelector,
  TKeySelector,
  TResultSelector,
  TResultSelectorJoin,
  SelectManyResultSelector,
  SelectManySelector,
} from "./selectors.ts";
import { Comparer } from "../comparer/comparer.ts";
import type { IOrderedEnumerable } from "./order.ts";

export interface IEnumerable<T> extends Iterable<T> {
  get enumeratorSource(): Iterable<T>;
  iterator(): Iterator<T>;

  /**
   * Applies an accumulator function over a sequence.
   *
   * @typeparam T - The type of elements in the sequence.
   * @typeparam TResult - The type of the accumulated result.
   *
   * @param func - An accumulator function to be invoked on each element.
   * Takes two parameters: the accumulator value and current element,
   * returns the new accumulator value.
   *
   * @returns The final accumulator value.
   *
   * @throws \{NoElementsException\} If the sequence is empty.
   * @throws \{InvalidArgumentException\} If func is not a function.
   *
   * @example
   * ```typescript
   * // Sum all numbers
   * Enumerable.create([1, 2, 3]).aggregate((acc, val) => acc + val); // 6
   *
   * // Find maximum value
   * Enumerable.create([1, 5, 3]).aggregate((acc, val) => Math.max(acc, val)); // 5
   *
   * // Concatenate strings
   * Enumerable.create(['a', 'b', 'c']).aggregate((acc, val) => acc + val); // 'abc'
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.aggregate}
   */
  aggregate<TResult>(func: AggregateFunctionType<T, T>): TResult;
  /**
   * Applies an accumulator function over a sequence with an optional seed value.
   *
   * @typeparam T - The type of elements in the sequence.
   * @typeparam TAccumulate - The type of the accumulator value.
   *
   * @param func - An accumulator function to be invoked on each element.
   * Takes two parameters: the current accumulator value and element,
   * returns the new accumulator value.
   * @param seed - Optional. The initial accumulator value.
   * If not provided, the first element is used as the initial value.
   *
   * @returns The final accumulator value.
   *
   * @throws \{InvalidOperationException\} If the sequence is empty and no seed is provided.
   * @throws \{InvalidArgumentException\} If func is not a function.
   *
   * @example
   * ```typescript
   * // Sum with initial value
   * Enumerable.create([1, 2, 3]).aggregate((acc, val) => acc + val, 10); // 16
   *
   * // Custom accumulation with seed
   * Enumerable.create(['a', 'b'])
   *   .aggregate((acc, val) => acc + ',' + val, 'start'); // 'start,a,b'
   *
   * // Empty sequence with seed returns seed
   * Enumerable.create([]).aggregate((acc, val) => acc + val, 0); // 0
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.aggregate}
   */
  aggregate<TAccumulate>(
    func: AggregateFunctionType<T, TAccumulate>,
    seed?: TAccumulate,
  ): TAccumulate;
  /**
   * Applies an accumulator function over a sequence with an optional seed value
   * and transforms the result using a selector function.
   *
   * @typeparam T - The type of elements in the sequence.
   * @typeparam TAccumulate - The type of the accumulator value.
   * @typeparam TResult - The type of the result value.
   *
   * @param func - An accumulator function to be invoked on each element.
   * Takes two parameters: the current accumulator value and element,
   * returns the new accumulator value.
   * @param seed - Optional. The initial accumulator value.
   * If not provided, the first element is used as the initial value.
   * @param resultSelector - Optional. A function to transform the final accumulator value
   * into the result value.
   *
   * @returns The transformed final accumulator value.
   *
   * @throws \{InvalidOperationException\} If the sequence is empty and no seed is provided.
   * @throws \{InvalidArgumentException\} If func is not a function.
   *
   * @example
   * ```typescript
   * // Sum and convert to string
   * Enumerable.create([1, 2, 3])
   *   .aggregate((acc, val) => acc + val, 0, sum => `Total: ${sum}`);
   * // "Total: 6"
   *
   * // Calculate average
   * Enumerable.create([1, 2, 3, 4])
   *   .aggregate(
   *     (acc, val) => ({ sum: acc.sum + val, count: acc.count + 1 }),
   *     { sum: 0, count: 0 },
   *     result => result.sum / result.count
   *   ); // 2.5
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.aggregate}
   */
  aggregate<TAccumulate, TResult>(
    func: AggregateFunctionType<T, TAccumulate>,
    seed?: TAccumulate,
    resultSelector?: AggregateResultType<TAccumulate, TResult>,
  ): TResult;

  /**
   * Groups and aggregates elements in a sequence based on a key selector.
   *
   * @typeparam TKey - The type of the key used for grouping.
   * @typeparam TAccumulate - The type of the accumulator value.
   *
   * @param keySelector - A function to extract the key for each element.
   * @param seed - An initial accumulator value, or a function that returns the initial value for each key.
   * @param func - An accumulator function to be invoked on each element within a group.
   * Takes two parameters: the current accumulator value and element,
   * returns the new accumulator value.
   * @param comparer - Optional. An EqualityComparer<TKey> to compare keys.
   *
   * @returns An IEnumerable\<[TKey, TAccumulate]\> where each element is a tuple of key and aggregated value.
   *
   * @throws \{InvalidArgumentException\} If keySelector or func is not a function.
   *
   * @example
   * ```typescript
   * // Sum values by category
   * const items = [
   *   { category: 'A', value: 10 },
   *   { category: 'B', value: 20 },
   *   { category: 'A', value: 30 }
   * ];
   *
   * Enumerable.create(items)
   *   .aggregateBy(
   *     x => x.category,
   *     0,
   *     (acc, item) => acc + item.value
   *   )
   *   .toArray();
   * // [['A', 40], ['B', 20]]
   *
   * // Using seed selector
   * Enumerable.create(items)
   *   .aggregateBy(
   *     x => x.category,
   *     key => ({ key, sum: 0 }),
   *     (acc, item) => ({ ...acc, sum: acc.sum + item.value })
   *   )
   *   .toArray();
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.aggregate}
   */
  aggregateBy<TKey, TAccumulate>(
    keySelector: TKeySelector<T, TKey>,
    seed: TAccumulate | AggregateFunctionSeedSelector<TKey, TAccumulate>,
    func: AggregateFunctionType<T, TAccumulate>,
    comparer?: EqualityComparer<TKey>,
  ): IEnumerable<[TKey, TAccumulate]>;

  /**
   * Determines whether all elements in a sequence satisfy a condition.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param predicate - A function to test each element for a condition.
   * The predicate takes an element of type T and returns a boolean.
   *
   * @returns `true` if every element of the sequence passes the test in the specified predicate,
   * or if the sequence is empty; otherwise, `false`.
   *
   * @throws \{InvalidArgumentException\} If predicate is not a function.
   *
   * @example
   * ```typescript
   * // Check if all numbers are positive
   * Enumerable.create([1, 2, 3]).all(x => x > 0); // true
   *
   * // Check if all numbers are even
   * Enumerable.create([1, 2, 3]).all(x => x % 2 === 0); // false
   *
   * // Empty sequence returns true
   * Enumerable.create([]).all(x => true); // true
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.all}
   */
  all(predicate: (x: T) => boolean): boolean;

  /**
   * Determines whether any element of a sequence exists or satisfies a condition.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param predicate - Optional. A function to test each element for a condition.
   * If not provided, checks if the sequence contains any elements.
   *
   * @returns When predicate is provided: `true` if any element satisfies the condition;
   * otherwise, `false`. When predicate is not provided: `true` if the sequence contains
   * any elements; otherwise, `false`.
   *
   *
   * @example
   * ```typescript
   * // Check if sequence has any elements
   * Enumerable.create([1, 2, 3]).any(); // true
   * Enumerable.create([]).any(); // false
   *
   * // Check if any element satisfies condition
   * Enumerable.create([1, 2, 3]).any(x => x > 2); // true
   * Enumerable.create([1, 2, 3]).any(x => x > 5); // false
   *
   * // Empty sequence with predicate returns false
   * Enumerable.create([]).any(x => true); // false
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.any}
   */
  any(predicate?: (x: T) => boolean): boolean;

  /**
   * Appends a value to the end of the sequence.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param item - The value to append to the sequence.
   *
   * @returns A new sequence that ends with the specified item.
   *
   * @example
   * ```typescript
   * // Append number
   * Enumerable.create([1, 2]).append(3).toArray(); // [1, 2, 3]
   *
   * // Append to empty sequence
   * Enumerable.create<number>([]).append(1).toArray(); // [1]
   *
   * // Append object
   * Enumerable.create([{id: 1}])
   *   .append({id: 2})
   *   .toArray(); // [{id: 1}, {id: 2}]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.append}
   */
  append(item: T): IEnumerable<T>;

  /**
   * Computes the average of a sequence of numeric values, or values selected by a transform function.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param selector - Optional. A transform function to apply to each element before computing the average.
   * If not provided, the sequence must contain numeric values.
   *
   * @returns The average of the sequence of values.
   *
   * @throws \{NoElementsException\} If the sequence is empty.
   * @throws \{InvalidArgumentException\} If selector is provided but is not a function.
   * @throws \{NotNumberException\} If any element or transformed value is not a number.
   *
   * @example
   * ```typescript
   * // Direct numeric average
   * Enumerable.create([1, 2, 3]).average(); // 2
   *
   * // Average with selector
   * Enumerable.create([{ value: 10 }, { value: 20 }])
   *   .average(x => x.value); // 15
   *
   * // Empty sequence throws
   * Enumerable.create([]).average(); // throws NoElementsException
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.average}
   */
  average(selector?: (x: T) => number): number;

  /**
   * Splits the sequence into chunks of the specified size.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param size - The size of each chunk. Must be greater than 0.
   *
   * @returns An IEnumerable\<Array\<T\>\> containing chunks of the original sequence.
   * The last chunk may contain fewer elements if the sequence length is not evenly divisible by size.
   *
   * @throws \{RangeError\} If size is null, undefined, or less than or equal to 0.
   *
   * @example
   * ```typescript
   * // Basic chunking
   * Enumerable.create([1, 2, 3, 4, 5])
   *   .chunk(2)
   *   .toArray(); // [[1, 2], [3, 4], [5]]
   *
   * // Empty sequence returns empty
   * Enumerable.create([]).chunk(2).toArray(); // []
   *
   * // Perfect chunks
   * Enumerable.create([1, 2, 3, 4])
   *   .chunk(2)
   *   .toArray(); // [[1, 2], [3, 4]]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.chunk}
   */
  chunk(size: number): IEnumerable<Array<T>>;

  /**
   * Concatenates two sequences into a single sequence.
   *
   * @typeparam T - The type of elements in both sequences.
   *
   * @param second - The sequence to concatenate to the first sequence.
   * The elements are added after all elements from the first sequence.
   *
   * @returns A new sequence that contains the elements from the first sequence
   * followed by the elements from the second sequence.
   *
   * @throws \{NotIterableException\} If second is not iterable.
   *
   * @example
   * ```typescript
   * // Basic number concatenation
   * Enumerable.create([1, 2]).concat([3, 4]).toArray(); // [1, 2, 3, 4]
   *
   * // String concatenation
   * Enumerable.create(['a']).concat(['b']).toArray(); // ['a', 'b']
   *
   * // Empty sequence handling
   * Enumerable.create([1]).concat([]).toArray(); // [1]
   * Enumerable.create<number>([]).concat([1]).toArray(); // [1]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.concat}
   */
  concat(second: Iterable<T>): IEnumerable<T>;

  /**
   * Determines whether a sequence contains a specified element.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param value - The value to locate in the sequence.
   * @param comparer - Optional. An EqualityComparer<T> to compare values.
   * If not provided, uses the default equality comparer.
   *
   * @returns `true` if the sequence contains the specified value; otherwise, `false`.
   *
   * @example
   * ```typescript
   * // Basic value check
   * Enumerable.create([1, 2, 3]).contains(2); // true
   * Enumerable.create([1, 2, 3]).contains(4); // false
   *
   * // With custom comparer
   * class CaseInsensitiveComparer extends EqualityComparer<string> {
   *   equals(x?: string, y?: string): boolean {
   *     return (x || '').toLowerCase() === (y || '').toLowerCase();
   *   }
   * }
   *
   * Enumerable.create(['A', 'B'])
   *   .contains('a', new CaseInsensitiveComparer()); // true
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.contains}
   */
  contains(value: T, comparer?: EqualityComparer<T>): boolean;

  /**
   * Returns the number of elements in a sequence that satisfy an optional condition.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param predicate - Optional. A function to test each element for a condition.
   * If not provided, returns the total number of elements in the sequence.
   *
   * @returns The number of elements that satisfy the condition if predicate is provided;
   * otherwise, the total number of elements in the sequence.
   *
   * @example
   * ```typescript
   * // Total count
   * Enumerable.create([1, 2, 3]).count(); // 3
   *
   * // Count with predicate
   * Enumerable.create([1, 2, 3]).count(x => x > 1); // 2
   *
   * // Empty sequence
   * Enumerable.create([]).count(); // 0
   *
   * // No matches
   * Enumerable.create([1, 2, 3]).count(x => x > 10); // 0
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.count}
   */
  count(predicate?: (x: T) => boolean): number;

  /**
   * Groups elements by key and counts the number of elements in each group.
   *
   * @typeparam T - The type of elements in the sequence.
   * @typeparam TKey - The type of the key returned by keySelector.
   *
   * @param keySelector - Optional. A function to extract the key from each element.
   * If not provided, uses the element itself as the key.
   * @param comparer - Optional. An EqualityComparer<TKey> to compare keys.
   *
   * @returns An IEnumerable\<[TKey, number]\> containing key-count pairs,
   * where each pair consists of a unique key and the number of elements with that key.
   *
   * @throws \{InvalidArgumentException\} If keySelector is provided but is not a function.
   *
   * @example
   * ```typescript
   * // Basic counting by value
   * Enumerable.create(['a', 'b', 'a', 'c'])
   *   .countBy()
   *   .toArray(); // [['a', 2], ['b', 1], ['c', 1]]
   *
   * // Counting by object property
   * const items = [
   *   { category: 'A', value: 1 },
   *   { category: 'B', value: 2 },
   *   { category: 'A', value: 3 }
   * ];
   * Enumerable.create(items)
   *   .countBy(x => x.category)
   *   .toArray(); // [['A', 2], ['B', 1]]
   *
   * // Using custom comparer
   * class CaseInsensitiveComparer extends EqualityComparer<string> {
   *   equals(x?: string, y?: string): boolean {
   *     return (x || '').toLowerCase() === (y || '').toLowerCase();
   *   }
   * }
   *
   * Enumerable.create(['A', 'a', 'B'])
   *   .countBy(x => x, new CaseInsensitiveComparer())
   *   .toArray(); // [['A', 2], ['B', 1]]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable}
   */
  countBy<TKey>(
    keySelector?: TKeySelector<T, TKey>,
    comparer?: EqualityComparer<TKey>,
  ): IEnumerable<[TKey, number]>;

  /**
   * Returns the elements of a sequence, or a singleton sequence containing the default value
   * if the sequence is empty.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param defaultValue - Optional. The value to return in a singleton sequence if the source sequence is empty.
   * If not provided, returns undefined.
   *
   * @returns An IEnumerable<T> that contains defaultValue if source is empty;
   * otherwise, returns the elements from the source sequence.
   *
   * @example
   * ```typescript
   * // Empty sequence with default
   * Enumerable.create<number>([])
   *   .defaultIfEmpty(0)
   *   .toArray(); // [0]
   *
   * // Empty sequence without default
   * Enumerable.create([])
   *   .defaultIfEmpty()
   *   .toArray(); // [undefined]
   *
   * // Non-empty sequence ignores default
   * Enumerable.create([1, 2])
   *   .defaultIfEmpty(0)
   *   .toArray(); // [1, 2]
   *
   * // With objects
   * Enumerable.create<{id: number}[]>([])
   *   .defaultIfEmpty({id: 0})
   *   .toArray(); // [{id: 0}]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.defaultifempty}
   */
  defaultIfEmpty(defaultValue?: T): IEnumerable<T>;

  /**
   * Returns distinct elements from a sequence using an optional equality comparer.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param comparer - Optional. An EqualityComparer<T> to compare values.
   * If not provided, uses the default equality comparer.
   *
   * @returns An IEnumerable<T> that contains distinct elements from the sequence.
   *
   * @example
   * ```typescript
   * // Basic distinct numbers
   * Enumerable.create([1, 1, 2, 3, 2])
   *   .distinct()
   *   .toArray(); // [1, 2, 3]
   *
   * // Object distinct with custom comparer
   * class PersonComparer extends EqualityComparer<{id: number}> {
   *   equals(x?: {id: number}, y?: {id: number}): boolean {
   *     return x?.id === y?.id;
   *   }
   * }
   *
   * const people = [
   *   {id: 1, name: 'John'},
   *   {id: 1, name: 'Jane'},
   *   {id: 2, name: 'Bob'}
   * ];
   *
   * Enumerable.create(people)
   *   .distinct(new PersonComparer())
   *   .toArray(); // [{id: 1, name: 'John'}, {id: 2, name: 'Bob'}]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.distinct}
   */
  distinct(comparer?: EqualityComparer<T>): IEnumerable<T>;

  /**
   * Returns distinct elements from a sequence using a key selector function and an optional comparer.
   *
   * @typeparam T - The type of elements in the sequence.
   * @typeparam TKey - The type of the key returned by keySelector.
   *
   * @param keySelector - A function to extract the key for comparison.
   * @param comparer - Optional. An EqualityComparer<TKey> to compare keys.
   * If not provided, uses the default equality comparer.
   *
   * @returns An IEnumerable<T> that contains elements with distinct keys from the sequence.
   *
   * @throws \{InvalidArgumentException\} If keySelector is not a function.
   *
   * @example
   * ```typescript
   * // Basic property selection
   * const items = [
   *   { id: 1, name: 'John' },
   *   { id: 1, name: 'Jane' },
   *   { id: 2, name: 'Bob' }
   * ];
   *
   * Enumerable.create(items)
   *   .distinctBy(x => x.id)
   *   .toArray(); // [{id: 1, name: 'John'}, {id: 2, name: 'Bob'}]
   *
   * // Case insensitive name comparison
   * class CaseInsensitiveComparer extends EqualityComparer<string> {
   *   equals(x?: string, y?: string): boolean {
   *     return (x || '').toLowerCase() === (y || '').toLowerCase();
   *   }
   * }
   *
   * const names = [
   *   { name: 'John', age: 25 },
   *   { name: 'JOHN', age: 30 },
   *   { name: 'Bob', age: 35 }
   * ];
   *
   * Enumerable.create(names)
   *   .distinctBy(x => x.name, new CaseInsensitiveComparer())
   *   .toArray(); // [{name: 'John', age: 25}, {name: 'Bob', age: 35}]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.distinctby}
   */
  distinctBy<TKey>(
    keySelector: TKeySelector<T, TKey>,
    comparer?: EqualityComparer<TKey>,
  ): IEnumerable<T>;

  /**
   * Returns the element at a specified index in a sequence.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param index - The zero-based index of the element to retrieve.
   *
   * @returns The element at the specified index.
   *
   * @throws \{InvalidArgumentException\} If index is not a number.
   * @throws \{OutOfRangeException\} If index is less than 0 or greater than or equal to the number of elements.
   *
   * @example
   * ```typescript
   * // Basic index access
   * Enumerable.create([1, 2, 3]).elementAt(1); // 2
   *
   * // Object access
   * Enumerable.create([{id: 1}, {id: 2}]).elementAt(0); // {id: 1}
   *
   * // Out of range throws
   * Enumerable.create([1]).elementAt(1); // throws OutOfRangeException
   *
   * // Empty sequence throws
   * Enumerable.create([]).elementAt(0); // throws OutOfRangeException
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.elementat}
   */
  elementAt(index: number): T;

  /**
   * Returns the element at a specified index in a sequence or a default value if the index is out of range.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param defaultValue - The value to return if index is out of range.
   * @param index - The zero-based index of the element to retrieve.
   *
   * @returns The element at the specified index if it exists;
   * otherwise, the default value.
   *
   * @example
   * ```typescript
   * // Valid index
   * Enumerable.create([1, 2, 3]).elementAtOrDefault(0, 1); // 2
   *
   * // Out of range returns default
   * Enumerable.create([1, 2]).elementAtOrDefault(999, 5); // 999
   *
   * // Empty sequence returns default
   * Enumerable.create([]).elementAtOrDefault(0, 0); // 0
   *
   * // With objects
   * const defaultObj = {id: 0, name: 'default'};
   * Enumerable.create([{id: 1, name: 'one'}])
   *   .elementAtOrDefault(defaultObj, 1); // {id: 0, name: 'default'}
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.elementatordefault}
   */
  elementAtOrDefault(defaultValue: T, index: number): T;

  /**
   * Produces the set difference of two sequences.
   *
   * @typeparam T - The type of elements in the sequences.
   *
   * @param second - The sequence whose elements will be excluded.
   * @param comparer - Optional. An EqualityComparer<T> to compare values.
   * If not provided, uses the default equality comparer.
   *
   * @returns An IEnumerable<T> containing elements that exist in the first sequence
   * but not in the second sequence.
   *
   * @throws \{NotIterableException\} If second is not iterable.
   *
   * @example
   * ```typescript
   * // Basic number difference
   * Enumerable.create([1, 2, 3])
   *   .except([2, 3, 4])
   *   .toArray(); // [1]
   *
   * // With custom comparer
   * class PersonComparer extends EqualityComparer<{id: number}> {
   *   equals(x?: {id: number}, y?: {id: number}): boolean {
   *     return x?.id === y?.id;
   *   }
   * }
   *
   * const seq1 = [{id: 1}, {id: 2}];
   * const seq2 = [{id: 2}, {id: 3}];
   *
   * Enumerable.create(seq1)
   *   .except(seq2, new PersonComparer())
   *   .toArray(); // [{id: 1}]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.except}
   */
  except(second: Iterable<T>, comparer?: EqualityComparer<T>): IEnumerable<T>;

  /**
   * Produces the set difference of two sequences according to a specified key selector function.
   *
   * @typeparam T - The type of elements in the source sequence.
   * @typeparam TKey - The type of key to compare elements by.
   *
   * @param second - The sequence whose keys will be excluded.
   * @param keySelector - A function to extract the key for each element.
   * @param comparer - Optional. An EqualityComparer<TKey> to compare keys.
   * If not provided, uses the default equality comparer.
   *
   * @returns An IEnumerable<T> containing elements from the first sequence whose keys
   * are not present in the second sequence.
   *
   * @throws \{InvalidArgumentException\} If keySelector is not a function.
   * @throws \{NotIterableException\} If second is not iterable.
   *
   * @example
   * ```typescript
   * // Basic key selection
   * const items = [
   *   { id: 1, name: 'John' },
   *   { id: 2, name: 'Jane' }
   * ];
   * const excludeIds = [2, 3];
   *
   * Enumerable.create(items)
   *   .exceptBy(excludeIds, x => x.id)
   *   .toArray(); // [{ id: 1, name: 'John' }]
   *
   * // Case insensitive comparison
   * class CaseInsensitiveComparer extends EqualityComparer<string> {
   *   equals(x?: string, y?: string): boolean {
   *     return (x || '').toLowerCase() === (y || '').toLowerCase();
   *   }
   * }
   *
   * const names = [{ name: 'John' }, { name: 'JANE' }];
   * const excludeNames = ['jane', 'bob'];
   *
   * Enumerable.create(names)
   *   .exceptBy(excludeNames, x => x.name, new CaseInsensitiveComparer())
   *   .toArray(); // [{ name: 'John' }]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.exceptby}
   */
  exceptBy<TKey>(
    second: Iterable<TKey>,
    keySelector: TKeySelector<T, TKey>,
    comparer?: EqualityComparer<TKey>,
  ): IEnumerable<T>;

  /**
   * Returns elements that appear in either of two sequences, but not both (symmetric difference).
   *
   * @typeparam T - The type of elements in the sequences.
   *
   * @param second - The sequence to compare against.
   * @param comparer - Optional. An EqualityComparer<T> to compare values.
   * If not provided, uses the default equality comparer.
   *
   * @returns An IEnumerable<T> containing elements that are present in only one of the sequences.
   *
   * @throws \{NotIterableException\} If second is not iterable.
   *
   * @example
   * ```typescript
   * // Basic number difference
   * Enumerable.create([1, 2, 3])
   *   .exclusive([2, 3, 4])
   *   .toArray(); // [1, 4]
   *
   * // Object comparison
   * class PersonComparer extends EqualityComparer<{id: number}> {
   *   equals(x?: {id: number}, y?: {id: number}): boolean {
   *     return x?.id === y?.id;
   *   }
   * }
   *
   * const seq1 = [{id: 1}, {id: 2}];
   * const seq2 = [{id: 2}, {id: 3}];
   *
   * Enumerable.create(seq1)
   *   .exclusive(seq2, new PersonComparer())
   *   .toArray(); // [{id: 1}, {id: 3}]
   * ```
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/symmetricDifference}
   */
  exclusive(
    second: Iterable<T>,
    comparer?: EqualityComparer<T>,
  ): IEnumerable<T>;

  /**
   * Returns elements that appear in either of two sequences, but not both,
   * based on a key selector function.
   *
   * @typeparam T - The type of elements in the sequences.
   * @typeparam TKey - The type of key to compare elements by.
   *
   * @param second - The sequence to compare against.
   * @param keySelector - A function to extract the key for each element.
   * @param comparer - Optional. An EqualityComparer<TKey> to compare keys.
   * If not provided, uses the default equality comparer.
   *
   * @returns An IEnumerable<T> containing elements whose keys are present
   * in only one of the sequences.
   *
   * @throws \{InvalidArgumentException\} If keySelector is not a function.
   * @throws \{NotIterableException\} If second is not iterable.
   *
   * @example
   * ```typescript
   * // Basic key selection
   * const seq1 = [{ id: 1, val: 'a' }, { id: 2, val: 'b' }];
   * const seq2 = [{ id: 2, val: 'c' }, { id: 3, val: 'd' }];
   *
   * Enumerable.create(seq1)
   *   .exclusiveBy(seq2, x => x.id)
   *   .toArray();
   * // [{ id: 1, val: 'a' }, { id: 3, val: 'd' }]
   *
   * // Case insensitive name comparison
   * class CaseInsensitiveComparer extends EqualityComparer<string> {
   *   equals(x?: string, y?: string): boolean {
   *     return (x || '').toLowerCase() === (y || '').toLowerCase();
   *   }
   * }
   *
   * const names1 = [{ name: 'John' }, { name: 'JANE' }];
   * const names2 = [{ name: 'jane' }, { name: 'Bob' }];
   *
   * Enumerable.create(names1)
   *   .exclusiveBy(names2, x => x.name, new CaseInsensitiveComparer())
   *   .toArray();
   * // [{ name: 'John' }, { name: 'Bob' }]
   * ```
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/symmetricDifference}
   */
  exclusiveBy<TKey>(
    second: Iterable<T>,
    keySelector: TKeySelector<T, TKey>,
    comparer?: EqualityComparer<TKey>,
  ): IEnumerable<T>;

  /**
   * Returns the first element in a sequence, or the first element that satisfies a condition.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param predicate - Optional. A function to test each element for a condition.
   *
   * @returns The first element in the sequence that passes the test if provided,
   * or the first element if no predicate is specified.
   *
   * @throws \{NoElementsException\} If the sequence is empty.
   * @throws \{NoElementsSatisfyCondition\} If no element satisfies the predicate.
   * @throws \{InvalidArgumentException\} If predicate is provided but is not a function.
   *
   * @example
   * ```typescript
   * // First element
   * Enumerable.create([1, 2, 3]).first(); // 1
   *
   * // First matching element
   * Enumerable.create([1, 2, 3]).first(x => x > 1); // 2
   *
   * // Empty sequence throws
   * Enumerable.create([]).first(); // throws InvalidOperationException
   *
   * // No matches throws
   * Enumerable.create([1, 2]).first(x => x > 5); // throws InvalidOperationException
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.first}
   */
  first(predicate?: (x: T) => boolean): T;

  /**
   * Returns the first element in a sequence that satisfies a condition,
   * or a default value if no element exists or matches the condition.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param defaultValue - The value to return if no element exists or matches the condition.
   * @param predicate - Optional. A function to test each element for a condition.
   *
   * @returns The first element that passes the predicate if provided,
   * or the first element if no predicate specified;
   * returns defaultValue if the sequence is empty or no element matches.
   *
   *
   * @example
   * ```typescript
   * // First element or default
   * Enumerable.create([1, 2]).firstOrDefault(0); // 1
   * Enumerable.create([]).firstOrDefault(0); // 0
   *
   * // With predicate
   * Enumerable.create([1, 2, 3])
   *   .firstOrDefault(0, x => x > 2); // 3
   *
   * // No matches returns default
   * Enumerable.create([1, 2])
   *   .firstOrDefault(0, x => x > 5); // 0
   *
   * // With objects
   * const defaultPerson = { id: 0, name: 'default' };
   * Enumerable.create([])
   *   .firstOrDefault(defaultPerson); // { id: 0, name: 'default' }
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.firstordefault}
   */
  firstOrDefault(defaultValue: T, predicate?: (x: T) => boolean): T;

  /**
   * Performs an action on each element of a sequence and returns a sequence of the results.
   *
   * @typeparam T - The type of elements in the source sequence.
   * @typeparam TResult - The type of elements in the result sequence.
   *
   * @param action - A function to execute on each element, returning a result.
   *
   * @returns An IEnumerable<TResult> containing the results of executing the action on each element.
   *
   * @throws \{InvalidArgumentException\} If action is not a function.
   *
   * @example
   * ```typescript
   * // Basic transformation
   * Enumerable.create([1, 2, 3])
   *   .forEach(x => x * 2)
   *   .toArray(); // [2, 4, 6]
   *
   * // Object transformation
   * Enumerable.create([{ value: 1 }, { value: 2 }])
   *   .forEach(x => ({ doubled: x.value * 2 }))
   *   .toArray(); // [{ doubled: 2 }, { doubled: 4 }]
   *
   * // Side effects with logging
   * Enumerable.create([1, 2])
   *   .forEach(x => {
   *     console.log(x);
   *     return x;
   *   })
   *   .toArray();
   * ```
   */
  forEach<TResult>(action: (x: T) => TResult): IEnumerable<TResult>;

  /**
   * Groups elements in a sequence according to a specified key selector function.
   *
   * @typeparam T - The type of elements in the sequence.
   * @typeparam TKey - The type of the key returned by keySelector.
   *
   * @param keySelector - A function to extract the key for each element.
   * @param comparer - Optional. An EqualityComparer<TKey> to compare keys.
   * If not provided, uses the default equality comparer.
   *
   * @returns An IEnumerable\<IGrouping\<TKey, T\>\> where each IGrouping object
   * contains a sequence of objects and a key.
   *
   * @throws \{InvalidArgumentException\} If keySelector is not a function.
   *
   * @example
   * ```typescript
   * // Basic number grouping
   * const numbers = [1, 2, 3, 4, 5];
   * Enumerable.create(numbers)
   *   .groupBy(x => x % 2)
   *   .select(g => ({ key: g.key, values: g.toArray() }))
   *   .toArray();
   * // [
   * //   { key: 1, values: [1, 3, 5] },
   * //   { key: 0, values: [2, 4] }
   * // ]
   *
   * // Object grouping
   * const items = [
   *   { category: 'A', value: 1 },
   *   { category: 'B', value: 2 },
   *   { category: 'A', value: 3 }
   * ];
   *
   * Enumerable.create(items)
   *   .groupBy(x => x.category)
   *   .select(g => ({
   *     category: g.key,
   *     sum: g.sum(x => x.value)
   *   }))
   *   .toArray();
   * // [
   * //   { category: 'A', sum: 4 },
   * //   { category: 'B', sum: 2 }
   * // ]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupby}
   */
  groupBy<TKey>(
    keySelector: TKeySelector<T, TKey>,
    comparer?: EqualityComparer<TKey>,
  ): IEnumerable<IGrouping<TKey, T>>;
  /**
   * Groups and transforms elements in a sequence according to a specified key selector function.
   *
   * @typeparam T - The type of elements in the source sequence.
   * @typeparam TKey - The type of the key returned by keySelector.
   * @typeparam TElement - The type of the elements in the resulting groups.
   *
   * @param keySelector - A function to extract the key for each element.
   * @param elementSelector - A function to transform each source element into the output type.
   * @param comparer - Optional. An EqualityComparer<TKey> to compare keys.
   * If not provided, uses the default equality comparer.
   *
   * @returns An IEnumerable\<IGrouping\<TKey, TElement\>\> where each IGrouping object
   * contains transformed elements and a key.
   *
   * @throws \{InvalidArgumentException\} If keySelector or elementSelector is not a function.
   *
   * @example
   * ```typescript
   * // Group and transform objects
   * const orders = [
   *   { id: 1, category: 'A', amount: 100 },
   *   { id: 2, category: 'B', amount: 200 },
   *   { id: 3, category: 'A', amount: 300 }
   * ];
   *
   * Enumerable.create(orders)
   *   .groupBy(
   *     x => x.category,
   *     x => ({ orderId: x.id, value: x.amount })
   *   )
   *   .select(g => ({
   *     category: g.key,
   *     orders: g.toArray()
   *   }))
   *   .toArray();
   * // [
   * //   {
   * //     category: 'A',
   * //     orders: [
   * //       { orderId: 1, value: 100 },
   * //       { orderId: 3, value: 300 }
   * //     ]
   * //   },
   * //   {
   * //     category: 'B',
   * //     orders: [
   * //       { orderId: 2, value: 200 }
   * //     ]
   * //   }
   * // ]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupby}
   */
  groupBy<TKey, TElement>(
    keySelector: TKeySelector<T, TKey>,
    elementSelector: TElementSelector<T, TElement>,
    comparer?: EqualityComparer<TKey>,
  ): IEnumerable<IGrouping<TKey, TElement>>;
  /**
   * Groups and transforms elements in a sequence with optional element and result transformations.
   *
   * @typeparam T - The type of elements in the source sequence.
   * @typeparam TKey - The type of the key returned by keySelector.
   * @typeparam TResult - The type of the elements in the resulting sequence.
   * @typeparam TElement - The type of the elements in the intermediate groups.
   *
   * @param keySelector - A function to extract the key for each element.
   * @param elementSelector - A function to transform each source element.
   * @param resultSelector - A function to transform each group into a result value.
   * @param comparer - Optional. An EqualityComparer<TKey> to compare keys.
   *
   * @returns An IEnumerable<TResult> containing the transformed groups.
   *
   * @throws \{InvalidArgumentException\} If keySelector or elementorSelector or resultSelector is not a function.
   *
   * @example
   * ```typescript
   * // Group, transform elements, and compute results
   * const orders = [
   *   { id: 1, category: 'A', amount: 100 },
   *   { id: 2, category: 'B', amount: 200 },
   *   { id: 3, category: 'A', amount: 300 }
   * ];
   *
   * Enumerable.create(orders)
   *   .groupBy(
   *     x => x.category,                    // key selector
   *     x => x.amount,                      // element selector
   *     (key, elements) => ({               // result selector
   *       category: key,
   *       totalAmount: elements.sum(),
   *       count: elements.count()
   *     })
   *   )
   *   .toArray();
   * // [
   * //   { category: 'A', totalAmount: 400, count: 2 },
   * //   { category: 'B', totalAmount: 200, count: 1 }
   * // ]
   *
   * // With custom key comparer
   * class CaseInsensitiveComparer extends EqualityComparer<string> {
   *   equals(x?: string, y?: string): boolean {
   *     return (x || '').toLowerCase() === (y || '').toLowerCase();
   *   }
   * }
   *
   * Enumerable.create(['A', 'a', 'B', 'b'])
   *   .groupBy(
   *     x => x,
   *     undefined,
   *     (key, elements) => ({
   *       key: key,
   *       count: elements.count()
   *     }),
   *     new CaseInsensitiveComparer()
   *   )
   *   .toArray();
   * // [
   * //   { key: 'A', count: 2 },
   * //   { key: 'B', count: 2 }
   * // ]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupby}
   */
  groupBy<TKey, TResult, TElement = T>(
    keySelector: TKeySelector<T, TKey>,
    elementSelector: TElementSelector<T, TElement> | undefined,
    resultSelector: TResultSelector<TKey, TElement, TResult>,
    comparer?: EqualityComparer<TKey>,
  ): IEnumerable<TResult>;

  /**
   * Correlates elements of two sequences based on key equality and groups the results.
   *
   * @typeparam TInner - The type of elements in the inner sequence.
   * @typeparam TKey - The type of the keys returned by the key selector functions.
   * @typeparam TResult - The type of the result elements.
   *
   * @param inner - The sequence to join to the first sequence.
   * @param outerKeySelector - A function to extract the join key from each element of the first sequence.
   * @param innerKeySelector - A function to extract the join key from each element of the second sequence.
   * @param resultSelector - A function to create a result element from an outer element and its matching inner elements.
   * @param comparer - Optional. An EqualityComparer<TKey> to compare keys.
   *
   * @returns An IEnumerable<TResult> containing elements obtained by performing a grouped join on two sequences.
   *
   * @throws \{NotIterableException\} If inner is not iterable
   * @throws \{InvalidArgumentException\} If outerKeySelector, innerKeySelector, or resultSelector is not a function.
   *
   * @example
   * ```typescript
   * // Basic group join
   * const departments = [
   *   { id: 1, name: 'HR' },
   *   { id: 2, name: 'IT' }
   * ];
   *
   * const employees = [
   *   { deptId: 1, name: 'John' },
   *   { deptId: 1, name: 'Jane' },
   *   { deptId: 2, name: 'Bob' }
   * ];
   *
   * Enumerable.create(departments)
   *   .groupJoin(
   *     employees,
   *     dept => dept.id,
   *     emp => emp.deptId,
   *     (dept, emps) => ({
   *       department: dept.name,
   *       employees: emps.select(e => e.name).toArray()
   *     })
   *   )
   *   .toArray();
   * // [
   * //   { department: 'HR', employees: ['John', 'Jane'] },
   * //   { department: 'IT', employees: ['Bob'] }
   * // ]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupjoin}
   */
  groupJoin<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: TKeySelector<T, TKey>,
    innerKeySelector: TKeySelector<TInner, TKey>,
    resultSelector: TResultSelector<TKey, TInner, TResult>,
    comparer?: EqualityComparer<TKey>,
  ): IEnumerable<TResult>;

  /**
   * Returns a sequence of tuples containing each element with its zero-based index.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @returns An IEnumerable\<[number, T]\> containing tuples of index and element pairs.
   *
   * @example
   * ```typescript
   * // Basic indexing
   * Enumerable.create(['a', 'b', 'c'])
   *   .index()
   *   .toArray(); // [[0, 'a'], [1, 'b'], [2, 'c']]
   *
   * // Object indexing
   * Enumerable.create([{ id: 1 }, { id: 2 }])
   *   .index()
   *   .toArray(); // [[0, { id: 1 }], [1, { id: 2 }]]
   *
   * // Empty sequence
   * Enumerable.create([])
   *   .index()
   *   .toArray(); // []
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable}
   */
  index(): IEnumerable<[number, T]>;

  /**
   * Produces the set intersection of two sequences using an optional equality comparer.
   *
   * @typeparam T - The type of elements in the sequences.
   *
   * @param second - The sequence to intersect with the first sequence.
   * @param comparer - Optional. An EqualityComparer<T> to compare values.
   * If not provided, uses the default equality comparer.
   *
   * @returns An IEnumerable<T> containing elements that exist in both sequences.
   *
   * @throws \{NotIterableException\} If second is not iterable.
   *
   * @example
   * ```typescript
   * // Basic number intersection
   * Enumerable.create([1, 2, 3])
   *   .intersect([2, 3, 4])
   *   .toArray(); // [2, 3]
   *
   * // Object intersection with custom comparer
   * class PersonComparer extends EqualityComparer<{id: number}> {
   *   equals(x?: {id: number}, y?: {id: number}): boolean {
   *     return x?.id === y?.id;
   *   }
   * }
   *
   * const seq1 = [{id: 1}, {id: 2}];
   * const seq2 = [{id: 2}, {id: 3}];
   *
   * Enumerable.create(seq1)
   *   .intersect(seq2, new PersonComparer())
   *   .toArray(); // [{id: 2}]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.intersect}
   */
  intersect(
    second: Iterable<T>,
    comparer?: EqualityComparer<T>,
  ): IEnumerable<T>;

  /**
   * Produces the set intersection of two sequences according to a specified key selector function.
   *
   * @typeparam T - The type of elements in the source sequence.
   * @typeparam TKey - The type of key to compare elements by.
   *
   * @param second - The sequence whose keys will be used for intersection.
   * @param keySelector - A function to extract the key for each element.
   * @param comparer - Optional. An EqualityComparer<TKey> to compare keys.
   * If not provided, uses the default equality comparer.
   *
   * @returns An IEnumerable<T> containing elements from the first sequence
   * whose keys are also present in the second sequence.
   *
   * @throws \{InvalidArgumentException\} If keySelector is not a function.
   * @throws \{NotIterableException\} If second is not iterable.
   *
   * @example
   * ```typescript
   * // Basic key selection
   * const items = [
   *   { id: 1, name: 'John' },
   *   { id: 2, name: 'Jane' }
   * ];
   * const ids = [2, 3];
   *
   * Enumerable.create(items)
   *   .intersectBy(ids, x => x.id)
   *   .toArray(); // [{ id: 2, name: 'Jane' }]
   *
   * // Case insensitive comparison
   * class CaseInsensitiveComparer extends EqualityComparer<string> {
   *   equals(x?: string, y?: string): boolean {
   *     return (x || '').toLowerCase() === (y || '').toLowerCase();
   *   }
   * }
   *
   * const names = [{ name: 'John' }, { name: 'JANE' }];
   * const filter = ['jane', 'bob'];
   *
   * Enumerable.create(names)
   *   .intersectBy(filter, x => x.name, new CaseInsensitiveComparer())
   *   .toArray(); // [{ name: 'JANE' }]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.intersectby}
   */
  intersectBy<TKey>(
    second: Iterable<TKey>,
    keySelector: TKeySelector<T, TKey>,
    comparer?: EqualityComparer<TKey>,
  ): IEnumerable<T>;

  /**
   * Determines whether the current sequence is disjoint from a specified sequence.
   *
   * @typeparam TSecond - The type of elements in the second sequence.
   *
   * @param second - The sequence to compare to the current sequence.
   *
   * @returns true if the current sequence and the specified sequence have no elements in common; otherwise, false.
   *
   * @throws \{NotIterableException\} If second is not iterable.
   *
   * @example
   * ```typescript
   * const first = [1, 2, 3];
   * const second = [4, 5, 6];
   *
   * Enumerable.create(first)
   *   .isDisjointFrom(second); // true
   * ```
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/isDisjointFrom}
   */
  isDisjointFrom(second: Iterable<T>): boolean;

  /**
   * Determines whether a sequence is a subset of a specified sequence.
   *
   * @typeparam TSecond - The type of elements in the second sequence.
   *
   * @param second - The sequence to compare to the current sequence.
   *
   * @returns true if the current sequence is a subset of the specified sequence; otherwise, false.
   *
   * @throws \{NotIterableException\} If second is not iterable.
   *
   * @example
   * ```typescript
   * const first = [1, 2, 3];
   * const second = [1, 2, 3, 4, 5];
   *
   * Enumerable.create(first)
   *   .isSubsetOf(second); // true
   *
   *
   * const first = [1, 2, 3];
   * const second = [1, 2, 4, 5, 6];
   *
   * Enumerable.create(first)
   *   .isSubsetOf(second); // false
   * ```
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/isSubsetOf}
   */
  isSubsetOf(second: Iterable<T>): boolean;

  /**
   * Determines whether a sequence is a superset of a specified sequence.
   *
   * @typeparam TSecond - The type of elements in the second sequence.
   *
   * @param second - The sequence to compare to the current sequence.
   *
   * @returns true if the current sequence is a superset of the specified sequence; otherwise, false.
   *
   * @throws \{NotIterableException\} If second is not iterable.
   *
   * @example
   * ```typescript
   * const first = [1, 2, 3, 4, 5];
   * const second = [1, 2, 3];
   *
   * Enumerable.create(first)
   *   .isSupersetOf(second); // true
   *
   *
   * const first = [1, 2, 3];
   * const second = [1, 2, 3, 4, 5];
   *
   * Enumerable.create(first)
   *   .isSupersetOf(second); // false
   * ```
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/isSupersetOf}
   */
  isSupersetOf(second: Iterable<T>): boolean;

  /**
   * Correlates elements of two sequences based on matching keys.
   *
   * @typeparam TInner - The type of elements in the inner sequence.
   * @typeparam TKey - The type of the keys returned by the key selector functions.
   * @typeparam TResult - The type of the result elements.
   *
   * @param inner - The sequence to join with the first sequence.
   * @param outerKeySelector - Function to extract join key from outer sequence element.
   * @param innerKeySelector - Function to extract join key from inner sequence element.
   * @param resultSelector - Function to create result element from one outer and one inner element.
   * @param comparer - Optional. An EqualityComparer<TKey> to compare keys.
   *
   * @returns An IEnumerable<TResult> containing results from matching elements from both sequences.
   *
   * @throws \{InvalidArgumentException\} If any required parameter is not a function.
   * @throws \{NotIterableException\} If inner is not iterable.
   *
   * @example
   * ```typescript
   * const orders = [
   *   { id: 1, customerId: 1, total: 100 },
   *   { id: 2, customerId: 2, total: 200 },
   *   { id: 3, customerId: 1, total: 300 }
   * ];
   *
   * const customers = [
   *   { id: 1, name: 'John' },
   *   { id: 2, name: 'Jane' }
   * ];
   *
   * Enumerable.create(orders)
   *   .join(
   *     customers,
   *     order => order.customerId,
   *     customer => customer.id,
   *     (order, customer) => ({
   *       orderId: order.id,
   *       customerName: customer.name,
   *       total: order.total
   *     })
   *   )
   *   .toArray();
   * // [
   * //   { orderId: 1, customerName: 'John', total: 100 },
   * //   { orderId: 2, customerName: 'Jane', total: 200 },
   * //   { orderId: 3, customerName: 'John', total: 300 }
   * // ]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.join}
   */
  join<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: TKeySelector<T, TKey>,
    innerKeySelector: TKeySelector<TInner, TKey>,
    resultSelector: TResultSelectorJoin<T, TInner, TResult>,
    comparer?: EqualityComparer<TKey>,
  ): IEnumerable<TResult>;

  /**
   * Returns the last element in a sequence, or the last element that satisfies a condition.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param predicate - Optional. A function to test each element for a condition.
   *
   * @returns The last element in the sequence that passes the test if provided,
   * or the last element if no predicate is specified.
   *
   * @throws \{NoElementsException\} If the sequence is empty.
   * @throws \{NoElementsSatisfyCondition\} If no element satisfies the predicate.
   * @throws \{InvalidArgumentException\} If predicate is provided but is not a function.
   *
   * @example
   * ```typescript
   * // Last element
   * Enumerable.create([1, 2, 3]).last(); // 3
   *
   * // Last matching element
   * Enumerable.create([1, 2, 3, 2]).last(x => x === 2); // 2
   *
   * // Empty sequence throws
   * Enumerable.create([]).last(); // throws InvalidOperationException
   *
   * // No matches throws
   * Enumerable.create([1, 2]).last(x => x > 5); // throws InvalidOperationException
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.last}
   */
  last(predicate?: (x: T) => boolean): T;

  /**
   * Returns the last element in a sequence that satisfies a condition,
   * or a default value if no element exists or matches the condition.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param defaultValue - The value to return if no element exists or matches the condition.
   * @param predicate - Optional. A function to test each element for a condition.
   *
   * @returns The last element that passes the predicate if provided,
   * or the last element if no predicate specified;
   * returns defaultValue if the sequence is empty or no element matches.
   *
   *
   * @example
   * ```typescript
   * // Last element or default
   * Enumerable.create([1, 2]).lastOrDefault(0); // 2
   * Enumerable.create<number>([]).lastOrDefault(0); // 0
   *
   * // With predicate
   * Enumerable.create([1, 2, 3, 2])
   *   .lastOrDefault(0, x => x === 2); // 2
   *
   * // No matches returns default
   * Enumerable.create([1, 2])
   *   .lastOrDefault(0, x => x > 5); // 0
   *
   * // With objects
   * const defaultPerson = { id: 0, name: 'default' };
   * Enumerable.create<typeof defaultPerson>([])
   *   .lastOrDefault(defaultPerson); // { id: 0, name: 'default' }
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.lastordefault}
   */
  lastOrDefault(defaultValue: T, predicate?: (x: T) => boolean): T;

  /**
   * Returns the maximum value in a sequence of numbers.
   *
   * @returns The maximum value in the sequence.
   *
   * @throws \{NoElementsException\} If the sequence is empty.
   * @throws \{InvalidElementsCollection\} If any element in the sequence is not a number.
   *
   * @example
   * ```typescript
   * // Basic maximum
   * Enumerable.create([1, 2, 3]).max(); // 3
   *
   * // Single element
   * Enumerable.create([1]).max(); // 1
   *
   * // Empty sequence throws
   * Enumerable.create([]).max(); // throws InvalidOperationException
   *
   * // Mixed types throw
   * Enumerable.create([1, '2']).max(); // throws TypeError
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.max}
   */
  max(): number;
  /**
   * Returns the maximum value in a sequence using a custom comparer.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param comparer - A Comparer<T> to compare elements.
   *
   * @returns The maximum value in the sequence according to the comparer.
   *
   * @throws \{InvalidOperationException\} If the sequence is empty.
   *
   * @example
   * ```typescript
   * // Custom object comparison
   * class PersonComparer extends Comparer<{age: number}> {
   *   compare(x?: {age: number}, y?: {age: number}): number {
   *     return (x?.age ?? 0) - (y?.age ?? 0);
   *   }
   * }
   *
   * const people = [
   *   { age: 25 },
   *   { age: 30 },
   *   { age: 20 }
   * ];
   *
   * Enumerable.create(people)
   *   .max(new PersonComparer()); // { age: 30 }
   *
   * // Custom string length comparison
   * class StringLengthComparer extends Comparer<string> {
   *   compare(x?: string, y?: string): number {
   *     return (x?.length ?? 0) - (y?.length ?? 0);
   *   }
   * }
   *
   * Enumerable.create(['a', 'bbb', 'cc'])
   *   .max(new StringLengthComparer()); // 'bbb'
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.max}
   */
  max(comparer: Comparer<T>): T;
  /**
   * Returns the maximum value in a sequence by using a key selector function
   * to extract numeric values from elements.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param transformer - A function to extract a numeric value from each element.
   *
   * @returns The maximum numeric value extracted from the sequence.
   *
   * @throws \{InvalidOperationException\} If the sequence is empty.
   * @throws \{InvalidArgumentException\} If transformer is not a function.
   * @throws \{InvalidElementsCollection\} If any extracted value is not a number.
   *
   * @example
   * ```typescript
   * // Object property maximum
   * const items = [
   *   { id: 1, value: 10 },
   *   { id: 2, value: 30 },
   *   { id: 3, value: 20 }
   * ];
   *
   * Enumerable.create(items)
   *   .max(x => x.value); // 30
   *
   * // String length maximum
   * Enumerable.create(['a', 'bbb', 'cc'])
   *   .max(x => x.length); // 3
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.max}
   */
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  max(transformer: TKeySelector<T, number>): number;

  /**
   * Returns the element with the maximum value in a sequence according to a key selector
   * and optional comparer.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param keySelector - A function to extract a numeric value from each element.
   * @param comparer - Optional. A Comparer<number> to compare the extracted values.
   *
   * @returns The element with the maximum key value.
   *
   * @throws \{InvalidOperationException\} If the sequence is empty.
   * @throws \{InvalidArgumentException\} If keySelector is not a function.
   * @throws \{InvalidElementsCollection\} If any extracted value is not a number.
   *
   * @example
   * ```typescript
   * // Find object with maximum value
   * const items = [
   *   { id: 1, value: 10, name: 'A' },
   *   { id: 2, value: 30, name: 'B' },
   *   { id: 3, value: 20, name: 'C' }
   * ];
   *
   * Enumerable.create(items)
   *   .maxBy(x => x.value); // { id: 2, value: 30, name: 'B' }
   *
   * // With custom comparer
   * class AbsoluteComparer extends Comparer<number> {
   *   compare(x?: number, y?: number): number {
   *     return Math.abs(x ?? 0) - Math.abs(y ?? 0);
   *   }
   * }
   *
   * Enumerable.create([{ val: -5 }, { val: 3 }])
   *   .maxBy(x => x.val, new AbsoluteComparer()); // { val: -5 }
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.maxby}
   */
  maxBy(keySelector: TKeySelector<T, number>, comparer?: Comparer<number>): T;

  /**
   * Returns the minimum value in a sequence of numbers.
   *
   * @returns The minimum value in the sequence.
   *
   * @throws \{InvalidOperationException\} If the sequence is empty.
   * @throws \{InvalidElementsCollection\} If any element in the sequence is not a number.
   *
   * @example
   * ```typescript
   * // Basic minimum
   * Enumerable.create([1, 2, 3]).min(); // 1
   *
   * // Single element
   * Enumerable.create([5]).min(); // 5
   *
   * // Empty sequence throws
   * Enumerable.create([]).min(); // throws InvalidOperationException
   *
   * // Mixed types throw
   * Enumerable.create([1, '2']).min(); // throws TypeError
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.min}
   */
  min(): number;
  /**
   * Returns the minimum value in a sequence using a custom comparer.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param comparer - A Comparer<T> to compare elements.
   *
   * @returns The minimum value in the sequence according to the comparer.
   *
   * @throws \{InvalidOperationException\} If the sequence is empty.
   *
   * @example
   * ```typescript
   * // Custom object comparison
   * class PersonComparer extends Comparer<{age: number}> {
   *   compare(x?: {age: number}, y?: {age: number}): number {
   *     return (x?.age ?? 0) - (y?.age ?? 0);
   *   }
   * }
   *
   * const people = [
   *   { age: 25 },
   *   { age: 30 },
   *   { age: 20 }
   * ];
   *
   * Enumerable.create(people)
   *   .min(new PersonComparer()); // { age: 20 }
   *
   * // Custom string length comparison
   * class StringLengthComparer extends Comparer<string> {
   *   compare(x?: string, y?: string): number {
   *     return (x?.length ?? 0) - (y?.length ?? 0);
   *   }
   * }
   *
   * Enumerable.create(['aaa', 'b', 'cc'])
   *   .min(new StringLengthComparer()); // 'b'
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.min}
   */
  min(comparer: Comparer<T>): T;
  /**
   * Returns the minimum value in a sequence by using a key selector function
   * to extract numeric values from elements.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param keySelector - A function to extract a numeric value from each element.
   *
   * @returns The minimum numeric value extracted from the sequence.
   *
   * @throws \{NoElementsException\} If the sequence is empty.
   * @throws \{InvalidArgumentException\} If transformer is not a function.
   * @throws \{InvalidElementsCollection\} If any extracted value is not a number.
   *
   * @example
   * ```typescript
   * // Object property minimum
   * const items = [
   *   { id: 1, value: 10 },
   *   { id: 2, value: 30 },
   *   { id: 3, value: 20 }
   * ];
   *
   * Enumerable.create(items)
   *   .min(x => x.value); // 10
   *
   * // String length minimum
   * Enumerable.create(['aaa', 'b', 'cc'])
   *   .min(x => x.length); // 1
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.min}
   */
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  min(transformer: TKeySelector<T, number>): number;

  /**
   * Returns the element with the minimum value in a sequence according to a key selector
   * and optional comparer.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param keySelector - A function to extract a numeric value from each element.
   * @param comparer - Optional. A Comparer<number> to compare the extracted values.
   *
   * @returns The element with the minimum key value.
   *
   * @throws \{InvalidOperationException\} If the sequence is empty.
   * @throws \{InvalidArgumentException\} If keySelector is not a function.
   * @throws \{InvalidElementsCollection\} If any extracted value is not a number.
   *
   * @example
   * ```typescript
   * // Find object with minimum value
   * const items = [
   *   { id: 1, value: 10, name: 'A' },
   *   { id: 2, value: 30, name: 'B' },
   *   { id: 3, value: 20, name: 'C' }
   * ];
   *
   * Enumerable.create(items)
   *   .minBy(x => x.value); // { id: 1, value: 10, name: 'A' }
   *
   * // With custom comparer
   * class AbsoluteComparer extends Comparer<number> {
   *   compare(x?: number, y?: number): number {
   *     return Math.abs(x ?? 0) - Math.abs(y ?? 0);
   *   }
   * }
   *
   * Enumerable.create([{ val: -5 }, { val: 3 }])
   *   .minBy(x => x.val, new AbsoluteComparer()); // { val: 3 }
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.minby}
   */
  minBy(keySelector: TKeySelector<T, number>, comparer?: Comparer<number>): T;

  /**
   * Filters elements of a sequence based on a specified type.
   *
   * @typeparam TType - The type to filter the elements to.
   * Must be one of the supported OfType values.
   *
   * @param type - The type to filter by (e.g., String, Number, Boolean).
   *
   * @returns An IEnumerable<TType> containing only the elements of the specified type.
   *
   *
   * @example
   * ```typescript
   * // Filter numbers
   * Enumerable.create([1, 'a', 2, 'b', 3])
   *   .ofType("number")
   *   .toArray(); // [1, 2, 3]
   *
   * // Filter strings
   * Enumerable.create([1, 'a', 2, 'b'])
   *   .ofType("string")
   *   .toArray(); // ['a', 'b']
   *
   * // Filter String objects
   * Enumerable.create([1, 'a', 2, 'b', new String('c')])
   *    .ofType(String)
   *    .toArray(); // ['c']
   *
   *
   *
   * // Custom class filtering
   * class Person {}
   * const items = [new Person(), 'a', new Person()];
   *
   * Enumerable.create(items)
   *   .ofType(Person)
   *   .toArray(); // [Person {}, Person {}]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.oftype}
   */
  ofType<TType extends OfType>(type: TType): IEnumerable<TType>;

  /**
   * Creates a sorted sequence according to a comparer.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param comparer - Optional. Comparer to compare elements.
   * Can be a Comparer<T>, "string" for string comparison,
   * or "number" for numeric comparison.
   *
   * @returns An IOrderedEnumerable<T> whose elements are sorted.
   *
   * @remarks If "string" or "number" are used in the comparer,
   * an "implicitly stable comparison" is used, reccurring to Intl.Collator
   *
   * @example
   * ```typescript
   * // Basic ordering
   * const numbers = Enumerable.create([3, 1, 2])
   *   .order()
   *   .toArray(); // [1, 2, 3]
   *
   * // String comparison
   * const words = Enumerable.create(['c', 'a', 'b'])
   *   .order('string')
   *   .toArray(); // ['a', 'b', 'c']
   *
   * // Custom comparison
   * class PersonComparer extends Comparer<{age: number}> {
   *   compare(x?: {age: number}, y?: {age: number}): number {
   *     return (x?.age ?? 0) - (y?.age ?? 0);
   *   }
   * }
   *
   * const people = Enumerable.create([
   *   { age: 30, name: 'Bob' },
   *   { age: 20, name: 'Alice' }
   * ])
   *   .order(new PersonComparer())
   *   .select(x => x.name)
   *   .toArray(); // ['Alice', 'Bob']
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.orderby}
   */
  order(comparer?: Comparer<T> | "string" | "number"): IOrderedEnumerable<T>;

  /**
   * Sorts the elements of a sequence according to a key selector function.
   *
   * @typeparam T - The type of elements in the sequence.
   * @typeparam TKey - The type of the key returned by keySelector.
   *
   * @param keySelector - A function to extract a key from each element.
   * @param comparer - Optional. A Comparer<TKey> to compare keys.
   * If not provided, uses the default comparer.
   *
   * @returns An IOrderedEnumerable<T> whose elements are sorted by key.
   *
   * @throws \{InvalidArgumentException\} If keySelector is not a function.
   *
   * @example
   * ```typescript
   * // Basic property ordering
   * const items = [
   *   { id: 3, name: 'C' },
   *   { id: 1, name: 'A' },
   *   { id: 2, name: 'B' }
   * ];
   *
   * Enumerable.create(items)
   *   .orderBy(x => x.id)
   *   .select(x => x.name)
   *   .toArray(); // ['A', 'B', 'C']
   *
   * // Custom key comparison
   * class CaseInsensitiveComparer extends Comparer<string> {
   *   compare(x?: string, y?: string): number {
   *     return (x || '').toLowerCase().localeCompare((y || '').toLowerCase());
   *   }
   * }
   *
   * const names = [{ name: 'bob' }, { name: 'Alice' }, { name: 'Charlie' }];
   *
   * Enumerable.create(names)
   *   .orderBy(x => x.name, new CaseInsensitiveComparer())
   *   .select(x => x.name)
   *   .toArray(); // ['Alice', 'bob', 'Charlie']
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.orderby}
   */
  orderBy<TKey>(
    keySelector: (x: T) => TKey,
    comparer?: Comparer<TKey>,
  ): IOrderedEnumerable<T>;

  /**
   * Sorts the elements of a sequence in descending order according to a key selector function.
   *
   * @typeparam T - The type of elements in the sequence.
   * @typeparam TKey - The type of the key returned by keySelector.
   *
   * @param keySelector - A function to extract a key from each element.
   * @param comparer - Optional. A Comparer<TKey> to compare keys.
   * If not provided, uses the default comparer.
   *
   * @returns An IOrderedEnumerable<T> whose elements are sorted in descending order by key.
   *
   * @throws \{InvalidArgumentException\} If keySelector is not a function.
   *
   * @example
   * ```typescript
   * // Basic descending property order
   * const items = [
   *   { id: 1, name: 'A' },
   *   { id: 3, name: 'C' },
   *   { id: 2, name: 'B' }
   * ];
   *
   * Enumerable.create(items)
   *   .orderByDescending(x => x.id)
   *   .select(x => x.name)
   *   .toArray(); // ['C', 'B', 'A']
   *
   * // Custom comparison
   * class ReverseStringComparer extends Comparer<string> {
   *   compare(x?: string, y?: string): number {
   *     return -((x || '').localeCompare(y || ''));
   *   }
   * }
   *
   * const names = ['Alice', 'Bob', 'Charlie'];
   *
   * Enumerable.create(names)
   *   .orderByDescending(x => x, new ReverseStringComparer())
   *   .toArray(); // ["Alice", "Bob", "Charlie"]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.orderbydescending}
   */
  orderByDescending<TKey>(
    keySelector: (x: T) => TKey,
    comparer?: Comparer<TKey>,
  ): IOrderedEnumerable<T>;

  /**
   * Creates a sorted sequence in descending order according to a comparer.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param comparer - Optional. Comparer to compare elements.
   * Can be a Comparer<T>, "string" for string comparison,
   * or "number" for numeric comparison.
   *
   * @returns An IOrderedEnumerable<T> whose elements are sorted in descending order.
   *
   * @remarks If "string" or "number" are used in the comparer,
   * an "implicitly stable comparison" is used, reccurring to Intl.Collator
   *
   * @example
   * ```typescript
   * // Basic descending order
   * Enumerable.create([1, 3, 2])
   *   .orderDescending()
   *   .toArray(); // [3, 2, 1]
   *
   * // Custom object comparison
   * class PersonComparer extends Comparer<{age: number}> {
   *   compare(x?: {age: number}, y?: {age: number}): number {
   *     return (x?.age ?? 0) - (y?.age ?? 0);
   *   }
   * }
   *
   * const people = [
   *   { age: 20, name: 'Alice' },
   *   { age: 30, name: 'Bob' },
   *   { age: 25, name: 'Charlie' }
   * ];
   *
   * Enumerable.create(people)
   *   .orderDescending(new PersonComparer())
   *   .select(x => x.name)
   *   .toArray(); // ['Bob', 'Charlie', 'Alice']
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.orderbydescending}
   */
  orderDescending(
    comparer?: Comparer<T> | "string" | "number",
  ): IOrderedEnumerable<T>;

  /**
   * Adds a value to the beginning of the sequence.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param item - The value to prepend to the sequence.
   *
   * @returns A new sequence that begins with the specified item.
   *
   * @example
   * ```typescript
   * // Basic prepend
   * Enumerable.create([2, 3])
   *   .prepend(1)
   *   .toArray(); // [1, 2, 3]
   *
   * // Prepend to empty sequence
   * Enumerable.create<number>([])
   *   .prepend(1)
   *   .toArray(); // [1]
   *
   * // Object prepend
   * const items = [{id: 2}, {id: 3}];
   * Enumerable.create(items)
   *   .prepend({id: 1})
   *   .toArray(); // [{id: 1}, {id: 2}, {id: 3}]
   *
   * // Multiple prepends
   * Enumerable.create([3])
   *   .prepend(2)
   *   .prepend(1)
   *   .toArray(); // [1, 2, 3]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.prepend}
   */
  prepend(item: T): IEnumerable<T>;

  /**
   * Inverts the order of elements in a sequence.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @returns An IEnumerable<T> whose elements correspond to those of the input sequence in reverse order.
   *
   * @example
   * ```typescript
   * // Basic number reversal
   * Enumerable.create([1, 2, 3])
   *   .reverse()
   *   .toArray(); // [3, 2, 1]
   *
   * // String reversal
   * Enumerable.create(['a', 'b', 'c'])
   *   .reverse()
   *   .toArray(); // ['c', 'b', 'a']
   *
   * // Object reversal
   * const items = [
   *   { id: 1, value: 'first' },
   *   { id: 2, value: 'second' }
   * ];
   *
   * Enumerable.create(items)
   *   .reverse()
   *   .select(x => x.value)
   *   .toArray(); // ['second', 'first']
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.reverse}
   */
  reverse(): IEnumerable<T>;

  /**
   * Projects each element of a sequence into a new form using a selector function.
   *
   * @typeparam T - The type of elements in the source sequence.
   * @typeparam TResult - The type of elements in the result sequence.
   *
   * @param selector - A transform function to apply to each element.
   * Optionally includes the index of the source element.
   *
   * @returns An IEnumerable<TResult> whose elements are the result of applying
   * the transform function to each element of the source.
   *
   * @throws \{InvalidArgumentException\} If selector is not a function.
   *
   * @example
   * ```typescript
   * // Basic transformation
   * Enumerable.create([1, 2, 3])
   *   .select(x => x * 2)
   *   .toArray(); // [2, 4, 6]
   *
   * // Using index
   * Enumerable.create(['a', 'b', 'c'])
   *   .select((x, i) => `${i}:${x}`)
   *   .toArray(); // ['0:a', '1:b', '2:c']
   *
   * // Object transformation
   * const items = [
   *   { id: 1, name: 'John' },
   *   { id: 2, name: 'Jane' }
   * ];
   *
   * Enumerable.create(items)
   *   .select(x => ({
   *     userId: x.id,
   *     displayName: x.name.toUpperCase()
   *   }))
   *   .toArray();
   * // [
   * //   { userId: 1, displayName: 'JOHN' },
   * //   { userId: 2, displayName: 'JANE' }
   * // ]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.select}
   */
  select<TResult>(
    selector: (x: T, index?: number) => TResult,
  ): IEnumerable<TResult>;

  /**
   * Projects each element of a sequence to an IEnumerable<T>, flattens the resulting sequences
   * into one sequence, and optionally transforms the flattened elements.
   *
   * @typeparam TCollection - The type of collection elements to flatten.
   * @typeparam TResult - The type of elements in the result sequence.
   *
   * @param selector - A function that returns a collection for each element.
   * @param resultSelector - Optional. A function that transforms each flattened element.
   *
   * @returns An IEnumerable<TResult> whose elements are the result of invoking the
   * transform function on each element of the flattened sequence.
   *
   * @throws \{InvalidArgumentException\} If selector is not a function.
   *
   * @example
   * ```typescript
   * // Basic array flattening
   * const arrays = [[1, 2], [3, 4]];
   * Enumerable.create(arrays)
   *   .selectMany(x => x)
   *   .toArray(); // [1, 2, 3, 4]
   *
   * // With result transformation
   * const items = [
   *   { id: 1, values: [1, 2] },
   *   { id: 2, values: [3, 4] }
   * ];
   *
   * Enumerable.create(items)
   *   .selectMany(
   *     x => x.values,
   *     (item, value) => ({
   *       id: item.id,
   *       value: value
   *     })
   *   )
   *   .toArray();
   * // [
   * //   { id: 1, value: 1 },
   * //   { id: 1, value: 2 },
   * //   { id: 2, value: 3 },
   * //   { id: 2, value: 4 }
   * // ]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.selectmany}
   */
  selectMany<TCollection, TResult>(
    selector: SelectManySelector<T, TCollection>,
    resultSelector?: SelectManyResultSelector<T, TCollection, TResult>,
  ): IEnumerable<TResult>;

  /**
   * Determines whether two sequences are equal by comparing their elements.
   *
   * @typeparam T - The type of elements in the sequences.
   *
   * @param second - The sequence to compare to the first sequence.
   * @param comparer - Optional. An EqualityComparer<T> to compare elements.
   * If not provided, uses the default equality comparer.
   *
   * @returns true if the sequences are equal; otherwise, false.
   *
   * @throws \{NotIterableException\} If second is not iterable.
   *
   * @example
   * ```typescript
   * // Basic number comparison
   * Enumerable.create([1, 2, 3])
   *   .sequenceEqual([1, 2, 3]); // true
   *
   * Enumerable.create([1, 2])
   *   .sequenceEqual([1, 2, 3]); // false
   *
   * // Custom object comparison
   * class PersonComparer extends EqualityComparer<{id: number}> {
   *   equals(x?: {id: number}, y?: {id: number}): boolean {
   *     return x?.id === y?.id;
   *   }
   * }
   *
   * const seq1 = [{id: 1}, {id: 2}];
   * const seq2 = [{id: 1}, {id: 2}];
   *
   * Enumerable.create(seq1)
   *   .sequenceEqual(seq2, new PersonComparer()); // true
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sequenceequal}
   */
  sequenceEqual(second: Iterable<T>, comparer?: EqualityComparer<T>): boolean;

  /**
   * Randomly reorders the elements in a sequence.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @returns A new IEnumerable<T> containing all elements from the input sequence in random order.
   *
   * @remarks ATTENTION: This method is not cryptographically secure it uses Math.Random
   * behind the scenes.
   *
   * @example
   * ```typescript
   * // Basic number shuffling
   * const numbers = [1, 2, 3, 4, 5];
   * Enumerable.create(numbers)
   *   .shuffle()
   *   .toArray(); // e.g., [3, 1, 5, 2, 4]
   *
   * // Original sequence remains unchanged
   * console.log(numbers); // [1, 2, 3, 4, 5]
   *
   * // Object shuffling
   * const items = [
   *   { id: 1, value: 'A' },
   *   { id: 2, value: 'B' },
   *   { id: 3, value: 'C' }
   * ];
   *
   * Enumerable.create(items)
   *   .shuffle()
   *   .select(x => x.value)
   *   .toArray(); // e.g., ['B', 'C', 'A']
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable}
   */
  shuffle(): IEnumerable<T>;

  /**
   * Returns the only element in a sequence that satisfies a condition,
   * or the only element if no condition is specified.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param predicate - Optional. A function to test each element for a condition.
   *
   * @returns The single element that satisfies the condition.
   *
   * @throws \{NoElementsException\} If the sequence is empty.
   * @throws \{MoreThanOneElementSatisfiesCondition\} If more than one element exists or satisfies the condition.
   * @throws \{InvalidArgumentException\} If predicate is provided but is not a function.
   * @throws \{NoElementsSatisfyCondition\} If no element satisfies the condition.
   *
   * @example
   * ```typescript
   * // Single element
   * Enumerable.create([1]).single(); // 1
   *
   * // With predicate
   * Enumerable.create([1, 2, 3])
   *   .single(x => x === 2); // 2
   *
   * // Multiple elements throw
   * Enumerable.create([1, 2])
   *   .single(); // throws MoreThanOneElementSatisfiesCondition
   *
   * // Multiple matches throw
   * Enumerable.create([1, 2, 2])
   *   .single(x => x === 2); // throws MoreThanOneElementSatisfiesCondition
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.single}
   */
  single(predicate?: (x: T) => boolean): T;

  /**
   * Returns the only element in a sequence that satisfies a condition,
   * or a default value if no element exists or if more than one element satisfies the condition.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param defaultValue - The value to return if no element exists or if multiple elements match.
   * @param predicate - Optional. A function to test each element for a condition.
   *
   * @returns The single element that satisfies the condition, or defaultValue if no such element
   * exists or if multiple elements satisfy the condition.
   *
   * @throws \{MoreThanOneElementSatisfiesCondition\} If more than one element exists and satisfies the condition.
   *
   * @example
   * ```typescript
   * // Single element
   * Enumerable.create([1])
   *   .singleOrDefault(0); // 1
   *
   * // Empty sequence returns default
   * Enumerable.create([])
   *   .singleOrDefault(0); // 0
   *
   * // Multiple elements throws MoreThanOneElementSatisfiesCondition
   * Enumerable.create([1, 2])
   *   .singleOrDefault(0); // throws MoreThanOneElementSatisfiesCondition
   *
   * // Single match with predicate
   * Enumerable.create([1, 2, 3])
   *   .singleOrDefault(0, x => x === 2); // 2
   *
   * // Multiple matches return default
   * Enumerable.create([1, 2, 2])
   *   .singleOrDefault(0, x => x === 2); // 0
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.singleordefault}
   */
  singleOrDefault(defaultValue: T, predicate?: (x: T) => boolean): T;

  /**
   * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param count - The number of elements to skip.
   * Negative values are treated as zero.
   *
   * @throws \{InvalidArgumentException\} If count is not a number.
   *
   * @returns An IEnumerable<T> that contains the elements that occur after the specified index.
   *
   * @example
   * ```typescript
   * // Basic skip
   * Enumerable.create([1, 2, 3, 4])
   *   .skip(2)
   *   .toArray(); // [3, 4]
   *
   * // Skip more than length
   * Enumerable.create([1, 2])
   *   .skip(5)
   *   .toArray(); // []
   *
   * // Skip with negative count
   * Enumerable.create([1, 2, 3])
   *   .skip(-1)
   *   .toArray(); // [1, 2, 3]
   *
   * // Skip with objects
   * const items = [
   *   { id: 1, value: 'A' },
   *   { id: 2, value: 'B' },
   *   { id: 3, value: 'C' }
   * ];
   *
   * Enumerable.create(items)
   *   .skip(1)
   *   .select(x => x.value)
   *   .toArray(); // ['B', 'C']
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skip}
   */
  skip(count: number): IEnumerable<T>;

  /**
   * Bypasses a specified number of elements at the end of a sequence.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param count - The number of elements to skip from the end.
   * Negative values are treated as zero.
   *
   * @throws \{InvalidArgumentException\} If count is not a number.
   *
   * @returns An IEnumerable<T> containing all elements except the last count elements.
   *
   * @example
   * ```typescript
   * // Basic skip last
   * Enumerable.create([1, 2, 3, 4])
   *   .skipLast(2)
   *   .toArray(); // [1, 2]
   *
   * // Skip more than length
   * Enumerable.create([1, 2])
   *   .skipLast(5)
   *   .toArray(); // []
   *
   * // Skip with negative count
   * Enumerable.create([1, 2, 3])
   *   .skipLast(-1)
   *   .toArray(); // [1, 2, 3]
   *
   * // Skip with objects
   * const items = [
   *   { id: 1, value: 'A' },
   *   { id: 2, value: 'B' },
   *   { id: 3, value: 'C' }
   * ];
   *
   * Enumerable.create(items)
   *   .skipLast(1)
   *   .select(x => x.value)
   *   .toArray(); // ['A', 'B']
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skiplast}
   */
  skipLast(count: number): IEnumerable<T>;

  /**
   * Bypasses elements in a sequence as long as a specified condition is true
   * and then returns the remaining elements.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param predicate - A function to test each element for a condition.
   * Takes the element and its index as parameters.
   *
   * @returns An IEnumerable<T> that contains the elements from the input sequence
   * starting at the first element that does not satisfy the condition.
   *
   * @throws \{InvalidArgumentException\} If predicate is not a function.
   *
   * @example
   * ```typescript
   * // Skip while less than 3
   * Enumerable.create([1, 2, 3, 4, 2])
   *   .skipWhile(x => x < 3)
   *   .toArray(); // [3, 4, 2]
   *
   * // Using index in predicate
   * Enumerable.create([1, 2, 3, 4])
   *   .skipWhile((x, i) => i < 2)
   *   .toArray(); // [3, 4]
   *
   * // Object sequence
   * const items = [
   *   { value: 1, name: 'A' },
   *   { value: 2, name: 'B' },
   *   { value: 3, name: 'C' },
   *   { value: 1, name: 'D' }
   * ];
   *
   * Enumerable.create(items)
   *   .skipWhile(x => x.value < 3)
   *   .select(x => x.name)
   *   .toArray(); // ['C', 'D']
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skipwhile}
   */
  skipWhile(predicate: (x: T, index: number) => boolean): IEnumerable<T>;

  /**
   * Computes the sum of a sequence of numeric values,
   * or concatenates a sequence of strings.
   *
   * @typeparam TResult - The type of the sum result.
   * Defaults to number for numeric sequences or string for string sequences.
   *
   * @returns For numbers: the sum of all values in the sequence.
   * For strings: the concatenation of all strings in the sequence.
   *
   * @throws \{NoElementsException\} If the sequence is empty.
   * @throws \{InvalidElementsCollection\} If elements are not numbers or strings.
   *
   * @example
   * ```typescript
   * // Number sum
   * Enumerable.create([1, 2, 3]).sum(); // 6
   *
   * // String concatenation
   * Enumerable.create(['a', 'b', 'c']).sum(); // 'abc'
   *
   * // Empty sequence throws
   * Enumerable.create([]).sum(); // throws InvalidOperationException
   *
   * // Mixed types throw
   * Enumerable.create([1, '2']).sum(); // throws InvalidElementsCollection
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sum}
   */
  sum<
    TResult = T extends number ? number : T extends string ? string : never,
  >(): TResult;
  /**
   * Computes the concatenation of string values selected from sequence elements.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param selector - A function to extract a string value from each element.
   *
   * @returns The concatenation of all selected string values.
   *
   * @throws \{NoElementsException\} If the sequence is empty.
   * @throws \{InvalidArgumentException\} If selector is not a function.
   * @throws \{InvalidElementsCollection\} If any selected value is not a string.
   *
   * @example
   * ```typescript
   * // Basic string concatenation
   * const items = [
   *   { id: 1, text: 'Hello' },
   *   { id: 2, text: ' ' },
   *   { id: 3, text: 'World' }
   * ];
   *
   * Enumerable.create(items)
   *   .sum(x => x.text); // 'Hello World'
   *
   * // Empty sequence throws
   * Enumerable.create([])
   *   .sum(x => x.toString()); // throws NoElementsException
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sum}
   */
  sum(selector: (x: T) => string): string;
  /**
   * Computes the sum of numeric values selected from sequence elements.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param selector - A function to extract a numeric value from each element.
   *
   * @returns The sum of the selected numeric values.
   *
   * @throws \{NoElementsException\} If the sequence is empty.
   * @throws \{InvalidArgumentException\} If selector is not a function.
   * @throws \{InvalidElementsCollection\} If any selected value is not a number.
   *
   * @example
   * ```typescript
   * // Sum of extracted values
   * const items = [
   *   { id: 1, value: 10 },
   *   { id: 2, value: 20 },
   *   { id: 3, value: 30 }
   * ];
   *
   * Enumerable.create(items)
   *   .sum(x => x.value); // 60
   *
   * // String length sum
   * Enumerable.create(['a', 'bb', 'ccc'])
   *   .sum(x => x.length); // 6
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sum}
   */
  sum(selector: (x: T) => number): number;

  /**
   * Returns a specified number of contiguous elements from the start of a sequence.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param count - The number of elements to return.
   * Negative values are treated as zero.
   *
   * @throws \{InvalidArgumentException\} If count is not a number.
   *
   * @returns An IEnumerable<T> that contains the specified number of elements
   * from the start of the sequence.
   *
   * @example
   * ```typescript
   * // Basic take
   * Enumerable.create([1, 2, 3, 4])
   *   .take(2)
   *   .toArray(); // [1, 2]
   *
   * // Take more than available
   * Enumerable.create([1, 2])
   *   .take(5)
   *   .toArray(); // [1, 2]
   *
   * // Take with negative count
   * Enumerable.create([1, 2, 3])
   *   .take(-1)
   *   .toArray(); // []
   *
   * // Take with objects
   * const items = [
   *   { id: 1, value: 'A' },
   *   { id: 2, value: 'B' },
   *   { id: 3, value: 'C' }
   * ];
   *
   * Enumerable.create(items)
   *   .take(2)
   *   .select(x => x.value)
   *   .toArray(); // ['A', 'B']
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.take}
   */
  take(count: number): IEnumerable<T>;

  /**
   * Returns a specified number of contiguous elements from the end of a sequence.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param count - The number of elements to take from the end.
   * Negative values are treated as zero.
   *
   * @throws \{InvalidArgumentException\} If count is not a number.
   *
   * @returns An IEnumerable<T> that contains the specified number of elements
   * from the end of the sequence.
   *
   * @example
   * ```typescript
   * // Basic take last
   * Enumerable.create([1, 2, 3, 4])
   *   .takeLast(2)
   *   .toArray(); // [3, 4]
   *
   * // Take more than available
   * Enumerable.create([1, 2])
   *   .takeLast(5)
   *   .toArray(); // [1, 2]
   *
   * // Take with negative count
   * Enumerable.create([1, 2, 3])
   *   .takeLast(-1)
   *   .toArray(); // []
   *
   * // Take with objects
   * const items = [
   *   { id: 1, value: 'A' },
   *   { id: 2, value: 'B' },
   *   { id: 3, value: 'C' }
   * ];
   *
   * Enumerable.create(items)
   *   .takeLast(2)
   *   .select(x => x.value)
   *   .toArray(); // ['B', 'C']
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.takelast}
   */
  takeLast(count: number): IEnumerable<T>;

  /**
   * Returns elements from a sequence as long as a specified condition is true.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param predicate - A function to test each element for a condition.
   * Takes the element and its index as parameters.
   *
   * @returns An IEnumerable<T> that contains elements from the input sequence
   * until the predicate returns false.
   *
   * @throws \{InvalidArgumentException\} If predicate is not a function.
   *
   * @example
   * ```typescript
   * // Take while less than 3
   * Enumerable.create([1, 2, 3, 4, 1])
   *   .takeWhile(x => x < 3)
   *   .toArray(); // [1, 2]
   *
   * // Using index in predicate
   * Enumerable.create([1, 2, 3, 4])
   *   .takeWhile((x, i) => i < 2)
   *   .toArray(); // [1, 2]
   *
   * // Object sequence
   * const items = [
   *   { value: 1, name: 'A' },
   *   { value: 2, name: 'B' },
   *   { value: 3, name: 'C' },
   *   { value: 1, name: 'D' }
   * ];
   *
   * Enumerable.create(items)
   *   .takeWhile(x => x.value < 3)
   *   .select(x => x.name)
   *   .toArray(); // ['A', 'B']
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.takewhile}
   */
  takeWhile(predicate: (element: T, index: number) => boolean): IEnumerable<T>;

  /**
   * Creates an array from a sequence.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @returns An array that contains the elements from the sequence.
   *
   * @example
   * ```typescript
   * // Basic conversion
   * Enumerable.create([1, 2, 3]).toArray(); // [1, 2, 3]
   *
   * // Empty sequence
   * Enumerable.create([]).toArray(); // []
   *
   * // Object sequence
   * const items = [
   *   { id: 1, value: 'A' },
   *   { id: 2, value: 'B' }
   * ];
   *
   * Enumerable.create(items)
   *   .select(x => x.value)
   *   .toArray(); // ['A', 'B']
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.toarray}
   */
  toArray(): Array<T>;

  /**
   * Creates a Map\<TKey, Array\<T\>\> from a sequence according to a specified key selector function.
   *
   * @typeparam T - The type of elements in the sequence.
   * @typeparam TKey - The type of the key returned by selector.
   *
   * @param selector - A function to extract the key from each element.
   *
   * @returns A Map\<TKey, Array<T>\> where each key contains an array of
   * all elements that share that key.
   *
   * @throws \{InvalidArgumentException\} If selector is not a function.
   *
   * @example
   * ```typescript
   * // Group by number
   * const items = [
   *   { category: 1, name: 'A' },
   *   { category: 2, name: 'B' },
   *   { category: 1, name: 'C' }
   * ];
   *
   * const map = Enumerable.create(items)
   *   .toMap(x => x.category);
   *
   * map.get(1); // [{ category: 1, name: 'A' }, { category: 1, name: 'C' }]
   * map.get(2); // [{ category: 2, name: 'B' }]
   *
   * // Group by string
   * const people = [
   *   { dept: 'IT', name: 'John' },
   *   { dept: 'HR', name: 'Jane' },
   *   { dept: 'IT', name: 'Bob' }
   * ];
   *
   * const deptMap = Enumerable.create(people)
   *   .toMap(x => x.dept);
   *
   * deptMap.get('IT'); // [{ dept: 'IT', name: 'John' }, { dept: 'IT', name: 'Bob' }]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable}
   */
  toMap<TKey>(selector: (x: T) => TKey): Map<TKey, Array<T>>;

  /**
   * Creates a Set<T> from a sequence, automatically removing duplicate elements.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @returns A Set<T> that contains unique elements from the sequence.
   *
   * @example
   * ```typescript
   * // Basic conversion
   * Enumerable.create([1, 2, 2, 3])
   *   .toSet(); // Set(3) {1, 2, 3}
   *
   * // Empty sequence
   * Enumerable.create([])
   *   .toSet(); // Set(0) {}
   *
   * // Object sequence
   * const items = [
   *   { id: 1, name: 'A' },
   *   { id: 1, name: 'A' },  // Duplicate by value
   *   { id: 2, name: 'B' }
   * ];
   *
   * Enumerable.create(items)
   *   .toSet(); // Set with 3 objects (unique by reference)
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable}
   */
  toSet(): Set<T>;

  /**
   * Produces the set union of two sequences using an optional equality comparer.
   *
   * @typeparam T - The type of elements in the sequences.
   *
   * @param second - The sequence whose distinct elements form the second iterable.
   * @param comparer - Optional. An EqualityComparer<T> to compare values.
   * If not provided, uses the default equality comparer.
   *
   * @returns An IEnumerable<T> that contains the elements from both input sequences,
   * excluding duplicates.
   *
   * @throws \{NotIterableException\} If second is not iterable.
   *
   * @example
   * ```typescript
   * // Basic number union
   * Enumerable.create([1, 2])
   *   .union([2, 3])
   *   .toArray(); // [1, 2, 3]
   *
   * // Custom object comparison
   * class PersonComparer extends EqualityComparer<{id: number}> {
   *   equals(x?: {id: number}, y?: {id: number}): boolean {
   *     return x?.id === y?.id;
   *   }
   * }
   *
   * const seq1 = [{id: 1}, {id: 2}];
   * const seq2 = [{id: 2}, {id: 3}];
   *
   * Enumerable.create(seq1)
   *   .union(seq2, new PersonComparer())
   *   .select(x => x.id)
   *   .toArray(); // [1, 2, 3]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.union}
   */
  union(second: Iterable<T>, comparer?: EqualityComparer<T>): IEnumerable<T>;

  /**
   * Produces the set union of two sequences according to a specified key selector function.
   *
   * @typeparam T - The type of elements in the sequences.
   * @typeparam TKey - The type of key to compare elements by.
   *
   * @param second - The sequence whose elements to unite.
   * @param keySelector - A function to extract the key for each element.
   * @param comparer - Optional. An EqualityComparer<TKey> to compare keys.
   * If not provided, uses the default equality comparer.
   *
   * @returns An IEnumerable<T> containing elements from both sequences,
   * excluding duplicates based on the selected keys.
   *
   * @throws \{NotIterableException\} If second is not iterable.
   * @throws \{InvalidArgumentException\} If keySelector is not a function.
   *
   * @example
   * ```typescript
   * // Basic key-based union
   * const seq1 = [{ id: 1, val: 'A' }, { id: 2, val: 'B' }];
   * const seq2 = [{ id: 2, val: 'C' }, { id: 3, val: 'D' }];
   *
   * Enumerable.create(seq1)
   *   .unionBy(seq2, x => x.id)
   *   .select(x => x.val)
   *   .toArray(); // ['A', 'B', 'D']
   *
   * // Case insensitive name union
   * class CaseInsensitiveComparer extends EqualityComparer<string> {
   *   equals(x?: string, y?: string): boolean {
   *     return (x || '').toLowerCase() === (y || '').toLowerCase();
   *   }
   * }
   *
   * const names1 = [{ name: 'John' }, { name: 'JANE' }];
   * const names2 = [{ name: 'jane' }, { name: 'Bob' }];
   *
   * Enumerable.create(names1)
   *   .unionBy(names2, x => x.name, new CaseInsensitiveComparer())
   *   .select(x => x.name)
   *   .toArray(); // ['John', 'JANE', 'Bob']
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.unionby}
   */
  unionBy<TKey>(
    second: Iterable<T>,
    keySelector: TKeySelector<T, TKey>,
    comparer?: EqualityComparer<TKey>,
  ): IEnumerable<T>;

  /**
   * Filters a sequence based on a predicate.
   *
   * @typeparam T - The type of elements in the sequence.
   *
   * @param predicate - A function to test each element for a condition.
   * Takes the element and its index as parameters.
   *
   * @returns An IEnumerable<T> that contains elements that satisfy the condition.
   *
   * @throws \{InvalidArgumentException\} If predicate is not a function.
   *
   * @example
   * ```typescript
   * // Basic number filtering
   * Enumerable.create([1, 2, 3, 4])
   *   .where(x => x > 2)
   *   .toArray(); // [3, 4]
   *
   * // Using index in predicate
   * Enumerable.create(['a', 'b', 'c'])
   *   .where((x, i) => i % 2 === 0)
   *   .toArray(); // ['a', 'c']
   *
   * // Object filtering
   * const items = [
   *   { id: 1, active: true },
   *   { id: 2, active: false },
   *   { id: 3, active: true }
   * ];
   *
   * Enumerable.create(items)
   *   .where(x => x.active)
   *   .select(x => x.id)
   *   .toArray(); // [1, 3]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.where}
   */
  where(predicate: (x: T, index: number) => boolean): IEnumerable<T>;

  /**
   * Combines two sequences by using the tuple type as the result selector.
   *
   * @typeparam T - The type of elements in the first sequence.
   * @typeparam TSecond - The type of elements in the second sequence.
   *
   * @param secon - The second sequence to combine with the first.
   *
   * @returns An IEnumerable\<[T, TSecond]\> containing tuples with elements from both sequences.
   * If sequences are of unequal length, the result only includes pairs up to the length
   * of the shorter sequence.
   *
   * @throws \{NotIterableException\} If second is not iterable.
   *
   * @example
   * ```typescript
   * // Basic number and string zip
   * Enumerable.create([1, 2, 3])
   *   .zip(['a', 'b', 'c'])
   *   .toArray(); // [[1, 'a'], [2, 'b'], [3, 'c']]
   *
   * // Unequal lengths
   * Enumerable.create([1, 2])
   *   .zip(['a', 'b', 'c'])
   *   .toArray(); // [[1, 'a'], [2, 'b']]
   *
   * // Object zip
   * const numbers = [1, 2];
   * const letters = ['A', 'B'];
   *
   * Enumerable.create(numbers)
   *   .zip(letters)
   *   .select(([num, letter]) => ({
   *     number: num,
   *     letter: letter
   *   }))
   *   .toArray();
   * // [
   * //   { number: 1, letter: 'A' },
   * //   { number: 2, letter: 'B' }
   * // ]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.zip}
   */
  zip<TSecond>(second: Iterable<TSecond>): IEnumerable<[T, TSecond]>;
  /**
   * Combines two sequences using a custom result selector function.
   *
   * @typeparam T - The type of elements in the first sequence.
   * @typeparam TSecond - The type of elements in the second sequence.
   * @typeparam TResult - The type of elements in the result sequence.
   *
   * @param second - The second sequence to combine with the first.
   * @param resultSelector - A function that specifies how to combine elements.
   *
   * @returns An IEnumerable<TResult> containing combined elements using the selector.
   * If sequences are of unequal length, pairs up to the shorter sequence length.
   *
   * @throws \{NotIterableException\} If second is not iterable
   * @throws \{InvalidArgumentException\} If resultSelector is not a function.
   *
   * @example
   * ```typescript
   * // Combine numbers and strings
   * Enumerable.create([1, 2, 3])
   *   .zip(
   *     ['a', 'b', 'c'],
   *     (num, letter) => `${num}-${letter}`
   *   )
   *   .toArray(); // ['1-a', '2-b', '3-c']
   *
   * // Create objects from pairs
   * const ids = [1, 2];
   * const names = ['John', 'Jane'];
   *
   * Enumerable.create(ids)
   *   .zip(
   *     names,
   *     (id, name) => ({ id, name })
   *   )
   *   .toArray();
   * // [
   * //   { id: 1, name: 'John' },
   * //   { id: 2, name: 'Jane' }
   * // ]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.zip}
   */
  zip<TSecond, TResult>(
    second: Iterable<TSecond>,
    resultSelector: (x: T, y: TSecond) => TResult,
  ): IEnumerable<TResult>;
  /**
   * Combines three sequences using the tuple type as the result selector.
   *
   * @typeparam T - The type of elements in the first sequence.
   * @typeparam TSecond - The type of elements in the second sequence.
   * @typeparam TThird - The type of elements in the third sequence.
   *
   * @param second - The second sequence to combine.
   * @param third - The third sequence to combine.
   *
   * @returns An IEnumerable\<[T, TSecond, TThird]\> containing tuples with elements
   * from all three sequences. If sequences are of unequal length, pairs up to the
   * shortest sequence length.
   *
   * @throws \{NotIterableException\} If second or third is not iterable.
   *
   * @example
   * ```typescript
   * // Basic three-way zip
   * Enumerable.create([1, 2])
   *   .zip(['a', 'b'], [true, false])
   *   .toArray(); // [[1, 'a', true], [2, 'b', false]]
   *
   * // Different lengths
   * Enumerable.create([1, 2, 3])
   *   .zip(['a', 'b'], [true])
   *   .toArray(); // [[1, 'a', true]]
   *
   * // Object creation from triple
   * const ids = [1, 2];
   * const names = ['John', 'Jane'];
   * const ages = [25, 30];
   *
   * Enumerable.create(ids)
   *   .zip(names, ages)
   *   .select(([id, name, age]) => ({
   *     id,
   *     name,
   *     age
   *   }))
   *   .toArray();
   * // [
   * //   { id: 1, name: 'John', age: 25 },
   * //   { id: 2, name: 'Jane', age: 30 }
   * // ]
   * ```
   *
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.zip}
   */
  zip<TSecond, TThird>(
    second: Iterable<TSecond>,
    third: Iterable<TThird>,
  ): IEnumerable<[T, TSecond, TThird]>;
}
