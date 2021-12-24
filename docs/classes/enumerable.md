[@n3okill/tslinq](../README.md) / Enumerable

# Class: Enumerable<TSource\>

## Type parameters

| Name |
| :------ |
| `TSource` |

## Hierarchy

- [`IEnumerable`][]<`TSource`\>

  ↳ **`Enumerable`**

## Table of contents

### Methods

- [asEnumerable](#asenumerable)
- [empty](#empty)
- [range](#range)
- [repeat](#repeat)



## Methods

### asEnumerable

▸ `Static` **asEnumerable**<`TSource2`\>(`source`): [`Enumerable`](enumerable.md)<`TSource2`\>

#### Type parameters

| Name |
| :------ |
| `TSource2` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | [`Enumerable`](enumerable.md)<`TSource2`\> \| `Iterable`<`TSource2`\> |

#### Returns

[`Enumerable`](enumerable.md)<`TSource2`\>

___

### empty

▸ `Static` **empty**<`TSource2`\>(`type`): [`Enumerable`](enumerable.md)<`TSource2`\>

Returns an `empty` [`IEnumerable<T>`][] that has the specified type argument.

[`Empty`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.empty)

#### Type parameters

| Name |
| :------ |
| `TSource2` |


#### Returns

[`Enumerable`](enumerable.md)<`TSource2`\>

___

### range

▸ `Static` **range**(`start`, `count`): [`IEnumerable`][]<`string` \| `number`\>

Generates a sequence of numbers within a specified range.

[`Range`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.range)

#### Parameters

| Name | Type |
| :------ | :------ |
| `start` | `string` \| `number` |
| `count` | `number` |

#### Returns

[`IEnumerable`][]<`string` \| `number`\>

___

### repeat

▸ `Static` **repeat**<`TSource2`\>(`element`, `count`): [`IEnumerable`][]<`TSource2`\>

Generates a sequence that contains one repeated value.

[`Repeat`](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.repeat)

#### Type parameters

| Name |
| :------ |
| `TSource2` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `element` | `TSource2` |
| `count` | `number` |

#### Returns

[`IEnumerable`][]<`TSource2`\>



[`IEnumerable`]: ../interfaces/ienumerable.md
[`IEnumerable<T>`]: ../interfaces/ienumerable.md