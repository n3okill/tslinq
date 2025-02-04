import type { IAsyncEnumerable } from "./types/async-enumerable.interface.ts";
import { getAsyncIterable } from "./helpers/async-iterable.ts";
import {
  aggregateAsync,
  aggregateByAsync,
  allAsync,
  anyAsync,
  appendAsync,
  averageAsync,
  chunkAsync,
  concatAsync,
  containsAsync,
  countAsync,
  countByAsync,
  defaultIfEmptyAsync,
  distinctAsync,
  distinctByAsync,
  elementAtAsync,
  elementAtOrDefaultAsync,
  exceptAsync,
  exceptByAsync,
  exclusiveAsync,
  exclusiveByAsync,
  firstAsync,
  firstOrDefaultAsync,
  forEachAsync,
  groupByAsync,
  groupJoinAsync,
  indexAsync,
  intersectAsync,
  intersectByAsync,
  isDisjointFromAsync,
  isSubsetOfAsync,
  isSupersetOfAsync,
  joinAsync,
  lastAsync,
  lastOrDefaultAsync,
  maxAsync,
  maxByAsync,
  minAsync,
  minByAsync,
  ofTypeAsync,
  orderAsync,
  orderByAsync,
  orderByDescendingAsync,
  orderDescendingAsync,
  prependAsync,
  rangeAsync,
  repeatAsync,
  reverseAsync,
  selectAsync,
  selectManyAsync,
  sequenceEqualAsync,
  shuffleAsync,
  singleAsync,
  singleOrDefaultAsync,
  skipAsync,
  skipLastAsync,
  skipWhileAsync,
  sumAsync,
  takeAsync,
  takeLastAsync,
  takeWhileAsync,
  toArrayAsync,
  toMapAsync,
  toSetAsync,
  unionAsync,
  unionByAsync,
  whereAsync,
  zipAsync,
} from "./internal.ts";
import type { AllIterable, TParamPromise } from "./types/other.ts";
import type {
  AggregateFunctionSeedSelectorAsync,
  AggregateFunctionTypeAsync,
  AggregateResultTypeAsync,
} from "./types/aggregate.ts";
import type {
  SelectManyResultSelectorAsync,
  SelectManySelectorAsync,
  TElementSelectorAsync,
  TKeySelectorAsync,
  TResultSelectorAsync,
  TResultSelectorJoinAsync,
  TZipResult,
  TZipResultSelectorAsync,
} from "./types/selectors.ts";
import type {
  EqualityComparer,
  EqualityComparerAsync,
} from "./comparer/equality-comparer.ts";
import type { Comparer, ComparerAsync } from "./comparer/comparer.ts";
import type { OfType } from "./types/infer.ts";
import type { IGrouping } from "./types/grouping.ts";
import type { IOrderedAsyncEnumerable } from "./types/order.ts";
import { NotIterableException } from "./exceptions/NotIterableException.ts";
import type { IConstructor } from "./types/constructor.interface.ts";

export class AsyncEnumerable<T> implements IAsyncEnumerable<T> {
  protected readonly _source: AsyncIterable<T>;
  constructor(source: AsyncIterable<T>) {
    this._source = source;
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return this._source[Symbol.asyncIterator]();
  }

  get enumeratorSource(): AsyncIterable<T> {
    return this.constructor.name === "EnumerableAsync" ? this._source : this;
  }
  iterator() {
    return this.enumeratorSource[Symbol.asyncIterator]();
  }

  static create<TSource2>(
    source: IAsyncEnumerable<TSource2> | AllIterable<TSource2>,
  ): IAsyncEnumerable<TSource2> {
    if (
      source &&
      typeof (source as Iterable<TSource2>)[Symbol.iterator] !== "function" &&
      typeof (source as AsyncIterable<TSource2>)[Symbol.asyncIterator] !==
        "function"
    ) {
      throw new NotIterableException();
    }
    if (source instanceof AsyncEnumerable) {
      return source;
    }
    if (typeof (source as Iterable<TSource2>)[Symbol.iterator] === "function") {
      return new AsyncEnumerable<TSource2>(getAsyncIterable(source));
    }
    return new AsyncEnumerable<TSource2>(source as AsyncIterable<TSource2>);
  }

  public aggregate<TAccumulate, TResult>(
    func: AggregateFunctionTypeAsync<T, T | TAccumulate>,
    seed?: TAccumulate,
    resultSelector?: AggregateResultTypeAsync<TAccumulate, TResult>,
  ): Promise<TResult> {
    return aggregateAsync(this, func, seed, resultSelector);
  }

