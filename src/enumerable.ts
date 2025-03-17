import {
  aggregate,
  aggregateBy,
  all,
  any,
  append,
  average,
  chunk,
  concat,
  contains,
  count,
  countBy,
  defaultIfEmpty,
  distinct,
  distinctBy,
  elementAt,
  elementAtOrDefault,
  except,
  exceptBy,
  exclusive,
  exclusiveBy,
  first,
  firstOrDefault,
  forEach,
  groupBy,
  groupJoin,
  index,
  intersect,
  intersectBy,
  isDisjointFrom,
  isSubsetOf,
  isSupersetOf,
  join,
  last,
  lastOrDefault,
  max,
  maxBy,
  min,
  minBy,
  ofType,
  order,
  orderBy,
  orderByDescending,
  orderDescending,
  prepend,
  range,
  repeat,
  reverse,
  select,
  selectMany,
  sequenceEqual,
  shuffle,
  single,
  singleOrDefault,
  skip,
  skipLast,
  skipWhile,
  sum,
  take,
  takeLast,
  takeWhile,
  toArray,
  toMap,
  toSet,
  union,
  unionBy,
  where,
  zip,
} from "./internal.ts";
import type {
  AggregateFunctionSeedSelector,
  AggregateFunctionType,
  AggregateResultType,
} from "./types/aggregate.ts";
import type { IEnumerable } from "./types/enumerable.interface.ts";
import { EqualityComparer } from "./comparer/equality-comparer.ts";
import type { IGrouping } from "./types/grouping.ts";
import type { OfType } from "./types/infer.ts";
import type {
  TElementSelector,
  TKeySelector,
  TResultSelector,
  TResultSelectorJoin,
  TZipResult,
  TZipResultSelector,
  SelectManyResultSelector,
  SelectManySelector,
} from "./types/selectors.ts";
import type { Comparer } from "./comparer/comparer.ts";
import type { IOrderedEnumerable } from "./types/order.ts";
import { NotIterableException } from "./exceptions/NotIterableException.ts";
import type { IConstructor } from "./types/constructor.interface.ts";

export class Enumerable<T> implements IEnumerable<T> {
  protected readonly _source: Iterable<T>;
  constructor(source: Iterable<T>) {
    this._source = source;
  }

  [Symbol.iterator]() {
    return this._source[Symbol.iterator]();
  }

  get enumeratorSource(): Iterable<T> {
    return this.constructor.name === "Enumerable" ? this._source : this;
  }

  iterator() {
    return this.enumeratorSource[Symbol.iterator]();
  }

  /**
   * Creates an instance of an Enumerable.
   * @typeparam TSource2 - The type of elements in the created sequence.
   * @param source - The source to create the Enumerable from.
   * @returns \{IEnumerable<TSource2>\} an Enumerable.
   */
  static create<TSource2>(source: Iterable<TSource2>): IEnumerable<TSource2> {
    if (source instanceof Enumerable) {
      return source;
    }

    if (typeof source[Symbol.iterator] !== "function") {
      throw new NotIterableException();
    }

    return new Enumerable<TSource2>(source);
  }

  public aggregate<TAccumulate, TResult>(
    func: AggregateFunctionType<T, T | TAccumulate>,
    seed?: TAccumulate,
    resultSelector?: AggregateResultType<TAccumulate, TResult>,
  ): TResult {
    return aggregate(this, func, seed, resultSelector);
  }

  public aggregateBy<TKey, TAccumulate>(
    keySelector: TKeySelector<T, TKey>,
    seed: TAccumulate | AggregateFunctionSeedSelector<TKey, TAccumulate>,
    func: AggregateFunctionType<T, TAccumulate>,
    comparer?: EqualityComparer<TKey>,
  ): IEnumerable<[TKey, TAccumulate]> {
    return aggregateBy(this, keySelector, seed, func, comparer);
  }

  public all(predicate: (x: T) => boolean): boolean {
    return all(this, predicate);
  }

