<!-- markdownlint-disable MD036 -->

# Class: DefaultComparerAsync

Default implementation of Comparer for numeric types.

## Description

Provides standard asynchronous comparison logic for numeric values.

Returns a Promise to maintain async interface, even though comparison is
synchronous.

## Example

```typescript
const comparer = new DefaultComparerAsync();
//or
const comparer = ComparerAsync.default; //Cached version

console.log(await comparer.compare(5, 10)); // Returns -1
console.log(await comparer.compare(10, 5)); // Returns 1
console.log(await comparer.compare(5, 5)); // Returns 0
```

## Extends

- [`ComparerAsync`](ComparerAsync.md)\<`number`\>

## Constructors

### new DefaultComparerAsync()

> **new DefaultComparerAsync**():
> [`DefaultComparerAsync`](DefaultComparerAsync.md)

**Returns**

[`DefaultComparerAsync`](DefaultComparerAsync.md)

## Methods

### compare()

```typescript
compare(x: number, y: number): Promise< -1 | 0 | 1 >
```

Compares two numeric values.

**Returns**

`Promise`\<`-1` \| `0` \| `1`\>

A Promise resolving to -1, 0, or 1 based on the comparison result.

#### Overrides

[`ComparerAsync`](ComparerAsync.md).[`compareAsync`](ComparerAsync.md#compare)