  public aggregateBy<TKey, TAccumulate>(
    keySelector: TKeySelectorAsync<T, TKey>,
    seed: TAccumulate | AggregateFunctionSeedSelectorAsync<TKey, TAccumulate>,
    func: AggregateFunctionTypeAsync<T, TAccumulate>,
    comparer?: EqualityComparerAsync<TKey> | EqualityComparer<TKey>,
  ): IAsyncEnumerable<[TKey, TAccumulate]> {
    return aggregateByAsync(this, keySelector, seed, func, comparer);
  }

  public all(predicate: (x: T) => TParamPromise<boolean>): Promise<boolean> {
    return allAsync(this, predicate);
  }

  public any(predicate?: (x: T) => TParamPromise<boolean>): Promise<boolean> {
    return anyAsync(this, predicate);
  }

  public append(item: T): IAsyncEnumerable<T> {
    return appendAsync(this, item);
  }

  public average(
    selector: (x: T) => TParamPromise<number> = (x) => x as unknown as number,
  ): Promise<number> {
    return averageAsync(this, selector);
  }

  public chunk(size: number): IAsyncEnumerable<Array<T>> {
    return chunkAsync<T>(this, size);
  }

  public concat(second: AllIterable<T>): IAsyncEnumerable<T> {
    return concatAsync(this, second);
  }

  public contains(
    value: T,
    comparer?: EqualityComparerAsync<T>,
  ): Promise<boolean> {
    return containsAsync<T>(this, value, comparer);
  }

  public count(predicate?: (x: T) => TParamPromise<boolean>): Promise<number> {
    return countAsync(this, predicate);
  }

  public countBy<TKey>(
    keySelector?: TKeySelectorAsync<T, TKey>,
    comparer?: EqualityComparerAsync<TKey>,
  ): IAsyncEnumerable<[TKey, number]> {
    return countByAsync(this, keySelector, comparer);
  }

  public defaultIfEmpty(defaultValue?: T): IAsyncEnumerable<T> {
    return defaultIfEmptyAsync(this, defaultValue);
  }

  public distinct(comparer?: EqualityComparerAsync<T>): IAsyncEnumerable<T> {
    return distinctAsync(this, comparer);
  }

  public distinctBy<TKey>(
    keySelector: TKeySelectorAsync<T, TKey>,
    comparer?: EqualityComparerAsync<TKey>,
  ): IAsyncEnumerable<T> {
    return distinctByAsync(this, keySelector, comparer);
  }

  public elementAt(index: number): Promise<T> {
    return elementAtAsync<T>(this, index);
  }

  public elementAtOrDefault(defaultValue: T, index: number): Promise<T> {
    return elementAtOrDefaultAsync<T>(this, defaultValue, index);
  }

  /**
   * Returns an `empty` [`IAsyncEnumerable<T>`](docs/interfaces/ienumerable.md) that has the specified type argument.
   * [`Empty`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.empty)
   */
  public static empty<TSource>(
    type?: IConstructor<Iterable<TSource>>,
  ): IAsyncEnumerable<TSource> {
    if (type) {
      return AsyncEnumerable.create<TSource>(new type());
    }
    return AsyncEnumerable.create<TSource>([]);
  }

  public except(
    second: AllIterable<T>,
    comparer?: EqualityComparerAsync<T>,
  ): IAsyncEnumerable<T> {
    return exceptAsync(this, second, comparer);
  }

  public exceptBy<TKey>(
    second: AllIterable<TKey>,
    keySelector: TKeySelectorAsync<T, TKey>,
    comparer?: EqualityComparerAsync<TKey>,
  ): IAsyncEnumerable<T> {
    return exceptByAsync(this, second, keySelector, comparer);
  }

  public exclusive(
    second: AllIterable<T>,
    comparer?: EqualityComparerAsync<T>,
  ): IAsyncEnumerable<T> {
    return exclusiveAsync(this, second, comparer);
  }

  public exclusiveBy<TKey>(
    second: AllIterable<T>,
    keySelector: TKeySelectorAsync<T, TKey>,
    comparer?: EqualityComparerAsync<TKey>,
  ): IAsyncEnumerable<T> {
    return exclusiveByAsync(this, second, keySelector, comparer);
  }

  public first(predicate?: (x: T) => TParamPromise<boolean>): Promise<T> {
    return firstAsync(this, predicate);
  }

  public firstOrDefault(
    defaultValue: T,
    predicate?: (x: T) => TParamPromise<boolean>,
  ): Promise<T> {
    return firstOrDefaultAsync(this, defaultValue, predicate);
  }

  public forEach<TResult>(
    action: (x: T) => TParamPromise<TResult>,
  ): IAsyncEnumerable<TResult> {
    return forEachAsync(this, action);
  }

