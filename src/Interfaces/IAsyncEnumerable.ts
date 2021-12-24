import { Types, Interfaces } from "../internal";

/**
 * Iterable type with methods from LINQ.
 */
export interface IAsyncEnumerable<TSource> extends AsyncIterable<TSource> {
    /**
     * Applies an accumulator function over a sequence.
     * @param func An [`accumulator`](docs/types.md#aggregatefunctiontypeasync) function to be invoked on each element.
     * @returns The final accumulator value.
     *
     * [`Aggregate`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.aggregate)
     */
    aggregate<TResult>(func: Types.AggregateFunctionTypeAsync<TSource, TSource>, resultSelector?: Types.AggregateResultTypeAsync<TSource, TResult>): Promise<TResult>;
    /**
     * Applies an accumulator function over a sequence.
     * The specified seed value is used as the initial accumulator value.
     * @param seed The initial accumulator value.
     * @param func An [`accumulator`](docs/types.md#aggregatefunctiontypeasync) function to be invoked on each element.
     * @returns The final accumulator value.
     */
    aggregate<TAccumulate, TResult>(seed: TAccumulate, func: Types.AggregateFunctionTypeAsync<TSource, TAccumulate>, resultSelector?: Types.AggregateResultTypeAsync<TAccumulate, TResult>): Promise<TResult>;
    /**
     * Applies an accumulator function over a sequence.
     * The specified seed value is used as the initial accumulator value,
     * and the specified function is used to select the result value.
     * @param seed The initial accumulator value.
     * @param func An [`accumulator`](docs/types.md#aggregatefunctiontypeasync) function to be invoked on each element.
     * @param resultSelector A function to transform the final accumulator value into the result value.
     * @returns The transformed final accumulator value.
     */
    aggregate<TAccumulate, TResult>(seed: TAccumulate, func: Types.AggregateFunctionTypeAsync<TSource, TAccumulate>, resultSelector: Types.AggregateResultTypeAsync<TAccumulate, TResult>): Promise<TResult>;

    /**
     * Determines whether all elements of a sequence satisfy a condition.
     * @param predicate A function to test each element for a condition.
     * @returns `true` if every element of the source sequence passes the test in the specified `predicate`,
     * or if the sequence is empty; otherwise, `false`.
     *
     * [`All`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.all)
     */
    all(predicate: (x: TSource) => boolean): Promise<boolean>;

    /**
     * Determines whether a sequence contains any elements.
     * If predicate is specified, determines whether any element of a sequence satisfies a condition.
     * @param predicate A function to test each element for a condition.
     *
     * [`Any`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.any)
     * @returns true if the source sequence contains any elements or passes the test specified; otherwise, false.
     */
    any(predicate?: (x: TSource) => boolean): Promise<boolean>;

    /**
     * Appends a value to the end of the sequence.
     *
     * [`Append`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.append)
     */
    append(item: TSource): Interfaces.IAsyncEnumerable<TSource>;

    /**
     * Computes the average of a sequence of values
     * that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector A transform function to apply to each element.
     * @throws InvalidOperationException - source contains no elements.
     * @returns The average of the sequence of values.
     *
     * [`Average`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.average)
     */
    average(selector: (x: TSource) => number): Promise<number>;

    /**
     * Splits the elements of a sequence into chunks of size at most size.
     *
     * [`Chunk`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.chunk)
     */
    chunk(size: number): Interfaces.IAsyncEnumerable<Array<TSource>>;

    /**
     * Concatenates two sequences.
     * @param second The sequence to concatenate to the first sequence.
     * @returns An [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md) that contains the concatenated elements of the two sequences.
     *
     * [`Concat`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.concat)
     */
    concat(second: AsyncIterable<TSource> | Iterable<TSource>): IAsyncEnumerable<TSource>;

