<!-- markdownlint-disable MD036 -->

# Class: `abstract` EqualityComparer\<T\>

Abstract base class for synchronous equality comparison operations.

## Typeparam

T - The type of elements being compared for equality.

## Remarks

Provides a standard interface for comparing two elements of the same type for
equality. Implementations can define custom equality logic for different types.

## Example

```typescript
// Create a custom equality comparer for complex objects
class PersonEqualityComparer extends EqualityComparer<Person> {
  equals(x: Person, y: Person): boolean {
    return x.id === y.id; // Compare by unique identifier
  }
}
```

## Extended by

- [`DefaultEqualityComparer`](DefaultEqualityComparer.md)

## Accessors

### default

```typescript
const defaultEqualityComparer = EqualityComparer.default;
```

Gets the default equality comparer for standard types.

**Returns**

[`DefaultEqualityComparer`](EqualityComparer.md)\<`T`\>

A default comparer that uses standard equality comparison.

## Methods

### equals()

```typescript
  abstract equals(x: T, y: T): boolean
```

Determines whether two elements are considered equal.

**Parameters**

- `x`: The first element to compare.
- `y`: The second element to compare.

**Returns**

`boolean`

A boolean indicating whether the elements are equal.
