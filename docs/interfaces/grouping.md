<!-- markdownlint-disable MD036 -->

# grouping

## IGrouping (interface)

**Description**

Represents a group of elements with a common key in a synchronous enumeration.

**Definition**

```typescript
export interface IGrouping<TKey, TElement> extends IEnumerable<TElement> {
  /**
   * Gets the key that defines this group.
   *
   * @returns The key used to group the elements.
   */
  get key(): TKey;
}
```

**Type Parameters**

- `TKey`: The type of the key used to group elements.
- `TElement`: The type of elements in the group.

**Remarks**

```typescript
This interface extends IEnumerable, allowing synchronous iteration over grouped elements
while providing access to the key that defines the group.
```

**Example**

```typescript
// Example of using IGrouping in a groupBy operation
const groupedNumbers = numbers.groupBy((num) => num % 2 === 0);
// groupedNumbers is an array of IGrouping<boolean, number>
```

---

## IAsyncGrouping (interface)

**Description**

Represents a group of elements with a common key in a synchronous enumeration.

**Definition**

```typescript
export interface IAsyncGrouping<TKey, TElement>
  extends IAsyncEnumerable<TElement> {
  /**
   * Gets the key that defines this group.
   *
   * @returns The key used to group the elements.
   */
  get key(): TKey;
}
```

**Type Parameters**

- `TKey`: The type of the key used to group elements.
- `TElement`: The type of elements in the group.

**Remarks**

```typescript
This interface extends IAsyncEnumerable, allowing asynchronous iteration over grouped elements
while providing access to the key that defines the group.
```

**Example**

```typescript
// Example of using IAsyncGrouping in an async groupBy operation
const asyncGroupedNumbers = asyncNumbers.groupBy(async (num) => num % 2 === 0);
// asyncGroupedNumbers is an async iterable of IAsyncGrouping<boolean, number>
```

---