    /**
     * Determines whether a sequence contains a specified element by
     * using the specified or default [`IAsyncEqualityComparer<T>`](docs/interfaces/iasyncequalitycomparer.md).
     * @param value The value to locate in the sequence.
     * @param comparer An equality comparer to compare values. Optional.
     * @returns `true` if the source sequence contains an element that has the specified value; otherwise, `false`.
     *
     * [`Contains`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.contains)
     */
    contains(value: TSource, comparer?: Interfaces.IEqualityComparer<TSource>): Promise<boolean>;

    /**
     * Returns the number of elements in a sequence
     * or represents how many elements in the specified sequence satisfy a condition
     * if the predicate is specified.
     * @param predicate A function to test each element for a condition. Optional.
     * @returns The number of elements in the input sequence.
     *
     * [`Count`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.count)
     */
    count(predicate?: (x: TSource) => boolean): Promise<number>;

    /**
     * Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is `empty`.
     *
     * [`DefaultIfEmtpy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.defaultifempty)
     */
    defaultIfEmpty(defaultValue?: TSource): Interfaces.IAsyncEnumerable<TSource>;

    /**
     * Returns distinct elements from a sequence by using the `default` or specified equality comparer to compare values.
     * @param comparer An [`IAsyncEqualityComparer<T>`](docs/interfaces/iasyncequalitycomparer.md) to compare values. Optional. Defaults to Strict Equality Comparison.
     * @returns An [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md) that contains distinct elements from the source sequence.
     *
     * [`Distinct`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.distinct)
     */
    distinct(comparer?: Interfaces.IEqualityComparer<TSource>): IAsyncEnumerable<TSource>;

    /**
     * Returns distinct elements from a sequence according to a specified key selector function and using a specified comparer to compare keys.
     *
     * [`DistinctBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.distinctby)
     */
    distinctBy<TKey>(keySelector?: Types.TKeySelectorAsync<TSource, TKey>, comparer?: Types.TIAsyncEqualityComparer<TKey>): Interfaces.IAsyncEnumerable<TSource>;

    /**
     * Returns the element at a specified index in a sequence.
     * @param index The zero-based index of the element to retrieve.
     * @throws `ArgumentOutOfRangeException` if index is less than 0 or greater than or equal to the number of elements in source.
     * @returns The element at the specified position in the source sequence.
     *
     * [`ElementAt`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.elementat)
     */
    elementAt(index: number): Promise<TSource>;

    /**
     * Returns the element at a specified index in a sequence or a default value if the index is out of range.
     * @param index The zero-based index of the element to retrieve.
     * @returns `null` if the index is outside the bounds of the source sequence;
     * otherwise, the element at the specified position in the source sequence.
     *
     * [`ElementAtOrDefault`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.elementatordefault)
     */
    elementAtOrDefault(index: number): Promise<TSource | undefined>;

    /**
     * Produces the set difference of two sequences by using the comparer provided
     * or EqualityComparer to compare values.
     * @param second An [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md) whose elements that also occur in the first sequence
     * will cause those elements to be removed from the returned sequence.
     * @param comparer An [`IAsyncEqualityComparer<T>`](docs/interfaces/iasyncequalitycomparer.md) to compare values. Optional.
     * @returns A sequence that contains the set difference of the elements of two sequences.
     *
     * [`Except`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.except)
     */
    except(second: Iterable<TSource>, comparer?: Interfaces.IEqualityComparer<TSource>): IAsyncEnumerable<TSource>;

    /**
     * Produces the set difference of two sequences according to a specified key selector function.
     *
     * [`ExceptBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.exceptby)
     */
    exceptBy<TKey>(second: Iterable<TKey>, keySelector?: Types.TKeySelectorAsync<TSource, TKey>, comparer?: Types.TIAsyncEqualityComparer<TKey>): Interfaces.IAsyncEnumerable<TSource>;

