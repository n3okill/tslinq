[@n3okill/tslinq](../README.md) / [Interfaces][] / DefaultAsyncCompareTo

# Class: DefaultAsyncCompareTo<A\>

[Interfaces][].DefaultAsyncCompareTo

## Type parameters

| Name | Type     |
| :--- | :------- |
| `A`  | `number` |

## Hierarchy

- [`IAsyncCompareTo`][]<`A`\>

  ↳ **`DefaultAsyncCompareTo`**

## Table of contents

### Constructors

- [constructor](#constructor)

### Methods

- [CompareTo](#compareto)

## Constructors

### constructor

• **new DefaultAsyncCompareTo**<`A`\>()

#### Type parameters

| Name | Type     |
| :--- | :------- |
| `A`  | `number` |

#### Inherited from

[IAsyncCompareTo](iasynccompareto.md).[constructor](iasynccompareto.md#constructor)

## Methods

### CompareTo

▸ **CompareTo**(`x`, `y`): `Promise`<`0` \| `1` \| `-1`\>

#### Parameters

| Name | Type |
| :--- | :--- |
| `x`  | `A`  |
| `y`  | `A`  |

#### Returns

`Promise`<`0` \| `1` \| `-1`\>

#### Overrides

[`IAsyncCompareTo`][].[CompareTo](iasynccompareto.md#compareto)

[interfaces]: ../interfaces.md
[`iasynccompareto`]: iasynccompareto.md