  public any(predicate?: (x: T) => boolean): boolean {
    return any(this, predicate);
  }

  public append(item: T): IEnumerable<T> {
    return append(this, item);
  }

  public average(
    selector: (x: T) => number = (x) => x as unknown as number,
  ): number {
    return average(this, selector);
  }

  public chunk(size: number): IEnumerable<Array<T>> {
    return chunk<T>(this, size);
  }

  public concat(second: Iterable<T>): IEnumerable<T> {
    return concat(this, second);
  }

  public contains(value: T, comparer?: EqualityComparer<T>): boolean {
    return contains<T>(this, value, comparer);
  }

  public count(predicate?: (x: T) => boolean): number {
    return count(this, predicate);
  }

  public countBy<TKey>(
    keySelector?: TKeySelector<T, TKey>,
    comparer?: EqualityComparer<TKey>,
  ): IEnumerable<[TKey, number]> {
    return countBy(this, keySelector, comparer);
  }

  public defaultIfEmpty(defaultValue?: T): IEnumerable<T> {
    return defaultIfEmpty(this, defaultValue);
  }

  public distinct(comparer?: EqualityComparer<T>): IEnumerable<T> {
    return distinct(this, comparer);
  }

  public distinctBy<TKey>(
    keySelector: TKeySelector<T, TKey>,
    comparer?: EqualityComparer<TKey>,
  ): IEnumerable<T> {
    return distinctBy(this, keySelector, comparer);
  }

  public elementAt(index: number): T {
    return elementAt<T>(this, index);
  }

  public elementAtOrDefault(defaultValue: T, index: number): T {
    return elementAtOrDefault<T>(this, defaultValue, index);
  }

  /**
   * Returns an `empty` [`IEnumerable<T>`](docs/interfaces/ienumerable.md) that has the specified type argument.
   * If the type argument is provided, it will be used to create an instance of the type.
   * Otherwise, an empty array will be used.
   * @typeparam TSource - The type of elements in the created sequence.
   * @param type - Optional. The type of elements in the created sequence.
   * @returns An empty sequence of the specified type.
   * @see {@link https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.empty}
   */
  public static empty<TSource>(
    type?: IConstructor<Iterable<TSource>>,
  ): IEnumerable<TSource> {
    if (type) {
      return Enumerable.create<TSource>(new type());
    }
    return Enumerable.create<TSource>([]);
  }

  public except(
    second: Iterable<T>,
    comparer?: EqualityComparer<T>,
  ): IEnumerable<T> {
    return except(this, second, comparer);
  }

  public exceptBy<TKey>(
    second: Iterable<TKey>,
    keySelector: TKeySelector<T, TKey>,
    comparer?: EqualityComparer<TKey>,
  ): IEnumerable<T> {
    return exceptBy(this, second, keySelector, comparer);
  }

  public exclusive(
    second: Iterable<T>,
    comparer?: EqualityComparer<T>,
  ): IEnumerable<T> {
    return exclusive(this, second, comparer);
  }

  public exclusiveBy<TKey>(
    second: Iterable<T>,
    keySelector: TKeySelector<T, TKey>,
    comparer?: EqualityComparer<TKey>,
  ): IEnumerable<T> {
    return exclusiveBy(this, second, keySelector, comparer);
  }

  public first(predicate?: (x: T) => boolean): T {
    return first(this, predicate);
  }

  public firstOrDefault(defaultValue: T, predicate?: (x: T) => boolean): T {
    return firstOrDefault(this, defaultValue, predicate);
  }

  public forEach<TResult>(action: (x: T) => TResult): IEnumerable<TResult> {
    return forEach(this, action);
  }