    /**
     * Returns the first element in sequence that satisfies `predicate` otherwise
     * returns the first element in the sequence.
     * @param predicate A function to test each element for a condition. Optional.
     * @throws `InvalidOperationException` - No elements in Iteration matching predicate
     * @returns The first element in the sequence
     * or the first element that passes the test in the specified predicate function.
     *
     * [`First`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.first)
     */
    first(predicate?: (x: TSource) => boolean): Promise<TSource>;

    /**
     * Returns first element in sequence that satisfies predicate otherwise
     * returns the first element in the sequence. Returns null if no value found.
     * @param predicate A function to test each element for a condition. Optional.
     * @returns The first element in the sequence
     * or the first element that passes the test in the specified predicate function.
     * Returns `null` if no value found.
     *
     * [`FirstOrDefault`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.firstordefault)
     */
    firstOrDefault(predicate?: (x: TSource) => boolean): Promise<TSource | undefined>;

    /**
     * Performs a specified action on each element of the Iterable<TSource>
     * @param action The action to take an each element
     * @returns A new [`IAsyncEnumerable<TResult>`](docs/interfaces/iasyncenumerable.md) that executes the action lazily as you iterate.
     */
    forEach<TResult>(action: (x: TSource) => TResult | Promise<TResult>): IAsyncEnumerable<TResult>;

    /**
     * Groups the elements of a sequence according to a specified key selector function.
     * @param keySelector A function to extract the key for each element.
     * @returns An IAsyncEnumerable<IAsyncGrouping<TKey, TSource>>
     * where each [`IAsyncGrouping<TKey,TElement>`](docs/interfaces/iasyncgrouping.md) object contains a sequence of objects and a key.
     *
     * [`GroupBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupby)
     */
    groupBy<TKey, TResult>(keySelector: Types.TKeySelectorAsync<TSource, TKey>, resultSelector?: Types.TResultSelectorAsync<TKey, TSource, TResult> | Interfaces.IEqualityComparer<TKey>, comparer?: Interfaces.IEqualityComparer<TKey>): Interfaces.IAsyncEnumerable<TResult>;
    /**
     * Groups the elements of a sequence according to a key selector function.
     * The keys are compared by using a comparer and each group's elements are projected by using a specified function.
     * @param keySelector A function to extract the key for each element.
     * @param comparer An [`IAsyncEqualityComparer<T>`](docs/interfaces/iasyncequalitycomparer.md) to compare keys.
     */
    groupBy<TKey, TElement, TResult>(keySelector: Types.TKeySelectorAsync<TSource, TKey>, elementSelector: Types.TElementSelectorAsync<TSource, TElement>, resultSelector?: Types.TResultSelectorAsync<TKey, TElement, TResult>, comparer?: Interfaces.IEqualityComparer<TKey>): Interfaces.IAsyncEnumerable<TResult>;

    groupByGrouped<TKey>(keySelector: Types.TKeySelectorAsync<TSource, TKey>): Interfaces.IAsyncEnumerable<Interfaces.IAsyncGrouping<TKey, TSource>>;
    groupByGrouped<TKey, TElement>(keySelector: Types.TKeySelectorAsync<TSource, TKey>, elementSelector: Types.TElementSelectorAsync<TSource, TElement>): Interfaces.IAsyncEnumerable<Interfaces.IAsyncGrouping<TKey, TSource>>;
    groupByGrouped<TKey, TElement>(keySelector: Types.TKeySelectorAsync<TSource, TKey>, elementSelector: Types.TElementSelectorAsync<TSource, TElement>, comparer: Interfaces.IEqualityComparer<TKey>): Interfaces.IAsyncEnumerable<Interfaces.IAsyncGrouping<TKey, TElement>>;