  public groupBy<TKey, TElement, TResult>(
    keySelector: TKeySelectorAsync<T, TKey>,
    elementSelectorOrComparer?:
      | TElementSelectorAsync<T, TElement>
      | EqualityComparerAsync<TKey>,
    resultSelectorOrComparer?:
      | TResultSelectorAsync<TKey, T | TElement, TResult>
      | EqualityComparerAsync<TKey>,
    comparer?: EqualityComparerAsync<TKey>,
  ): IAsyncEnumerable<IGrouping<TKey, T | TElement> | TResult> {
    return groupByAsync<T, TKey, TElement, TResult>(
      this,
      keySelector,
      elementSelectorOrComparer,
      resultSelectorOrComparer,
      comparer,
    );
  }

  public groupJoin<TInner, TKey, TResult>(
    inner: AllIterable<TInner>,
    outerKeySelector: TKeySelectorAsync<T, TKey>,
    innerKeySelector: TKeySelectorAsync<TInner, TKey>,
    resultSelector: TResultSelectorAsync<TKey, TInner, TResult>,
    comparer?: EqualityComparerAsync<TKey>,
  ): IAsyncEnumerable<TResult> {
    return groupJoinAsync(
      this,
      inner,
      outerKeySelector,
      innerKeySelector,
      resultSelector,
      comparer,
    );
  }

  public index(): IAsyncEnumerable<[number, T]> {
    return indexAsync(this);
  }

  public intersect(
    second: AllIterable<T>,
    comparer?: EqualityComparerAsync<T>,
  ): IAsyncEnumerable<T> {
    return intersectAsync(this, second, comparer);
  }

  public intersectBy<TKey>(
    second: AllIterable<TKey>,
    keySelector: TKeySelectorAsync<T, TKey>,
    comparer?: EqualityComparerAsync<TKey>,
  ): IAsyncEnumerable<T> {
    return intersectByAsync(this, second, keySelector, comparer);
  }

  public isDisjointFrom(second: AllIterable<T>): Promise<boolean> {
    return isDisjointFromAsync<T>(this, second);
  }

  public isSubsetOf(second: AllIterable<T>): Promise<boolean> {
    return isSubsetOfAsync<T>(this, second);
  }

  public isSupersetOf(second: AllIterable<T>): Promise<boolean> {
    return isSupersetOfAsync<T>(this, second);
  }

  public join<TInner, TKey, TResult>(
    inner: AllIterable<TInner>,
    outerKeySelector: TKeySelectorAsync<T, TKey>,
    innerKeySelector: TKeySelectorAsync<TInner, TKey>,
    resultSelector: TResultSelectorJoinAsync<T, TInner, TResult>,
    comparer?: EqualityComparerAsync<TKey>,
  ): IAsyncEnumerable<TResult> {
    return joinAsync(
      this,
      inner,
      outerKeySelector,
      innerKeySelector,
      resultSelector,
      comparer,
    );
  }

  public last(predicate?: (x: T) => TParamPromise<boolean>): Promise<T> {
    return lastAsync(this, predicate);
  }

  public lastOrDefault(
    defaultValue: T,
    predicate?: (x: T) => TParamPromise<boolean>,
  ): Promise<T> {
    return lastOrDefaultAsync(this, defaultValue, predicate);
  }

  public max(): Promise<number>;
  public max(comparer: ComparerAsync<T> | Comparer<T>): Promise<T>;
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  public max(keySelector: TKeySelectorAsync<T, number>): Promise<number>;
  max(
    selectorOrcomparer?: TKeySelectorAsync<T, number> | ComparerAsync<T>,
  ): Promise<number | T> {
    return maxAsync<T>(this, selectorOrcomparer);
  }

  public maxBy(
    keySelector: TKeySelectorAsync<T, number>,
    comparer?: ComparerAsync<number>,
  ): Promise<T> {
    return maxByAsync<T>(this, keySelector, comparer);
  }
  public min(): Promise<number>;
  public min(comparer: ComparerAsync<T> | Comparer<T>): Promise<T>;
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  public min(keySelector: TKeySelectorAsync<T, number>): Promise<number>;
  min(
    selectorOrcomparer?: TKeySelectorAsync<T, number> | ComparerAsync<T>,
  ): Promise<number | T> {
    return minAsync<T>(this, selectorOrcomparer);
  }

  public minBy(
    keySelector: TKeySelectorAsync<T, number>,
    comparer?: ComparerAsync<number>,
  ): Promise<T> {
    return minByAsync<T>(this, keySelector, comparer);
  }

  public ofType<TType extends OfType>(type: TType): IAsyncEnumerable<TType> {
    return ofTypeAsync<T, TType>(this, type);
  }

  public order(comparer?: Comparer<T>): IOrderedAsyncEnumerable<T> {
    return orderAsync<T>(this, comparer);
  }

  public orderBy<TKey>(
    keySelector: TKeySelectorAsync<T, TKey>,
    comparer?: Comparer<TKey>,
  ): IOrderedAsyncEnumerable<T> {
    return orderByAsync(this, keySelector, comparer);
  }

