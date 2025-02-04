<!-- markdownlint-disable MD036 -->

# Class: DefaultComparer

Default implementation of Comparer for numeric types.

## Description

Provides standard comparison logic for numeric values using greater than, less
than, and equality checks.

## Example

```typescript
const comparer = new DefaultComparer();
//or
const comparer = Comparer.default; //Cached version
console.log(comparer.compare(5, 10)); // Returns -1
console.log(comparer.compare(10, 5)); // Returns 1
console.log(comparer.compare(5, 5)); // Returns 0
```

## Extends

- [`Comparer`](Comparer.md)\<`number`\>

## Constructors

### new DefaultComparer()

> **new DefaultComparer**(): [`DefaultComparer`](DefaultComparer.md)

**Returns**

[`DefaultComparer`](DefaultComparer.md)

## Methods

### compare()

```typescript
compare(x: number, y: number): -1 | 0 | 1
```

Compares two numeric values.

**Parameters**

- `x`: he first element to compare.
- `y`: The second element to compare.

**Returns**

`-1` \| `0` \| `1` based on the comparison result.

#### Overrides

[`Comparer`](Comparer.md).[`compare`](Comparer.md#compare)