    /**
     * Correlates the elements of two sequences based on matching keys.
     * A specified [`IAsyncEqualityComparer<T>`](docs/interfaces/iasyncequalitycomparer.md) is used to compare keys or the strict equality comparer.
     * @param inner The sequence to join to the first sequence.
     * @param outerKeySelector A function to extract the join key from each element of the first sequence.
     * @param innerKeySelector A function to extract the join key from each element of the second sequence.
     * @param resultSelector A function to create a result element from two matching elements.
     * @param comparer An [`IAsyncEqualityComparer<T>`](docs/interfaces/iasyncequalitycomparer.md) to hash and compare keys. Optional.
     * @returns An [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md) that has elements of type TResult that
     * are obtained by performing an inner join on two sequences.
     *
     * [`GroupJoin`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupjoin)
     */
    groupJoin<TInner, TKey, TResult>(inner: AsyncIterable<TInner>, outerKeySelector: Types.TKeySelectorAsync<TSource, TKey>, innerKeySelector: Types.TKeySelectorAsync<TInner, TKey>, resultSelector: Types.TResultSelectorAsync<TKey, TInner, TResult>, comparer?: Interfaces.IEqualityComparer<TKey>): Interfaces.IAsyncEnumerable<TResult>;

    /**
     * Produces the set intersection of two sequences by using the specified [`IAsyncEqualityComparer<T>`](docs/interfaces/iasyncequalitycomparer.md) to compare values.
     * If no comparer is selected, uses the StrictEqualityComparer.
     * @param second An Iterable<T> whose distinct elements that also appear in the first sequence will be returned.
     * @param comparer An [`IAsyncEqualityComparer<T>`](docs/interfaces/iasyncequalitycomparer.md) to compare values. Optional.
     * @returns A sequence that contains the elements that form the set intersection of two sequences.
     *
     * [`Intersect`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.intersect)
     */
    intersect(second: AsyncIterable<TSource> | Iterable<TSource>, comparer?: Interfaces.IEqualityComparer<TSource>): IAsyncEnumerable<TSource>;

    /**
     * Produces the set intersection of two sequences according to a specified key selector function.
     *
     * [`IntersectBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.intersectby)
     */
    intersectBy<TKey>(second: AsyncIterable<TKey> | Iterable<TKey>, keySelector?: Types.TKeySelectorAsync<TSource, TKey>, comparer?: Types.TIAsyncEqualityComparer<TKey>): Interfaces.IAsyncEnumerable<TSource>;

    /**
     * Correlates the elements of two sequences based on matching keys. A specified [`IAsyncEqualityComparer<T>`](docs/interfaces/iasyncequalitycomparer.md) is used to compare keys.
     *
     * [`Join`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.join)
     */
    join<TInner, TKey, TResult>(inner: AsyncIterable<TInner> | Iterable<TInner>, outerKeySelector: Types.TKeySelectorAsync<TSource, TKey>, innerKeySelector: Types.TKeySelectorAsync<TInner, TKey>, resultSelector: Types.TResultSelectorJoin<TSource, TInner, TResult>, comparer: Interfaces.IEqualityComparer<TKey>): Interfaces.IAsyncEnumerable<TResult>;

    /**
     * Returns the last element of a sequence.
     * If predicate is specified, the last element of a sequence that satisfies a specified `condition`.
     * @param predicate A function to test each element for a condition. Optional.
     * @throws `InvalidOperationException` if the `source` sequence is `empty`.
     * @returns The value at the last position in the source sequence
     * or the last element in the sequence that passes the test in the specified predicate function.
     *
     * [`Last`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.last)
     */
    last(predicate?: (x: TSource) => boolean): Promise<TSource>;

    /**
     * Returns the last element of a sequence.
     * If predicate is specified, the last element of a sequence that satisfies a specified condition.
     * @param predicate A function to test each element for a condition. Optional.
     * @returns The value at the last position in the source sequence
     * or the last element in the sequence that passes the test in the specified predicate function.
     *
     * [`LastOrDefault`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.lastordefault)
     */
    lastOrDefault(predicate?: (x: TSource) => boolean): Promise<TSource | undefined>;