  public groupBy<TKey, TElement, TResult>(
    keySelector: TKeySelector<T, TKey>,
    elementSelectorOrComparer?:
      | TElementSelector<T, TElement>
      | EqualityComparer<TKey>,
    resultSelectorOrComparer?:
      | TResultSelector<TKey, T | TElement, TResult>
      | EqualityComparer<TKey>,
    comparer?: EqualityComparer<TKey>,
  ): IEnumerable<IGrouping<TKey, T | TElement> | TResult> {
    return groupBy<T, TKey, TElement, TResult>(
      this,
      keySelector,
      elementSelectorOrComparer,
      resultSelectorOrComparer,
      comparer,
    );
  }

  public groupJoin<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: TKeySelector<T, TKey>,
    innerKeySelector: TKeySelector<TInner, TKey>,
    resultSelector: TResultSelector<TKey, TInner, TResult>,
    comparer?: EqualityComparer<TKey>,
  ): IEnumerable<TResult> {
    return groupJoin(
      this,
      inner,
      outerKeySelector,
      innerKeySelector,
      resultSelector,
      comparer,
    );
  }

  public index(): IEnumerable<[number, T]> {
    return index(this);
  }

  public intersect(
    second: Iterable<T>,
    comparer?: EqualityComparer<T>,
  ): IEnumerable<T> {
    return intersect(this, second, comparer);
  }

  public intersectBy<TKey>(
    second: Iterable<TKey>,
    keySelector: TKeySelector<T, TKey>,
    comparer?: EqualityComparer<TKey>,
  ): IEnumerable<T> {
    return intersectBy(this, second, keySelector, comparer);
  }

  public isDisjointFrom(second: Iterable<T>): boolean {
    return isDisjointFrom<T>(this, second);
  }

  public isSubsetOf(second: Iterable<T>): boolean {
    return isSubsetOf<T>(this, second);
  }

  public isSupersetOf(second: Iterable<T>): boolean {
    return isSupersetOf<T>(this, second);
  }

  public join<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: TKeySelector<T, TKey>,
    innerKeySelector: TKeySelector<TInner, TKey>,
    resultSelector: TResultSelectorJoin<T, TInner, TResult>,
    comparer?: EqualityComparer<TKey>,
  ): IEnumerable<TResult> {
    return join(
      this,
      inner,
      outerKeySelector,
      innerKeySelector,
      resultSelector,
      comparer,
    );
  }

  public last(predicate?: (x: T) => boolean): T {
    return last(this, predicate);
  }

  public lastOrDefault(defaultValue: T, predicate?: (x: T) => boolean): T {
    return lastOrDefault(this, defaultValue, predicate);
  }

  public max(): number;
  public max(comparer: Comparer<T>): T;
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  public max(keySelector: TKeySelector<T, number>): number;
  max(selectorOrcomparer?: TKeySelector<T, number> | Comparer<T>): number | T {
    return max<T>(this, selectorOrcomparer);
  }

  public maxBy(
    keySelector: TKeySelector<T, number>,
    comparer?: Comparer<number>,
  ): T {
    return maxBy<T>(this, keySelector, comparer);
  }

  public min(): number;
  public min(comparer: Comparer<T>): T;
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  public min(keySelector: TKeySelector<T, number>): number;
  min(selectorOrcomparer?: TKeySelector<T, number> | Comparer<T>): number | T {
    return min<T>(this, selectorOrcomparer);
  }

  public minBy(
    keySelector: TKeySelector<T, number>,
    comparer?: Comparer<number>,
  ): T {
    return minBy<T>(this, keySelector, comparer);
  }

  public ofType<TType extends OfType>(type: TType): IEnumerable<TType> {
    return ofType<T, TType>(this, type);
  }

  public order(comparer?: Comparer<T>): IOrderedEnumerable<T> {
    return order<T>(this, comparer);
  }

  public orderBy<TKey>(
    keySelector: TKeySelector<T, TKey>,
    comparer?: Comparer<TKey>,
  ): IOrderedEnumerable<T> {
    return orderBy(this, keySelector, comparer);
  }

  public orderByDescending<TKey>(
    keySelector: TKeySelector<T, TKey>,
    comparer?: Comparer<TKey>,
  ): IOrderedEnumerable<T> {
    return orderByDescending(this, keySelector, comparer);
  }

  public orderDescending(comparer?: Comparer<T>): IOrderedEnumerable<T> {
    return orderDescending<T>(this, comparer);
  }

  public prepend(item: T): IEnumerable<T> {
    return prepend(this, item);
  }

  /**
   * Generates a sequence of numbers within a specified range.
   * [`Range`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.range)
   */
  public static range<
    TOut extends string | number,
    TSource = TOut extends string
      ? string
      : TOut extends number
        ? number
        : never,
  >(startElement: TOut, count: number): IEnumerable<TSource> {
    return range(startElement, count) as unknown as IEnumerable<TSource>;
  }

  /**
   * Generates a sequence that contains one repeated value.
   * [`Repeat`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.repeat)
   */
  public static repeat<TOut>(element: TOut, count: number): IEnumerable<TOut> {
    return repeat(element, count);
  }

  public reverse(): IEnumerable<T> {
    return reverse(this);
  }

  public select<TResult>(
    selector: (x: T, index?: number) => TResult,
  ): IEnumerable<TResult> {
    return select(this, selector);
  }

  public selectMany<TCollection, TResult>(
    selector: SelectManySelector<T, TCollection>,
    resultSelector: SelectManyResultSelector<T, TCollection, TResult>,
  ): IEnumerable<TResult> {
    return selectMany(this, selector, resultSelector);
  }

  public shuffle(): IEnumerable<T> {
    return shuffle(this);
  }

  public sequenceEqual(
    second: Iterable<T>,
    comparer?: EqualityComparer<T>,
  ): boolean {
    return sequenceEqual<T>(this, second, comparer);
  }

  public single(predicate: (x: T) => boolean = () => true): T {
    return single(this, predicate);
  }

  public singleOrDefault(defaultValue: T, predicate?: (x: T) => boolean): T {
    return singleOrDefault(this, defaultValue, predicate);
  }

  public skip(count: number): IEnumerable<T> {
    return skip(this, count);
  }

  public skipLast(count: number): IEnumerable<T> {
    return skipLast(this, count);
  }

  public skipWhile(
    predicate: (element: T, index: number) => boolean,
  ): IEnumerable<T> {
    return skipWhile(this, predicate);
  }

  public sum<TResult extends string | number>(
    selector?: (element: T) => TResult,
  ): TResult {
    return sum(this, selector);
  }

  public take(count: number): IEnumerable<T> {
    return take(this, count);
  }

  public takeLast(count: number): IEnumerable<T> {
    return takeLast(this, count);
  }

  public takeWhile(
    predicate: (element: T, index: number) => boolean,
  ): IEnumerable<T> {
    return takeWhile(this, predicate);
  }

  public toArray(): Array<T> {
    return toArray<T>(this);
  }

  public toMap<TKey>(selector: (x: T) => TKey): Map<TKey, Array<T>> {
    return toMap(this, selector);
  }

  public toSet(): Set<T> {
    return toSet<T>(this);
  }

  public union(
    second: Iterable<T>,
    comparer?: EqualityComparer<T>,
  ): IEnumerable<T> {
    return union(this, second, comparer);
  }

  public unionBy<TKey>(
    second: Iterable<T>,
    keySelector: TKeySelector<T, TKey>,
    comparer?: EqualityComparer<TKey>,
  ): IEnumerable<T> {
    return unionBy(this, second, keySelector, comparer);
  }

  public where(predicate: (x: T, index: number) => boolean): IEnumerable<T> {
    return where(this, predicate);
  }

  public zip<TSecond, TResult, TThird = unknown>(
    second: Iterable<TSecond>,
    third?: Iterable<TThird> | TZipResultSelector<T, TSecond, TResult>,
  ): IEnumerable<TZipResult<T, TSecond, TThird, TResult>> {
    return zip(this, second, third);
  }
}
