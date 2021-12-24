[@n3okill/tslinq](../README.md) / [Interfaces](../interfaces.md) / IEnumerable

# Interface: IEnumerable<TSource\>

[Interfaces](../interfaces.md).IEnumerable

Iterable type with methods from LINQ.

## Type parameters

| Name |
| :------ |
| `TSource` |

## Hierarchy

- `Iterable`<`TSource`\>

  ↳ **`IEnumerable`**

  ↳↳ [`Enumerable`](../classes/enumerable.md)

  ↳↳ [`IGrouping`](igrouping.md)

  ↳↳ [`IOrderedEnumerable`](iorderedenumerable.md)

## Table of contents

### Methods

- [[iterator]](#[iterator])
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

### [iterator]

▸ **[iterator]**(): `Iterator`<`TSource`, `any`, `undefined`\>

#### Returns

`Iterator`<`TSource`, `any`, `undefined`\>

#### Overrides

Iterable.\_\_@iterator

___

### aggregate

▸ **aggregate**<`TResult`\>(`func`, `resultSelector?`): `TResult`

Applies an accumulator function over a sequence.

#### Type parameters

| Name |
| :------ |
| `TResult` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `func` | [`AggregateFunctionType`](../types.md#aggregatefunctiontype)<`TSource`, `TSource`\> | An [`accumulator`](../types.md#aggregatefunctiontype) function to be invoked on each element. |
| `resultSelector?` | [`AggregateResultType`](../types.md#aggregateresulttype)<`TSource`, `TResult`\> | - |

#### Returns

`TResult`

The final accumulator value.

[`Aggregate`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.aggregate)

▸ **aggregate**<`TAccumulate`, `TResult`\>(`seed`, `func`, `resultSelector?`): `TResult`

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
| `func` | [`AggregateFunctionType`](../types.md#aggregatefunctiontype)<`TSource`, `TAccumulate`\> | An [`accumulator`](../types.md#aggregatefunctiontype) function to be invoked on each element. |
| `resultSelector?` | [`AggregateResultType`](../types.md#aggregateresulttype)<`TAccumulate`, `TResult`\> | - |

#### Returns

`TResult`

The final accumulator value.

▸ **aggregate**<`TAccumulate`, `TResult`\>(`seed`, `func`, `resultSelector`): `TResult`

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
| `func` | [`AggregateFunctionType`](../types.md#aggregatefunctiontype)<`TSource`, `TAccumulate`\> | An [`accumulator`](../types.md#aggregatefunctiontype) function to be invoked on each element. |
| `resultSelector` | [`AggregateResultType`](../types.md#aggregateresulttype)<`TAccumulate`, `TResult`\> | A function to transform the final accumulator value into the result value. |

#### Returns

`TResult`

The transformed final accumulator value.

___

### all

▸ **all**(`predicate`): `boolean`

Determines whether all elements of a sequence satisfy a condition.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate` | (`x`: `TSource`) => `boolean` | A function to test each element for a condition. |

#### Returns

`boolean`

`true` if every element of the source sequence passes the test in the specified `predicate`,
or if the sequence is empty; otherwise, `false`.

[`All`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.all)

___

### any

▸ **any**(`predicate?`): `boolean`

Determines whether a sequence contains any elements.
If predicate is specified, determines whether any element of a sequence satisfies a condition.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate?` | (`x`: `TSource`) => `boolean` | A function to test each element for a condition. |

[`Any`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.any) 

#### Returns

`boolean`

true if the source sequence contains any elements or passes the test specified; otherwise, false.

___

### append

▸ **append**(`item`): [`IEnumerable`][]<`TSource`\>

Appends a value to the end of the sequence.

[`Append`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.append)

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `TSource` |

#### Returns

[`IEnumerable`][]<`TSource`\>

___

### average

▸ **average**(`selector`): `number`

Computes the average of a sequence of values
that are obtained by invoking a transform function on each element of the input sequence.

**`throws`** InvalidOperationException - source contains no elements.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | (`x`: `TSource`) => `number` | A transform function to apply to each element. |

#### Returns

`number`

The average of the sequence of values.

[`Average`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.average)

___

### chunk

▸ **chunk**(`size`): [`IEnumerable`][]<`TSource`[]\>

Splits the elements of a sequence into chunks of size at most size.

[`Chunk`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.chunk)

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

[`IEnumerable`][]<`TSource`[]\>

___

### concat

▸ **concat**(`second`): [`IEnumerable`][]<`TSource`\>

Concatenates two sequences.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `second` | `Iterable`<`TSource`\> | The sequence to concatenate to the first sequence. |

#### Returns

[`IEnumerable`][]<`TSource`\>

An [`IEnumerable<T>`][] that contains the concatenated elements of the two sequences.

[`Concat`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.concat)

___

### contains

▸ **contains**(`value`, `comparer?`): `boolean`

Determines whether a sequence contains a specified element by
using the specified or default [`IEqualityComparer<T>`][].

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `TSource` | The value to locate in the sequence. |
| `comparer?` | [`IEqualityComparer`][]<`TSource`\> | An equality comparer to compare values. Optional. |

#### Returns

`boolean`

`true` if the source sequence contains an element that has the specified value; otherwise, `false`.

[`Contains`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.contains)

___

### count

▸ **count**(`predicate?`): `number`

Returns the number of elements in a sequence
or represents how many elements in the specified sequence satisfy a condition
if the predicate is specified.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate?` | (`x`: `TSource`) => `boolean` | A function to test each element for a condition. Optional. |

#### Returns

`number`

The number of elements in the input sequence.

[`Count`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.count)

___

### defaultIfEmpty

▸ **defaultIfEmpty**(`defaultValue?`): [`IEnumerable`][]<`TSource`\>

Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is `empty`.

[`DefaultIfEmtpy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.defaultifempty)

#### Parameters

| Name | Type |
| :------ | :------ |
| `defaultValue?` | `TSource` |

#### Returns

[`IEnumerable`][]<`TSource`\>

___

### distinct

▸ **distinct**(`comparer?`): [`IEnumerable`][]<`TSource`\>

Returns distinct elements from a sequence by using the `default` or specified equality comparer to compare values.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `comparer?` | [`IEqualityComparer`][]<`TSource`\> | An [`IEqualityComparer<T>`][] to compare values. Optional. Defaults to Strict Equality Comparison. |

#### Returns

[`IEnumerable`][]<`TSource`\>

An [`IEnumerable<T>`][] that contains distinct elements from the source sequence.

[`Distinct`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.distinct)

___

### distinctBy

▸ **distinctBy**<`TKey`\>(`keySelector?`, `comparer?`): [`IEnumerable`][]<`TSource`\>

Returns distinct elements from a sequence according to a specified key selector function and using a specified comparer to compare keys.

[`DistinctBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.distinctby)

#### Type parameters

| Name |
| :------ |
| `TKey` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `keySelector?` | [`TKeySelector`](../types.md#tkeyselector)<`TSource`, `TKey`\> |
| `comparer?` | [`IEqualityComparer`][]<`TKey`\> |

#### Returns

[`IEnumerable`][]<`TSource`\>

___

### elementAt

▸ **elementAt**(`index`): `TSource`

Returns the element at a specified index in a sequence.

**`throws`** `ArgumentOutOfRangeException` if index is less than 0 or greater than or equal to the number of elements in source.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `index` | `number` | The zero-based index of the element to retrieve. |

#### Returns

`TSource`

The element at the specified position in the source sequence.

[`ElementAt`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.elementat)

___

### elementAtOrDefault

▸ **elementAtOrDefault**(`index`): `undefined` \| `TSource`

Returns the element at a specified index in a sequence or a default value if the index is out of range.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `index` | `number` | The zero-based index of the element to retrieve. |

#### Returns

`undefined` \| `TSource`

`null` if the index is outside the bounds of the source sequence;
otherwise, the element at the specified position in the source sequence.

[`ElementAtOrDefault`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.elementatordefault)

___

### except

▸ **except**(`second`, `comparer?`): [`IEnumerable`][]<`TSource`\>

Produces the set difference of two sequences by using the comparer provided
or EqualityComparer to compare values.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `second` | `Iterable`<`TSource`\> | An [`IEnumerable<T>`][] whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence. |
| `comparer?` | [`IEqualityComparer`][]<`TSource`\> | An [`IEqualityComparer<T>`][] to compare values. Optional. |

#### Returns

[`IEnumerable`][]<`TSource`\>

A sequence that contains the set difference of the elements of two sequences.

[`Except`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.except)

___

### exceptBy

▸ **exceptBy**<`TKey`\>(`second`, `keySelector?`, `comparer?`): [`IEnumerable`][]<`TSource`\>

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
| `keySelector?` | [`TKeySelector`](../types.md#tkeyselector)<`TSource`, `TKey`\> |
| `comparer?` | [`IEqualityComparer`][]<`TKey`\> |

#### Returns

[`IEnumerable`][]<`TSource`\>

___

### first

▸ **first**(`predicate?`): `TSource`

Returns the first element in sequence that satisfies `predicate` otherwise
returns the first element in the sequence.

**`throws`** `InvalidOperationException` - No elements in Iteration matching predicate

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate?` | (`x`: `TSource`) => `boolean` | A function to test each element for a condition. Optional. |

#### Returns

`TSource`

The first element in the sequence
or the first element that passes the test in the specified predicate function.

[`First`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.first)

___

### firstOrDefault

▸ **firstOrDefault**(`predicate?`): `undefined` \| `TSource`

Returns first element in sequence that satisfies predicate otherwise
returns the first element in the sequence. Returns null if no value found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate?` | (`x`: `TSource`) => `boolean` | A function to test each element for a condition. Optional. |

#### Returns

`undefined` \| `TSource`

The first element in the sequence
or the first element that passes the test in the specified predicate function.
Returns `null` if no value found.

[`FirstOrDefault`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.firstordefault)

___

### forEach

▸ **forEach**<`TResult`\>(`action`): [`IEnumerable`][]<`TResult`\>

Performs a specified action on each element of the Iterable<TSource>

#### Type parameters

| Name |
| :------ |
| `TResult` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `action` | (`x`: `TSource`) => `TResult` | The action to take an each element |

#### Returns

[`IEnumerable`][]<`TResult`\>

A new [`IEnumerable<TResult>`][] that executes the action lazily as you iterate.

___

### groupBy

▸ **groupBy**<`TKey`, `TResult`\>(`keySelector`, `resultSelector?`, `comparer?`): [`IEnumerable`][]<`TResult`\>

Groups the elements of a sequence according to a specified key selector function.

#### Type parameters

| Name |
| :------ |
| `TKey` |
| `TResult` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `keySelector` | [`TKeySelector`](../types.md#tkeyselector)<`TSource`, `TKey`\> | A function to extract the key for each element. |
| `resultSelector?` | [`TResultSelector`](../types.md#tresultselector)<`TKey`, `TSource`, `TResult`\> \| [`IEqualityComparer`][]<`TKey`\> | - |
| `comparer?` | [`IEqualityComparer`][]<`TSource`\> | - |

#### Returns

[`IEnumerable`][]<`TResult`\>

An IEnumerable<IGrouping<TKey, TSource>>
where each [`IGrouping<TKey,TElement>`](igrouping.md) object contains a sequence of objects and a key.

[`GroupBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupby)

▸ **groupBy**<`TKey`, `TElement`, `TResult`\>(`keySelector`, `elementSelector`, `resultSelector?`, `comparer?`): [`IEnumerable`][]<`TResult`\>

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
| `keySelector` | [`TKeySelector`](../types.md#tkeyselector)<`TSource`, `TKey`\> | A function to extract the key for each element. |
| `elementSelector` | [`TElementSelector`](../types.md#telementselector)<`TSource`, `TElement`\> | - |
| `resultSelector?` | [`TResultSelector`](../types.md#tresultselector)<`TKey`, `TElement`, `TResult`\> | - |
| `comparer?` | [`IEqualityComparer`][]<`TSource`\> | An [`IEqualityComparer<T>`][] to compare keys. |

#### Returns

[`IEnumerable`][]<`TResult`\>

___

### groupByGrouped

▸ **groupByGrouped**<`TKey`\>(`keySelector`): [`IEnumerable`][]<[`IGrouping`](Interfaces.IGrouping.md)<`TKey`, `TSource`\>\>

#### Type parameters

| Name |
| :------ |
| `TKey` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `keySelector` | [`TKeySelector`](../types.md#tkeyselector)<`TSource`, `TKey`\> |

#### Returns

[`IEnumerable`][]<[`IGrouping`](igrouping.md)<`TKey`, `TSource`\>\>

▸ **groupByGrouped**<`TKey`, `TElement`\>(`keySelector`, `elementSelector`): [`IEnumerable`][]<[`IGrouping`](igrouping.md)<`TKey`, `TSource`\>\>

#### Type parameters

| Name |
| :------ |
| `TKey` |
| `TElement` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `keySelector` | [`TKeySelector`](../types.md#tkeyselector)<`TSource`, `TKey`\> |
| `elementSelector` | [`TElementSelector`](../types.md#telementselector)<`TSource`, `TElement`\> |

#### Returns

[`IEnumerable`][]<[`IGrouping`](igrouping.md)<`TKey`, `TSource`\>\>

▸ **groupByGrouped**<`TKey`, `TElement`\>(`keySelector`, `elementSelector`, `comparer?`): [`IEnumerable`][]<[`IGrouping`](igrouping.md)<`TKey`, `TSource`\>\>

#### Type parameters

| Name |
| :------ |
| `TKey` |
| `TElement` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `keySelector` | [`TKeySelector`](../types.md#tkeyselector)<`TSource`, `TKey`\> |
| `elementSelector` | [`TElementSelector`](../types.md#telementselector)<`TSource`, `TElement`\> |
| `comparer?` | [`IEqualityComparer`][]<`TKey`\> |

#### Returns

[`IEnumerable`][]<[`IGrouping`](igrouping.md)<`TKey`, `TSource`\>\>

___

### groupJoin

▸ **groupJoin**<`TInner`, `TKey`, `TResult`\>(`inner`, `outerKeySelector`, `innerKeySelector`, `resultSelector`, `comparer?`): [`IEnumerable`][]<`TResult`\>

Correlates the elements of two sequences based on matching keys.
A specified [`IEqualityComparer<T>`][] is used to compare keys or the strict equality comparer.

#### Type parameters

| Name |
| :------ |
| `TInner` |
| `TKey` |
| `TResult` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `inner` | `Iterable`<`TInner`\> | The sequence to join to the first sequence. |
| `outerKeySelector` | [`TKeySelector`](../types.md#tkeyselector)<`TSource`, `TKey`\> | A function to extract the join key from each element of the first sequence. |
| `innerKeySelector` | [`TKeySelector`](../types.md#tkeyselector)<`TInner`, `TKey`\> | A function to extract the join key from each element of the second sequence. |
| `resultSelector` | [`TResultSelector`](../types.md#tresultselector)<`TKey`, `TInner`, `TResult`\> | A function to create a result element from two matching elements. |
| `comparer?` | [`IEqualityComparer`][]<`TKey`\> | An [`IEqualityComparer<T>`][] to hash and compare keys. Optional. |

#### Returns

[`IEnumerable`][]<`TResult`\>

An [`IEnumerable<T>`][] that has elements of type TResult that
are obtained by performing an inner join on two sequences.

[`GroupJoin`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupjoin)

___

### intersect

▸ **intersect**(`second`, `comparer?`): [`IEnumerable`][]<`TSource`\>

Produces the set intersection of two sequences by using the specified [`IEqualityComparer<T>`][] to compare values.
If no comparer is selected, uses the StrictEqualityComparer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `second` | `Iterable`<`TSource`\> | An Iterable<T> whose distinct elements that also appear in the first sequence will be returned. |
| `comparer?` | [`IEqualityComparer`][]<`TSource`\> | An [`IEqualityComparer<T>`][] to compare values. Optional. |

#### Returns

[`IEnumerable`][]<`TSource`\>

A sequence that contains the elements that form the set intersection of two sequences.

[`Intersect`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.intersect)

___

### intersectBy

▸ **intersectBy**<`TKey`\>(`second`, `keySelector?`, `comparer?`): [`IEnumerable`][]<`TSource`\>

Produces the set intersection of two sequences according to a specified key selector function.

[`IntersectBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.intersectby)

#### Type parameters

| Name |
| :------ |
| `TKey` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `second` | `Iterable`<`TKey`\> |
| `keySelector?` | [`TKeySelector`](../types.md#tkeyselector)<`TSource`, `TKey`\> |
| `comparer?` | [`IEqualityComparer`][]<`TKey`\> |

#### Returns

[`IEnumerable`][]<`TSource`\>

___

### join

▸ **join**<`TInner`, `TKey`, `TResult`\>(`inner`, `outerKeySelector`, `innerKeySelector`, `resultSelector`, `comparer?`): [`IEnumerable`][]<`TResult`\>

Correlates the elements of two sequences based on matching keys. A specified [`IEqualityComparer<T>`][] is used to compare keys.

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
| `inner` | `Iterable`<`TInner`\> |
| `outerKeySelector` | [`TKeySelector`](../types.md#tkeyselector)<`TSource`, `TKey`\> |
| `innerKeySelector` | [`TKeySelector`](../types.md#tkeyselector)<`TInner`, `TKey`\> |
| `resultSelector` | [`TResultSelectorJoin`](../types.md#tresultselectorjoin)<`TSource`, `TInner`, `TResult`\> |
| `comparer?` | [`IEqualityComparer`][]<`TKey`\> |

#### Returns

[`IEnumerable`][]<`TResult`\>

___

### last

▸ **last**(`predicate?`): `TSource`

Returns the last element of a sequence.
If predicate is specified, the last element of a sequence that satisfies a specified `condition`.

**`throws`** `InvalidOperationException` if the `source` sequence is `empty`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate?` | (`x`: `TSource`) => `boolean` | A function to test each element for a condition. Optional. |

#### Returns

`TSource`

The value at the last position in the source sequence
or the last element in the sequence that passes the test in the specified predicate function.

[`Last`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.last)

___

### lastOrDefault

▸ **lastOrDefault**(`predicate?`): ``null`` \| `TSource`

Returns the last element of a sequence.
If predicate is specified, the last element of a sequence that satisfies a specified condition.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate?` | (`x`: `TSource`) => `boolean` | A function to test each element for a condition. Optional. |

#### Returns

``null`` \| `TSource`

The value at the last position in the source sequence
or the last element in the sequence that passes the test in the specified predicate function.

[`LastOrDefault`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.lastordefault)

___

### max

▸ **max**(`comparer?`): `number`

Invokes a transform function on each element of a sequence and returns the maximum value.

**`throws`** `InvalidOperationException` - if source contains no elements.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `comparer?` | [`ICompareTo`](icompareto.md)<`number`\> | A compare function to apply to each element. |

#### Returns

`number`

The maximum value in the sequence.

[`Max`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.max)

___

### maxBy

▸ **maxBy**<`TKey`\>(`keySelector?`, `comparer?`): `TSource`

Returns the maximum value in a generic sequence according to a specified key selector function and key comparer.

[`MaxBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.maxby)

#### Type parameters

| Name |
| :------ |
| `TKey` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `keySelector?` | [`TKeySelector`](../types.md#tkeyselector)<`TSource`, `TKey`\> |
| `comparer?` | [`ICompareTo`](icompareto.md)<`TKey`\> |

#### Returns

`TSource`

___

### min

▸ **min**(`comparer?`): `number`

Invokes a transform function on each element of a sequence and returns the minimum value.

**`throws`** `InvalidOperationException` - if source contains no elements.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `comparer?` | [`ICompareTo`](icompareto.md)<`number`\> | A compare function to apply to each element. |

#### Returns

`number`

The minimum value in the sequence.

[`Min`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.min)

___

### minBy

▸ **minBy**<`TKey`\>(`keySelector?`, `comparer?`): `TSource`

Returns the minimum value in a generic sequence according to a specified key selector function and key comparer.

[`MinBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.minby)

#### Type parameters

| Name |
| :------ |
| `TKey` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `keySelector?` | [`TKeySelector`](../types.md#tkeyselector)<`TSource`, `TKey`\> |
| `comparer?` | [`ICompareTo`](icompareto.md)<`TKey`\> |

#### Returns

`TSource`

___

### ofType

▸ **ofType**<`TType`\>(`type`): [`IEnumerable`][]<`TType`\>

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

[`IEnumerable`][]<`TType`\>

Values that match the type string or are instance of type

[`OfType`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.oftype)

___

### orderBy

▸ **orderBy**<`TKey`\>(`keySelector?`, `comparer?`): [`IOrderedEnumerable`](iorderedenumerable.md)<`TSource`\>

Sorts the elements of a sequence in ascending order by using a specified or default comparer.

#### Type parameters

| Name |
| :------ |
| `TKey` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `keySelector?` | (`x`: `TSource`) => `TKey` | A function to extract a key from an element. |
| `comparer?` | [`ICompareTo`](icompareto.md)<`TKey`\> | An [`ICompareTo<T>`](icompareto.md) to compare keys. Optional. |

#### Returns

[`IOrderedEnumerable`](iorderedenumerable.md)<`TSource`\>

An [`IOrderedEnumerable<TElement>`](iorderedenumerable.md) whose elements are sorted according to a key.

[`OrderBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.orderby)

___

### orderByDescending

▸ **orderByDescending**<`TKey`\>(`keySelector?`, `comparer?`): [`IOrderedEnumerable`](iorderedenumerable.md)<`TSource`\>

Sorts the elements of a sequence in descending order by using a specified or default comparer.

#### Type parameters

| Name |
| :------ |
| `TKey` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `keySelector?` | (`x`: `TSource`) => `TKey` | A function to extract a key from an element. |
| `comparer?` | [`ICompareTo`](icompareto.md)<`TKey`\> | An [`ICompareTo<T>`](icompareto.md) to compare keys. Optional. |

#### Returns

[`IOrderedEnumerable`](iorderedenumerable.md)<`TSource`\>

An [`IOrderedEnumerable<TElement>`](iorderedenumerable.md) whose elements are sorted in descending order according to a key.

[`OrderByDescending`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.orderbydescending)

___

### prepend

▸ **prepend**(`item`): [`IEnumerable`][]<`TSource`\>

Adds a value to the beginning of the sequence.

[`Prepend`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.prepend)

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `TSource` |

#### Returns

[`IEnumerable`][]<`TSource`\>

___

### reverse

▸ **reverse**(): [`IEnumerable`][]<`TSource`\>

Inverts the order of the elements in a sequence.

#### Returns

[`IEnumerable`][]<`TSource`\>

A sequence whose elements correspond to those of the input sequence in reverse order.

[`Reverse`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.reverse)

___

### select

▸ **select**<`TResult`\>(`selector`): [`IEnumerable`][]<`TResult`\>

Projects each element of a sequence into a new form.

#### Type parameters

| Name |
| :------ |
| `TResult` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | (`x`: `TSource`, `index?`: `number`) => `TResult` | A transform function to apply to each element. |

#### Returns

[`IEnumerable`][]<`TResult`\>

- An [`IEnumerable<T>`][] whose elements are the result of invoking the transform function on each element of source.
- 
[`Select`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.select)

___

### selectMany

▸ **selectMany**<`TCollection`, `TResult`\>(`selector?`, `resultSelector?`): [`IEnumerable`][]<`TResult`\>

Projects each element of a sequence to an [`IEnumerable<T>`][] and flattens the resulting sequences into one sequence.

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

[`IEnumerable`][]<`TResult`\>

An [`IEnumerable<T>`][] whose elements are the result of invoking the
one-to-many transform function on each element of the input sequence.

[`SelectMany`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.selectmany)

___

### sequenceEqual

▸ **sequenceEqual**(`second`, `comparer?`): `boolean`

Determines whether or not two sequences are `equal`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `second` | `Iterable`<`TSource`\> | second iterable |
| `comparer?` | [`IEqualityComparer`][]<`TSource`\> | Compare function to use, by default is StrictEqualityComparer |

#### Returns

`boolean`

Whether or not the two iterations are equal

[`SequenceEqual`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sequenceequal)

___

### single

▸ **single**(`predicate?`): `TSource`

Returns the only element of a sequence that satisfies a specified condition (if specified), and throws an exception if more than one such element exists.

**`throws`** `InvalidOperationException` - if no element satisfies the `condition` in predicate. OR
More than one element satisfies the condition in predicate. OR
The source sequence is empty.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate?` | (`x`: `TSource`) => `boolean` | A function to test an element for a condition. (Optional) |

#### Returns

`TSource`

The single element of the input sequence that satisfies a condition.

[`Single`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.single)

___

### singleOrDefault

▸ **singleOrDefault**(`predicate?`): ``null`` \| `TSource`

If predicate is specified returns the only element of a sequence that satisfies a specified condition,
ootherwise returns the only element of a sequence. Returns a default value if no such element exists.

**`throws`** `InvalidOperationException` - If predicate is specified more than one element satisfies the condition in predicate,
otherwise the input sequence contains more than one element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate?` | (`x`: `TSource`) => `boolean` | A function to test an element for a condition. Optional. |

#### Returns

``null`` \| `TSource`

The single element of the input sequence that satisfies the condition,
or null if no such element is found.

[`SingleOrDefault`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.singleordefault)

___

### skip

▸ **skip**(`count`): [`IEnumerable`][]<`TSource`\>

Bypasses a specified number of elements in a sequence and then returns the remaining elements.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `count` | `number` | The number of elements to skip before returning the remaining elements. |

#### Returns

[`IEnumerable`][]<`TSource`\>

An [`IEnumerable<T>`][] that contains the elements that occur after the specified index in the input sequence.

[`Skip`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skip)

___

### skipLast

▸ **skipLast**(`count`): [`IEnumerable`][]<`TSource`\>

Returns a new enumerable collection that contains the elements from `source` with the last `count` elements of the source collection omitted.

[`SkipLast`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skiplast)

#### Parameters

| Name | Type |
| :------ | :------ |
| `count` | `number` |

#### Returns

[`IEnumerable`][]<`TSource`\>

___

### skipWhile

▸ **skipWhile**(`predicate`): [`IEnumerable`][]<`TSource`\>

Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
The element's index is used in the logic of the predicate function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate` | (`x`: `TSource`, `index`: `number`) => `boolean` | A function to test each source element for a condition; the second parameter of the function represents the index of the source element. |

#### Returns

[`IEnumerable`][]<`TSource`\>

An [`IEnumerable<T>`][] that contains the elements from the input sequence starting at the first element
in the linear series that does not pass the test specified by predicate.

[`SkipWhile`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skipwhile)

___

### sum

▸ **sum**(`selector?`): `string` \| `number`

Computes the sum of the sequence of numeric values that are obtained by invoking a transform function
on each element of the input sequence.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector?` | (`x`: `TSource`) => `string` \| `number` | A transform function to apply to each element. |

#### Returns

`string` \| `number`

The sum of the projected values.

[`Sum`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sum)

___

### take

▸ **take**(`count`): [`IEnumerable`][]<`TSource`\>

Returns a specified number of contiguous elements from the start of a sequence.

#### Parameters

| Name | Type |
| :------ | :------ |
| `count` | `number` |

#### Returns

[`IEnumerable`][]<`TSource`\>

An [`IEnumerable<T>`][] that contains the specified number of elements from the start of the input sequence.

[`Take`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.take)

___

### takeLast

▸ **takeLast**(`count`): [`IEnumerable`][]<`TSource`\>

Returns a new enumerable collection that contains the last `count` elements from `source`.

[`TakeLast`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.takelast)

#### Parameters

| Name | Type |
| :------ | :------ |
| `count` | `number` |

#### Returns

[`IEnumerable`][]<`TSource`\>

___

### takeWhile

▸ **takeWhile**(`predicate`): [`IEnumerable`][]<`TSource`\>

Returns elements from a sequence as long as a specified condition is true.
The element's index is used in the logic of the predicate function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate` | (`element`: `TSource`, `index`: `number`) => `boolean` | A function to test each source element for a condition; the second parameter of the function represents the index of the source element. |

#### Returns

[`IEnumerable`][]<`TSource`\>

An [`IEnumerable<T>`][] that contains elements from the input sequence
that occur before the element at which the test no longer passes.

[`TakeWhile`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.takewhile)

___

### toArray

▸ **toArray**(): `TSource`[]

Creates an array from a [`IEnumerable<T>`][].

#### Returns

`TSource`[]

An array of elements

[`ToArray`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.toarray)

___

### toMap

▸ **toMap**<`TKey`\>(`selector`): `Map`<`TKey`, `TSource`[]\>

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

`Map`<`TKey`, `TSource`[]\>

Map<K, V[]>

[`ToDictionary`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.todictionary)

___

### toSet

▸ **toSet**(): `Set`<`TSource`\>

Converts the iteration to a Set

#### Returns

`Set`<`TSource`\>

Set containing the iteration values

___

### union

▸ **union**(`second`, `comparer?`): [`IEnumerable`][]<`TSource`\>

Produces the set union of two sequences by using scrict equality comparison or a specified [`IEqualityComparer<T>`][].

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `second` | `Iterable`<`TSource`\> | An Iterable<T> whose distinct elements form the second set for the union. |
| `comparer?` | [`IEqualityComparer`][]<`TSource`\> | The [`IEqualityComparer<T>`][] to compare values. Optional. |

#### Returns

[`IEnumerable`][]<`TSource`\>

An [`IEnumerable<T>`][] that contains the elements from both input sequences, excluding duplicates.

[`Union`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.union)

___

### unionBy

▸ **unionBy**<`TKey`\>(`second`, `keySelector?`, `comparer?`): [`IEnumerable`][]<`TSource`\>

Produces the set union of two sequences according to a specified key selector function.

[`UnionBy`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.unionby)

#### Type parameters

| Name |
| :------ |
| `TKey` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `second` | `Iterable`<`TKey`\> |
| `keySelector?` | [`TKeySelector`](../types.md#tkeyselector)<`TSource`, `TKey`\> |
| `comparer?` | [`IEqualityComparer`][]<`TKey`\> |

#### Returns

[`IEnumerable`][]<`TSource`\>

___

### where

▸ **where**(`predicate`): [`IEnumerable`][]<`TSource`\>

Filters a sequence of values based on a predicate.
Each element's index is used in the logic of the predicate function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate` | (`x`: `TSource`, `index`: `number`) => `boolean` | A function to test each source element for a condition; the second parameter of the function represents the index of the source element. |

#### Returns

[`IEnumerable`][]<`TSource`\>

An [`IEnumerable<T>`][] that contains elements from the input sequence that satisfy the condition.

[`Where`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.where)

___

### zip

▸ **zip**<`TSecond`\>(`second`): [`IEnumerable`][]<[`TSource`, `TSecond`]\>

Creates a tuple of corresponding elements of two sequences, producing a sequence of the results.

#### Type parameters

| Name |
| :------ |
| `TSecond` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `second` | `Iterable`<`TSecond`\> | The second sequence to merge. |

#### Returns

[`IEnumerable`][]<[`TSource`, `TSecond`]\>

An [`IEnumerable<[T, V]>`][] that contains merged elements of two input sequences.

[`zip`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.zip)

▸ **zip**<`TSecond`, `TResult`\>(`second`, `resultSelector`): [`IEnumerable`][]<`TResult`\>

Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.

#### Type parameters

| Name |
| :------ |
| `TSecond` |
| `TResult` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `second` | `Iterable`<`TSecond`\> | The second sequence to merge. |
| `resultSelector` | (`x`: `TSource`, `y`: `TSecond`) => `TResult` | A function that specifies how to merge the elements from the two sequences. |

#### Returns

[`IEnumerable`][]<`TResult`\>

An [`IEnumerable<TResult>`][] that contains merged elements of two input sequences.

▸ **zip**<`TSecond`, `TThird`, `TResult`\>(`second`, `third`, `resultSelector`): [`IEnumerable`][]<`TResult`\>

#### Type parameters

| Name |
| :------ |
| `TSecond` |
| `TThird` |
| `TResult` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `second` | `Iterable`<`TSecond`\> |
| `third` | `Iterable`<`TThird`\> |
| `resultSelector` | (`x`: `TSource`, `y`: `TSecond`, `z`: `TThird`) => `TResult` |

#### Returns

[`IEnumerable`][]<`TResult`\>



[`IEnumerable`]: ienumerable.md
[`IEqualityComparer<T>`]: iequalitycomparer.md