    /**
     * Invokes a transform function on each element of a sequence and returns the maximum value.
     * @param comparer A compare function to apply to each element.
     * @throws `InvalidOperationException` - if source contains no elements.
     * @returns The maximum value in the sequence.
     *
     * [`Max`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.max)
     */
    max(comparer?: Interfaces.ICompareTo<number>): Promise<number>;

    /**
     * Returns the maximum value in a generic sequence according to a specified key selector function and key comparer.
     *
     * [`MaxBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.maxby)
     */
    maxBy<TKey>(keySelector?: Types.TKeySelectorAsync<TSource, TKey>, comparer?: Types.TICompareTo<TKey>): Promise<TSource>;

    /**
     * Invokes a transform function on each element of a sequence and returns the minimum value.
     * @param comparer A compare function to apply to each element.
     * @throws `InvalidOperationException` - if source contains no elements.
     * @returns The minimum value in the sequence.
     *
     * [`Min`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.min)
     */
    min(comparer?: Interfaces.ICompareTo<number>): Promise<number>;

    /**
     * Returns the minimum value in a generic sequence according to a specified key selector function and key comparer.
     *
     * [`MinBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.minby)
     */
    minBy<TKey>(keySelector?: Types.TKeySelectorAsync<TSource, TKey>, comparer?: Types.TICompareTo<TKey>): Promise<TSource>;

    /**
     * Applies a type filter to a source iteration
     * @param type Either value for typeof or a consturctor function
     * @returns Values that match the type string or are instance of type
     *
     * [`OfType`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.oftype)
     */
    ofType<TType extends Interfaces.OfType>(type: TType): Interfaces.IAsyncEnumerable<TType>;

    /**
     * Sorts the elements of a sequence in ascending order by using a specified or default comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An [`ICompareTo<T>`](docs/interfaces/icompareto.md) to compare keys. Optional.
     * @returns An [`IAsyncOrderedEnumerable<TElement>`](docs/interfaces/iasyncorderedenumerable.md) whose elements are sorted according to a key.
     *
     * [`OrderBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.orderby)
     */
    orderBy<TKey>(keySelector?: Types.TKeySelectorAsync<TSource, TKey>, comparer?: Interfaces.ICompareTo<TKey>): Interfaces.IAsyncOrderedEnumerable<TSource>;

    /**
     * Sorts the elements of a sequence in descending order by using a specified or default comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An [`ICompareTo<T>`](docs/interfaces/icompareto.md) to compare keys. Optional.
     * @returns An [`IAsyncOrderedEnumerable<TElement>`](docs/interfaces/iasyncorderedenumerable.md) whose elements are sorted in descending order according to a key.
     *
     * [`OrderByDescending`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.orderbydescending)
     */
    orderByDescending<TKey>(keySelector?: Types.TKeySelectorAsync<TSource, TKey>, comparer?: Interfaces.ICompareTo<TKey>): Interfaces.IAsyncOrderedEnumerable<TSource>;

    /**
     * Adds a value to the beginning of the sequence.
     *
     * [`Prepend`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.prepend)
     */
    prepend(item: TSource): Interfaces.IAsyncEnumerable<TSource>;

    /**
     * Inverts the order of the elements in a sequence.
     * @returns A sequence whose elements correspond to those of the input sequence in reverse order.
     *
     * [`Reverse`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.reverse)
     */
    reverse(): IAsyncEnumerable<TSource>;

    /**
     * Projects each element of a sequence into a new form.
     * @param selector A transform function to apply to each element.
     * @returns - An [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md) whose elements are the result of invoking the transform function on each element of source.
     *
     * [`Select`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.select)
     */
    select<TResult>(selector?: (x: TSource, index?: number) => TResult | Promise<TResult>): IAsyncEnumerable<TResult>;