  public orderByDescending<TKey>(
    keySelector: TKeySelectorAsync<T, TKey>,
    comparer?: Comparer<TKey>,
  ): IOrderedAsyncEnumerable<T> {
    return orderByDescendingAsync(this, keySelector, comparer);
  }

  public orderDescending(comparer?: Comparer<T>): IOrderedAsyncEnumerable<T> {
    return orderDescendingAsync<T>(this, comparer);
  }

  public prepend(item: T): IAsyncEnumerable<T> {
    return prependAsync(this, item);
  }

  /**
   * Generates a sequence of numbers within a specified range.
   * [`Range`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.range)
   */
  public static range<
    TOut extends string | number,
    TSource = TOut extends string ? string : number,
  >(startElement: TOut, count: number): IAsyncEnumerable<TSource> {
    return rangeAsync(
      startElement,
      count,
    ) as unknown as IAsyncEnumerable<TSource>;
  }

  /**
   * Generates a sequence that contains one repeated value.
   * [`Repeat`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.repeat)
   */
  public static repeat<TOut>(
    element: TOut,
    count: number,
  ): IAsyncEnumerable<TOut> {
    return repeatAsync(element, count);
  }

  public reverse(): IAsyncEnumerable<T> {
    return reverseAsync(this);
  }

  public select<TResult>(
    selector: (x: T, index?: number) => TParamPromise<TResult>,
  ): IAsyncEnumerable<TResult> {
    return selectAsync(this, selector);
  }

  public selectMany<TCollection, TResult>(
    selector: SelectManySelectorAsync<T, TCollection>,
    resultSelector?: SelectManyResultSelectorAsync<T, TCollection, TResult>,
  ): IAsyncEnumerable<TResult> {
    return selectManyAsync(this, selector, resultSelector);
  }

  public shuffle(): IAsyncEnumerable<T> {
    return shuffleAsync(this);
  }

  public sequenceEqual(
    second: AllIterable<T>,
    comparer?: EqualityComparerAsync<T>,
  ): Promise<boolean> {
    return sequenceEqualAsync<T>(this, second, comparer);
  }

  public single(
    predicate: (x: T) => TParamPromise<boolean> = () => true,
  ): Promise<T> {
    return singleAsync(this, predicate);
  }

  public singleOrDefault(
    defaultValue: T,
    predicate?: (x: T) => TParamPromise<boolean>,
  ): Promise<T> {
    return singleOrDefaultAsync(this, defaultValue, predicate);
  }

  public skip(count: number): IAsyncEnumerable<T> {
    return skipAsync(this, count);
  }

  public skipLast(count: number): IAsyncEnumerable<T> {
    return skipLastAsync(this, count);
  }

  public skipWhile(
    predicate: (element: T, index: number) => boolean,
  ): IAsyncEnumerable<T> {
    return skipWhileAsync(this, predicate);
  }

  public sum<TResult extends string | number>(
    selector?: (element: T) => TParamPromise<TResult>,
  ): TParamPromise<TResult> {
    return sumAsync(this, selector);
  }

  public take(count: number): IAsyncEnumerable<T> {
    return takeAsync(this, count);
  }

  public takeLast(count: number): IAsyncEnumerable<T> {
    return takeLastAsync(this, count);
  }

  public takeWhile(
    predicate: (element: T, index: number) => boolean,
  ): IAsyncEnumerable<T> {
    return takeWhileAsync(this, predicate);
  }

  public toArray(): Promise<Array<T>> {
    return toArrayAsync<T>(this);
  }

  public toMap<TKey>(
    selector: TKeySelectorAsync<T, TKey>,
  ): Promise<Map<TKey, Array<T>>> {
    return toMapAsync(this, selector);
  }

  public toSet(): Promise<Set<T>> {
    return toSetAsync<T>(this);
  }

  public union(
    second: AllIterable<T>,
    comparer?: EqualityComparerAsync<T>,
  ): IAsyncEnumerable<T> {
    return unionAsync(this, second, comparer);
  }

  public unionBy<TKey>(
    second: AllIterable<T>,
    keySelector: TKeySelectorAsync<T, TKey>,
    comparer?: EqualityComparerAsync<TKey>,
  ): IAsyncEnumerable<T> {
    return unionByAsync(this, second, keySelector, comparer);
  }

  public where(
    predicate: (x: T, index: number) => TParamPromise<boolean>,
  ): IAsyncEnumerable<T> {
    return whereAsync(this, predicate);
  }

  public zip<TSecond, TResult, TThird = unknown>(
    second: AllIterable<TSecond>,
    third?: AllIterable<TThird> | TZipResultSelectorAsync<T, TSecond, TResult>,
  ): IAsyncEnumerable<TZipResult<T, TSecond, TThird, TResult>> {
    return zipAsync(this, second, third);
  }
}
