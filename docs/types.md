[@n3okill/tslinq](../README.md) / Types

# Namespace: Types

## Table of contents

- [Table of contents](#table-of-contents)
  - [AggregateFunctionType](#aggregatefunctiontype)
  - [AggregateFunctionTypeAsync](#aggregatefunctiontypeasync)
  - [AggregateResultType](#aggregateresulttype)
  - [AggregateResultTypeAsync](#aggregateresulttypeasync)
  - [SelectManyResultSelector](#selectmanyresultselector)
  - [SelectManyResultSelectorAsync](#selectmanyresultselectorasync)
  - [SelectManySelector](#selectmanyselector)
  - [SelectManySelectorAsync](#selectmanyselectorasync)
  - [TElementSelector](#telementselector)
  - [TElementSelectorAsync](#telementselectorasync)
  - [TIAsyncEqualityComparer](#tiasyncequalitycomparer)
  - [TICompareTo](#ticompareto)
  - [TKeySelector](#tkeyselector)
  - [TKeySelectorAsync](#tkeyselectorasync)
  - [TResultSelector](#tresultselector)
  - [TResultSelectorAsync](#tresultselectorasync)
  - [TResultSelectorJoin](#tresultselectorjoin)
  - [TResultSelectorJoinAsync](#tresultselectorjoinasync)
  - [ZipResultSelectorAsync](#zipresultselectorasync)

#### AggregateFunctionType

Ƭ **AggregateFunctionType**<`TSource`, `TAccumulate`\>: (`result`: `TSource` \| `TAccumulate`, `current`: `TSource`) => `TAccumulate`

##### Type parameters

| Name          |
| :------------ |
| `TSource`     |
| `TAccumulate` |

##### Type declaration

▸ (`result`, `current`): `TAccumulate`

###### Parameters

| Name      | Type                       |
| :-------- | :------------------------- |
| `result`  | `TSource` \| `TAccumulate` |
| `current` | `TSource`                  |

###### Returns

`TAccumulate`

---

#### AggregateFunctionTypeAsync

Ƭ **AggregateFunctionTypeAsync**<`TSource`, `TAccumulate`\>: (`result`: `TSource` \| `TAccumulate`, `current`: `TSource`) => `TAccumulate` \| `Promise`<`TAccumulate`\>

##### Type parameters

| Name          |
| :------------ |
| `TSource`     |
| `TAccumulate` |

##### Type declaration

▸ (`result`, `current`): `TAccumulate` \| `Promise`<`TAccumulate`\>

###### Parameters

| Name      | Type                       |
| :-------- | :------------------------- |
| `result`  | `TSource` \| `TAccumulate` |
| `current` | `TSource`                  |

###### Returns

`TAccumulate` \| `Promise`<`TAccumulate`\>

---

#### AggregateResultType

Ƭ **AggregateResultType**<`TAccumulate`, `TResult`\>: (`result`: `TAccumulate`) => `TResult`

##### Type parameters

| Name          |
| :------------ |
| `TAccumulate` |
| `TResult`     |

##### Type declaration

▸ (`result`): `TResult`

###### Parameters

| Name     | Type          |
| :------- | :------------ |
| `result` | `TAccumulate` |

###### Returns

`TResult`

---

#### AggregateResultTypeAsync

Ƭ **AggregateResultTypeAsync**<`TAccumulate`, `TResult`\>: (`result`: `TAccumulate`) => `TResult` \| `Promise`<`TResult`\>

##### Type parameters

| Name          |
| :------------ |
| `TAccumulate` |
| `TResult`     |

##### Type declaration

▸ (`result`): `TResult` \| `Promise`<`TResult`\>

###### Parameters

| Name     | Type          |
| :------- | :------------ |
| `result` | `TAccumulate` |

###### Returns

`TResult` \| `Promise`<`TResult`\>

---

#### SelectManyResultSelector

Ƭ **SelectManyResultSelector**<`T`, `TCollection`, `TResult`\>: (`x`: `T`, `y`: `TCollection`) => `TResult`

##### Type parameters

| Name          |
| :------------ |
| `T`           |
| `TCollection` |
| `TResult`     |

##### Type declaration

▸ (`x`, `y`): `TResult`

###### Parameters

| Name | Type          |
| :--- | :------------ |
| `x`  | `T`           |
| `y`  | `TCollection` |

###### Returns

`TResult`

---

#### SelectManyResultSelectorAsync

Ƭ **SelectManyResultSelectorAsync**<`T`, `TCollection`, `TResult`\>: (`x`: `T`, `y`: `TCollection`) => `TResult` \| `Promise`<`TResult`\>

##### Type parameters

| Name          |
| :------------ |
| `T`           |
| `TCollection` |
| `TResult`     |

##### Type declaration

▸ (`x`, `y`): `TResult` \| `Promise`<`TResult`\>

###### Parameters

| Name | Type          |
| :--- | :------------ |
| `x`  | `T`           |
| `y`  | `TCollection` |

###### Returns

`TResult` \| `Promise`<`TResult`\>

---

#### SelectManySelector

Ƭ **SelectManySelector**<`T`, `TCollection`\>: (`x`: `T`, `y`: `number`) => `Iterable`<`TCollection`\>

##### Type parameters

| Name          |
| :------------ |
| `T`           |
| `TCollection` |

##### Type declaration

▸ (`x`, `y`): `Iterable`<`TCollection`\>

###### Parameters

| Name | Type     |
| :--- | :------- |
| `x`  | `T`      |
| `y`  | `number` |

###### Returns

`Iterable`<`TCollection`\>

---

#### SelectManySelectorAsync

Ƭ **SelectManySelectorAsync**<`T`, `TCollection`\>: (`x`: `T`, `y`: `number`) => `AsyncIterable`<`TCollection`\> \| `Promise`<`AsyncIterable`<`TCollection`\>\> \| `Iterable`<`TCollection`\> \| `Promise`<`Iterable`<`TCollection`\>\>

##### Type parameters

| Name          |
| :------------ |
| `T`           |
| `TCollection` |

##### Type declaration

▸ (`x`, `y`): `AsyncIterable`<`TCollection`\> \| `Promise`<`AsyncIterable`<`TCollection`\>\> \| `Iterable`<`TCollection`\> \| `Promise`<`Iterable`<`TCollection`\>\>

###### Parameters

| Name | Type     |
| :--- | :------- |
| `x`  | `T`      |
| `y`  | `number` |

###### Returns

`AsyncIterable`<`TCollection`\> \| `Promise`<`AsyncIterable`<`TCollection`\>\> \| `Iterable`<`TCollection`\> \| `Promise`<`Iterable`<`TCollection`\>\>

---

#### TElementSelector

Ƭ **TElementSelector**<`T`, `TElement`\>: (`x`: `T`) => `TElement`

##### Type parameters

| Name       |
| :--------- |
| `T`        |
| `TElement` |

##### Type declaration

▸ (`x`): `TElement`

###### Parameters

| Name | Type |
| :--- | :--- |
| `x`  | `T`  |

###### Returns

`TElement`

---

#### TElementSelectorAsync

Ƭ **TElementSelectorAsync**<`T`, `TElement`\>: (`x`: `T`) => `TElement` \| `Promise`<`TElement`\>

##### Type parameters

| Name       |
| :--------- |
| `T`        |
| `TElement` |

##### Type declaration

▸ (`x`): `TElement` \| `Promise`<`TElement`\>

###### Parameters

| Name | Type |
| :--- | :--- |
| `x`  | `T`  |

###### Returns

`TElement` \| `Promise`<`TElement`\>

---

#### TIAsyncEqualityComparer

Ƭ **TIAsyncEqualityComparer**<`T`\>: [`IEqualityComparer`](../classes/Interfaces.IEqualityComparer.md)<`T`\> \| [`IAsyncEqualityComparer`](../classes/Interfaces.IAsyncEqualityComparer.md)<`T`\>

##### Type parameters

| Name |
| :--- |
| `T`  |

---

#### TICompareTo

Ƭ **TICompareTo**<`T`\>: [`ICompareTo`](../classes/Interfaces.ICompareTo.md)<`T`\> \| [`IAsyncCompareTo`](../classes/Interfaces.IAsyncCompareTo.md)<`T`\>

##### Type parameters

| Name |
| :--- |
| `T`  |

---

#### TKeySelector

Ƭ **TKeySelector**<`T`, `TKey`\>: (`x`: `T`) => `TKey`

##### Type parameters

| Name   |
| :----- |
| `T`    |
| `TKey` |

##### Type declaration

▸ (`x`): `TKey`

###### Parameters

| Name | Type |
| :--- | :--- |
| `x`  | `T`  |

###### Returns

`TKey`

---

#### TKeySelectorAsync

Ƭ **TKeySelectorAsync**<`T`, `TKey`\>: (`x`: `T`) => `TKey` \| `Promise`<`TKey`\>

##### Type parameters

| Name   |
| :----- |
| `T`    |
| `TKey` |

##### Type declaration

▸ (`x`): `TKey` \| `Promise`<`TKey`\>

###### Parameters

| Name | Type |
| :--- | :--- |
| `x`  | `T`  |

###### Returns

`TKey` \| `Promise`<`TKey`\>

---

#### TResultSelector

Ƭ **TResultSelector**<`TKey`, `TElement`, `TResult`\>: (`x`: `TKey`, `y`: [`IEnumerable`](../interfaces/Interfaces.IEnumerable.md)<`TElement`\>) => `TResult`

##### Type parameters

| Name       |
| :--------- |
| `TKey`     |
| `TElement` |
| `TResult`  |

##### Type declaration

▸ (`x`, `y`): `TResult`

###### Parameters

| Name | Type                                                                  |
| :--- | :-------------------------------------------------------------------- |
| `x`  | `TKey`                                                                |
| `y`  | [`IEnumerable`](../interfaces/Interfaces.IEnumerable.md)<`TElement`\> |

###### Returns

`TResult`

---

#### TResultSelectorAsync

Ƭ **TResultSelectorAsync**<`TKey`, `TElement`, `TResult`\>: (`x`: `TKey`, `y`: [`IAsyncEnumerable`](../interfaces/Interfaces.IAsyncEnumerable.md)<`TElement`\> \| [`IEnumerable`](../interfaces/Interfaces.IEnumerable.md)<`TElement`\>) => `TResult` \| `Promise`<`TResult`\>

##### Type parameters

| Name       |
| :--------- |
| `TKey`     |
| `TElement` |
| `TResult`  |

##### Type declaration

▸ (`x`, `y`): `TResult` \| `Promise`<`TResult`\>

###### Parameters

| Name | Type |
| :-- | :-- |
| `x` | `TKey` |
| `y` | [`IAsyncEnumerable`](../interfaces/Interfaces.IAsyncEnumerable.md)<`TElement`\> \| [`IEnumerable`](../interfaces/Interfaces.IEnumerable.md)<`TElement`\> |

###### Returns

`TResult` \| `Promise`<`TResult`\>

---

#### TResultSelectorJoin

Ƭ **TResultSelectorJoin**<`TKey`, `TElement`, `TResult`\>: (`x`: `TKey`, `y`: `TElement`) => `TResult`

##### Type parameters

| Name       |
| :--------- |
| `TKey`     |
| `TElement` |
| `TResult`  |

##### Type declaration

▸ (`x`, `y`): `TResult`

###### Parameters

| Name | Type       |
| :--- | :--------- |
| `x`  | `TKey`     |
| `y`  | `TElement` |

###### Returns

`TResult`

---

#### TResultSelectorJoinAsync

Ƭ **TResultSelectorJoinAsync**<`TKey`, `TElement`, `TResult`\>: (`x`: `TKey`, `y`: `TElement`) => `TResult` \| `Promise`<`TResult`\>

##### Type parameters

| Name       |
| :--------- |
| `TKey`     |
| `TElement` |
| `TResult`  |

##### Type declaration

▸ (`x`, `y`): `TResult` \| `Promise`<`TResult`\>

###### Parameters

| Name | Type       |
| :--- | :--------- |
| `x`  | `TKey`     |
| `y`  | `TElement` |

###### Returns

`TResult` \| `Promise`<`TResult`\>

---

#### ZipResultSelectorAsync

Ƭ **ZipResultSelectorAsync**<`T`, `TSecond`, `TThird`, `TResult`\>: (`x`: `T`, `y`: `TSecond`, `z?`: `TThird`) => `TResult` \| `Promise`<`TResult`\>

##### Type parameters

| Name      |
| :-------- |
| `T`       |
| `TSecond` |
| `TThird`  |
| `TResult` |

##### Type declaration

▸ (`x`, `y`, `z?`): `TResult` \| `Promise`<`TResult`\>

###### Parameters

| Name | Type      |
| :--- | :-------- |
| `x`  | `T`       |
| `y`  | `TSecond` |
| `z?` | `TThird`  |

###### Returns

`TResult` \| `Promise`<`TResult`\>
