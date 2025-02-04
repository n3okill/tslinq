<!-- markdownlint-disable MD036 -->

# Class: `abstract` EqualityComparerAsync\<T\>

Abstract base class for asynchronous equality comparison operations.

## Typeparam

T - The type of elements being compared for equality.

## Remarks

Provides a standard interface for asynchronous equality comparison of two
elements. Useful when equality check may involve async operations like database
lookups.

## Example

```typescript
// Create a custom async equality comparer for complex objects
class AsyncUserEqualityComparer extends EqualityComparerAsync<User> {
  async equals(x: User, y: User): Promise<boolean> {
    const xDetails = await x.fetchDetails();
    const yDetails = await y.fetchDetails();
    return xDetails.uniqueIdentifier === yDetails.uniqueIdentifier;
  }
}
```

## Extended by

- [`DefaultEqualityComparerAsync`](DefaultEqualityComparerAsync.md)

## Accessors

### default

```typescript
const defaultEqualityComparerAsync = EqualityComparerAsync.default;
```

Gets the default async equality comparer for standard types.

**Returns**

[`DefaultEqualityComparerAsync`](DefaultEqualityComparerAsync.md)\<`T`\>

A default async comparer that uses standard equality comparison.

## Methods

### equals()

```typescript
  abstract equals(x: T, y: T): boolean | Promise<boolean>
```

Determines whether two elements are considered equal asynchronously.

**Parameters**

- `x`: The first element to compare.
- `y`: The second element to compare.

**Returns**

`boolean` | `Promise`\<`boolean`\>

A Promise resolving to a boolean indicating whether the elements are equal.
