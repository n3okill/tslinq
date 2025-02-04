<!-- markdownlint-disable MD036 -->

# Class: DefaultEqualityComparerAsync\<T\>

Default implementation of EqualityComparerAsync for standard types.

## Typeparam

T - The type of elements being compared for equality.

## Remarks

Provides standard asynchronous equality comparison using strict equality (===)
operator. Returns a Promise to maintain async interface, even though comparison
is synchronous.

## Example

```typescript
const asyncComparer = new DefaultEqualityComparerAsync();
const result = await asyncComparer.equals(5, 5); // Returns Promise<true>
const result2 = await asyncComparer.equals(5, "5"); // Returns Promise<false>
```

## Extends

- [`EqualityComparer`](EqualityComparer.md)\<`T`\>

## Constructors

### new DefaultEqualityComparerAsync()

> **new DefaultEqualityComparerAsync**\<`T`\>():
> [`DefaultEqualityComparerAsync`](DefaultEqualityComparerAsync.md)\<`T`\>

#### Returns

[`DefaultEqualityComparerAsync`](DefaultEqualityComparerAsync.md)\<`T`\>

#### Inherited from

[`EqualityComparerAsync`](EqualityComparerAsync.md).[`constructor`](EqualityComparerAsync.md#constructors)

## Methods

### equals()

```typescript
    equals(x: T, y: T): Promise<boolean>
```

Compares two values for strict equality.

**Parameters**

- `x`: he first element to compare.
- `y`: The second element to compare.

**Returns**

`Promise`\<`boolean`\> A Promise resolving to a boolean indicating whether the
values are strictly equal.

#### Overrides

[`EqualityComparerAsync`](EqualityComparerAsync.md).[`equals`](EqualityComparerAsync.md#equals)
