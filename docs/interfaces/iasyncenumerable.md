[@n3okill/tslinq](../README.md) / [Interfaces][] / IAsyncEnumerable

# Interface: IAsyncEnumerable<TSource\>

[Interfaces][].IAsyncEnumerable

Iterable type with methods from LINQ.

## Type parameters

| Name |
| :------ |
| `TSource` |

## Hierarchy

- `AsyncIterable`<`TSource`\>

  ↳ **`IAsyncEnumerable`**

  ↳↳ [`EnumerableAsync`](../classes/EnumerableAsync.md)

  ↳↳ [`IAsyncGrouping`](iasyncgrouping.md)

  ↳↳ [`IAsyncOrderedEnumerable`](iasyncorderedenumerable.md)

## Table of contents

### Methods

- [[asyncIterator]](#[asynciterator])
- [aggregate](#aggregate)
- [all](#all)
- [any](#any)
- [append](#append)
- [average](#average)
- [chunk](#chunk)
- [concat](#concat)
- [contains](#contains)
- [count](#count)
- [defaultIfEmpty](#defaultifempty)
- [distinct](#distinct)
- [distinctBy](#distinctby)
- [elementAt](#elementat)
- [elementAtOrDefault](#elementatordefault)
- [except](#except)
- [exceptBy](#exceptby)
- [first](#first)
- [firstOrDefault](#firstordefault)
- [forEach](#foreach)
- [groupBy](#groupby)
- [groupByGrouped](#groupbygrouped)
- [groupJoin](#groupjoin)
- [intersect](#intersect)
- [intersectBy](#intersectby)
- [join](#join)
- [last](#last)
- [lastOrDefault](#lastordefault)
- [max](#max)
- [maxBy](#maxby)
- [min](#min)
- [minBy](#minby)
- [ofType](#oftype)
- [orderBy](#orderby)
- [orderByDescending](#orderbydescending)
- [prepend](#prepend)
- [reverse](#reverse)
- [select](#select)
- [selectMany](#selectmany)
- [sequenceEqual](#sequenceequal)
- [single](#single)
- [singleOrDefault](#singleordefault)
- [skip](#skip)
- [skipLast](#skiplast)
- [skipWhile](#skipwhile)
- [sum](#sum)
- [take](#take)
- [takeLast](#takelast)
- [takeWhile](#takewhile)
- [toArray](#toarray)
- [toMap](#tomap)
- [toSet](#toset)
- [union](#union)
- [unionBy](#unionby)
- [where](#where)
- [zip](#zip)

## Methods

### [asyncIterator]

▸ **[asyncIterator]**(): `AsyncIterator`<`TSource`, `any`, `undefined`\>

#### Returns

`AsyncIterator`<`TSource`, `any`, `undefined`\>

#### Overrides

AsyncIterable.\_\_@asyncIterator@481

___

### aggregate

▸ **aggregate**<`TResult`\>(`func`, `resultSelector?`): `Promise`<`TResult`\>

Applies an accumulator function over a sequence.

#### Type parameters

| Name |
| :------ |
| `TResult` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `func` | [`AggregateFunctionTypeAsync`](../types.md#aggregatefunctiontypeasync)<`TSource`, `TSource`\> | An [`accumulator`](docs/types.md#aggregatefunctiontypeasync) function to be invoked on each element. |
| `resultSelector?` | [`AggregateResultTypeAsync`](../types.md#aggregateresulttypeasync)<`TSource`, `TResult`\> | - |

#### Returns

`Promise`<`TResult`\>

The final accumulator value.

[`Aggregate`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.aggregate)

▸ **aggregate**<`TAccumulate`, `TResult`\>(`seed`, `func`, `resultSelector?`): `Promise`<`TResult`\>

Applies an accumulator function over a sequence.
The specified seed value is used as the initial accumulator value.

#### Type parameters

| Name |
| :------ |
| `TAccumulate` |
| `TResult` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `seed` | `TAccumulate` | The initial accumulator value. |
| `func` | [`AggregateFunctionTypeAsync`](../types.md#aggregatefunctiontypeasync)<`TSource`, `TAccumulate`\> | An [`accumulator`](../types.md#aggregatefunctiontypeasync) function to be invoked on each element. |
| `resultSelector?` | [`AggregateResultTypeAsync`](../types.md#aggregateresulttypeasync)<`TAccumulate`, `TResult`\> | - |

#### Returns

`Promise`<`TResult`\>

The final accumulator value.

▸ **aggregate**<`TAccumulate`, `TResult`\>(`seed`, `func`, `resultSelector`): `Promise`<`TResult`\>

Applies an accumulator function over a sequence.
The specified seed value is used as the initial accumulator value,
and the specified function is used to select the result value.

#### Type parameters

| Name |
| :------ |
| `TAccumulate` |
| `TResult` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `seed` | `TAccumulate` | The initial accumulator value. |
| `func` | [`AggregateFunctionTypeAsync`](../types.md#aggregatefunctiontypeasync)<`TSource`, `TAccumulate`\> | An [`accumulator`](../types.md#aggregatefunctiontypeasync) function to be invoked on each element. |
| `resultSelector` | [`AggregateResultTypeAsync`](../types.md#aggregateresulttypeasync)<`TAccumulate`, `TResult`\> | A function to transform the final accumulator value into the result value. |

#### Returns

`Promise`<`TResult`\>

The transformed final accumulator value.

___

### all

▸ **all**(`predicate`): `Promise`<`boolean`\>

Determines whether all elements of a sequence satisfy a condition.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate` | (`x`: `TSource`) => `boolean` | A function to test each element for a condition. |

#### Returns

`Promise`<`boolean`\>

`true` if every element of the source sequence passes the test in the specified `predicate`,
or if the sequence is empty; otherwise, `false`.

[`All`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.all)

___

### any

▸ **any**(`predicate?`): `Promise`<`boolean`\>

Determines whether a sequence contains any elements.
If predicate is specified, determines whether any element of a sequence satisfies a condition.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate?` | (`x`: `TSource`) => `boolean` | A function to test each element for a condition.  [`Any`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.any) |

#### Returns

`Promise`<`boolean`\>

true if the source sequence contains any elements or passes the test specified; otherwise, false.

___

### append

▸ **append**(`item`): [`IAsyncEnumerable`][]<`TSource`\>

Appends a value to the end of the sequence.

[`Append`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.append)

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `TSource` |

#### Returns

[`IAsyncEnumerable`][]<`TSource`\>

___

### average

▸ **average**(`selector`): `Promise`<`number`\>

Computes the average of a sequence of values
that are obtained by invoking a transform function on each element of the input sequence.

**`throws`** InvalidOperationException - source contains no elements.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | (`x`: `TSource`) => `number` | A transform function to apply to each element. |

#### Returns

`Promise`<`number`\>

The average of the sequence of values.

[`Average`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.average)

___

### chunk

▸ **chunk**(`size`): [`IAsyncEnumerable`][]<`TSource`[]\>

Splits the elements of a sequence into chunks of size at most size.

[`Chunk`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.chunk)

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

[`IAsyncEnumerable`][]<`TSource`[]\>

___

### concat

▸ **concat**(`second`): [`IAsyncEnumerable`][]<`TSource`\>

Concatenates two sequences.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `second` | `AsyncIterable`<`TSource`\> \| `Iterable`<`TSource`\> | The sequence to concatenate to the first sequence. |

#### Returns

[`IAsyncEnumerable`][]<`TSource`\>

An [`IAsyncEnumerable<T>`][] that contains the concatenated elements of the two sequences.

[`Concat`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.concat)

___

### contains

▸ **contains**(`value`, `comparer?`): `Promise`<`boolean`\>

Determines whether a sequence contains a specified element by
using the specified or default [`IAsyncEqualityComparer<T>`](iasyncequalitycomparer.md).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `TSource` | The value to locate in the sequence. |
| `comparer?` | [`IEqualityComparer`](iequalitycomparer.md)<`TSource`\> | An equality comparer to compare values. Optional. |

#### Returns

`Promise`<`boolean`\>

`true` if the source sequence contains an element that has the specified value; otherwise, `false`.

[`Contains`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.contains)

___

### count

▸ **count**(`predicate?`): `Promise`<`number`\>

Returns the number of elements in a sequence
or represents how many elements in the specified sequence satisfy a condition
if the predicate is specified.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate?` | (`x`: `TSource`) => `boolean` | A function to test each element for a condition. Optional. |

#### Returns

`Promise`<`number`\>

The number of elements in the input sequence.

[`Count`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.count)

___

### defaultIfEmpty

▸ **defaultIfEmpty**(`defaultValue?`): [`IAsyncEnumerable`][]<`TSource`\>

Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is `empty`.

[`DefaultIfEmtpy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.defaultifempty)

#### Parameters

| Name | Type |
| :------ | :------ |
| `defaultValue?` | `TSource` |

#### Returns

[`IAsyncEnumerable`][]<`TSource`\>

___

### distinct

▸ **distinct**(`comparer?`): [`IAsyncEnumerable`][]<`TSource`\>

Returns distinct elements from a sequence by using the `default` or specified equality comparer to compare values.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `comparer?` | [`IEqualityComparer`](iequalitycomparer.md)<`TSource`\> | An [`IAsyncEqualityComparer<T>`](iasyncequalitycomparer.md) to compare values. Optional. Defaults to Strict Equality Comparison. |

#### Returns

[`IAsyncEnumerable`][]<`TSource`\>

An [`IAsyncEnumerable<T>`][] that contains distinct elements from the source sequence.

[`Distinct`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.distinct)

___

### distinctBy

▸ **distinctBy**<`TKey`\>(`keySelector?`, `comparer?`): [`IAsyncEnumerable`][]<`TSource`\>

Returns distinct elements from a sequence according to a specified key selector function and using a specified comparer to compare keys.

[`DistinctBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.distinctby)

#### Type parameters

| Name |
| :------ |
| `TKey` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `keySelector?` | [`TKeySelectorAsync`](../types.md#tkeyselectorasync)<`TSource`, `TKey`\> |
| `comparer?` | [`TIAsyncEqualityComparer`](../types.md#tiasyncequalitycomparer)<`TKey`\> |

#### Returns

[`IAsyncEnumerable`][]<`TSource`\>

___

### elementAt

▸ **elementAt**(`index`): `Promise`<`TSource`\>

Returns the element at a specified index in a sequence.

**`throws`** `ArgumentOutOfRangeException` if index is less than 0 or greater than or equal to the number of elements in source.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `index` | `number` | The zero-based index of the element to retrieve. |

#### Returns

`Promise`<`TSource`\>

The element at the specified position in the source sequence.

[`ElementAt`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.elementat)

___

### elementAtOrDefault

▸ **elementAtOrDefault**(`index`): `Promise`<`undefined` \| `TSource`\>

Returns the element at a specified index in a sequence or a default value if the index is out of range.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `index` | `number` | The zero-based index of the element to retrieve. |

#### Returns

`Promise`<`undefined` \| `TSource`\>

`null` if the index is outside the bounds of the source sequence;
otherwise, the element at the specified position in the source sequence.

[`ElementAtOrDefault`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.elementatordefault)

___

### except

▸ **except**(`second`, `comparer?`): [`IAsyncEnumerable`][]<`TSource`\>

Produces the set difference of two sequences by using the comparer provided
or EqualityComparer to compare values.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `second` | `Iterable`<`TSource`\> | An [`IAsyncEnumerable<T>`][] whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence. |
| `comparer?` | [`IEqualityComparer`](iequalitycomparer.md)<`TSource`\> | An [`IAsyncEqualityComparer<T>`](iasyncequalitycomparer.md) to compare values. Optional. |

#### Returns

[`IAsyncEnumerable`][]<`TSource`\>

A sequence that contains the set difference of the elements of two sequences.

[`Except`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.except)

___

### exceptBy

▸ **exceptBy**<`TKey`\>(`second`, `keySelector?`, `comparer?`): [`IAsyncEnumerable`][]<`TSource`\>

Produces the set difference of two sequences according to a specified key selector function.

[`ExceptBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.exceptby)

#### Type parameters

| Name |
| :------ |
| `TKey` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `second` | `Iterable`<`TKey`\> |
| `keySelector?` | [`TKeySelectorAsync`](../types.md#tkeyselectorasync)<`TSource`, `TKey`\> |
| `comparer?` | [`TIAsyncEqualityComparer`](../types.md#tiasyncequalitycomparer)<`TKey`\> |

#### Returns

[`IAsyncEnumerable`][]<`TSource`\>

___

### first

▸ **first**(`predicate?`): `Promise`<`TSource`\>

Returns the first element in sequence that satisfies `predicate` otherwise
returns the first element in the sequence.

**`throws`** `InvalidOperationException` - No elements in Iteration matching predicate

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate?` | (`x`: `TSource`) => `boolean` | A function to test each element for a condition. Optional. |

#### Returns

`Promise`<`TSource`\>

The first element in the sequence
or the first element that passes the test in the specified predicate function.

[`First`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.first)

___

### firstOrDefault

▸ **firstOrDefault**(`predicate?`): `Promise`<`undefined` \| `TSource`\>

Returns first element in sequence that satisfies predicate otherwise
returns the first element in the sequence. Returns null if no value found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate?` | (`x`: `TSource`) => `boolean` | A function to test each element for a condition. Optional. |

#### Returns

`Promise`<`undefined` \| `TSource`\>

The first element in the sequence
or the first element that passes the test in the specified predicate function.
Returns `null` if no value found.

[`FirstOrDefault`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.firstordefault)

___

### forEach

▸ **forEach**<`TResult`\>(`action`): [`IAsyncEnumerable`][]<`TResult`\>

Performs a specified action on each element of the Iterable<TSource>

#### Type parameters

| Name |
| :------ |
| `TResult` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `action` | (`x`: `TSource`) => `TResult` \| `Promise`<`TResult`\> | The action to take an each element |

#### Returns

[`IAsyncEnumerable`][]<`TResult`\>

A new [`IAsyncEnumerable<TResult>`](iasyncenumerable.md) that executes the action lazily as you iterate.

___

### groupBy

▸ **groupBy**<`TKey`, `TResult`\>(`keySelector`, `resultSelector?`, `comparer?`): [`IAsyncEnumerable`][]<`TResult`\>

Groups the elements of a sequence according to a specified key selector function.

#### Type parameters

| Name |
| :------ |
| `TKey` |
| `TResult` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `keySelector` | [`TKeySelectorAsync`](../types.md#tkeyselectorasync)<`TSource`, `TKey`\> | A function to extract the key for each element. |
| `resultSelector?` | [`TResultSelectorAsync`](../types.md#tresultselectorasync)<`TKey`, `TSource`, `TResult`\> \| [`IEqualityComparer`](iequalitycomparer.md)<`TKey`\> | - |
| `comparer?` | [`IEqualityComparer`](iequalitycomparer.md)<`TKey`\> | - |

#### Returns

[`IAsyncEnumerable`][]<`TResult`\>

An IAsyncEnumerable<IAsyncGrouping<TKey, TSource>>
where each [`IAsyncGrouping<TKey,TElement>`](iasyncgrouping.md) object contains a sequence of objects and a key.

[`GroupBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupby)

▸ **groupBy**<`TKey`, `TElement`, `TResult`\>(`keySelector`, `elementSelector`, `resultSelector?`, `comparer?`): [`IAsyncEnumerable`][]<`TResult`\>

Groups the elements of a sequence according to a key selector function.
The keys are compared by using a comparer and each group's elements are projected by using a specified function.

#### Type parameters

| Name |
| :------ |
| `TKey` |
| `TElement` |
| `TResult` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `keySelector` | [`TKeySelectorAsync`](../types.md#tkeyselectorasync)<`TSource`, `TKey`\> | A function to extract the key for each element. |
| `elementSelector` | [`TElementSelectorAsync`](../types.md#telementselectorasync)<`TSource`, `TElement`\> | - |
| `resultSelector?` | [`TResultSelectorAsync`](../types.md#tresultselectorasync)<`TKey`, `TElement`, `TResult`\> | - |
| `comparer?` | [`IEqualityComparer`](iequalitycomparer.md)<`TKey`\> | An [`IAsyncEqualityComparer<T>`](iasyncequalitycomparer.md) to compare keys. |

#### Returns

[`IAsyncEnumerable`][]<`TResult`\>

___

### groupByGrouped

▸ **groupByGrouped**<`TKey`\>(`keySelector`): [`IAsyncEnumerable`][]<[`IAsyncGrouping`](iasyncgrouping.md)<`TKey`, `TSource`\>\>

#### Type parameters

| Name |
| :------ |
| `TKey` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `keySelector` | [`TKeySelectorAsync`](../types.md#tkeyselectorasync)<`TSource`, `TKey`\> |

#### Returns

[`IAsyncEnumerable`][]<[`IAsyncGrouping`](iasyncgrouping.md)<`TKey`, `TSource`\>\>

▸ **groupByGrouped**<`TKey`, `TElement`\>(`keySelector`, `elementSelector`): [`IAsyncEnumerable`][]<[`IAsyncGrouping`](iasyncgrouping.md)<`TKey`, `TSource`\>\>

#### Type parameters

| Name |
| :------ |
| `TKey` |
| `TElement` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `keySelector` | [`TKeySelectorAsync`](../types.md#tkeyselectorasync)<`TSource`, `TKey`\> |
| `elementSelector` | [`TElementSelectorAsync`](../types.md#telementselectorasync)<`TSource`, `TElement`\> |

#### Returns

[`IAsyncEnumerable`][]<[`IAsyncGrouping`](iasyncgrouping.md)<`TKey`, `TSource`\>\>

▸ **groupByGrouped**<`TKey`, `TElement`\>(`keySelector`, `elementSelector`, `comparer`): [`IAsyncEnumerable`][]<[`IAsyncGrouping`](iasyncgrouping.md)<`TKey`, `TElement`\>\>

#### Type parameters

| Name |
| :------ |
| `TKey` |
| `TElement` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `keySelector` | [`TKeySelectorAsync`](../types.md#tkeyselectorasync)<`TSource`, `TKey`\> |
| `elementSelector` | [`TElementSelectorAsync`](../types.md#telementselectorasync)<`TSource`, `TElement`\> |
| `comparer` | [`IEqualityComparer`](iequalitycomparer.md)<`TKey`\> |

#### Returns

[`IAsyncEnumerable`][]<[`IAsyncGrouping`](iasyncgrouping.md)<`TKey`, `TElement`\>\>

___

### groupJoin

▸ **groupJoin**<`TInner`, `TKey`, `TResult`\>(`inner`, `outerKeySelector`, `innerKeySelector`, `resultSelector`, `comparer?`): [`IAsyncEnumerable`][]<`TResult`\>

Correlates the elements of two sequences based on matching keys.
A specified [`IAsyncEqualityComparer<T>`](iasyncequalitycomparer.md) is used to compare keys or the strict equality comparer.

#### Type parameters

| Name |
| :------ |
| `TInner` |
| `TKey` |
| `TResult` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `inner` | `AsyncIterable`<`TInner`\> | The sequence to join to the first sequence. |
| `outerKeySelector` | [`TKeySelectorAsync`](../types.md#tkeyselectorasync)<`TSource`, `TKey`\> | A function to extract the join key from each element of the first sequence. |
| `innerKeySelector` | [`TKeySelectorAsync`](../types.md#tkeyselectorasync)<`TInner`, `TKey`\> | A function to extract the join key from each element of the second sequence. |
| `resultSelector` | [`TResultSelectorAsync`](../types.md#tresultselectorasync)<`TKey`, `TInner`, `TResult`\> | A function to create a result element from two matching elements. |
| `comparer?` | [`IEqualityComparer`](iequalitycomparer.md)<`TKey`\> | An [`IAsyncEqualityComparer<T>`](iasyncequalitycomparer.md) to hash and compare keys. Optional. |

#### Returns

[`IAsyncEnumerable`][]<`TResult`\>

An [`IAsyncEnumerable<T>`][] that has elements of type TResult that
are obtained by performing an inner join on two sequences.

[`GroupJoin`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupjoin)

___

### intersect

▸ **intersect**(`second`, `comparer?`): [`IAsyncEnumerable`][]<`TSource`\>

Produces the set intersection of two sequences by using the specified [`IAsyncEqualityComparer<T>`](iasyncequalitycomparer.md) to compare values.
If no comparer is selected, uses the StrictEqualityComparer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `second` | `AsyncIterable`<`TSource`\> \| `Iterable`<`TSource`\> | An Iterable<T> whose distinct elements that also appear in the first sequence will be returned. |
| `comparer?` | [`IEqualityComparer`](iequalitycomparer.md)<`TSource`\> | An [`IAsyncEqualityComparer<T>`](iasyncequalitycomparer.md) to compare values. Optional. |

#### Returns

[`IAsyncEnumerable`][]<`TSource`\>

A sequence that contains the elements that form the set intersection of two sequences.

[`Intersect`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.intersect)

___

### intersectBy

▸ **intersectBy**<`TKey`\>(`second`, `keySelector?`, `comparer?`): [`IAsyncEnumerable`][]<`TSource`\>

Produces the set intersection of two sequences according to a specified key selector function.

[`IntersectBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.intersectby)

#### Type parameters

| Name |
| :------ |
| `TKey` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `second` | `AsyncIterable`<`TKey`\> \| `Iterable`<`TKey`\> |
| `keySelector?` | [`TKeySelectorAsync`](../types.md#tkeyselectorasync)<`TSource`, `TKey`\> |
| `comparer?` | [`TIAsyncEqualityComparer`](../types.md#tiasyncequalitycomparer)<`TKey`\> |

#### Returns

[`IAsyncEnumerable`][]<`TSource`\>

___

### join

▸ **join**<`TInner`, `TKey`, `TResult`\>(`inner`, `outerKeySelector`, `innerKeySelector`, `resultSelector`, `comparer`): [`IAsyncEnumerable`][]<`TResult`\>

Correlates the elements of two sequences based on matching keys. A specified [`IAsyncEqualityComparer<T>`](iasyncequalitycomparer.md) is used to compare keys.

[`Join`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.join)

#### Type parameters

| Name |
| :------ |
| `TInner` |
| `TKey` |
| `TResult` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `inner` | `AsyncIterable`<`TInner`\> \| `Iterable`<`TInner`\> |
| `outerKeySelector` | [`TKeySelectorAsync`](../types.md#tkeyselectorasync)<`TSource`, `TKey`\> |
| `innerKeySelector` | [`TKeySelectorAsync`](../types.md#tkeyselectorasync)<`TInner`, `TKey`\> |
| `resultSelector` | [`TResultSelectorJoin`](../types.md#tresultselectorjoin)<`TSource`, `TInner`, `TResult`\> |
| `comparer` | [`IEqualityComparer`](iequalitycomparer.md)<`TKey`\> |

#### Returns

[`IAsyncEnumerable`][]<`TResult`\>

___

### last

▸ **last**(`predicate?`): `Promise`<`TSource`\>

Returns the last element of a sequence.
If predicate is specified, the last element of a sequence that satisfies a specified `condition`.

**`throws`** `InvalidOperationException` if the `source` sequence is `empty`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate?` | (`x`: `TSource`) => `boolean` | A function to test each element for a condition. Optional. |

#### Returns

`Promise`<`TSource`\>

The value at the last position in the source sequence
or the last element in the sequence that passes the test in the specified predicate function.

[`Last`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.last)

___

### lastOrDefault

▸ **lastOrDefault**(`predicate?`): `Promise`<`undefined` \| `TSource`\>

Returns the last element of a sequence.
If predicate is specified, the last element of a sequence that satisfies a specified condition.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate?` | (`x`: `TSource`) => `boolean` | A function to test each element for a condition. Optional. |

#### Returns

`Promise`<`undefined` \| `TSource`\>

The value at the last position in the source sequence
or the last element in the sequence that passes the test in the specified predicate function.

[`LastOrDefault`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.lastordefault)

___

### max

▸ **max**(`comparer?`): `Promise`<`number`\>

Invokes a transform function on each element of a sequence and returns the maximum value.

**`throws`** `InvalidOperationException` - if source contains no elements.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `comparer?` | [`ICompareTo`](icompareto.md)<`number`\> | A compare function to apply to each element. |

#### Returns

`Promise`<`number`\>

The maximum value in the sequence.

[`Max`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.max)

___

### maxBy

▸ **maxBy**<`TKey`\>(`keySelector?`, `comparer?`): `Promise`<`TSource`\>

Returns the maximum value in a generic sequence according to a specified key selector function and key comparer.

[`MaxBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.maxby)

#### Type parameters

| Name |
| :------ |
| `TKey` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `keySelector?` | [`TKeySelectorAsync`](../types.md#tkeyselectorasync)<`TSource`, `TKey`\> |
| `comparer?` | [`TICompareTo`](../types.md#ticompareto)<`TKey`\> |

#### Returns

`Promise`<`TSource`\>

___

### min

▸ **min**(`comparer?`): `Promise`<`number`\>

Invokes a transform function on each element of a sequence and returns the minimum value.

**`throws`** `InvalidOperationException` - if source contains no elements.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `comparer?` | [`ICompareTo`](icompareto.md)<`number`\> | A compare function to apply to each element. |

#### Returns

`Promise`<`number`\>

The minimum value in the sequence.

[`Min`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.min)

___

### minBy

▸ **minBy**<`TKey`\>(`keySelector?`, `comparer?`): `Promise`<`TSource`\>

Returns the minimum value in a generic sequence according to a specified key selector function and key comparer.

[`MinBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.minby)

#### Type parameters

| Name |
| :------ |
| `TKey` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `keySelector?` | [`TKeySelectorAsync`](../types.md#tkeyselectorasync)<`TSource`, `TKey`\> |
| `comparer?` | [`TICompareTo`](../types.md#ticompareto)<`TKey`\> |

#### Returns

`Promise`<`TSource`\>

___

### ofType

▸ **ofType**<`TType`\>(`type`): [`IAsyncEnumerable`][]<`TType`\>

Applies a type filter to a source iteration

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TType` | extends [`OfType`] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `TType` | Either value for typeof or a consturctor function |

#### Returns

[`IAsyncEnumerable`][]<`TType`\>

Values that match the type string or are instance of type

[`OfType`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.oftype)

___

### orderBy

▸ **orderBy**<`TKey`\>(`keySelector?`, `comparer?`): [`IAsyncOrderedEnumerable`](iasyncorderedenumerable.md)<`TSource`\>

Sorts the elements of a sequence in ascending order by using a specified or default comparer.

#### Type parameters

| Name |
| :------ |
| `TKey` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `keySelector?` | [`TKeySelectorAsync`](../types.md#tkeyselectorasync)<`TSource`, `TKey`\> | A function to extract a key from an element. |
| `comparer?` | [`ICompareTo`](icompareto.md)<`TKey`\> | An [`ICompareTo<T>`](icompareto.md) to compare keys. Optional. |

#### Returns

[`IAsyncOrderedEnumerable`](iasyncorderedenumerable.md)<`TSource`\>

An [`IAsyncOrderedEnumerable<TElement>`](iasyncorderedenumerable.md) whose elements are sorted according to a key.

[`OrderBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.orderby)

___

### orderByDescending

▸ **orderByDescending**<`TKey`\>(`keySelector?`, `comparer?`): [`IAsyncOrderedEnumerable`](iasyncorderedenumerable.md)<`TSource`\>

Sorts the elements of a sequence in descending order by using a specified or default comparer.

#### Type parameters

| Name |
| :------ |
| `TKey` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `keySelector?` | [`TKeySelectorAsync`](../types.md#tkeyselectorasync)<`TSource`, `TKey`\> | A function to extract a key from an element. |
| `comparer?` | [`ICompareTo`](icompareto.md)<`TKey`\> | An [`ICompareTo<T>`](icompareto.md) to compare keys. Optional. |

#### Returns

[`IAsyncOrderedEnumerable`](iasyncorderedenumerable.md)<`TSource`\>

An [`IAsyncOrderedEnumerable<TElement>`](iasyncorderedenumerable.md) whose elements are sorted in descending order according to a key.

[`OrderByDescending`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.orderbydescending)

___

### prepend

▸ **prepend**(`item`): [`IAsyncEnumerable`][]<`TSource`\>

Adds a value to the beginning of the sequence.

[`Prepend`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.prepend)

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `TSource` |

#### Returns

[`IAsyncEnumerable`][]<`TSource`\>

___

### reverse

▸ **reverse**(): [`IAsyncEnumerable`][]<`TSource`\>

Inverts the order of the elements in a sequence.

#### Returns

[`IAsyncEnumerable`][]<`TSource`\>

A sequence whose elements correspond to those of the input sequence in reverse order.

[`Reverse`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.reverse)

___

### select

▸ **select**<`TResult`\>(`selector?`): [`IAsyncEnumerable`][]<`TResult`\>

Projects each element of a sequence into a new form.

#### Type parameters

| Name |
| :------ |
| `TResult` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector?` | (`x`: `TSource`, `index?`: `number`) => `TResult` \| `Promise`<`TResult`\> | A transform function to apply to each element. |

#### Returns

[`IAsyncEnumerable`][]<`TResult`\>

- An [`IAsyncEnumerable<T>`][] whose elements are the result of invoking the transform function on each element of source.

[`Select`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.select)

___

### selectMany

▸ **selectMany**<`TCollection`, `TResult`\>(`selector?`, `resultSelector?`): [`IAsyncEnumerable`][]<`TResult`\>

Projects each element of a sequence to an [`IAsyncEnumerable<T>`][] and flattens the resulting sequences into one sequence.

#### Type parameters

| Name |
| :------ |
| `TCollection` |
| `TResult` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector?` | [`SelectManySelector`](../types.md#selectmanyselector)<`TSource`, `TCollection`\> | A transform function to apply to each element. |
| `resultSelector?` | [`SelectManyResultSelector`](../types.md#selectmanyresultselector)<`TSource`, `TCollection`, `TResult`\> | - |

#### Returns

[`IAsyncEnumerable`][]<`TResult`\>

An [`IAsyncEnumerable<T>`][] whose elements are the result of invoking the
one-to-many transform function on each element of the input sequence.

[`SelectMany`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.selectmany)

___

### sequenceEqual

▸ **sequenceEqual**(`second`, `comparer?`): `Promise`<`boolean`\>

Determines whether or not two sequences are `equal`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `second` | `AsyncIterable`<`TSource`\> \| `Iterable`<`TSource`\> | second iterable |
| `comparer?` | [`IEqualityComparer`](iequalitycomparer.md)<`TSource`\> | Compare function to use, by default is @see {StrictEqualityComparer} |

#### Returns

`Promise`<`boolean`\>

Whether or not the two iterations are equal

[`SequenceEqual`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sequenceequal)

___

### single

▸ **single**(`predicate?`): `Promise`<`TSource`\>

Returns the only element of a sequence that satisfies a specified condition (if specified),
and throws an exception if more than one such element exists.

**`throws`** `InvalidOperationException` - if no element satisfies the `condition` in predicate. OR
More than one element satisfies the condition in predicate. OR
The source sequence is empty.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate?` | (`x`: `TSource`) => `boolean` | A function to test an element for a condition. (Optional) |

#### Returns

`Promise`<`TSource`\>

The single element of the input sequence that satisfies a condition.

[`Single`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.single)

___

### singleOrDefault

▸ **singleOrDefault**(`predicate?`): `Promise`<`undefined` \| `TSource`\>

If predicate is specified returns the only element of a sequence that satisfies a specified condition,
ootherwise returns the only element of a sequence. Returns a default value if no such element exists.

**`throws`** `InvalidOperationException` - If predicate is specified more than one element satisfies the condition in predicate,
otherwise the input sequence contains more than one element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate?` | (`x`: `TSource`) => `boolean` | A function to test an element for a condition. Optional. |

#### Returns

`Promise`<`undefined` \| `TSource`\>

The single element of the input sequence that satisfies the condition,
or null if no such element is found.

[`SingleOrDefault`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.singleordefault)

___

### skip

▸ **skip**(`count`): [`IAsyncEnumerable`][]<`TSource`\>

Bypasses a specified number of elements in a sequence and then returns the remaining elements.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `count` | `number` | The number of elements to skip before returning the remaining elements. |

#### Returns

[`IAsyncEnumerable`][]<`TSource`\>

An [`IAsyncEnumerable<T>`][] that contains the elements that occur after the specified index in the input sequence.

[`Skip`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skip)

___

### skipLast

▸ **skipLast**(`count`): [`IAsyncEnumerable`][]<`TSource`\>

Returns a new enumerable collection that contains the elements from `source` with the last `count` elements of the source collection omitted.

[`SkipLast`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skiplast)

#### Parameters

| Name | Type |
| :------ | :------ |
| `count` | `number` |

#### Returns

[`IAsyncEnumerable`][]<`TSource`\>

___

### skipWhile

▸ **skipWhile**(`predicate`): [`IAsyncEnumerable`][]<`TSource`\>

Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
The element's index is used in the logic of the predicate function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate` | (`x`: `TSource`, `index`: `number`) => `boolean` \| `Promise`<`boolean`\> | A function to test each source element for a condition; the second parameter of the function represents the index of the source element. |

#### Returns

[`IAsyncEnumerable`][]<`TSource`\>

An [`IAsyncEnumerable<T>`][] that contains the elements from the input sequence starting at the first element
in the linear series that does not pass the test specified by predicate.

[`SkipWhile`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skipwhile)

___

### sum

▸ **sum**(`selector?`): `Promise`<`string` \| `number`\>

Computes the sum of the sequence of numeric values that are obtained by invoking a transform function
on each element of the input sequence.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector?` | (`x`: `TSource`) => `string` \| `number` \| `Promise`<`string` \| `number`\> | A transform function to apply to each element. |

#### Returns

`Promise`<`string` \| `number`\>

The sum of the projected values.

[`Sum`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sum)

___

### take

▸ **take**(`count`): [`IAsyncEnumerable`][]<`TSource`\>

Returns a specified number of contiguous elements from the start of a sequence.

#### Parameters

| Name | Type |
| :------ | :------ |
| `count` | `number` |

#### Returns

[`IAsyncEnumerable`][]<`TSource`\>

An [`IAsyncEnumerable<T>`][] that contains the specified number of elements from the start of the input sequence.

[`Take`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.take)

___

### takeLast

▸ **takeLast**(`count`): [`IAsyncEnumerable`][]<`TSource`\>

Returns a new enumerable collection that contains the last `count` elements from `source`.

[`TakeLast`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.takelast)

#### Parameters

| Name | Type |
| :------ | :------ |
| `count` | `number` |

#### Returns

[`IAsyncEnumerable`][]<`TSource`\>

___

### takeWhile

▸ **takeWhile**(`predicate`): [`IAsyncEnumerable`][]<`TSource`\>

Returns elements from a sequence as long as a specified condition is true.
The element's index is used in the logic of the predicate function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate` | (`element`: `TSource`, `index`: `number`) => `boolean` | A function to test each source element for a condition; the second parameter of the function represents the index of the source element. |

#### Returns

[`IAsyncEnumerable`][]<`TSource`\>

An [`IAsyncEnumerable<T>`][] that contains elements from the input sequence
that occur before the element at which the test no longer passes.

[`TakeWhile`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.takewhile)

___

### toArray

▸ **toArray**(): `Promise`<`TSource`[]\>

Creates an array from a [`IAsyncEnumerable<T>`][].

#### Returns

`Promise`<`TSource`[]\>

An array of elements

[`ToArray`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.toarray)

___

### toMap

▸ **toMap**<`TKey`\>(`selector`): `Promise`<`Map`<`TKey`, `TSource`[]\>\>

Converts an Iterable<V> to a Map<K, V[]>.

#### Type parameters

| Name |
| :------ |
| `TKey` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | (`x`: `TSource`) => `TKey` | A function to serve as a key selector. |

#### Returns

`Promise`<`Map`<`TKey`, `TSource`[]\>\>

Map<K, V[]>

[`ToDictionary`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.todictionary)

___

### toSet

▸ **toSet**(): `Promise`<`Set`<`TSource`\>\>

Converts the iteration to a Set

#### Returns

`Promise`<`Set`<`TSource`\>\>

Set containing the iteration values

___

### union

▸ **union**(`second`, `comparer?`): [`IAsyncEnumerable`][]<`TSource`\>

Produces the set union of two sequences by using scrict equality comparison or a specified [`IAsyncEqualityComparer<T>`](iasyncequalitycomparer.md).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `second` | `AsyncIterable`<`TSource`\> \| `Iterable`<`TSource`\> | An Iterable<T> whose distinct elements form the second set for the union. |
| `comparer?` | [`IEqualityComparer`](iequalitycomparer.md)<`TSource`\> | The [`IAsyncEqualityComparer<T>`](iasyncequalitycomparer.md) to compare values. Optional. |

#### Returns

[`IAsyncEnumerable`][]<`TSource`\>

An [`IAsyncEnumerable<T>`][] that contains the elements from both input sequences, excluding duplicates.

[`Union`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.union)

___

### unionBy

▸ **unionBy**<`TKey`\>(`second`, `keySelector?`, `comparer?`): [`IAsyncEnumerable`][]<`TSource`\>

Produces the set union of two sequences according to a specified key selector function.

[`UnionBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.unionby)

#### Type parameters

| Name |
| :------ |
| `TKey` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `second` | `AsyncIterable`<`TKey`\> \| `Iterable`<`TKey`\> |
| `keySelector?` | [`TKeySelectorAsync`](../types.md#tkeyselectorasync)<`TSource`, `TKey`\> |
| `comparer?` | [`TIAsyncEqualityComparer`](../types.md#tiasyncequalitycomparer)<`TKey`\> |

#### Returns

[`IAsyncEnumerable`][]<`TSource`\>

___

### where

▸ **where**(`predicate`): [`IAsyncEnumerable`][]<`TSource`\>

Filters a sequence of values based on a predicate.
Each element's index is used in the logic of the predicate function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate` | (`x`: `TSource`, `index`: `number`) => `boolean` \| `Promise`<`boolean`\> | A function to test each source element for a condition; the second parameter of the function represents the index of the source element. |

#### Returns

[`IAsyncEnumerable`][]<`TSource`\>

An [`IAsyncEnumerable<T>`][] that contains elements from the input sequence that satisfy the condition.

[`Where`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.where)

___

### zip

▸ **zip**<`TSecond`\>(`second`): [`IAsyncEnumerable`][]<[`TSource`, `TSecond`]\>

Creates a tuple of corresponding elements of two sequences, producing a sequence of the results.

#### Type parameters

| Name |
| :------ |
| `TSecond` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `second` | `Iterable`<`TSecond`\> \| `AsyncIterable`<`TSecond`\> | The second sequence to merge. |

#### Returns

[`IAsyncEnumerable`][]<[`TSource`, `TSecond`]\>

An [`IAsyncEnumerable<[T, V]>`](iasyncenumerable.md) that contains merged elements of two input sequences.

[`zip`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.zip)

▸ **zip**<`TSecond`, `TResult`\>(`second`, `resultSelector`): [`IAsyncEnumerable`][]<`TResult`\>

Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.

#### Type parameters

| Name |
| :------ |
| `TSecond` |
| `TResult` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `second` | `Iterable`<`TSecond`\> \| `AsyncIterable`<`TSecond`\> | The second sequence to merge. |
| `resultSelector` | [`ZipResultSelectorAsync`](../types.md#zipresultselectorasync)<`TSource`, `TSecond`, `undefined`, `TResult`\> | A function that specifies how to merge the elements from the two sequences. |

#### Returns

[`IAsyncEnumerable`][]<`TResult`\>

An [`IAsyncEnumerable<TResult>`](iasyncenumerable.md) that contains merged elements of two input sequences.

▸ **zip**<`TSecond`, `TThird`, `TResult`\>(`second`, `third`, `resultSelector`): [`IAsyncEnumerable`][]<`TResult`\>

#### Type parameters

| Name |
| :------ |
| `TSecond` |
| `TThird` |
| `TResult` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `second` | `Iterable`<`TSecond`\> \| `AsyncIterable`<`TSecond`\> |
| `third` | `Iterable`<`TThird`\> \| `AsyncIterable`<`TThird`\> |
| `resultSelector` | [`ZipResultSelectorAsync`](../types.md#zipresultselectorasync)<`TSource`, `TSecond`, `undefined`, `TResult`\> |

#### Returns

[`IAsyncEnumerable`][]<`TResult`\>



[interfaces]: ../interfaces.md
[`IAsyncEnumerable`]: iasyncenumerable.md
[`IAsyncEnumerable<T>`]: iasyncenumerable.md