    /**
     * Projects each element of a sequence to an [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md) and flattens the resulting sequences into one sequence.
     * @param selector A transform function to apply to each element.
     * @returns An [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md) whose elements are the result of invoking the
     * one-to-many transform function on each element of the input sequence.
     *
     * [`SelectMany`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.selectmany)
     */
    selectMany<TCollection, TResult>(selector?: Types.SelectManySelector<TSource, TCollection>, resultSelector?: Types.SelectManyResultSelector<TSource, TCollection, TResult>): IAsyncEnumerable<TResult>;

    /**
     * Determines whether or not two sequences are `equal`
     * @param second second iterable
     * @param comparer Compare function to use, by default is @see {StrictEqualityComparer}
     * @returns Whether or not the two iterations are equal
     *
     * [`SequenceEqual`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sequenceequal)
     */
    sequenceEqual(second: Iterable<TSource> | AsyncIterable<TSource>, comparer?: Interfaces.IEqualityComparer<TSource>): Promise<boolean>;

    /**
     * Returns the only element of a sequence that satisfies a specified condition (if specified),
     * and throws an exception if more than one such element exists.
     * @param predicate A function to test an element for a condition. (Optional)
     * @throws `InvalidOperationException` - if no element satisfies the `condition` in predicate. OR
     * More than one element satisfies the condition in predicate. OR
     * The source sequence is empty.
     * @returns The single element of the input sequence that satisfies a condition.
     *
     * [`Single`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.single)
     */
    single(predicate?: (x: TSource) => boolean): Promise<TSource>;

    /**
     * If predicate is specified returns the only element of a sequence that satisfies a specified condition,
     * ootherwise returns the only element of a sequence. Returns a default value if no such element exists.
     * @param predicate A function to test an element for a condition. Optional.
     * @throws `InvalidOperationException` - If predicate is specified more than one element satisfies the condition in predicate,
     * otherwise the input sequence contains more than one element.
     * @returns The single element of the input sequence that satisfies the condition,
     * or null if no such element is found.
     *
     * [`SingleOrDefault`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.singleordefault)
     */
    singleOrDefault(predicate?: (x: TSource) => boolean): Promise<TSource | undefined>;

    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     * @param count The number of elements to skip before returning the remaining elements.
     * @returns An [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md) that contains the elements that occur after the specified index in the input sequence.
     *
     * [`Skip`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skip)
     */
    skip(count: number): IAsyncEnumerable<TSource>;

    /**
     * Returns a new enumerable collection that contains the elements from `source` with the last `count` elements of the source collection omitted.
     *
     * [`SkipLast`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skiplast)
     */
    skipLast(count: number): Interfaces.IAsyncEnumerable<TSource>;

    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * The element's index is used in the logic of the predicate function.
     * @param predicate A function to test each source element for a condition;
     * the second parameter of the function represents the index of the source element.
     * @returns An [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md) that contains the elements from the input sequence starting at the first element
     * in the linear series that does not pass the test specified by predicate.
     *
     * [`SkipWhile`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skipwhile)
     */
    skipWhile(predicate: (x: TSource, index: number) => boolean | Promise<boolean>): IAsyncEnumerable<TSource>;

    /**
     * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function
     * on each element of the input sequence.
     * @param selector A transform function to apply to each element.
     * @returns The sum of the projected values.
     *
     * [`Sum`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sum)
     */
    sum(selector?: (x: TSource) => string | number | Promise<string | number>): Promise<string | number>;

    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param amount The number of elements to return.
     * @returns An [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md) that contains the specified number of elements from the start of the input sequence.
     *
     * [`Take`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.take)
     */
    take(count: number): IAsyncEnumerable<TSource>;

    /**
     * Returns a new enumerable collection that contains the last `count` elements from `source`.
     *
     * [`TakeLast`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.takelast)
     */
    takeLast(count: number): IAsyncEnumerable<TSource>;

    /**
     * Returns elements from a sequence as long as a specified condition is true.
     * The element's index is used in the logic of the predicate function.
     * @param predicate A function to test each source element for a condition;
     * the second parameter of the function represents the index of the source element.
     * @returns An [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md) that contains elements from the input sequence
     * that occur before the element at which the test no longer passes.
     *
     * [`TakeWhile`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.takewhile)
     */
    takeWhile(predicate: (element: TSource, index: number) => boolean): IAsyncEnumerable<TSource>;

