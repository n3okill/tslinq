<!-- markdownlint-disable MD036 -->

# Class: `abstract` Comparer\<T\>

Abstract base class for synchronous comparison operations.

## Type Parameters

T - The type of elements being compared.

## Description

Provides a standard interface for comparing two elements of the same type.
Implementations define custom comparison logic for different types.

## Example

```typescript
// Create a custom comparer for complex objects
class PersonComparer extends Comparer<Person> {
  compare(x: Person, y: Person): number {
    return x.age - y.age; // Compare by age
  }
}
```

## Extended by

- [`DefaultComparer`](DefaultComparer.md)
- [`DefaultStringComparer`](DefaultStringComparer.md)

## Accessors

### default

```typescript
const defaultComparer = Comparer.default;
```

Gets the default comparer for numeric or comparable types.

**Returns**

[`DefaultComparer`](DefaultComparer.md)

A default comparer that uses standard comparison logic.

---

### defaultString

```typescript
const defaultStringComparer = Comparer.defaultString;
```

Gets the default comparer for string types.

**Returns**

[`DefaultStringComparer`](DefaultStringComparer.md.md)

A default comparer that uses locale-aware string comparison.

## Methods

### compare()

```typescript
  abstract compare(x: T, y: T): number;
```

Compares two elements of the same type.

**Parameters**

- `x`: he first element to compare.
- `y`: The second element to compare.

**Returns**

`number`

A number indicating the relative order:

- Negative if x should be sorted before y
- Zero if x and y are considered equal
- Positive if x should be sorted after y
