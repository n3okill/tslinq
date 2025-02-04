<!-- markdownlint-disable MD036 -->

# Class: DefaultStringComparer

Default implementation of Comparer for string types.

## Description

Provides locale-aware string comparison using Intl.Collator. This ensures proper
sorting of strings across different languages and locales.

## Example

```typescript
const comparer = new DefaultStringComparer();
//or
const comparer = Comparer.defaultString; //Cached version

console.log(comparer.compare("apple", "banana")); // Locale-aware comparison
console.log(comparer.compare("café", "cafe")); // Handles accents correctly
```

## Extends

- [`Comparer`](Comparer.md)\<`string`\>

## Constructors

### new DefaultStringComparer()

> **new DefaultStringComparer**():
> [`DefaultStringComparer`](DefaultStringComparer.md)

**Returns**

[`DefaultStringComparer`](DefaultStringComparer.md)

## Methods

### compare()

```typescript
compare(x: string, y: string): `number`
```

Compares two string values using locale-aware comparison.

**Returns**

`number` A number indicating the relative order of the strings.

#### Overrides

[`Comparer`](Comparer.md).[`compare`](Comparer.md#compare)