    /**
     * Creates an array from a [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md).
     * @returns An array of elements
     *
     * [`ToArray`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.toarray)
     */
    toArray(): Promise<TSource[]>;

    /**
     * Converts an Iterable<V> to a Map<K, V[]>.
     * @param selector A function to serve as a key selector.
     * @returns Map<K, V[]>
     *
     * [`ToDictionary`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.todictionary)
     */
    toMap<TKey>(selector: (x: TSource) => TKey): Promise<Map<TKey, Array<TSource>>>;

    /**
     * Converts the iteration to a Set
     * @returns Set containing the iteration values
     */
    toSet(): Promise<Set<TSource>>;

    /**
     * Produces the set union of two sequences by using scrict equality comparison or a specified [`IAsyncEqualityComparer<T>`](docs/interfaces/iasyncequalitycomparer.md).
     * @param second An Iterable<T> whose distinct elements form the second set for the union.
     * @param comparer The [`IAsyncEqualityComparer<T>`](docs/interfaces/iasyncequalitycomparer.md) to compare values. Optional.
     * @returns An [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md) that contains the elements from both input sequences, excluding duplicates.
     *
     * [`Union`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.union)
     */
    union(second: Iterable<TSource> | AsyncIterable<TSource>, comparer?: Interfaces.IEqualityComparer<TSource>): IAsyncEnumerable<TSource>;

    /**
     * Produces the set union of two sequences according to a specified key selector function.
     *
     * [`UnionBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.unionby)
     */
    unionBy<TKey>(second: AsyncIterable<TKey> | Iterable<TKey>, keySelector?: Types.TKeySelectorAsync<TSource, TKey>, comparer?: Types.TIAsyncEqualityComparer<TKey>): Interfaces.IAsyncEnumerable<TSource>;

    /**
     * Filters a sequence of values based on a predicate.
     * Each element's index is used in the logic of the predicate function.
     * @param predicate A function to test each source element for a condition;
     * the second parameter of the function represents the index of the source element.
     * @returns An [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md) that contains elements from the input sequence that satisfy the condition.
     *
     * [`Where`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.where)
     */
    where(predicate: (x: TSource, index: number) => boolean | Promise<boolean>): IAsyncEnumerable<TSource>;

    /**
     * Creates a tuple of corresponding elements of two sequences, producing a sequence of the results.
     * @param second The second sequence to merge.
     * @returns An [`IAsyncEnumerable<[T, V]>`](docs/interfaces/iasyncenumerable.md) that contains merged elements of two input sequences.
     *
     * [`zip`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.zip)
     */
    zip<TSecond>(second: Iterable<TSecond> | AsyncIterable<TSecond>): IAsyncEnumerable<[TSource, TSecond]>;
    /**
     * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
     * @param second The second sequence to merge.
     * @param resultSelector A function that specifies how to merge the elements from the two sequences.
     * @returns An [`IAsyncEnumerable<TResult>`](docs/interfaces/iasyncenumerable.md) that contains merged elements of two input sequences.
     */
    zip<TSecond, TResult>(second: Iterable<TSecond> | AsyncIterable<TSecond>, resultSelector: Types.ZipResultSelectorAsync<TSource, TSecond, undefined, TResult>): IAsyncEnumerable<TResult>;
    zip<TSecond, TThird, TResult>(second: Iterable<TSecond> | AsyncIterable<TSecond>, third: Iterable<TThird> | AsyncIterable<TThird>, resultSelector: Types.ZipResultSelectorAsync<TSource, TSecond, undefined, TResult>): IAsyncEnumerable<TResult>;
    [Symbol.asyncIterator](): AsyncIterator<TSource>;
}
