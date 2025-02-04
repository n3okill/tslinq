<!-- markdownlint-disable MD036 -->

# Class: `abstract` ComparerAsync\<T\>

Abstract base class for asynchronous comparison operations.

## Type Parameters

T - The type of elements being compared.

## Description

Provides a standard interface for asynchronous comparison of two elements.
Useful when comparison may involve async operations like database lookups.

## Example

```typescript
// Create a custom async comparer for complex objects
class AsyncPersonComparer extends ComparerAsync<Person> {
  async compare(x: Person, y: Person): Promise<number> {
    const xScore = await x.calculateScore();
    const yScore = await y.calculateScore();
    return xScore - yScore;
  }
}
```

## Extended by

- [`DefaultComparerAsync`](DefaultComparerAsync.md)

## Accessors

### default

```typescript
const defaultComparer = ComparerAsync.default;
```

Gets the default comparer for numeric or comparable types.

**Returns**

[`DefaultComparerAsync`](DefaultComparerAsync.md)

Cached default async comparer instance

---

## Methods

### compare()

```typescript
  abstract compare(x: T, y: T): number | Promise<number>;
```

Compares two elements of the same type.

**Parameters**

- `x`: he first element to compare.
- `y`: The second element to compare.

**Returns**

`number` \| `Promise`\<`number`\>

A number indicating the relative order:

- Negative if x should be sorted before y
- Zero if x and y are considered equal
- Positive if x should be sorted after y
