import { Interfaces, Async, Deferred, Types, Helpers } from "./internal";
import {
  isAsyncFunction,
  isAsyncIterable,
  isFunction,
  isIterable,
  isNullOrUndefined,
  isString,
  isUndefined,
} from "./utils";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class EnumerableAsync<T> {
  constructor(protected readonly _source: AsyncIterable<T>) {}

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return this._source[Symbol.asyncIterator]();
  }

  protected get getIterator(): AsyncIterator<T> {
    return this[Symbol.asyncIterator]();
  }

  /*static asEnumerable = <TSource>(source: Enumerable<TSource> | Iterable<TSource>): Enumerable<TSource> => {
        return Enumerable.asEnumerable(source);
    }*/

  static asEnumerableAsync = <TSource>(
    source: EnumerableAsync<TSource> | AsyncIterable<TSource> | Iterable<TSource>,
  ): EnumerableAsync<TSource> => {
    if (!isAsyncIterable(source) && !isIterable(source)) {
      throw new TypeError("source is not iterable.");
    }
    if (source instanceof EnumerableAsync) {
      return source;
    }
    if (isIterable(source)) {
      return new EnumerableAsync<TSource>(Helpers.asAsyncIterable(source as Array<TSource>));
    }
    return new EnumerableAsync<TSource>(source as AsyncIterable<TSource>);
  };

  /**
   * Applies an accumulator function over a sequence.
   * @param func An [`accumulator`](docs/types.md#aggregatefunctiontypeasync) function to be invoked on each element.
   * @returns The final accumulator value.
   *
   * [`Aggregate`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.aggregate)
   */
  public async aggregate<TResult>(
    func: Types.AggregateFunctionTypeAsync<T, T>,
    resultSelector?: Types.AggregateResultTypeAsync<T, TResult>,
  ): Promise<TResult>;
  /**
   * Applies an accumulator function over a sequence.
   * The specified seed value is used as the initial accumulator value.
   * @param seed The initial accumulator value.
   * @param func An [`accumulator`](docs/types.md#aggregatefunctiontypeasync) function to be invoked on each element.
   * @returns The final accumulator value.
   */
  public async aggregate<TAccumulate, TResult>(
    seed: TAccumulate,
    func: Types.AggregateFunctionTypeAsync<T, TAccumulate>,
    resultSelector?: Types.AggregateResultTypeAsync<TAccumulate, TResult>,
  ): Promise<TResult>;
  /**
   * Applies an accumulator function over a sequence.
   * The specified seed value is used as the initial accumulator value,
   * and the specified function is used to select the result value.
   * @param seed The initial accumulator value.
   * @param func An [`accumulator`](docs/types.md#aggregatefunctiontypeasync) function to be invoked on each element.
   * @param resultSelector A function to transform the final accumulator value into the result value.
   * @returns The transformed final accumulator value.
   */
  public async aggregate<TAccumulate, TResult>(
    seed: TAccumulate | Types.AggregateFunctionTypeAsync<T, TAccumulate>,
    func: Types.AggregateFunctionTypeAsync<T, TAccumulate> = (x) => x as unknown as TAccumulate,
    resultSelector: Types.AggregateResultTypeAsync<TAccumulate, TResult> = (o) => o as unknown as TResult,
  ): Promise<TResult> {
    return Async.aggregate(this.getIterator, seed, func, resultSelector);
  }

  /**
   * Determines whether all elements of a sequence satisfy a condition.
   * @param predicate A function to test each element for a condition.
   * @returns `true` if every element of the source sequence passes the test in the specified `predicate`,
   * or if the sequence is empty; otherwise, `false`.
   *
   * [`All`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.all)
   */
  public async all(predicate: (x: T) => boolean | Promise<boolean>): Promise<boolean> {
    return Async.all(this.getIterator, predicate);
  }

  /**
   * Determines whether a sequence contains any elements.
   * If predicate is specified, determines whether any element of a sequence satisfies a condition.
   * @param predicate A function to test each element for a condition.
   *
   * [`Any`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.any)
   * @returns true if the source sequence contains any elements or passes the test specified; otherwise, false.
   */
  public async any(predicate?: (x: T) => boolean | Promise<boolean>): Promise<boolean> {
    return Async.any(this.getIterator, predicate);
  }

  /**
   * Appends a value to the end of the sequence.
   *
   * [`Append`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.append)
   */
  public append(item: T): Interfaces.IAsyncEnumerable<T> {
    return new Deferred.Async.AppendPrependEnumerable(this, item, true);
  }

  /**
   * Computes the average of a sequence of values
   * that are obtained by invoking a transform function on each element of the input sequence.
   * @param selector A transform function to apply to each element.
   * @throws InvalidOperationException - source contains no elements.
   * @returns The average of the sequence of values.
   *
   * [`Average`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.average)
   */
  public async average(selector: (x: T) => number | Promise<number> = (x) => x as unknown as number): Promise<number> {
    return Async.average(this.getIterator, selector);
  }

  /**
   * Splits the elements of a sequence into chunks of size at most size.
   *
   * [`Chunk`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.chunk)
   */
  public chunk(size: number): Interfaces.IAsyncEnumerable<Array<T>> {
    return Async.chunk(this.getIterator, size);
  }

  /**
   * Concatenates two sequences.
   * @param second The sequence to concatenate to the first sequence.
   * @returns An [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md) that contains the concatenated elements of the two sequences.
   *
   * [`Concat`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.concat)
   */
  public concat(second: AsyncIterable<T> | Iterable<T>): Interfaces.IAsyncEnumerable<T> {
    return new Deferred.Async.ConcatEnumerable(this, second);
  }

  /**
   * Determines whether a sequence contains a specified element by
   * using the specified or default [`IAsyncEqualityComparer<T>`](docs/interfaces/iasyncequalitycomparer.md).
   * @param value The value to locate in the sequence.
   * @param comparer An equality comparer to compare values. Optional.
   * @returns `true` if the source sequence contains an element that has the specified value; otherwise, `false`.
   *
   * [`Contains`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.contains)
   */
  public async contains(
    value: T,
    comparer: Types.TIAsyncEqualityComparer<T> = new Interfaces.DefaultEqualityComparer(),
  ): Promise<boolean> {
    return Async.contains(this.getIterator, value, comparer);
  }

  /**
   * Returns the number of elements in a sequence
   * or represents how many elements in the specified sequence satisfy a condition
   * if the predicate is specified.
   * @param predicate A function to test each element for a condition. Optional.
   * @returns The number of elements in the input sequence.
   *
   * [`Count`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.count)
   */
  public async count(predicate: (x: T) => boolean | Promise<boolean> = () => true): Promise<number> {
    return Async.count(this.getIterator, predicate);
  }

  /**
   * Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is `empty`.
   *
   * [`DefaultIfEmtpy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.defaultifempty)
   */
  public defaultIfEmpty(defaultValue?: T): Interfaces.IAsyncEnumerable<T> {
    return new Deferred.Async.DefaultIfEmptyEnumerable(this, defaultValue);
  }

  /**
   * Returns distinct elements from a sequence by using the `default` or specified equality comparer to compare values.
   * @param comparer An [`IAsyncEqualityComparer<T>`](docs/interfaces/iasyncequalitycomparer.md) to compare values. Optional. Defaults to Strict Equality Comparison.
   * @returns An [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md) that contains distinct elements from the source sequence.
   *
   * [`Distinct`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.distinct)
   */
  public distinct(
    comparer: Types.TIAsyncEqualityComparer<T> = new Interfaces.DefaultEqualityComparer(),
  ): Interfaces.IAsyncEnumerable<T> {
    return new Deferred.Async.DistinctEnumerable(this, comparer);
  }

  /**
   * Returns distinct elements from a sequence according to a specified key selector function and using a specified comparer to compare keys.
   *
   * [`DistinctBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.distinctby)
   */
  public distinctBy<TKey>(
    keySelector: Types.TKeySelectorAsync<T, TKey> = (x) => x as unknown as TKey,
    comparer: Types.TIAsyncEqualityComparer<TKey> = new Interfaces.DefaultEqualityComparer(),
  ): Interfaces.IAsyncEnumerable<T> {
    return new Deferred.Async.DistinctByEnumerable(this, keySelector, comparer);
  }

  /**
   * Returns the element at a specified index in a sequence.
   * @param index The zero-based index of the element to retrieve.
   * @throws `ArgumentOutOfRangeException` if index is less than 0 or greater than or equal to the number of elements in source.
   * @returns The element at the specified position in the source sequence.
   *
   * [`ElementAt`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.elementat)
   */
  public async elementAt(index: number): Promise<T> {
    return Async.elementAt(this.getIterator, index);
  }

  /**
   * Returns the element at a specified index in a sequence or a default value if the index is out of range.
   * @param index The zero-based index of the element to retrieve.
   * @returns `null` if the index is outside the bounds of the source sequence;
   * otherwise, the element at the specified position in the source sequence.
   *
   * [`ElementAtOrDefault`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.elementatordefault)
   */
  public async elementAtOrDefault(index: number): Promise<T> {
    return Async.elementAtOrDefault(this.getIterator, index);
  }

  /**
   * Returns an `empty` [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md) that has the specified type argument.
   *
   * [`Empty`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.empty)
   */
  public static empty<TSource>(
    type: Interfaces.IConstructor<Iterable<TSource> | AsyncIterable<TSource>>,
  ): Interfaces.IAsyncEnumerable<TSource> {
    return new EnumerableAsync<TSource>(Helpers.asAsyncIterable(new type()));
  }

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
  public except(
    second: Iterable<T>,
    comparer: Types.TIAsyncEqualityComparer<T> = new Interfaces.DefaultEqualityComparer(),
  ): Interfaces.IAsyncEnumerable<T> {
    return new Deferred.Async.ExceptEnumerable(this, second, comparer);
  }

  /**
   * Produces the set difference of two sequences according to a specified key selector function.
   *
   * [`ExceptBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.exceptby)
   */
  public exceptBy<TKey>(
    second: Iterable<TKey>,
    keySelector: Types.TKeySelectorAsync<T, TKey> = (x) => x as unknown as TKey,
    comparer: Types.TIAsyncEqualityComparer<TKey> = new Interfaces.DefaultEqualityComparer(),
  ): Interfaces.IAsyncEnumerable<T> {
    return new Deferred.Async.ExceptByEnumerable(this, second, keySelector, comparer);
  }

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
  public async first(predicate: (x: T) => boolean | Promise<boolean> = () => true): Promise<T> {
    return Async.first(this.getIterator, predicate);
  }

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
  public async firstOrDefault(
    predicate: (x: T) => boolean | Promise<boolean> = () => true,
    defaultValue?: T,
  ): Promise<T> {
    return Async.firstOrDefault(this.getIterator, predicate, defaultValue);
  }

  /**
   * Performs a specified action on each element of the Iterable<TSource>
   * @param action The action to take an each element
   * @returns A new [`IAsyncEnumerable<TResult>`](docs/interfaces/iasyncenumerable.md) that executes the action lazily as you iterate.
   */
  public forEach<TResult>(action: (x: T) => TResult | Promise<TResult>): Interfaces.IAsyncEnumerable<TResult> {
    return Async.forEach(this, action);
  }

  /**
   * Groups the elements of a sequence according to a specified key selector function.
   * @param keySelector A function to extract the key for each element.
   * @returns An IAsyncEnumerable<IAsyncGrouping<TKey, TSource>>
   * where each [`IAsyncGrouping<TKey,TElement>`](docs/interfaces/iasyncgrouping.md) object contains a sequence of objects and a key.
   *
   * [`GroupBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupby)
   */
  public groupBy<TKey, TResult>(
    keySelector: Types.TKeySelectorAsync<T, TKey>,
    resultSelector?: Types.TResultSelectorAsync<TKey, T, TResult> | Types.TIAsyncEqualityComparer<TKey>,
    comparer?: Types.TIAsyncEqualityComparer<TKey>,
  ): Interfaces.IAsyncEnumerable<TResult>;
  /**
   * Groups the elements of a sequence according to a key selector function.
   * The keys are compared by using a comparer and each group's elements are projected by using a specified function.
   * @param keySelector A function to extract the key for each element.
   * @param comparer An [`IAsyncEqualityComparer<T>`](docs/interfaces/iasyncequalitycomparer.md) to compare keys.
   */
  public groupBy<TKey, TElement, TResult>(
    keySelector: Types.TKeySelectorAsync<T, TKey>,
    elementSelector: Types.TElementSelectorAsync<T, TElement>,
    resultSelector: Types.TResultSelectorAsync<TKey, TElement, TResult>,
    comparer?: Types.TIAsyncEqualityComparer<TKey>,
  ): Interfaces.IAsyncEnumerable<TResult>;
  public groupBy<TKey, TElement, TResult>(
    keySelector: Types.TKeySelectorAsync<T, TKey>,
    a?:
      | Types.TElementSelectorAsync<T, TElement>
      | Types.TResultSelectorAsync<TKey, TElement, TResult>
      | Types.TIAsyncEqualityComparer<TKey>,
    b?: Types.TResultSelectorAsync<TKey, TElement, TResult> | Types.TIAsyncEqualityComparer<TKey>,
    c?: Types.TIAsyncEqualityComparer<TKey>,
  ): Interfaces.IAsyncEnumerable<TResult> {
    let elementSelector: Types.TElementSelectorAsync<T, TElement> = (x) => x as unknown as TElement;
    let resultSelector: Types.TResultSelectorAsync<TKey, TElement, TResult> = (x, y) => y as unknown as TResult;
    let comparer: Types.TIAsyncEqualityComparer<TKey> = new Interfaces.DefaultEqualityComparer();

    if (!isUndefined(c)) {
      comparer = c as Types.TIAsyncEqualityComparer<TKey>;
      resultSelector = b as Types.TResultSelectorAsync<TKey, TElement, TResult>;
      elementSelector = a as Types.TElementSelectorAsync<T, TElement>;
    } else if (!isUndefined(b)) {
      if (b instanceof Interfaces.IEqualityComparer || b instanceof Interfaces.IAsyncEqualityComparer) {
        comparer = b;
        elementSelector = a as Types.TElementSelectorAsync<T, TElement>;
      } else {
        elementSelector = a as Types.TElementSelectorAsync<T, TElement>;
        resultSelector = b as Types.TResultSelectorAsync<TKey, TElement, TResult>;
      }
    } else if (!isUndefined(a)) {
      if (a instanceof Interfaces.IEqualityComparer || a instanceof Interfaces.IAsyncEqualityComparer) {
        comparer = a;
      } else {
        elementSelector = a as Types.TElementSelectorAsync<T, TElement>;
      }
    }
    return new Deferred.Async.GroupByEnumerable(this, keySelector, elementSelector, resultSelector, comparer);
  }

  public groupByGrouped<TKey>(
    keySelector: Types.TKeySelectorAsync<T, TKey>,
  ): Interfaces.IAsyncEnumerable<Interfaces.IAsyncGrouping<TKey, T>>;
  public groupByGrouped<TKey, TElement>(
    keySelector: Types.TKeySelectorAsync<T, TKey>,
    elementSelector: Types.TElementSelectorAsync<T, TElement>,
  ): Interfaces.IAsyncEnumerable<Interfaces.IAsyncGrouping<TKey, T>>;
  public groupByGrouped<TKey, TElement>(
    keySelector: Types.TKeySelectorAsync<T, TKey> = (x) => x as unknown as TKey,
    elementSelector: Types.TElementSelectorAsync<T, TElement> = (x) => x as unknown as TElement,
    comparer: Interfaces.IEqualityComparer<TKey> = new Interfaces.DefaultEqualityComparer(),
  ): Interfaces.IAsyncEnumerable<Interfaces.IAsyncGrouping<TKey, TElement>> {
    //TODO: permitir o comparer no lugar do elementSelector
    return new Deferred.Async.GroupByGroupedEnumerable(this, keySelector, elementSelector, comparer);
  }

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
  public groupJoin<TInner, TKey, TResult>(
    inner: AsyncIterable<TInner> | Iterable<TInner>,
    outerKeySelector: Types.TKeySelectorAsync<T, TKey>,
    innerKeySelector: Types.TKeySelectorAsync<TInner, TKey>,
    resultSelector: Types.TResultSelectorAsync<TKey, TInner, TResult>,
    comparer: Types.TIAsyncEqualityComparer<TKey> = new Interfaces.DefaultEqualityComparer(),
  ): Interfaces.IAsyncEnumerable<TResult> {
    return new Deferred.Async.GroupJoinEnumerable(
      this,
      inner,
      outerKeySelector,
      innerKeySelector,
      resultSelector,
      comparer,
    );
  }

  /**
   * Produces the set intersection of two sequences by using the specified [`IAsyncEqualityComparer<T>`](docs/interfaces/iasyncequalitycomparer.md) to compare values.
   * If no comparer is selected, uses the StrictEqualityComparer.
   * @param second An Iterable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @param comparer An [`IAsyncEqualityComparer<T>`](docs/interfaces/iasyncequalitycomparer.md) to compare values. Optional.
   * @returns A sequence that contains the elements that form the set intersection of two sequences.
   *
   * [`Intersect`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.intersect)
   */
  public intersect(
    second: AsyncIterable<T> | Iterable<T>,
    comparer: Interfaces.IEqualityComparer<T> = new Interfaces.DefaultEqualityComparer(),
  ): Interfaces.IAsyncEnumerable<T> {
    return new Deferred.Async.IntersectEnumerable(this, second, comparer);
  }

  /**
   * Produces the set intersection of two sequences according to a specified key selector function.
   *
   * [`IntersectBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.intersectby)
   */
  public intersectBy<TKey>(
    second: AsyncIterable<TKey> | Iterable<TKey>,
    keySelector: Types.TKeySelectorAsync<T, TKey> = (x) => x as unknown as TKey,
    comparer: Types.TIAsyncEqualityComparer<TKey> = new Interfaces.DefaultEqualityComparer(),
  ): Interfaces.IAsyncEnumerable<T> {
    return new Deferred.Async.IntersectByEnumerable(this, second, keySelector, comparer);
  }

  /**
   * Correlates the elements of two sequences based on matching keys. A specified [`IAsyncEqualityComparer<T>`](docs/interfaces/iasyncequalitycomparer.md) is used to compare keys.
   *
   * [`Join`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.join)
   */
  public join<TInner, TKey, TResult>(
    inner: AsyncIterable<TInner> | Iterable<TInner>,
    outerKeySelector: Types.TKeySelectorAsync<T, TKey>,
    innerKeySelector: Types.TKeySelectorAsync<TInner, TKey>,
    resultSelector: Types.TResultSelectorJoinAsync<T, TInner, TResult>,
    comparer: Types.TIAsyncEqualityComparer<TKey> = new Interfaces.DefaultEqualityComparer(),
  ): Interfaces.IAsyncEnumerable<TResult> {
    return new Deferred.Async.JoinEnumerable(this, inner, outerKeySelector, innerKeySelector, resultSelector, comparer);
  }

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
  public async last(predicate: (x: T) => boolean | Promise<boolean> = () => true): Promise<T> {
    return Async.last(this.getIterator, predicate);
  }

  /**
   * Returns the last element of a sequence.
   * If predicate is specified, the last element of a sequence that satisfies a specified condition.
   * @param predicate A function to test each element for a condition. Optional.
   * @returns The value at the last position in the source sequence
   * or the last element in the sequence that passes the test in the specified predicate function.
   *
   * [`LastOrDefault`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.lastordefault)
   */
  public async lastOrDefault(
    predicate: (x: T) => boolean | Promise<boolean> = () => true,
    defaultValue?: T,
  ): Promise<T> {
    return Async.lastOrDefault(this.getIterator, predicate, defaultValue);
  }

  /**
   * Invokes a transform function on each element of a sequence and returns the maximum value.
   * @param comparer A compare function to apply to each element.
   * @throws `InvalidOperationException` - if source contains no elements.
   * @returns The maximum value in the sequence.
   *
   * [`Max`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.max)
   */
  public async max(comparer: Types.TICompareTo<number> = new Interfaces.DefaultCompareTo()): Promise<number> {
    return Async.max(this.getIterator as AsyncIterator<number>, comparer);
  }

  /**
   * Returns the maximum value in a generic sequence according to a specified key selector function and key comparer.
   *
   * [`MaxBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.maxby)
   */
  public async maxBy<TKey>(
    keySelector: Types.TKeySelectorAsync<T, TKey> = (x) => x as unknown as TKey,
    comparer: Types.TICompareTo<TKey> = new Interfaces.DefaultCompareTo(),
  ): Promise<T> {
    return Async.maxBy<T, TKey>(this.getIterator, keySelector, comparer);
  }

  /**
   * Invokes a transform function on each element of a sequence and returns the minimum value.
   * @param comparer A compare function to apply to each element.
   * @throws `InvalidOperationException` - if source contains no elements.
   * @returns The minimum value in the sequence.
   *
   * [`Min`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.min)
   */
  public async min(comparer: Types.TICompareTo<number> = new Interfaces.DefaultCompareTo()): Promise<number> {
    return Async.min(this.getIterator as AsyncIterator<number>, comparer);
  }

  /**
   * Returns the minimum value in a generic sequence according to a specified key selector function and key comparer.
   *
   * [`MinBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.minby)
   */
  public async minBy<TKey>(
    keySelector: Types.TKeySelectorAsync<T, TKey> = (x) => x as unknown as TKey,
    comparer: Types.TICompareTo<TKey> = new Interfaces.DefaultCompareTo(),
  ): Promise<T> {
    return Async.minBy<T, TKey>(this.getIterator, keySelector, comparer);
  }

  /**
   * Applies a type filter to a source iteration
   * @param type Either value for typeof or a consturctor function
   * @returns Values that match the type string or are instance of type
   *
   * [`OfType`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.oftype)
   */
  public ofType<TType extends Interfaces.OfType>(type: TType): Interfaces.IAsyncEnumerable<TType> {
    return new Deferred.Async.OfTypeEnumerable<T, TType>(this, type);
  }

  /**
   * Sorts the elements of a sequence in ascending order by using a specified or default comparer.
   * @param keySelector A function to extract a key from an element.
   * @param comparer An [`ICompareTo<T>`](docs/interfaces/icompareto.md) to compare keys. Optional.
   * @returns An [`IAsyncOrderedEnumerable<TElement>`](docs/interfaces/iasyncorderedenumerable.md) whose elements are sorted according to a key.
   *
   * [`OrderBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.orderby)
   */
  public orderBy<TKey>(
    keySelector: Types.TKeySelectorAsync<T, TKey> = (x) => x as unknown as TKey,
    comparer: Interfaces.ICompareTo<TKey> = new Interfaces.DefaultCompareTo(),
  ): Interfaces.IAsyncOrderedEnumerable<T> {
    return new Deferred.Async.OrderEnumerable(this, keySelector, comparer, false);
  }

  /**
   * Sorts the elements of a sequence in descending order by using a specified or default comparer.
   * @param keySelector A function to extract a key from an element.
   * @param comparer An [`ICompareTo<T>`](docs/interfaces/icompareto.md) to compare keys. Optional.
   * @returns An [`IAsyncOrderedEnumerable<TElement>`](docs/interfaces/iasyncorderedenumerable.md) whose elements are sorted in descending order according to a key.
   *
   * [`OrderByDescending`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.orderbydescending)
   */
  public orderByDescending<TKey>(
    keySelector: Types.TKeySelectorAsync<T, TKey> = (x) => x as unknown as TKey,
    comparer: Interfaces.ICompareTo<TKey> = new Interfaces.DefaultCompareTo(),
  ): Interfaces.IAsyncOrderedEnumerable<T> {
    return new Deferred.Async.OrderEnumerable(this, keySelector, comparer, true);
  }

  /**
   * Adds a value to the beginning of the sequence.
   *
   * [`Prepend`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.prepend)
   */
  public prepend(item: T): Interfaces.IAsyncEnumerable<T> {
    return new Deferred.Async.AppendPrependEnumerable(this, item, false);
  }

  /**
   * Generates a sequence of numbers within a specified range.
   *
   * [`Range`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.range)
   */
  public static range(start: number | string, count: number): Interfaces.IAsyncEnumerable<number | string> {
    const result = [];
    const startIsString: boolean = isString(start);
    let begin = startIsString ? (start as string).charCodeAt(0) : (start as number);
    while (count--) {
      result.push(begin++);
    }
    return new EnumerableAsync(
      Helpers.asAsyncIterable(startIsString ? String.fromCharCode(...result) : (result as never)),
    );
  }

  /**
   * Generates a sequence that contains one repeated value.
   *
   * [`Repeat`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.repeat)
   */
  public static repeat<TSource>(element: TSource, count: number): Interfaces.IAsyncEnumerable<TSource> {
    return Deferred.Async.RepeatEnumerable.Generate(element, count);
  }

  /**
   * Inverts the order of the elements in a sequence.
   * @returns A sequence whose elements correspond to those of the input sequence in reverse order.
   *
   * [`Reverse`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.reverse)
   */
  public reverse(): Interfaces.IAsyncEnumerable<T> {
    return new Deferred.Async.ReverseEnumerable(this);
  }

  /**
   * Projects each element of a sequence into a new form.
   * @param selector A transform function to apply to each element.
   * @returns - An [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md) whose elements are the result of invoking the transform function on each element of source.
   *
   * [`Select`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.select)
   */
  public select<TResult>(
    selector: (x: T, index?: number) => TResult | Promise<TResult> = (x) => x as unknown as TResult,
  ): Interfaces.IAsyncEnumerable<TResult> {
    return new Deferred.Async.SelectEnumerable(this, selector);
  }

  /**
   * Projects each element of a sequence to an [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md) and flattens the resulting sequences into one sequence.
   * @param selector A transform function to apply to each element.
   * @returns An [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md) whose elements are the result of invoking the
   * one-to-many transform function on each element of the input sequence.
   *
   * [`SelectMany`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.selectmany)
   */
  public selectMany<TCollection, TResult>(
    selector: Types.SelectManySelectorAsync<T, TCollection> = (x) => x as unknown as AsyncIterable<TCollection>,
    resultSelector: Types.SelectManyResultSelectorAsync<T, TCollection, TResult> = (x, y) => y as unknown as TResult,
  ): Interfaces.IAsyncEnumerable<TResult> {
    return new Deferred.Async.SelectManyEnumerable(this, selector, resultSelector);
  }

  /**
   * Determines whether or not two sequences are `equal`
   * @param second second iterable
   * @param comparer Compare function to use, by default is @see {StrictEqualityComparer}
   * @returns Whether or not the two iterations are equal
   *
   * [`SequenceEqual`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sequenceequal)
   */
  public async sequenceEqual(
    second: AsyncIterable<T> | Iterable<T>,
    comparer:
      | Interfaces.IEqualityComparer<T>
      | Interfaces.IAsyncEqualityComparer<T> = new Interfaces.DefaultEqualityComparer<T>(),
  ): Promise<boolean> {
    return Async.sequenceEqual(this.getIterator, Helpers.asAsyncIterable(second), comparer);
  }

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
  public async single(predicate: (x: T) => boolean | Promise<boolean> = () => true): Promise<T> {
    return Async.single(this.getIterator, predicate);
  }

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
  public async singleOrDefault(
    predicate: (x: T) => boolean | Promise<boolean> = () => true,
    defaultValue?: T,
  ): Promise<T> {
    return Async.singleOrDefault(this.getIterator, predicate, defaultValue);
  }

  /**
   * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
   * @param count The number of elements to skip before returning the remaining elements.
   * @returns An [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md) that contains the elements that occur after the specified index in the input sequence.
   *
   * [`Skip`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skip)
   */
  public skip(count: number): Interfaces.IAsyncEnumerable<T> {
    if (count <= 0) {
      return this;
    }
    return new Deferred.Async.SkipEnumerable(this, count);
  }

  /**
   * Returns a new enumerable collection that contains the elements from `source` with the last `count` elements of the source collection omitted.
   *
   * [`SkipLast`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skiplast)
   */
  public skipLast(count: number): Interfaces.IAsyncEnumerable<T> {
    if (count <= 0) {
      return this;
    }
    return new Deferred.Async.SkipLastEnumerable(this, count);
  }

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
  public skipWhile(
    predicate: (element: T, index: number) => boolean | Promise<boolean> = () => true,
  ): Interfaces.IAsyncEnumerable<T> {
    return new Deferred.Async.SkipWhileEnumerable(this, predicate);
  }

  /**
   * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function
   * on each element of the input sequence.
   * @param selector A transform function to apply to each element.
   * @returns The sum of the projected values.
   *
   * [`Sum`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sum)
   */
  public async sum(
    selector: (element: T) => string | number | Promise<string | number> = (element) =>
      element as unknown as number | string,
  ): Promise<string | number> {
    return Async.sum(this.getIterator, selector);
  }

  /**
   * Returns a specified number of contiguous elements from the start of a sequence.
   * @param amount The number of elements to return.
   * @returns An [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md) that contains the specified number of elements from the start of the input sequence.
   *
   * [`Take`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.take)
   */
  public take(count: number): Interfaces.IAsyncEnumerable<T> {
    if (count <= 0) {
      return new EnumerableAsync(Helpers.asAsyncIterable([]));
    }
    return new Deferred.Async.TakeEnumerable(this, count);
  }

  /**
   * Returns a new enumerable collection that contains the last `count` elements from `source`.
   *
   * [`TakeLast`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.takelast)
   */
  public takeLast(count: number): Interfaces.IAsyncEnumerable<T> {
    if (count <= 0) {
      return new EnumerableAsync(Helpers.asAsyncIterable([]));
    }
    return new Deferred.Async.TakeLastEnumerable(this, count);
  }

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
  public takeWhile(
    predicate: (element: T, index: number) => boolean | Promise<boolean> = () => true,
  ): Interfaces.IAsyncEnumerable<T> {
    return new Deferred.Async.TakeWhileEnumerable(this, predicate);
  }

  /**
   * Creates an array from a [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md).
   * @returns An array of elements
   *
   * [`ToArray`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.toarray)
   */
  public async toArray(): Promise<Array<T>> {
    return Async.toArray(this.getIterator);
  }

  /**
   * Converts an Iterable<V> to a Map<K, V[]>.
   * @param selector A function to serve as a key selector.
   * @returns Map<K, V[]>
   *
   * [`ToDictionary`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.todictionary)
   */
  public async toMap<TKey>(selector: (x: T) => TKey | Promise<TKey>): Promise<Map<TKey, Array<T>>> {
    return Async.toMap(this.getIterator, selector);
  }

  /**
   * Converts the iteration to a Set
   * @returns Set containing the iteration values
   */
  public async toSet(): Promise<Set<T>> {
    return new Set(await this.toArray());
  }

  /**
   * Produces the set union of two sequences by using scrict equality comparison or a specified [`IAsyncEqualityComparer<T>`](docs/interfaces/iasyncequalitycomparer.md).
   * @param second An Iterable<T> whose distinct elements form the second set for the union.
   * @param comparer The [`IAsyncEqualityComparer<T>`](docs/interfaces/iasyncequalitycomparer.md) to compare values. Optional.
   * @returns An [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md) that contains the elements from both input sequences, excluding duplicates.
   *
   * [`Union`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.union)
   */
  public union(
    second: AsyncIterable<T> | Iterable<T>,
    comparer: Interfaces.IEqualityComparer<T> = new Interfaces.DefaultEqualityComparer(),
  ): Interfaces.IAsyncEnumerable<T> {
    return new Deferred.Async.UnionEnumerable<T>(this, Helpers.asAsyncIterable(second), comparer);
  }

  /**
   * Produces the set union of two sequences according to a specified key selector function.
   *
   * [`UnionBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.unionby)
   */
  public unionBy<TKey>(
    second: AsyncIterable<TKey> | Iterable<TKey>,
    keySelector: Types.TKeySelectorAsync<T, TKey> = (x) => x as unknown as TKey,
    comparer: Types.TIAsyncEqualityComparer<TKey> = new Interfaces.DefaultEqualityComparer(),
  ): Interfaces.IAsyncEnumerable<T> {
    return new Deferred.Async.UnionByEnumerable(this, Helpers.asAsyncIterable(second), keySelector, comparer);
  }

  /**
   * Filters a sequence of values based on a predicate.
   * Each element's index is used in the logic of the predicate function.
   * @param predicate A function to test each source element for a condition;
   * the second parameter of the function represents the index of the source element.
   * @returns An [`IAsyncEnumerable<T>`](docs/interfaces/iasyncenumerable.md) that contains elements from the input sequence that satisfy the condition.
   *
   * [`Where`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.where)
   */
  public where(
    predicate: (x: T, index: number) => boolean | Promise<boolean> = () => true,
  ): Interfaces.IAsyncEnumerable<T> {
    return new Deferred.Async.WhereEnumerable(this, predicate);
  }

  /**
   * Creates a tuple of corresponding elements of two sequences, producing a sequence of the results.
   * @param second The second sequence to merge.
   * @returns An [`IAsyncEnumerable<[T, V]>`](docs/interfaces/iasyncenumerable.md) that contains merged elements of two input sequences.
   *
   * [`zip`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.zip)
   */
  public zip<TSecond>(second: AsyncIterable<TSecond> | Iterable<TSecond>): Interfaces.IAsyncEnumerable<[T, TSecond]>;
  /**
   * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
   * @param second The second sequence to merge.
   * @param resultSelector A function that specifies how to merge the elements from the two sequences.
   * @returns An [`IAsyncEnumerable<TResult>`](docs/interfaces/iasyncenumerable.md) that contains merged elements of two input sequences.
   */
  public zip<TSecond, TResult>(
    second: AsyncIterable<TSecond> | Iterable<TSecond>,
    resultSelector: Types.ZipResultSelectorAsync<T, TSecond, undefined, TResult>,
  ): Interfaces.IAsyncEnumerable<TResult>;
  public zip<TSecond, TThird, TResult>(
    second: AsyncIterable<TSecond> | Iterable<TSecond>,
    third: AsyncIterable<TThird> | Iterable<TThird>,
    resultSelector: Types.ZipResultSelectorAsync<T, TSecond, TThird, TResult>,
  ): Interfaces.IAsyncEnumerable<TResult>;
  public zip<TSecond, TThird, TResult>(
    second: AsyncIterable<TSecond> | Iterable<TSecond>,
    b?: AsyncIterable<TThird> | Iterable<TThird> | Types.ZipResultSelectorAsync<T, TSecond, TThird, TResult>,
    c?: Types.ZipResultSelectorAsync<T, TSecond, TThird, TResult>,
  ): Interfaces.IAsyncEnumerable<TResult> {
    let third: AsyncIterable<TThird> | undefined;
    let resultSelector: Types.ZipResultSelectorAsync<T, TSecond, TThird, TResult>;
    if (!isNullOrUndefined(c)) {
      third = Helpers.asAsyncIterable(b as unknown as Iterable<TThird> | AsyncIterable<TThird>);
      resultSelector = c as Types.ZipResultSelectorAsync<T, TSecond, TThird, TResult>;
    } else if (isFunction(b) || isAsyncFunction(b)) {
      resultSelector = b as Types.ZipResultSelectorAsync<T, TSecond, TThird, TResult>;
    } else {
      resultSelector = (x: T, y: TSecond) => [x, y] as unknown as TResult;
    }

    return new Deferred.Async.ZipEnumerable<T, TSecond, TThird, TResult>(
      this,
      Helpers.asAsyncIterable(second),
      third,
      resultSelector,
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface EnumerableAsync<T> extends Interfaces.IAsyncEnumerable<T> {}
