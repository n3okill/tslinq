<!-- markdownlint-disable MD036 -->

# Class: DefaultEqualityComparer\<T\>

Default implementation of EqualityComparer for standard types.

## Typeparam

T - The type of elements being compared for equality.

## Remarks

Provides standard equality comparison using strict equality (===) operator.
Works well for primitive types and object references.

## Example

```typescript
const comparer = new DefaultEqualityComparer();
console.log(comparer.equals(5, 5)); // Returns true
console.log(comparer.equals("a", "a")); // Returns true
console.log(comparer.equals(5, "5")); // Returns false
```

## Extends

- [`EqualityComparer`](EqualityComparer.md)\<`T`\>

## Constructors

### new DefaultEqualityComparer()

> **new DefaultEqualityComparer**\<`T`\>():
> [`DefaultEqualityComparer`](DefaultEqualityComparer.md)\<`T`\>

#### Returns

[`DefaultEqualityComparer`](DefaultEqualityComparer.md)\<`T`\>

#### Inherited from

[`EqualityComparer`](EqualityComparer.md).[`constructor`](EqualityComparer.md#constructors)

## Methods

### equals()

```typescript
    equals(x: T, y: T): boolean
```

Compares two values for strict equality.

**Parameters**

- `x`: he first element to compare.
- `y`: The second element to compare.

**Returns**

`boolean` A boolean indicating whether the values are strictly equal.

#### Overrides

[`EqualityComparer`](EqualityComparer.md).[`equals`](EqualityComparer.md#equals)
