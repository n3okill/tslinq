import { Deferred, Interfaces, Sync, Types } from "./internal";
import { isIterable, isUndefined, isString, isNullOrUndefined, isFunction } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class Enumerable<TSource> {
  constructor(protected readonly _source: Iterable<TSource>) {}

  [Symbol.iterator](): Iterator<TSource> {
    return this._source[Symbol.iterator]();
  }

  protected get getIterator(): Iterator<TSource> {
    return this[Symbol.iterator]();
  }

  static asEnumerable = <TSource2>(source: Enumerable<TSource2> | Iterable<TSource2>): Enumerable<TSource2> => {
    if (!isIterable(source)) {
      throw new TypeError("source is not iterable.");
    }
    if (source instanceof Enumerable) {
      return source;
    }
    return new Enumerable<TSource2>(source);
  };
  static create = Enumerable.asEnumerable;

  /**
   * Applies an accumulator function over a sequence.
   * @param func An [`accumulator`](docs/types.md#aggregatefunctiontype) function to be invoked on each element.
   * @returns The final accumulator value.
   * [`Aggregate`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.aggregate)
   */
  public aggregate<TResult>(
    func: Types.AggregateFunctionType<TSource, TSource>,
    resultSelector?: Types.AggregateResultType<TSource, TResult>,
  ): TResult;
  /**
   * Applies an accumulator function over a sequence.
   * The specified seed value is used as the initial accumulator value.
   * @param seed The initial accumulator value.
   * @param func An [`accumulator`](docs/types.md#aggregatefunctiontype) function to be invoked on each element.
   * @returns The final accumulator value.
   */
  public aggregate<TAccumulate, TResult>(
    seed: TAccumulate,
    func: Types.AggregateFunctionType<TSource, TAccumulate>,
    resultSelector?: Types.AggregateResultType<TAccumulate, TResult>,
  ): TResult;
  /**
   * Applies an accumulator function over a sequence.
   * The specified seed value is used as the initial accumulator value,
   * and the specified function is used to select the result value.
   * @param seed The initial accumulator value.
   * @param func An [`accumulator`](docs/types.md#aggregatefunctiontype) function to be invoked on each element.
   * @param resultSelector A function to transform the final accumulator value into the result value.
   * @returns The transformed final accumulator value.
   */
  public aggregate<TAccumulate, TResult>(
    seed: TAccumulate | Types.AggregateFunctionType<TSource, TAccumulate>,
    func: Types.AggregateFunctionType<TSource, TAccumulate> = (x) => x as unknown as TAccumulate,
    resultSelector: Types.AggregateResultType<TAccumulate, TResult> = (o) => o as unknown as TResult,
  ): TResult {
    return Sync.aggregate(this.getIterator, seed, func, resultSelector);
  }

  /**
   * Determines whether all elements of a sequence satisfy a condition.
   * @param predicate A function to test each element for a condition.
   * @returns `true` if every element of the source sequence passes the test in the specified `predicate`,
   * or if the sequence is empty; otherwise, `false`.
   * [`All`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.all)
   */
  public all(predicate: (x: TSource) => boolean): boolean {
    return Sync.all(this.getIterator, predicate);
  }

  /**
   * Determines whether a sequence contains any elements.
   * If predicate is specified, determines whether any element of a sequence satisfies a condition.
   * @param predicate A function to test each element for a condition.
   * [`Any`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.any)
   * @returns true if the source sequence contains any elements or passes the test specified; otherwise, false.
   */
  public any(predicate?: (x: TSource) => boolean): boolean {
    return Sync.any(this.getIterator, predicate);
  }

  /**
   * Appends a value to the end of the sequence.
   * [`Append`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.append)
   */
  public append(item: TSource): Interfaces.IEnumerable<TSource> {
    return new Deferred.Sync.AppendPrependEnumerable(this, item, true);
  }

  /**
   * Computes the average of a sequence of values
   * that are obtained by invoking a transform function on each element of the input sequence.
   * @param selector A transform function to apply to each element.
   * @throws InvalidOperationException - source contains no elements.
   * @returns The average of the sequence of values.
   * [`Average`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.average)
   */
  public average(selector: (x: TSource) => number = (x) => x as unknown as number): number {
    return Sync.average(this.getIterator, selector);
  }

  /**
   * Splits the elements of a sequence into chunks of size at most size.
   * [`Chunk`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.chunk)
   */
  public chunk(size: number): Interfaces.IEnumerable<Array<TSource>> {
    return Sync.chunk(this.getIterator, size);
  }

  /**
   * Concatenates two sequences.
   * @param second The sequence to concatenate to the first sequence.
   * @returns An [`IEnumerable<T>`](docs/interfaces/ienumerable.md) that contains the concatenated elements of the two sequences.
   * [`Concat`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.concat)
   */
  public concat(second: Iterable<TSource>): Interfaces.IEnumerable<TSource> {
    return new Deferred.Sync.ConcatEnumerable(this, second);
  }

  /**
   * Determines whether a sequence contains a specified element by
   * using the specified or default [`IEqualityComparer<T>`](docs/interfaces/iequalitycomparer.md).
   * @param value The value to locate in the sequence.
   * @param comparer An equality comparer to compare values. Optional.
   * @returns `true` if the source sequence contains an element that has the specified value; otherwise, `false`.
   * [`Contains`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.contains)
   */
  public contains(
    value: TSource,
    comparer: Interfaces.IEqualityComparer<TSource> = new Interfaces.DefaultEqualityComparer(),
  ): boolean {
    return Sync.contains(this.getIterator, value, comparer);
  }

  /**
   * Returns the number of elements in a sequence
   * or represents how many elements in the specified sequence satisfy a condition
   * if the predicate is specified.
   * @param predicate A function to test each element for a condition. Optional.
   * @returns The number of elements in the input sequence.
   * [`Count`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.count)
   */
  public count(predicate: (x: TSource) => boolean = () => true): number {
    return Sync.count(this.getIterator, predicate);
  }

  /**
   * Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is `empty`.
   * [`DefaultIfEmtpy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.defaultifempty)
   */
  public defaultIfEmpty(defaultValue?: TSource): Interfaces.IEnumerable<TSource> {
    return new Deferred.Sync.DefaultIfEmptyEnumerable(this, defaultValue) as Interfaces.IEnumerable<TSource>;
  }

  /**
   * Returns distinct elements from a sequence by using the `default` or specified equality comparer to compare values.
   * @param comparer An [`IEqualityComparer<T>`](docs/interfaces/iequalitycomparer.md) to compare values. Optional. Defaults to Strict Equality Comparison.
   * @returns An [`IEnumerable<T>`](docs/interfaces/ienumerable.md) that contains distinct elements from the source sequence.
   * [`Distinct`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.distinct)
   */
  public distinct(
    comparer: Interfaces.IEqualityComparer<TSource> = new Interfaces.DefaultEqualityComparer(),
  ): Interfaces.IEnumerable<TSource> {
    return new Deferred.Sync.DistinctEnumerable(this, comparer);
  }

  /**
   * Returns distinct elements from a sequence according to a specified key selector function and using a specified comparer to compare keys.
   * [`DistinctBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.distinctby)
   */
  public distinctBy<TKey>(
    keySelector: Types.TKeySelector<TSource, TKey> = (x) => x as unknown as TKey,
    comparer: Interfaces.IEqualityComparer<TKey> = new Interfaces.DefaultEqualityComparer(),
  ): Interfaces.IEnumerable<TSource> {
    return new Deferred.Sync.DistinctByEnumerable(this, keySelector, comparer);
  }

  /**
   * Returns the element at a specified index in a sequence.
   * @param index The zero-based index of the element to retrieve.
   * @throws `ArgumentOutOfRangeException` if index is less than 0 or greater than or equal to the number of elements in source.
   * @returns The element at the specified position in the source sequence.
   * [`ElementAt`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.elementat)
   */
  public elementAt(index: number): TSource {
    return Sync.elementAt(this.getIterator, index);
  }

  /**
   * Returns the element at a specified index in a sequence or a default value if the index is out of range.
   * @param index The zero-based index of the element to retrieve.
   * @returns `null` if the index is outside the bounds of the source sequence;
   * otherwise, the element at the specified position in the source sequence.
   * [`ElementAtOrDefault`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.elementatordefault)
   */
  public elementAtOrDefault(index: number): TSource {
    return Sync.elementAtOrDefault(this.getIterator, index);
  }

  /**
   * Returns an `empty` [`IEnumerable<T>`](docs/interfaces/ienumerable.md) that has the specified type argument.
   * [`Empty`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.empty)
   */
  public static empty<TSource2>(type: Interfaces.IConstructor<Iterable<TSource2>>): Enumerable<TSource2> {
    return new Enumerable<TSource2>(new type());
  }

  /**
   * Produces the set difference of two sequences by using the comparer provided
   * or EqualityComparer to compare values.
   * @param second An [`IEnumerable<T>`](docs/interfaces/ienumerable.md) whose elements that also occur in the first sequence
   * will cause those elements to be removed from the returned sequence.
   * @param comparer An [`IEqualityComparer<T>`](docs/interfaces/iequalitycomparer.md) to compare values. Optional.
   * @returns A sequence that contains the set difference of the elements of two sequences.
   * [`Except`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.except)
   */
  public except(
    second: Iterable<TSource>,
    comparer: Interfaces.IEqualityComparer<TSource> = new Interfaces.DefaultEqualityComparer(),
  ): Interfaces.IEnumerable<TSource> {
    return new Deferred.Sync.ExceptEnumerable(this, second, comparer);
  }

  /**
   * Produces the set difference of two sequences according to a specified key selector function.
   * [`ExceptBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.exceptby)
   */
  public exceptBy<TKey>(
    second: Iterable<TKey>,
    keySelector: Types.TKeySelector<TSource, TKey> = (x) => x as unknown as TKey,
    comparer: Interfaces.IEqualityComparer<TKey> = new Interfaces.DefaultEqualityComparer(),
  ): Interfaces.IEnumerable<TSource> {
    return new Deferred.Sync.ExceptByEnumerable(this, second, keySelector, comparer);
  }

  /**
   * Returns the first element in sequence that satisfies `predicate` otherwise
   * returns the first element in the sequence.
   * @param predicate A function to test each element for a condition. Optional.
   * @throws `InvalidOperationException` - No elements in Iteration matching predicate
   * @returns The first element in the sequence
   * or the first element that passes the test in the specified predicate function.
   * [`First`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.first)
   */
  public first(predicate: (x: TSource) => boolean = () => true): TSource {
    return Sync.first(this.getIterator, predicate);
  }

  /**
   * Returns first element in sequence that satisfies predicate otherwise
   * returns the first element in the sequence. Returns null if no value found.
   * @param predicate A function to test each element for a condition. Optional.
   * @returns The first element in the sequence
   * or the first element that passes the test in the specified predicate function.
   * Returns `null` if no value found.
   * [`FirstOrDefault`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.firstordefault)
   */
  public firstOrDefault(predicate: (x: TSource) => boolean = () => true, defaultValue?: TSource): TSource {
    return Sync.firstOrDefault(this.getIterator, predicate, defaultValue);
  }

  /**
   * Performs a specified action on each element of the Iterable<TSource>
   * @param action The action to take an each element
   * @returns A new [`IEnumerable<TResult>`](docs/interfaces/ienumerable.md) that executes the action lazily as you iterate.
   */
  public forEach<TResult>(action: (x: TSource) => TResult): Interfaces.IEnumerable<TResult> {
    return Sync.forEach(this, action);
  }

  /**
   * Groups the elements of a sequence according to a specified key selector function.
   * @param keySelector A function to extract the key for each element.
   * @returns An IEnumerable<IGrouping<TKey, TSource>>
   * where each [`IGrouping<TKey,TElement>`](docs/interfaces/igrouping.md) object contains a sequence of objects and a key.
   * [`GroupBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupby)
   */
  public groupBy<TKey, TResult>(
    keySelector: Types.TKeySelector<TSource, TKey>,
    resultSelector?: Types.TResultSelector<TKey, TSource, TResult> | Interfaces.IEqualityComparer<TSource>,
    comparer?: Interfaces.IEqualityComparer<TKey>,
  ): Interfaces.IEnumerable<TResult>;
  /**
   * Groups the elements of a sequence according to a key selector function.
   * The keys are compared by using a comparer and each group's elements are projected by using a specified function.
   * @param keySelector A function to extract the key for each element.
   * @param comparer An [`IEqualityComparer<T>`](docs/interfaces/iequalitycomparer.md) to compare keys.
   */
  public groupBy<TKey, TElement, TResult>(
    keySelector: Types.TKeySelector<TSource, TKey>,
    elementSelector: Types.TElementSelector<TSource, TElement>,
    resultSelector: Types.TResultSelector<TKey, TElement, TResult>,
    comparer?: Interfaces.IEqualityComparer<TKey>,
  ): Interfaces.IEnumerable<TResult>;
  public groupBy<TKey, TElement, TResult>(
    keySelector: Types.TKeySelector<TSource, TKey>,
    a?:
      | Types.TElementSelector<TSource, TElement>
      | Types.TResultSelector<TKey, TElement, TResult>
      | Interfaces.IEqualityComparer<TKey>,
    b?: Types.TResultSelector<TKey, TElement, TResult> | Interfaces.IEqualityComparer<TKey>,
    c?: Interfaces.IEqualityComparer<TKey>,
  ): Interfaces.IEnumerable<TResult> {
    let elementSelector: Types.TElementSelector<TSource, TElement> = (x) => x as unknown as TElement;
    let resultSelector: Types.TResultSelector<TKey, TElement, TResult> = (x, y) => y as unknown as TResult;
    let comparer: Interfaces.IEqualityComparer<TKey> = new Interfaces.DefaultEqualityComparer();

    if (!isUndefined(c)) {
      comparer = c as Interfaces.IEqualityComparer<TKey>;
      resultSelector = b as Types.TResultSelector<TKey, TElement, TResult>;
      elementSelector = a as Types.TElementSelector<TSource, TElement>;
    } else if (!isUndefined(b)) {
      if (b instanceof Interfaces.IEqualityComparer) {
        comparer = b;
        elementSelector = a as Types.TElementSelector<TSource, TElement>;
      } else {
        elementSelector = a as Types.TElementSelector<TSource, TElement>;
        resultSelector = b as Types.TResultSelector<TKey, TElement, TResult>;
      }
    } else if (!isUndefined(a)) {
      if (a instanceof Interfaces.IEqualityComparer) {
        comparer = a;
      } else {
        elementSelector = a as Types.TElementSelector<TSource, TElement>;
      }
    }
    return new Deferred.Sync.GroupByEnumerable(this, keySelector, elementSelector, resultSelector, comparer);
  }

  public groupByGrouped<TKey>(
    keySelector: Types.TKeySelector<TSource, TKey>,
  ): Interfaces.IEnumerable<Interfaces.IGrouping<TKey, TSource>>;
  public groupByGrouped<TKey, TElement>(
    keySelector: Types.TKeySelector<TSource, TKey>,
    elementSelector: Types.TElementSelector<TSource, TElement>,
  ): Interfaces.IEnumerable<Interfaces.IGrouping<TKey, TSource>>;
  public groupByGrouped<TKey, TElement>(
    keySelector: Types.TKeySelector<TSource, TKey>,
    elementSelector: Types.TElementSelector<TSource, TElement> = (x) => x as unknown as TElement,
    comparer: Interfaces.IEqualityComparer<TKey> = new Interfaces.DefaultEqualityComparer(),
  ): Interfaces.IEnumerable<Interfaces.IGrouping<TKey, TElement>> {
    return new Deferred.Sync.GroupByGroupedEnumerable(this, keySelector, elementSelector, comparer);
  }

  /**
   * Correlates the elements of two sequences based on matching keys.
   * A specified [`IEqualityComparer<T>`](docs/interfaces/iequalitycomparer.md) is used to compare keys or the strict equality comparer.
   * @param inner The sequence to join to the first sequence.
   * @param outerKeySelector A function to extract the join key from each element of the first sequence.
   * @param innerKeySelector A function to extract the join key from each element of the second sequence.
   * @param resultSelector A function to create a result element from two matching elements.
   * @param comparer An [`IEqualityComparer<T>`](docs/interfaces/iequalitycomparer.md) to hash and compare keys. Optional.
   * @returns An [`IEnumerable<T>`](docs/interfaces/ienumerable.md) that has elements of type TResult that
   * are obtained by performing an inner join on two sequences.
   * [`GroupJoin`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupjoin)
   */
  public groupJoin<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: Types.TKeySelector<TSource, TKey>,
    innerKeySelector: Types.TKeySelector<TInner, TKey>,
    resultSelector: Types.TResultSelector<TKey, TInner, TResult>,
    comparer: Interfaces.IEqualityComparer<TKey> = new Interfaces.DefaultEqualityComparer(),
  ): Interfaces.IEnumerable<TResult> {
    return new Deferred.Sync.GroupJoinEnumerable(
      this,
      inner,
      outerKeySelector,
      innerKeySelector,
      resultSelector,
      comparer,
    );
  }

  /**
   * Produces the set intersection of two sequences by using the specified [`IEqualityComparer<T>`](docs/interfaces/iequalitycomparer.md) to compare values.
   * If no comparer is selected, uses the StrictEqualityComparer.
   * @param second An Iterable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @param comparer An [`IEqualityComparer<T>`](docs/interfaces/iequalitycomparer.md) to compare values. Optional.
   * @returns A sequence that contains the elements that form the set intersection of two sequences.
   * [`Intersect`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.intersect)
   */
  public intersect(
    second: Iterable<TSource>,
    comparer: Interfaces.IEqualityComparer<TSource> = new Interfaces.DefaultEqualityComparer(),
  ): Interfaces.IEnumerable<TSource> {
    return new Deferred.Sync.IntersectEnumerable(this, second, comparer);
  }

  /**
   * Produces the set intersection of two sequences according to a specified key selector function.
   * [`IntersectBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.intersectby)
   */
  public intersectBy<TKey>(
    second: Iterable<TKey>,
    keySelector: Types.TKeySelector<TSource, TKey> = (x) => x as unknown as TKey,
    comparer: Interfaces.IEqualityComparer<TKey> = new Interfaces.DefaultEqualityComparer(),
  ): Interfaces.IEnumerable<TSource> {
    return new Deferred.Sync.IntersectByEnumerable(this, second, keySelector, comparer);
  }

  /**
   * Correlates the elements of two sequences based on matching keys. A specified [`IEqualityComparer<T>`](docs/interfaces/iequalitycomparer.md) is used to compare keys.
   * [`Join`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.join)
   */
  public join<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: Types.TKeySelector<TSource, TKey>,
    innerKeySelector: Types.TKeySelector<TInner, TKey>,
    resultSelector: Types.TResultSelectorJoin<TSource, TInner, TResult>,
    comparer: Interfaces.IEqualityComparer<TKey> = new Interfaces.DefaultEqualityComparer(),
  ): Interfaces.IEnumerable<TResult> {
    return new Deferred.Sync.JoinEnumerable(this, inner, outerKeySelector, innerKeySelector, resultSelector, comparer);
  }

  /**
   * Returns the last element of a sequence.
   * If predicate is specified, the last element of a sequence that satisfies a specified `condition`.
   * @param predicate A function to test each element for a condition. Optional.
   * @throws `InvalidOperationException` if the `source` sequence is `empty`.
   * @returns The value at the last position in the source sequence
   * or the last element in the sequence that passes the test in the specified predicate function.
   * [`Last`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.last)
   */
  public last(predicate: (x: TSource) => boolean = () => true): TSource {
    return Sync.last(this.getIterator, predicate);
  }

  /**
   * Returns the last element of a sequence.
   * If predicate is specified, the last element of a sequence that satisfies a specified condition.
   * @param predicate A function to test each element for a condition. Optional.
   * @returns The value at the last position in the source sequence
   * or the last element in the sequence that passes the test in the specified predicate function.
   * [`LastOrDefault`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.lastordefault)
   */
  public lastOrDefault(predicate: (x: TSource) => boolean = () => true, defaultValue?: TSource): TSource {
    return Sync.lastOrDefault(this.getIterator, predicate, defaultValue);
  }

  /**
   * Invokes a transform function on each element of a sequence and returns the maximum value.
   * @param comparer A compare function to apply to each element.
   * @throws `InvalidOperationException` - if source contains no elements.
   * @returns The maximum value in the sequence.
   * [`Max`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.max)
   */
  public max(comparer: Interfaces.ICompareTo<number> = new Interfaces.DefaultCompareTo()): number {
    return Sync.max(this.getIterator as Iterator<number>, comparer);
  }

  /**
   * Returns the maximum value in a generic sequence according to a specified key selector function and key comparer.
   * [`MaxBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.maxby)
   */
  public maxBy<TKey>(
    keySelector: Types.TKeySelector<TSource, TKey> = (x) => x as unknown as TKey,
    comparer: Interfaces.ICompareTo<TKey> = new Interfaces.DefaultCompareTo(),
  ): TSource {
    return Sync.maxBy<TSource, TKey>(this.getIterator, keySelector, comparer);
  }

  /**
   * Invokes a transform function on each element of a sequence and returns the minimum value.
   * @param comparer A compare function to apply to each element.
   * @throws `InvalidOperationException` - if source contains no elements.
   * @returns The minimum value in the sequence.
   * [`Min`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.min)
   */
  public min(comparer: Interfaces.ICompareTo<number> = new Interfaces.DefaultCompareTo()): number {
    return Sync.min(this.getIterator as Iterator<number>, comparer);
  }

  /**
   * Returns the minimum value in a generic sequence according to a specified key selector function and key comparer.
   * [`MinBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.minby)
   */
  public minBy<TKey>(
    keySelector: Types.TKeySelector<TSource, TKey> = (x) => x as unknown as TKey,
    comparer: Interfaces.ICompareTo<TKey> = new Interfaces.DefaultCompareTo(),
  ): TSource {
    return Sync.minBy<TSource, TKey>(this.getIterator, keySelector, comparer);
  }

  /**
   * Applies a type filter to a source iteration
   * @param type Either value for typeof or a consturctor function
   * @returns Values that match the type string or are instance of type
   * [`OfType`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.oftype)
   */
  public ofType<TType extends Interfaces.OfType>(type: TType): Interfaces.IEnumerable<TType> {
    return new Deferred.Sync.OfTypeEnumerable<TSource, TType>(this, type);
  }

  /**
   * Sorts the elements of a sequence in ascending order by using a specified or default comparer.
   * @param keySelector A function to extract a key from an element.
   * @param comparer An [`ICompareTo<T>`](docs/interfaces/icompareto.md) to compare keys. Optional.
   * @returns An [`IOrderedEnumerable<TElement>`](docs/interfaces/iorderedenumerable.md) whose elements are sorted according to a key.
   * [`OrderBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.orderby)
   */
  public orderBy<TKey>(
    keySelector: Types.TKeySelector<TSource, TKey> = (x) => x as unknown as TKey,
    comparer: Interfaces.ICompareTo<TKey> = new Interfaces.DefaultCompareTo(),
  ): Interfaces.IOrderedEnumerable<TSource> {
    return new Deferred.Sync.OrderEnumerable(this, keySelector, comparer, false);
  }

  /**
   * Sorts the elements of a sequence in descending order by using a specified or default comparer.
   * @param keySelector A function to extract a key from an element.
   * @param comparer An [`ICompareTo<T>`](docs/interfaces/icompareto.md) to compare keys. Optional.
   * @returns An [`IOrderedEnumerable<TElement>`](docs/interfaces/iorderedenumerable.md) whose elements are sorted in descending order according to a key.
   * [`OrderByDescending`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.orderbydescending)
   */
  public orderByDescending<TKey>(
    keySelector: Types.TKeySelector<TSource, TKey> = (x) => x as unknown as TKey,
    comparer: Interfaces.ICompareTo<TKey> = new Interfaces.DefaultCompareTo(),
  ): Interfaces.IOrderedEnumerable<TSource> {
    return new Deferred.Sync.OrderEnumerable(this, keySelector, comparer, true);
  }

  /**
   * Adds a value to the beginning of the sequence.
   * [`Prepend`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.prepend)
   */
  public prepend(item: TSource): Interfaces.IEnumerable<TSource> {
    return new Deferred.Sync.AppendPrependEnumerable(this, item, false);
  }

  /**
   * Generates a sequence of numbers within a specified range.
   * [`Range`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.range)
   */
  public static range(start: number | string, count: number): Interfaces.IEnumerable<number | string> {
    const result = [];
    const startIsString: boolean = isString(start);
    let begin = startIsString ? (start as string).charCodeAt(0) : (start as number);
    while (count--) {
      result.push(begin++);
    }
    return new Enumerable(startIsString ? String.fromCharCode(...result) : (result as never));
  }

  /**
   * Generates a sequence that contains one repeated value.
   * [`Repeat`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.repeat)
   */
  public static repeat<TSource2>(element: TSource2, count: number): Interfaces.IEnumerable<TSource2> {
    return Deferred.Sync.RepeatEnumerable.Generate(element, count) as Interfaces.IEnumerable<TSource2>;
  }

  /**
   * Inverts the order of the elements in a sequence.
   * @returns A sequence whose elements correspond to those of the input sequence in reverse order.
   * [`Reverse`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.reverse)
   */
  public reverse(): Interfaces.IEnumerable<TSource> {
    return new Deferred.Sync.ReverseEnumerable(this);
  }

  /**
   * Projects each element of a sequence into a new form.
   * @param selector A transform function to apply to each element.
   * @returns - An [`IEnumerable<T>`](docs/interfaces/ienumerable.md) whose elements are the result of invoking the transform function on each element of source.
   * [`Select`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.select)
   */
  public select<TResult>(
    selector: (x: TSource, index?: number) => TResult = (x) => x as unknown as TResult,
  ): Interfaces.IEnumerable<TResult> {
    return new Deferred.Sync.SelectEnumerable(this, selector);
  }

  /**
   * Projects each element of a sequence to an [`IEnumerable<T>`](docs/interfaces/ienumerable.md) and flattens the resulting sequences into one sequence.
   * @param selector A transform function to apply to each element.
   * @returns An [`IEnumerable<T>`](docs/interfaces/ienumerable.md) whose elements are the result of invoking the
   * one-to-many transform function on each element of the input sequence.
   * [`SelectMany`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.selectmany)
   */
  public selectMany<TCollection, TResult>(
    selector: Types.SelectManySelector<TSource, TCollection> = (x) => x as unknown as Iterable<TCollection>,
    resultSelector: Types.SelectManyResultSelector<TSource, TCollection, TResult> = (x, y) => y as unknown as TResult,
  ): Interfaces.IEnumerable<TResult> {
    return new Deferred.Sync.SelectManyEnumerable(this, selector, resultSelector);
  }

  /**
   * Determines whether or not two sequences are `equal`
   * @param second second iterable
   * @param comparer Compare function to use, by default is @see {StrictEqualityComparer}
   * @returns Whether or not the two iterations are equal
   * [`SequenceEqual`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sequenceequal)
   */
  public sequenceEqual(
    second: Iterable<TSource>,
    comparer: Interfaces.IEqualityComparer<TSource> = new Interfaces.DefaultEqualityComparer<TSource>(),
  ): boolean {
    return Sync.sequenceEqual(this.getIterator, second, comparer);
  }

  /**
   * Returns the only element of a sequence that satisfies a specified condition (if specified),
   * and throws an exception if more than one such element exists.
   * @param predicate A function to test an element for a condition. (Optional)
   * @throws `InvalidOperationException` - if no element satisfies the `condition` in predicate. OR
   * More than one element satisfies the condition in predicate. OR
   * The source sequence is empty.
   * @returns The single element of the input sequence that satisfies a condition.
   * [`Single`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.single)
   */
  public single(predicate: (x: TSource) => boolean = () => true): TSource {
    return Sync.single(this.getIterator, predicate);
  }

  /**
   * If predicate is specified returns the only element of a sequence that satisfies a specified condition,
   * ootherwise returns the only element of a sequence. Returns a default value if no such element exists.
   * @param predicate A function to test an element for a condition. Optional.
   * @throws `InvalidOperationException` - If predicate is specified more than one element satisfies the condition in predicate,
   * otherwise the input sequence contains more than one element.
   * @returns The single element of the input sequence that satisfies the condition,
   * or null if no such element is found.
   * [`SingleOrDefault`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.singleordefault)
   */
  public singleOrDefault(predicate: (x: TSource) => boolean = () => true, defaultValue?: TSource): TSource {
    return Sync.singleOrDefault(this.getIterator, predicate, defaultValue);
  }

  /**
   * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
   * @param count The number of elements to skip before returning the remaining elements.
   * @returns An [`IEnumerable<T>`](docs/interfaces/ienumerable.md) that contains the elements that occur after the specified index in the input sequence.
   * [`Skip`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skip)
   */
  public skip(count: number): Interfaces.IEnumerable<TSource> {
    if (count <= 0) {
      return this;
    }
    return new Deferred.Sync.SkipEnumerable(this, count);
  }

  /**
   * Returns a new enumerable collection that contains the elements from `source` with the last `count` elements of the source collection omitted.
   * [`SkipLast`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skiplast)
   */
  public skipLast(count: number): Interfaces.IEnumerable<TSource> {
    if (count <= 0) {
      return this;
    }
    return new Deferred.Sync.SkipLastEnumerable(this, count);
  }

  /**
   * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
   * The element's index is used in the logic of the predicate function.
   * @param predicate A function to test each source element for a condition;
   * the second parameter of the function represents the index of the source element.
   * @returns An [`IEnumerable<T>`](docs/interfaces/ienumerable.md) that contains the elements from the input sequence starting at the first element
   * in the linear series that does not pass the test specified by predicate.
   * [`SkipWhile`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skipwhile)
   */
  public skipWhile(
    predicate: (element: TSource, index: number) => boolean = () => true,
  ): Interfaces.IEnumerable<TSource> {
    return new Deferred.Sync.SkipWhileEnumerable(this, predicate);
  }

  /**
   * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function
   * on each element of the input sequence.
   * @param selector A transform function to apply to each element.
   * @returns The sum of the projected values.
   * [`Sum`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sum)
   */
  public sum(
    selector: (element: TSource) => string | number = (element) => element as unknown as number | string,
  ): string | number {
    return Sync.sum(this.getIterator, selector);
  }

  /**
   * Returns a specified number of contiguous elements from the start of a sequence.
   * @param amount The number of elements to return.
   * @returns An [`IEnumerable<T>`](docs/interfaces/ienumerable.md) that contains the specified number of elements from the start of the input sequence.
   * [`Take`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.take)
   */
  public take(count: number): Interfaces.IEnumerable<TSource> {
    if (count <= 0) {
      return new Enumerable([]);
    }
    return new Deferred.Sync.TakeEnumerable(this, count);
  }

  /**
   * Returns a new enumerable collection that contains the last `count` elements from `source`.
   * [`TakeLast`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.takelast)
   */
  public takeLast(count: number): Interfaces.IEnumerable<TSource> {
    if (count <= 0) {
      return new Enumerable([]);
    }
    return new Deferred.Sync.TakeLastEnumerable(this, count);
  }

  /**
   * Returns elements from a sequence as long as a specified condition is true.
   * The element's index is used in the logic of the predicate function.
   * @param predicate A function to test each source element for a condition;
   * the second parameter of the function represents the index of the source element.
   * @returns An [`IEnumerable<T>`](docs/interfaces/ienumerable.md) that contains elements from the input sequence
   * that occur before the element at which the test no longer passes.
   * [`TakeWhile`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.takewhile)
   */
  public takeWhile(
    predicate: (element: TSource, index: number) => boolean = () => true,
  ): Interfaces.IEnumerable<TSource> {
    return new Deferred.Sync.TakeWhileEnumerable(this, predicate);
  }

  /**
   * Creates an array from a [`IEnumerable<T>`](docs/interfaces/ienumerable.md).
   * @returns An array of elements
   * [`ToArray`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.toarray)
   */
  public toArray(): Array<TSource> {
    return Sync.toArray(this.getIterator);
  }

  /**
   * Converts an Iterable<V> to a Map<K, V[]>.
   * @param selector A function to serve as a key selector.
   * @returns Map<K, V[]>
   * [`ToDictionary`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.todictionary)
   */
  public toMap<TKey>(selector: (x: TSource) => TKey): Map<TKey, Array<TSource>> {
    return Sync.toMap(this.getIterator, selector);
  }

  /**
   * Converts the iteration to a Set
   * @returns Set containing the iteration values
   */
  public toSet(): Set<TSource> {
    return new Set(this);
  }

  /**
   * Produces the set union of two sequences by using scrict equality comparison or a specified [`IEqualityComparer<T>`](docs/interfaces/iequalitycomparer.md).
   * @param second An Iterable<T> whose distinct elements form the second set for the union.
   * @param comparer The [`IEqualityComparer<T>`](docs/interfaces/iequalitycomparer.md) to compare values. Optional.
   * @returns An [`IEnumerable<T>`](docs/interfaces/ienumerable.md) that contains the elements from both input sequences, excluding duplicates.
   * [`Union`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.union)
   */
  public union(
    second: Iterable<TSource>,
    comparer: Interfaces.IEqualityComparer<TSource> = new Interfaces.DefaultEqualityComparer(),
  ): Interfaces.IEnumerable<TSource> {
    return new Deferred.Sync.UnionEnumerable<TSource>(this, second, comparer);
  }

  /**
   * Produces the set union of two sequences according to a specified key selector function.
   * [`UnionBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.unionby)
   */
  public unionBy<TKey>(
    second: Iterable<TKey>,
    keySelector: Types.TKeySelector<TSource, TKey> = (x) => x as unknown as TKey,
    comparer: Interfaces.IEqualityComparer<TKey> = new Interfaces.DefaultEqualityComparer(),
  ): Interfaces.IEnumerable<TSource> {
    return new Deferred.Sync.UnionByEnumerable(this, second, keySelector, comparer);
  }

  /**
   * Filters a sequence of values based on a predicate.
   * Each element's index is used in the logic of the predicate function.
   * @param predicate A function to test each source element for a condition;
   * the second parameter of the function represents the index of the source element.
   * @returns An [`IEnumerable<T>`](docs/interfaces/ienumerable.md) that contains elements from the input sequence that satisfy the condition.
   * [`Where`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.where)
   */
  public where(predicate: (x: TSource, index: number) => boolean = () => true): Interfaces.IEnumerable<TSource> {
    return new Deferred.Sync.WhereEnumerable(this, predicate);
  }

  /**
   * Creates a tuple of corresponding elements of two sequences, producing a sequence of the results.
   * @param second The second sequence to merge.
   * @returns An [`IEnumerable<[T, V]>`](docs/interfaces/ienumerable.md) that contains merged elements of two input sequences.
   * [`zip`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.zip)
   */
  public zip<TSecond>(second: Iterable<TSecond>): Interfaces.IEnumerable<[TSource, TSecond]>;
  /**
   * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
   * @param second The second sequence to merge.
   * @param resultSelector A function that specifies how to merge the elements from the two sequences.
   * @returns An [`IEnumerable<TResult>`](docs/interfaces/ienumerable.md) that contains merged elements of two input sequences.
   */
  public zip<TSecond, TResult>(
    second: Iterable<TSecond>,
    resultSelector: (x: TSource, y: TSecond) => TResult,
  ): Interfaces.IEnumerable<TResult>;
  public zip<TSecond, TThird, TResult>(
    second: Iterable<TSecond>,
    third: Iterable<TThird>,
    resultSelector: (x: TSource, y: TSecond, z: TThird) => TResult,
  ): Interfaces.IEnumerable<TResult>;
  public zip<TSecond, TThird, TResult>(
    second: Iterable<TSecond>,
    b?: Iterable<TThird> | ((x: TSource, y: TSecond) => TResult),
    c?: (x: TSource, y: TSecond, z: TThird) => TResult,
  ): Interfaces.IEnumerable<TResult> {
    let third: Iterable<TThird> | undefined;
    let resultSelector: CallableFunction;
    if (!isNullOrUndefined(c)) {
      third = b as Iterable<TThird>;
      resultSelector = c as CallableFunction;
    } else if (isFunction(b)) {
      resultSelector = b as CallableFunction;
    } else {
      resultSelector = (x: TSource, y: TSecond) => [x, y];
    }

    return new Deferred.Sync.ZipEnumerable<TSource, TSecond, TThird, TResult>(this, second, third, resultSelector);
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Enumerable<TSource> extends Interfaces.IEnumerable<TSource> {}
