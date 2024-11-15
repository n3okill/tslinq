[@n3okill/tslinq](../README.md) / [Interfaces][] / DefaultAsyncEqualityComparer

# Class: DefaultAsyncEqualityComparer<T\>

[Interfaces][].DefaultAsyncEqualityComparer

## Type parameters

| Name |
| :--- |
| `T`  |

## Hierarchy

- [`IAsyncEqualityComparer`][]<`T`\>

  ↳ **`DefaultAsyncEqualityComparer`**

## Table of contents

### Constructors

- [constructor](#constructor)

### Methods

- [Equals](#equals)

## Constructors

### constructor

• **new DefaultAsyncEqualityComparer**<`T`\>()

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Inherited from

[`IAsyncEqualityComparer`][].[constructor](iasyncequalitycomparer.md#constructor)

## Methods

### Equals

▸ **Equals**(`x`, `y`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :--- | :--- |
| `x`  | `T`  |
| `y`  | `T`  |

#### Returns

`Promise`<`boolean`\>

#### Overrides

[`IAsyncEqualityComparer`][].[Equals](IAsyncEqualityComparer.md#equals)

[interfaces]: ../interfaces.md
[`IAsyncEqualityComparer`]: iasyncequalitycomparer.md
