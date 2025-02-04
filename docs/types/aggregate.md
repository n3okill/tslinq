<!-- markdownlint-disable MD036 -->
<!-- omit in toc -->

# aggregate

- [AggregateFunctionType (type)](#aggregatefunctiontype-type)
- [AggregateResultType (type)](#aggregateresulttype-type)
- [AggregateFunctionTypeAsync (type)](#aggregatefunctiontypeasync-type)
- [AggregateResultTypeAsync (type)](#aggregateresulttypeasync-type)
- [AggregateFunctionSeedSelector (type)](#aggregatefunctionseedselector-type)
- [AggregateFunctionSeedSelectorAsync (type)](#aggregatefunctionseedselectorasync-type)

## AggregateFunctionType (type)

**Description**

Represents a function that takes an accumulator and a current value and returns
a new accumulator. Used by the aggregate() method to aggregate elements in a
sequence.

**Definition**

```typescript
export type AggregateFunctionType<T, TAccumulate> = (
  result: TAccumulate,
  current: T,
) => TAccumulate;
```

**Type Parameters**

- `T`: The type of elements in the sequence.
- `TAccumulate`: The type of the accumulator value.

**Parameters**

- `result`: The accumulator value.
- `current`: The current element in the sequence.

**Returns**

- A new accumulator value.

---

## AggregateResultType (type)

**Description**

Represents a function that takes an accumulator and a current value and returns
a new accumulator. Used by the aggregate() method to aggregate elements in a
sequence.

**Definition**

```typescript
export type AggregateResultType<TAccumulate, TResult> = (
  result: TAccumulate,
) => TResult;
```

**Type Parameters**

- `TAccumulate`: The type of the accumulator value.
- `TResult`: The type of the result.

**Parameters**

- `result`: The accumulator value.

**Returns**

- The final result.

---

## AggregateFunctionTypeAsync (type)

**Description**

Represents a function that takes an accumulator and a current value and returns
a new accumulator. Used by the aggregate() method to aggregate elements in a
sequence.

**Definition**

```typescript
export type AggregateFunctionTypeAsync<T, TAccumulate> = (
  result: TAccumulate,
  current: T,
) => TAccumulate | Promise<TAccumulate>;
```

**Type Parameters**

- `T`: The type of elements in the sequence.
- `TAccumulate`: The type of the accumulator value.

**Parameters**

- `result`: The accumulator value.
- `current`: The current element in the sequence.

**Returns**

- A new accumulator value, or a Promise that resolves to the new accumulator
  value.

---

## AggregateResultTypeAsync (type)

**Description**

Represents a function that takes an accumulator and a current value and returns
a new accumulator. Used by the aggregate() method to aggregate elements in a
sequence.

**Definition**

```typescript
export type AggregateResultTypeAsync<TAccumulate, TResult> = (
  result: TAccumulate,
) => TResult | Promise<TResult>;
```

**Type Parameters**

- `TAccumulate`: The type of the accumulator value.
- `TResult`: The type of the result.

**Parameters**

- `result`: The accumulator value.

**Returns**

- The final result, or a Promise that resolves to the final result.

---

## AggregateFunctionSeedSelector (type)

**Description**

Represents a function that takes an accumulator and a current value and returns
a new accumulator. Used by the aggregate() method to aggregate elements in a
sequence.

**Definition**

```typescript
export type AggregateFunctionSeedSelector<TKey, TAccumulate> = (
  key: TKey,
) => TAccumulate;
```

**Type Parameters**

- `TAccumulate`: The type of the accumulator value.
- `TKey`: The type of the key used to group elements.

**Parameters**

- `key`: The key of the group.

**Returns**

- The initial accumulator value.

---

## AggregateFunctionSeedSelectorAsync (type)

**Description**

Represents a function that takes an accumulator and a current value and returns
a new accumulator. Used by the aggregate() method to aggregate elements in a
sequence.

**Definition**

```typescript
export type AggregateFunctionSeedSelectorAsync<TKey, TAccumulate> = (
  key: TKey,
) => TAccumulate | Promise<TAccumulate>;
```

**Type Parameters**

- `TKey`: The type of the key used to group elements.
- `TAccumulate`: The type of the accumulator value.

**Parameters**

- `key`: The key of the group.

**Returns**

- The initial accumulator value, or a Promise that resolves to the initial
  accumulator value.

---
