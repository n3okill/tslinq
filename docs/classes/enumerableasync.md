[@n3okill/tslinq](../README.md) / EnumerableAsync

# Class: EnumerableAsync<T\>

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`IAsyncEnumerable`][]<`T`\>

  ↳ **`EnumerableAsync`**

## Table of contents

### Methods
- [asEnumerableAsync](#asenumerableasync)
- [empty](#empty)
- [range](#range)
- [repeat](#repeat)

## Methods

### asEnumerableAsync

▸ `Static` **asEnumerableAsync**<`TSource`\>(`source`): [`EnumerableAsync`](enumerableasync.md)<`TSource`\>

#### Type parameters

| Name |
| :------ |
| `TSource` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | [`EnumerableAsync`](enumerableasync.md)<`TSource`\> \| `AsyncIterable`<`TSource`\> \| `Iterable`<`TSource`\> |

#### Returns

[`EnumerableAsync`](enumerableasync.md)<`TSource`\>

___

### empty

▸ `Static` **empty**<`TSource`\>(`type`): [`EnumerableAsync`](enumerableasync.md)<`TSource`\>

Returns an `empty` [`IAsyncEnumerable<T>`][] that has the specified type argument.

[`Empty`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.empty)

#### Type parameters

| Name |
| :------ |
| `TSource` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`IConstructor`](../interfaces/Interfaces.IConstructor.md)<`Iterable`<`TSource`\> \| `AsyncIterable`<`TSource`\>\> |

#### Returns

[`EnumerableAsync`](enumerableasync.md)<`TSource`\>

___

### range

▸ `Static` **range**(`start`, `count`): [`IAsyncEnumerable`][]<`string` \| `number`\>

Generates a sequence of numbers within a specified range.

[`Range`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.range)

#### Parameters

| Name | Type |
| :------ | :------ |
| `start` | `string` \| `number` |
| `count` | `number` |

#### Returns

[`IAsyncEnumerable`][]<`string` \| `number`\>

___

### repeat

▸ `Static` **repeat**<`TSource`\>(`element`, `count`): [`IAsyncEnumerable`][]<`TSource`\>

Generates a sequence that contains one repeated value.

[`Repeat`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.repeat)

#### Type parameters

| Name |
| :------ |
| `TSource` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `element` | `TSource` |
| `count` | `number` |

#### Returns

[`IAsyncEnumerable`][]<`TSource`\>



[`IAsyncEnumerable`]: ../interfaces/iasyncenumerable.md
[`IAsyncEnumerable<T>`]: ../interfaces/iasyncenumerable.md