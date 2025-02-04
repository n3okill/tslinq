<!-- markdownlint-disable MD036 -->
<!-- omit in toc -->

# AsyncEnumerable API Documentation

<!-- TOC depthFrom:1 depthTo:4 -->

- [Methods](#methods)
  - [aggregate](#aggregate)
    - [`aggregate(func)`](#aggregatefunc)
    - [`aggregate(func, seed)`](#aggregatefunc-seed)
    - [`aggregate(func, seed, resultSelector)`](#aggregatefunc-seed-resultselector)
  - [aggregateBy](#aggregateby)
    - [`aggregateBy<T, TKey, TAccumulate>(keySelector, seed, func, comparer)`](#aggregatebyt-tkey-taccumulatekeyselector-seed-func-comparer)
  - [all](#all)
    - [`all<T>(predicate)`](#alltpredicate)
  - [any](#any)
    - [`any<T>(predicate)`](#anytpredicate)
  - [append](#append)
    - [`append<T>(item)`](#appendtitem)
  - [average](#average)
    - [`average<T>(selector)`](#averagetselector)
  - [chunk](#chunk)
    - [`chunk<T>(size)`](#chunktsize)
  - [concat](#concat)
    - [`concat<T>(second)`](#concattsecond)
  - [contains](#contains)
    - [`contains<T>(value, comparer)`](#containstvalue-comparer)
  - [count](#count)
    - [`count<T>(predicate)`](#counttpredicate)
  - [countBy](#countby)
    - [`countBy<T, TKey>(keySelector, comparer)`](#countbyt-tkeykeyselector-comparer)
  - [defaultIfEmpty](#defaultifempty)
    - [`defaultIfEmpty<T>(defaultValue)`](#defaultifemptytdefaultvalue)
  - [distinct](#distinct)
    - [`distinct<T>(comparer)`](#distincttcomparer)
  - [distinctBy](#distinctby)
    - [`distinctBy<T, TKey>(keySelector, comparer)`](#distinctbyt-tkeykeyselector-comparer)
  - [elementAt](#elementat)
    - [`elementAt<T>(index)`](#elementattindex)
  - [elementAtOrDefault](#elementatordefault)
    - [`elementAtOrDefault<T>(defaultValue, index)`](#elementatordefaulttdefaultvalue-index)
  - [except](#except)
    - [`except<T>(second, comparer)`](#excepttsecond-comparer)
  - [exceptBy](#exceptby)
    - [`exceptBy<T, TKey>(second, keySelector, comparer)`](#exceptbyt-tkeysecond-keyselector-comparer)
  - [exclusive](#exclusive)
    - [`exclusive<T>(second, comparer)`](#exclusivetsecond-comparer)
  - [exclusiveBy](#exclusiveby)
    - [`exclusiveBy<T, TKey>(second, keySelector, comparer)`](#exclusivebyt-tkeysecond-keyselector-comparer)
  - [first](#first)
    - [`first<T>(predicate)`](#firsttpredicate)
  - [firstOrDefault](#firstordefault)
    - [`firstOrDefault<T>(defaultValue, predicate)`](#firstordefaulttdefaultvalue-predicate)
  - [forEach](#foreach)
    - [`forEach<T, TResult>(action)`](#foreacht-tresultaction)
  - [groupBy](#groupby)
    - [`groupBy<T, TKey>(keySelector, comparer)`](#groupbyt-tkeykeyselector-comparer)
    - [`groupBy<T, TKey, TElement>(keySelector, elementSelector, comparer)`](#groupbyt-tkey-telementkeyselector-elementselector-comparer)
    - [`groupBy<T, TKey, TResult, TElement>(keySelector, elementSelector, resultSelector, comparer)`](#groupbyt-tkey-tresult-telementkeyselector-elementselector-resultselector-comparer)
  - [groupJoin](#groupjoin)
    - [`groupJoin<TInner, TKey, TResult>(inner, outerKeySelector, innerKeySelector, resultSelector, comparer)`](#groupjointinner-tkey-tresultinner-outerkeyselector-innerkeyselector-resultselector-comparer)
  - [index](#index)
    - [`index<T>()`](#indext)
  - [intersect](#intersect)
    - [`intersect<T>(second, comparer)`](#intersecttsecond-comparer)
  - [intersectBy](#intersectby)
    - [`intersectBy<T, TKey>(second, keySelector, comparer)`](#intersectbyt-tkeysecond-keyselector-comparer)
  - [isDisjointFrom](#isdisjointfrom)
    - [`isDisjointFrom<TSecond>(second)`](#isdisjointfromtsecondsecond)
  - [isSubsetOf](#issubsetof)
    - [`isSubsetOf<TSecond>(second)`](#issubsetoftsecondsecond)
  - [isSupersetOf](#issupersetof)
    - [`isSupersetOf<TSecond>(second)`](#issupersetoftsecondsecond)
  - [join](#join)
    - [`join<TInner, TKey, TResult>(inner, outerKeySelector, innerKeySelector, resultSelector, comparer)`](#jointinner-tkey-tresultinner-outerkeyselector-innerkeyselector-resultselector-comparer)
  - [last](#last)
    - [`last<T>(predicate)`](#lasttpredicate)
  - [lastOrDefault](#lastordefault)
    - [`lastOrDefault<T>(defaultValue, predicate)`](#lastordefaulttdefaultvalue-predicate)
  - [max](#max)
    - [`max()`](#max-1)
    - [`max<T>(comparer)`](#maxtcomparer)
  - [maxBy](#maxby)
    - [`maxBy<T, T>(transformer, keySelector, comparer)`](#maxbyt-ttransformer-keyselector-comparer)
  - [min](#min)
    - [`min()`](#min-1)
    - [`min<T>(comparer)`](#mintcomparer)
  - [minBy](#minby)
    - [`minBy<T, T>(keySelector, keySelector, comparer)`](#minbyt-tkeyselector-keyselector-comparer)
  - [ofType](#oftype)
    - [`ofType<TType>(type)`](#oftypettypetype)
  - [order](#order)
    - [`order<T>(comparer)`](#ordertcomparer)
  - [orderBy](#orderby)
    - [`orderBy<T, TKey>(keySelector, comparer)`](#orderbyt-tkeykeyselector-comparer)
  - [orderByDescending](#orderbydescending)
    - [`orderByDescending<T, TKey>(keySelector, comparer)`](#orderbydescendingt-tkeykeyselector-comparer)
  - [orderDescending](#orderdescending)
    - [`orderDescending<T>(comparer)`](#orderdescendingtcomparer)
  - [prepend](#prepend)
    - [`prepend<T>(item)`](#prependtitem)
  - [reverse](#reverse)
    - [`reverse<T>()`](#reverset)
  - [select](#select)
    - [`select<T, TResult>(selector)`](#selectt-tresultselector)
  - [selectMany](#selectmany)
    - [`selectMany<TCollection, TResult>(selector, resultSelector)`](#selectmanytcollection-tresultselector-resultselector)
  - [sequenceEqual](#sequenceequal)
    - [`sequenceEqual<T>(second, comparer)`](#sequenceequaltsecond-comparer)
  - [shuffle](#shuffle)
    - [`shuffle<T>()`](#shufflet)
  - [single](#single)
    - [`single<T>(predicate)`](#singletpredicate)
  - [singleOrDefault](#singleordefault)
    - [`singleOrDefault<T>(defaultValue, predicate)`](#singleordefaulttdefaultvalue-predicate)
  - [skip](#skip)
    - [`skip<T>(count)`](#skiptcount)
  - [skipLast](#skiplast)
    - [`skipLast<T>(count)`](#skiplasttcount)
  - [skipWhile](#skipwhile)
    - [`skipWhile<T>(predicate)`](#skipwhiletpredicate)
  - [sum](#sum)
    - [`sum<TResult>()`](#sumtresult)
    - [`sum<string>(selector)`](#sumstringselector)
    - [`sum<number>(selector)`](#sumnumberselector)
  - [take](#take)
    - [`take<T>(count)`](#taketcount)
  - [takeLast](#takelast)
    - [`takeLast<T>(count)`](#takelasttcount)
  - [takeWhile](#takewhile)
    - [`takeWhile<T>(predicate)`](#takewhiletpredicate)
  - [toArray](#toarray)
    - [`toArray<T>()`](#toarrayt)
  - [toMap](#tomap)
    - [`toMap<T, TKey>(selector)`](#tomapt-tkeyselector)
  - [toSet](#toset)
    - [`toSet<T>()`](#tosett)
  - [union](#union)
    - [`union<T>(second, comparer)`](#uniontsecond-comparer)
  - [unionBy](#unionby)
    - [`unionBy<T, TKey>(second, keySelector, comparer)`](#unionbyt-tkeysecond-keyselector-comparer)
  - [where](#where)
    - [`where<T>(predicate)`](#wheretpredicate)
  - [zip](#zip)
    - [`zip<T, TSecond>(second)`](#zipt-tsecondsecond)
    - [`zip<T, TSecond, TResult>(second, resultSelector)`](#zipt-tsecond-tresultsecond-resultselector)
    - [`zip<T, TSecond, TThird>(second, third)`](#zipt-tsecond-tthirdsecond-third)

<!-- /TOC -->

## Methods

### aggregate

#### `aggregate(func)`

Applies an async accumulator function over a sequence.

**Parameters**

- `func`: An async function that takes the current accumulator value and the
  next element, returning a new accumulator value

**Returns**: A Promise that resolves to the final accumulator value

**Throws**

- `NoElementsException`: If the sequence is empty.
- `InvalidArgumentException`: If func is not a function.

**Examples**

```typescript
// Sum all numbers
await AsyncEnumerable.create([1, 2, 3]).aggregate((acc, val) => acc + val); // 6

// Find maximum value
await AsyncEnumerable.create([1, 5, 3]).aggregate((acc, val) =>
  Math.max(acc, val),
); // 5

// Concatenate strings
await AsyncEnumerable.create(["a", "b", "c"]).aggregate(
  (acc, val) => acc + val,
); // 'abc'
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.aggregate](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.aggregate)

---

#### `aggregate(func, seed)`

Applies an async accumulator function over a sequence, with an optional seed
value.

**Parameters**

- `func`: An async function that takes the current accumulator value and the
  next element, returning a new accumulator value
- `seed`: Optional initial value for the accumulator. If not provided, first
  element is used.

**Returns**: A Promise that resolves to the final accumulator value

**Throws**

- `InvalidOperationException`: If the sequence is empty and no seed is provided.
- `InvalidArgumentException`: If func is not a function.

**Examples**

```typescript
// Sum with initial value
await AsyncEnumerable.create([1, 2, 3]).aggregate((acc, val) => acc + val, 10); // 16

// Custom accumulation with seed
await AsyncEnumerable.create(["a", "b"]).aggregate(
  (acc, val) => acc + "," + val,
  "start",
); // 'start,a,b'

// Empty sequence with seed returns seed
await AsyncEnumerable.create([]).aggregate((acc, val) => acc + val, 0); // 0
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.aggregate](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.aggregate)

---

#### `aggregate(func, seed, resultSelector)`

Applies an async accumulator function over a sequence with seed value and result
transformation.

**Parameters**

- `func`: An async function that takes accumulator and current element, returns
  new accumulator
- `seed`: Optional initial accumulator value
- `resultSelector`: Optional async function to transform the final accumulator
  value

**Returns**: A Promise that resolves to the transformed result

**Throws**

- `InvalidArgumentException`: If func is null or undefined.

**Examples**

```typescript
// Sum and convert to string
await AsyncEnumerable.create([1, 2, 3]).aggregate(
  (acc, val) => acc + val,
  0,
  (sum) => `Total: ${sum}`,
);
// "Total: 6"

// Calculate average
await AsyncEnumerable.create([1, 2, 3, 4]).aggregate(
  (acc, val) => ({ sum: acc.sum + val, count: acc.count + 1 }),
  { sum: 0, count: 0 },
  (result) => result.sum / result.count,
); // 2.5
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.aggregate](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.aggregate)

---

### aggregateBy

#### `aggregateBy<T, TKey, TAccumulate>(keySelector, seed, func, comparer)`

Groups elements by key and applies an accumulator function over each group.

**Type Parameters**

- `T`: The type of elements in the sequence.
- `TKey`: The type of the key used for grouping.
- `TAccumulate`: The type of the accumulator value.

**Parameters**

- `keySelector`: An async function to extract the key for each element.
- `seed`: Initial value for each group, or a function to generate it from the
  key.
- `func`: An async function to aggregate elements within each group.
- `comparer`: Optional. An async or sync comparer to compare keys.

**Returns**: An IAsyncEnumerable<[TKey, TAccumulate]> containing key-result
pairs.

**Throws**

- `InvalidArgumentException`: If keySelector or func is not a function.

**Examples**

```typescript
// Sum values by category
const items = [
  { category: "A", value: 10 },
  { category: "B", value: 20 },
  { category: "A", value: 30 },
];

await AsyncEnumerable.create(items)
  .aggregateBy(
    (x) => x.category,
    0,
    (acc, item) => acc + item.value,
  )
  .toArray();
// [['A', 40], ['B', 20]]

// Using seed selector
await AsyncEnumerable.create(items)
  .aggregateBy(
    (x) => x.category,
    (key) => ({ key, sum: 0 }),
    (acc, item) => ({ ...acc, sum: acc.sum + item.value }),
  )
  .toArray();
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.aggregateby](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.aggregateby)

---

### all

#### `all<T>(predicate)`

Determines whether all elements of an async sequence satisfy a condition.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `predicate`: An async function to test each element for a condition.

**Returns**: A Promise that resolves to true if every element passes the test;
otherwise, false.

**Throws**

- `InvalidArgumentException`: If predicate is null or undefined.

**Examples**

```typescript
// Basic condition check
const numbers = AsyncEnumerable.create([1, 2, 3]);
await numbers.all(async (x) => x > 0); // true

// Object validation
const items = AsyncEnumerable.create([
  { id: 1, valid: true },
  { id: 2, valid: true },
]);

await items.all(async (x) => x.valid); // true

// Early termination
const sequence = AsyncEnumerable.create([1, 2, 0, 3]);
await sequence.all(async (x) => x > 0); // false (stops at 0)
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.all](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.all)

---

### any

#### `any<T>(predicate)`

Determines whether any element of an async sequence exists or satisfies a
condition.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `predicate`: Optional. An async function to test each element for a condition.

**Returns**: A Promise that resolves to:

- true if any element exists (when no predicate provided)
- true if any element satisfies the predicate
- false otherwise

**Examples**

```typescript
// Check if sequence has any elements
Enumerable.create([1, 2, 3]).any(); // true
Enumerable.create([]).any(); // false

// Check if any element satisfies condition
Enumerable.create([1, 2, 3]).any((x) => x > 2); // true
Enumerable.create([1, 2, 3]).any((x) => x > 5); // false

// Empty sequence with predicate returns false
Enumerable.create([]).any((x) => true); // false
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.any](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.any)

---

### append

#### `append<T>(item)`

Appends a value to the end of the async sequence.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `item`: The value to append to the sequence.

**Returns**: A new IAsyncEnumerable\<T> that ends with the specified item.

**Examples**

```typescript
// Append number
Enumerable.create([1, 2]).append(3).toArray(); // [1, 2, 3]

// Append to empty sequence
Enumerable.create<number>([]).append(1).toArray(); // [1]

// Append object
Enumerable.create([{ id: 1 }])
  .append({ id: 2 })
  .toArray(); // [{id: 1}, {id: 2}]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.append](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.append)

---

### average

#### `average<T>(selector)`

Computes the average of a sequence of numeric values or transformed values.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `selector`: Optional. An async function to extract a numeric value from each
  element.

**Returns**: A Promise that resolves to the average of the sequence values.

**Throws**

- `NoElementsException`: If the sequence is empty.
- `InvalidArgumentException`: If selector is provided but is not a function.
- `NotNumberException`: If any element or transformed value is not a number.

**Examples**

```typescript
// Direct numeric average
Enumerable.create([1, 2, 3]).average(); // 2

// Average with selector
Enumerable.create([{ value: 10 }, { value: 20 }]).average((x) => x.value); // 15

// Empty sequence throws
Enumerable.create([]).average(); // throws NoElementsException
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.average](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.average)

---

### chunk

#### `chunk<T>(size)`

Splits the elements of a sequence into chunks of a specified size.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `size`: The maximum size of each chunk. Must be greater than zero.

**Returns**: An IAsyncEnumerable<Array\<T>> containing chunks of the original
sequence. The last chunk may contain fewer elements.

**Throws**

- `RangeError`: If size is null, undefined, or less than or equal to 0.

**Examples**

```typescript
// Basic chunking
Enumerable.create([1, 2, 3, 4, 5]).chunk(2).toArray(); // [[1, 2], [3, 4], [5]]

// Empty sequence returns empty
Enumerable.create([]).chunk(2).toArray(); // []

// Perfect chunks
Enumerable.create([1, 2, 3, 4]).chunk(2).toArray(); // [[1, 2], [3, 4]]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.chunk](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.chunk)

---

### concat

#### `concat<T>(second)`

Concatenates two sequences.

**Type Parameters**

- `T`: The type of elements in the sequences.

**Parameters**

- `second`: The sequence to concatenate to the first sequence. Can be an array,
  iterable, or async iterable.

**Returns**: An IAsyncEnumerable\<T> that contains the concatenated elements.

**Throws**

- `NotIterableException`: If second is not iterable.

**Examples**

```typescript
// Basic number concatenation
Enumerable.create([1, 2]).concat([3, 4]).toArray(); // [1, 2, 3, 4]

// String concatenation
Enumerable.create(["a"]).concat(["b"]).toArray(); // ['a', 'b']

// Empty sequence handling
Enumerable.create([1]).concat([]).toArray(); // [1]
Enumerable.create<number>([]).concat([1]).toArray(); // [1]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.concat](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.concat)

---

### contains

#### `contains<T>(value, comparer)`

Determines whether a sequence contains a specified element using an optional
comparer.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `value`: The value to locate in the sequence.
- `comparer`: Optional. An equality comparer to compare values. Can be async or
  sync comparer.

**Returns**: A Promise that resolves to true if the value is found; otherwise,
false.

**Examples**

```typescript
// Basic value check
Enumerable.create([1, 2, 3]).contains(2); // true
Enumerable.create([1, 2, 3]).contains(4); // false

// With custom comparer
class CaseInsensitiveComparer extends EqualityComparer<string> {
  equals(x?: string, y?: string): boolean {
    return (x || "").toLowerCase() === (y || "").toLowerCase();
  }
}

Enumerable.create(["A", "B"]).contains("a", new CaseInsensitiveComparer()); // true
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.contains](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.contains)

---

### count

#### `count<T>(predicate)`

Returns the number of elements in a sequence that satisfy an optional condition.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `predicate`: Optional. An async function to test each element for a condition.

**Returns**: A Promise that resolves to the number of elements that satisfy the
condition.

**Examples**

```typescript
// Total count
Enumerable.create([1, 2, 3]).count(); // 3

// Count with predicate
Enumerable.create([1, 2, 3]).count((x) => x > 1); // 2

// Empty sequence
Enumerable.create([]).count(); // 0

// No matches
Enumerable.create([1, 2, 3]).count((x) => x > 10); // 0
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.count](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.count)

---

### countBy

#### `countBy<T, TKey>(keySelector, comparer)`

Groups elements by key and returns the count of elements in each group.

**Type Parameters**

- `T`: The type of elements in the sequence.
- `TKey`: The type of the key returned by keySelector.

**Parameters**

- `keySelector`: Optional. An async function to extract the key from each
  element.
- `comparer`: Optional. A comparer to compare keys. Can be async or sync.

**Returns**: An IAsyncEnumerable<[TKey, number]> containing keys and their
counts.

**Throws**

- `InvalidArgumentException`: If keySelector is provided but is not a function.

**Examples**

```typescript
// Basic counting by value
Enumerable.create(["a", "b", "a", "c"]).countBy().toArray(); // [['a', 2], ['b', 1], ['c', 1]]

// Counting by object property
const items = [
  { category: "A", value: 1 },
  { category: "B", value: 2 },
  { category: "A", value: 3 },
];
Enumerable.create(items)
  .countBy((x) => x.category)
  .toArray(); // [['A', 2], ['B', 1]]

// Using custom comparer
class CaseInsensitiveComparer extends EqualityComparer<string> {
  equals(x?: string, y?: string): boolean {
    return (x || "").toLowerCase() === (y || "").toLowerCase();
  }
}

Enumerable.create(["A", "a", "B"])
  .countBy((x) => x, new CaseInsensitiveComparer())
  .toArray(); // [['A', 2], ['B', 1]]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.countby](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.countby)

---

### defaultIfEmpty

#### `defaultIfEmpty<T>(defaultValue)`

Returns elements from a sequence, or a default value in a singleton sequence if
empty.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `defaultValue`: Optional. The value to return in a singleton sequence if
  empty. If not provided, uses the type's default value.

**Returns**: An IAsyncEnumerable\<T> that contains defaultValue if source is
empty; otherwise, source.

**Examples**

```typescript
// Empty sequence with default
Enumerable.create<number>([]).defaultIfEmpty(0).toArray(); // [0]

// Empty sequence without default
Enumerable.create([]).defaultIfEmpty().toArray(); // [undefined]

// Non-empty sequence ignores default
Enumerable.create([1, 2]).defaultIfEmpty(0).toArray(); // [1, 2]

// With objects
Enumerable.create<{ id: number }[]>([]).defaultIfEmpty({ id: 0 }).toArray(); // [{id: 0}]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.defaultifempty](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.defaultifempty)

---

### distinct

#### `distinct<T>(comparer)`

Returns distinct elements from a sequence using optional equality comparison.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `comparer`: Optional. An equality comparer to compare values. Can be async or
  sync comparer.

**Returns**: An IAsyncEnumerable\<T> that contains distinct elements from the
source sequence.

**Examples**

```typescript
// Basic distinct numbers
await AsyncEnumerable.create([1, 1, 2, 3, 2]).distinct().toArray(); // [1, 2, 3]

// Object distinct with custom comparer
class PersonComparer extends EqualityComparer<{ id: number }> {
  equals(x?: { id: number }, y?: { id: number }): boolean {
    return x?.id === y?.id;
  }
}

const people = [
  { id: 1, name: "John" },
  { id: 1, name: "Jane" },
  { id: 2, name: "Bob" },
];

await AsyncEnumerable.create(people).distinct(new PersonComparer()).toArray(); // [{id: 1, name: 'John'}, {id: 2, name: 'Bob'}]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.distinct](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.distinct)

---

### distinctBy

#### `distinctBy<T, TKey>(keySelector, comparer)`

Returns distinct elements from a sequence according to a specified key selector.

**Type Parameters**

- `T`: The type of elements in the sequence.
- `TKey`: The type of keys to compare.

**Parameters**

- `keySelector`: An async function to extract the key for each element.
- `comparer`: Optional. An equality comparer to compare keys. Can be async or
  sync comparer.

**Returns**: An IAsyncEnumerable\<T> that contains elements with distinct keys.

**Throws**

- `InvalidArgumentException`: If keySelector is not a function.

**Examples**

```typescript
// Basic property selection
const items = [
  { id: 1, name: "John" },
  { id: 1, name: "Jane" },
  { id: 2, name: "Bob" },
];

await AsyncEnumerable.create(items)
  .distinctBy((x) => x.id)
  .toArray(); // [{id: 1, name: 'John'}, {id: 2, name: 'Bob'}]

// Case insensitive name comparison
class CaseInsensitiveComparer extends EqualityComparer<string> {
  equals(x?: string, y?: string): boolean {
    return (x || "").toLowerCase() === (y || "").toLowerCase();
  }
}

const names = [
  { name: "John", age: 25 },
  { name: "JOHN", age: 30 },
  { name: "Bob", age: 35 },
];

await AsyncEnumerable.create(names)
  .distinctBy((x) => x.name, new CaseInsensitiveComparer())
  .toArray(); // [{name: 'John', age: 25}, {name: 'Bob', age: 35}]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.distinctby](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.distinctby)

---

### elementAt

#### `elementAt<T>(index)`

Returns the element at a specified index in a sequence.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `index`: Zero-based index of element to retrieve.

**Returns**: Promise that resolves to the element at the specified position.

**Throws**

- `InvalidArgumentException`: If index is not a number.
- `OutOfRangeException`: If index is less than 0 or greater than or equal to the
  number of elements.

**Examples**

```typescript
// Basic index access
await AsyncEnumerable.create([1, 2, 3]).elementAt(1); // 2

// Object access
await AsyncEnumerable.create([{ id: 1 }, { id: 2 }]).elementAt(0); // {id: 1}

// Out of range throws
await AsyncEnumerable.create([1]).elementAt(1); // throws OutOfRangeException

// Empty sequence throws
await AsyncEnumerable.create([]).elementAt(0); // throws OutOfRangeException
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.elementat](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.elementat)

---

### elementAtOrDefault

#### `elementAtOrDefault<T>(defaultValue, index)`

Returns the element at a specified index or a default value if index is out of
range.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `defaultValue`: The value to return if index is out of range.
- `index`: Zero-based index of element to retrieve.

**Returns**: Promise that resolves to the element at specified position, or
defaultValue if index is out of range.

**Examples**

```typescript
// Valid index
await AsyncEnumerable.create([1, 2, 3]).elementAtOrDefault(0, 1); // 2

// Out of range returns default
await AsyncEnumerable.create([1, 2]).elementAtOrDefault(999, 5); // 999

// Empty sequence returns default
await AsyncEnumerable.create([]).elementAtOrDefault(0, 0); // 0

// With objects
const defaultObj = { id: 0, name: "default" };
await AsyncEnumerable.create([{ id: 1, name: "one" }]).elementAtOrDefault(
  defaultObj,
  1,
); // {id: 0, name: 'default'}
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.elementatordefault](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.elementatordefault)

---

### except

#### `except<T>(second, comparer)`

Produces the set difference of two sequences using optional equality comparison.

**Type Parameters**

- `T`: The type of elements in the sequences.

**Parameters**

- `second`: The sequence whose elements to exclude. Can be array, iterable, or
  async iterable.
- `comparer`: Optional. An equality comparer to compare values. Can be async or
  sync comparer.

**Returns**: An IAsyncEnumerable\<T> containing elements in first but not in
second sequence.

**Throws**

- `NotIterableException`: If second is not iterable.

**Examples**

```typescript
// Basic number difference
await AsyncEnumerable.create([1, 2, 3]).except([2, 3, 4]).toArray(); // [1]

// With custom comparer
class PersonComparer extends EqualityComparer<{ id: number }> {
  equals(x?: { id: number }, y?: { id: number }): boolean {
    return x?.id === y?.id;
  }
}

const seq1 = [{ id: 1 }, { id: 2 }];
const seq2 = [{ id: 2 }, { id: 3 }];

await AsyncEnumerable.create(seq1).except(seq2, new PersonComparer()).toArray(); // [{id: 1}]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.except](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.except)

---

### exceptBy

#### `exceptBy<T, TKey>(second, keySelector, comparer)`

Produces the set difference of two sequences according to a specified key
selector function.

**Type Parameters**

- `T`: The type of elements in the source sequence.
- `TKey`: The type of key to compare elements by.

**Parameters**

- `second`: The sequence whose keys will be excluded. Can be array, iterable, or
  async iterable.
- `keySelector`: An async function to extract the key for each element.
- `comparer`: Optional. An async or sync EqualityComparer\<TKey> to compare
  keys. If not provided, uses the default equality comparer.

**Returns**: An IAsyncEnumerable\<T> containing elements from the first sequence
whose keys are not present in the second sequence.

**Throws**

- `InvalidArgumentException`: If keySelector is not a function.
- `NotIterableException`: If second is not iterable.

**Examples**

```typescript
// Basic key selection
const items = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
];
const excludeIds = [2, 3];

await AsyncEnumerable.create(items)
  .exceptBy(excludeIds, async (x) => x.id)
  .toArray(); // [{ id: 1, name: 'John' }]

// Case insensitive comparison
class CaseInsensitiveComparer extends EqualityComparer<string> {
  equals(x?: string, y?: string): boolean {
    return (x || "").toLowerCase() === (y || "").toLowerCase();
  }
}

const names = [{ name: "John" }, { name: "JANE" }];
const excludeNames = ["jane", "bob"];

await AsyncEnumerable.create(names)
  .exceptBy(excludeNames, async (x) => x.name, new CaseInsensitiveComparer())
  .toArray(); // [{ name: 'John' }]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.exceptby](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.exceptby)

---

### exclusive

#### `exclusive<T>(second, comparer)`

Returns elements that appear in either of two sequences, but not both (symmetric
difference).

**Type Parameters**

- `T`: The type of elements in the sequences.

**Parameters**

- `second`: The sequence to compare against. Can be array, iterable, or async
  iterable.
- `comparer`: Optional. An async or sync EqualityComparer\<T> to compare values.
  If not provided, uses the default equality comparer.

**Returns**: An IAsyncEnumerable\<T> containing elements that are present in
only one of the sequences.

**Throws**

- `NotIterableException`: If second is not iterable.

**Examples**

```typescript
// Basic number difference
await AsyncEnumerable.create([1, 2, 3]).exclusive([2, 3, 4]).toArray(); // [1, 4]

// Object comparison
class PersonComparer extends EqualityComparer<{ id: number }> {
  equals(x?: { id: number }, y?: { id: number }): boolean {
    return x?.id === y?.id;
  }
}

const seq1 = [{ id: 1 }, { id: 2 }];
const seq2 = [{ id: 2 }, { id: 3 }];

await AsyncEnumerable.create(seq1)
  .exclusive(seq2, new PersonComparer())
  .toArray(); // [{id: 1}, {id: 3}]
```

**See Also**

- [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/symmetricDifference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/symmetricDifference)

---

### exclusiveBy

#### `exclusiveBy<T, TKey>(second, keySelector, comparer)`

Returns elements that appear in either of two sequences, but not both, based on
a key selector function.

**Type Parameters**

- `T`: The type of elements in the sequences.
- `TKey`: The type of key to compare elements by.

**Parameters**

- `second`: The sequence to compare against. Can be array, iterable, or async
  iterable.
- `keySelector`: An async function to extract the key for each element.
- `comparer`: Optional. An async or sync EqualityComparer\<TKey> to compare
  keys. If not provided, uses the default equality comparer.

**Returns**: An IAsyncEnumerable\<T> containing elements whose keys are present
in only one of the sequences.

**Throws**

- `InvalidArgumentException`: If keySelector is not a function.
- `NotIterableException`: If second is not iterable.

**Examples**

```typescript
// Basic key selection
const seq1 = [
  { id: 1, val: "a" },
  { id: 2, val: "b" },
];
const seq2 = [
  { id: 2, val: "c" },
  { id: 3, val: "d" },
];

await AsyncEnumerable.create(seq1)
  .exclusiveBy(seq2, async (x) => x.id)
  .toArray();
// [{ id: 1, val: 'a' }, { id: 3, val: 'd' }]

// Case insensitive name comparison
class CaseInsensitiveComparer extends EqualityComparer<string> {
  equals(x?: string, y?: string): boolean {
    return (x || "").toLowerCase() === (y || "").toLowerCase();
  }
}

const names1 = [{ name: "John" }, { name: "JANE" }];
const names2 = [{ name: "jane" }, { name: "Bob" }];

await AsyncEnumerable.create(names1)
  .exclusiveBy(names2, async (x) => x.name, new CaseInsensitiveComparer())
  .toArray();
// [{ name: 'John' }, { name: 'Bob' }]
```

**See Also**

- [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/symmetricDifference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/symmetricDifference)

---

### first

#### `first<T>(predicate)`

Returns the first element in a sequence, or the first element that satisfies a
condition.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `predicate`: Optional. An async function to test each element for a condition.

**Returns**: A Promise that resolves to the first element in the sequence that
passes the test if provided, or the first element if no predicate is specified.

**Throws**

- `NoElementsException`: If the sequence is empty.
- `NoElementsSatisfyCondition`: If no element satisfies the predicate.
- `InvalidArgumentException`: If predicate is provided but is not a function.

**Examples**

```typescript
// First element
await AsyncEnumerable.create([1, 2, 3]).first(); // 1

// First matching element
await AsyncEnumerable.create([1, 2, 3]).first(async (x) => x > 1); // 2

// Empty sequence throws
await AsyncEnumerable.create([]).first(); // throws NoElementsException

// No matches throws
await AsyncEnumerable.create([1, 2]).first(async (x) => x > 5); // throws NoElementsSatisfyCondition
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.first](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.first)

---

### firstOrDefault

#### `firstOrDefault<T>(defaultValue, predicate)`

Returns the first element in a sequence that satisfies a condition, or a default
value if no element exists or matches the condition.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `defaultValue`: The value to return if no element exists or matches the
  condition.
- `predicate`: Optional. An async function to test each element for a condition.

**Returns**: A Promise that resolves to the first element that passes the
predicate if provided, or the first element if no predicate specified; returns
defaultValue if the sequence is empty or no element matches.

**Examples**

```typescript
// First element or default
await AsyncEnumerable.create([1, 2]).firstOrDefault(0); // 1
await AsyncEnumerable.create([]).firstOrDefault(0); // 0

// With predicate
await AsyncEnumerable.create([1, 2, 3]).firstOrDefault(0, async (x) => x > 2); // 3

// No matches returns default
await AsyncEnumerable.create([1, 2]).firstOrDefault(0, async (x) => x > 5); // 0

// With objects
const defaultPerson = { id: 0, name: "default" };
await AsyncEnumerable.create([]).firstOrDefault(defaultPerson); // { id: 0, name: 'default' }
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.firstordefault](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.firstordefault)

---

### forEach

#### `forEach<T, TResult>(action)`

Performs an async action on each element of a sequence and returns a sequence of
the results.

**Type Parameters**

- `T`: The type of elements in the source sequence.
- `TResult`: The type of elements in the result sequence.

**Parameters**

- `action`: An async function to execute on each element, returning a result.

**Returns**: An IAsyncEnumerable\<TResult> containing the results of executing
the action on each element.

**Throws**

- `InvalidArgumentException`: If action is not a function.

---

### groupBy

#### `groupBy<T, TKey>(keySelector, comparer)`

Groups elements in a sequence according to a specified async key selector
function.

**Type Parameters**

- `T`: The type of elements in the sequence.
- `TKey`: The type of the key returned by keySelector.

**Parameters**

- `keySelector`: An async function to extract the key for each element.
- `comparer`: Optional. An async or sync EqualityComparer\<TKey> to compare
  keys. If not provided, uses the default equality comparer.

**Returns**: An IAsyncEnumerable<IGrouping<TKey, T>> where each IGrouping object
contains a sequence of objects and a key.

**Throws**

- `InvalidArgumentException`: If keySelector is not a function.

**Examples**

```typescript
// Basic number grouping
const numbers = [1, 2, 3, 4, 5];
await AsyncEnumerable.create(numbers)
  .groupBy(async (x) => x % 2)
  .select(async (g) => ({
    key: g.key,
    values: await g.toArray(),
  }))
  .toArray();
// [
//   { key: 1, values: [1, 3, 5] },
//   { key: 0, values: [2, 4] }
// ]

// Object grouping with async operations
const items = [
  { category: "A", value: 1 },
  { category: "B", value: 2 },
  { category: "A", value: 3 },
];

await AsyncEnumerable.create(items)
  .groupBy(async (x) => x.category)
  .select(async (g) => ({
    category: g.key,
    sum: await g.sum(async (x) => x.value),
  }))
  .toArray();
// [
//   { category: 'A', sum: 4 },
//   { category: 'B', sum: 2 }
// ]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupby](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupby)

---

#### `groupBy<T, TKey, TElement>(keySelector, elementSelector, comparer)`

Groups and transforms elements in a sequence according to a specified async key
selector function.

**Type Parameters**

- `T`: The type of elements in the source sequence.
- `TKey`: The type of the key returned by keySelector.
- `TElement`: The type of the elements in the resulting groups.

**Parameters**

- `keySelector`: An async function to extract the key for each element.
- `elementSelector`: An async function to transform each source element.
- `comparer`: Optional. An async or sync EqualityComparer\<TKey> to compare
  keys. If not provided, uses the default equality comparer.

**Returns**: An IAsyncEnumerable<IGrouping<TKey, TElement>> where each IGrouping
object contains transformed elements and a key.

**Throws**

- `InvalidArgumentException`: If keySelector or elementSelector is not a
  function.

**Examples**

```typescript
// Group and transform objects
const orders = [
  { id: 1, category: "A", amount: 100 },
  { id: 2, category: "B", amount: 200 },
  { id: 3, category: "A", amount: 300 },
];

await AsyncEnumerable.create(orders)
  .groupBy(
    async (x) => x.category,
    async (x) => ({
      orderId: x.id,
      value: x.amount,
    }),
  )
  .select(async (g) => ({
    category: g.key,
    orders: await g.toArray(),
    total: await g.sum(async (x) => x.value),
  }))
  .toArray();
// [
//   {
//     category: 'A',
//     orders: [
//       { orderId: 1, value: 100 },
//       { orderId: 3, value: 300 }
//     ],
//     total: 400
//   },
//   {
//     category: 'B',
//     orders: [
//       { orderId: 2, value: 200 }
//     ],
//     total: 200
//   }
// ]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupby](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupby)

---

#### `groupBy<T, TKey, TResult, TElement>(keySelector, elementSelector, resultSelector, comparer)`

Groups and transforms elements in a sequence with optional element and result
transformations.

**Type Parameters**

- `T`: The type of elements in the source sequence.
- `TKey`: The type of the key returned by keySelector.
- `TResult`: The type of the elements in the resulting sequence.
- `TElement`: The type of the elements in the intermediate groups.

**Parameters**

- `keySelector`: An async function to extract the key for each element.
- `elementSelector`: An async function to transform each source element.
- `resultSelector`: An async function to transform each group into a result
  value.
- `comparer`: Optional. An async or sync EqualityComparer\<TKey> to compare
  keys.

**Returns**: An IAsyncEnumerable\<TResult> containing the transformed groups.

**Throws**

- `InvalidArgumentException`: If keySelector or elementSelector or
  resultSelector is not a function.

**Examples**

```typescript
// Group, transform elements, and compute results
const orders = [
  { id: 1, category: "A", amount: 100 },
  { id: 2, category: "B", amount: 200 },
  { id: 3, category: "A", amount: 300 },
];

await AsyncEnumerable.create(orders)
  .groupBy(
    async (x) => x.category, // key selector
    async (x) => x.amount, // element selector
    async (key, elements) => ({
      // result selector
      category: key,
      totalAmount: await elements.sum(),
      count: await elements.count(),
    }),
  )
  .toArray();
// [
//   { category: 'A', totalAmount: 400, count: 2 },
//   { category: 'B', totalAmount: 200, count: 1 }
// ]

// With custom key comparer
class CaseInsensitiveComparer extends EqualityComparer<string> {
  equals(x?: string, y?: string): boolean {
    return (x || "").toLowerCase() === (y || "").toLowerCase();
  }
}

await AsyncEnumerable.create(["A", "a", "B", "b"])
  .groupBy(
    async (x) => x,
    undefined,
    async (key, elements) => ({
      key: key,
      count: await elements.count(),
    }),
    new CaseInsensitiveComparer(),
  )
  .toArray();
// [
//   { key: 'A', count: 2 },
//   { key: 'B', count: 2 }
// ]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupby](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupby)

---

### groupJoin

#### `groupJoin<TInner, TKey, TResult>(inner, outerKeySelector, innerKeySelector, resultSelector, comparer)`

Correlates elements of two sequences based on key equality and groups the
results.

**Type Parameters**

- `TInner`: The type of elements in the inner sequence.
- `TKey`: The type of the keys returned by the key selector functions.
- `TResult`: The type of the result elements.

**Parameters**

- `inner`: The sequence to join to the first sequence. Can be array, iterable,
  or async iterable.
- `outerKeySelector`: An async function to extract the join key from each
  element of the first sequence.
- `innerKeySelector`: An async function to extract the join key from each
  element of the second sequence.
- `resultSelector`: An async function to create a result element from an outer
  element and its matching inner elements.
- `comparer`: Optional. An async or sync EqualityComparer\<TKey> to compare
  keys.

**Returns**: An IAsyncEnumerable\<TResult> containing elements obtained by
performing a grouped join on two sequences.

**Throws**

- `NotIterableException`: If inner is not iterable
- `InvalidArgumentException`: If outerKeySelector, innerKeySelector, or
  resultSelector is not a function.

**Examples**

```typescript
// Basic group join
const departments = [
  { id: 1, name: "HR" },
  { id: 2, name: "IT" },
];

const employees = [
  { deptId: 1, name: "John" },
  { deptId: 1, name: "Jane" },
  { deptId: 2, name: "Bob" },
];

await AsyncEnumerable.create(departments)
  .groupJoin(
    employees,
    async (dept) => dept.id,
    async (emp) => emp.deptId,
    async (dept, emps) => ({
      department: dept.name,
      employees: await emps.select(async (e) => e.name).toArray(),
    }),
  )
  .toArray();
// [
//   { department: 'HR', employees: ['John', 'Jane'] },
//   { department: 'IT', employees: ['Bob'] }
// ]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupjoin](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.groupjoin)

---

### index

#### `index<T>()`

Returns a sequence of tuples containing each element with its zero-based index.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Returns**: An IAsyncEnumerable<[number, T]> containing tuples of index and
element pairs.

**Examples**

```typescript
// Basic indexing
await AsyncEnumerable.create(["a", "b", "c"]).index().toArray(); // [[0, 'a'], [1, 'b'], [2, 'c']]

// Object indexing
await AsyncEnumerable.create([{ id: 1 }, { id: 2 }])
  .index()
  .toArray(); // [[0, { id: 1 }], [1, { id: 2 }]]

// Empty sequence
await AsyncEnumerable.create([]).index().toArray(); // []

// With async transformation
await AsyncEnumerable.create(["a", "b", "c"])
  .index()
  .select(async ([i, val]) => `${i}: ${val}`)
  .toArray(); // ['0: a', '1: b', '2: c']
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.index](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.index)

---

### intersect

#### `intersect<T>(second, comparer)`

Produces the set intersection of two sequences using an optional equality
comparer.

**Type Parameters**

- `T`: The type of elements in the sequences.

**Parameters**

- `second`: The sequence to intersect with the first sequence. Can be array,
  iterable, or async iterable.
- `comparer`: Optional. An equality comparer to compare values. Can be async or
  sync comparer.

**Returns**: An IAsyncEnumerable\<T> containing elements that exist in both
sequences.

**Throws**

- `NotIterableException`: If second is not iterable.

**Examples**

```typescript
// Basic number intersection
await AsyncEnumerable.create([1, 2, 3]).intersect([2, 3, 4]).toArray(); // [2, 3]

// Object intersection with custom comparer
class PersonComparer extends EqualityComparer<{ id: number }> {
  equals(x?: { id: number }, y?: { id: number }): boolean {
    return x?.id === y?.id;
  }
}

const seq1 = [{ id: 1 }, { id: 2 }];
const seq2 = [{ id: 2 }, { id: 3 }];

await AsyncEnumerable.create(seq1)
  .intersect(seq2, new PersonComparer())
  .toArray(); // [{id: 2}]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.intersect](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.intersect)

---

### intersectBy

#### `intersectBy<T, TKey>(second, keySelector, comparer)`

Produces the set intersection of two sequences according to a specified key
selector function.

**Type Parameters**

- `T`: The type of elements in the source sequence.
- `TKey`: The type of key to compare elements by.

**Parameters**

- `second`: The sequence whose keys will be used for intersection. Can be array,
  iterable, or async iterable.
- `keySelector`: An async function to extract the key for each element.
- `comparer`: Optional. An equality comparer to compare keys. Can be async or
  sync comparer.

**Returns**: An IAsyncEnumerable\<T> containing elements from the first sequence
whose keys are also present in the second sequence.

**Throws**

- `InvalidArgumentException`: If keySelector is not a function.
- `NotIterableException`: If second is not iterable.

**Examples**

```typescript
// Basic key selection
const items = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
];
const ids = [2, 3];

await AsyncEnumerable.create(items)
  .intersectBy(ids, (x) => x.id)
  .toArray(); // [{ id: 2, name: 'Jane' }]

// Case insensitive comparison
class CaseInsensitiveComparer extends EqualityComparer<string> {
  equals(x?: string, y?: string): boolean {
    return (x || "").toLowerCase() === (y || "").toLowerCase();
  }
}

const names = [{ name: "John" }, { name: "JANE" }];
const filter = ["jane", "bob"];

await AsyncEnumerable.create(names)
  .intersectBy(filter, (x) => x.name, new CaseInsensitiveComparer())
  .toArray(); // [{ name: 'JANE' }]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.intersectby](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.intersectby)

---

### isDisjointFrom

#### `isDisjointFrom<TSecond>(second)`

Determines whether the current sequence is disjoint from a specified sequence.

**Type Parameters**

- `TSecond`: The type of elements in the second sequence.

**Parameters**

- `second`: The sequence to compare to the current sequence. Can be array,
  iterable, or async iterable.

**Returns**: A Promise that resolves to true if the current sequence and the
specified sequence have no elements in common; otherwise, false.

**Throws**

- `NotIterableException`: If second is not iterable.

**Examples**

```typescript
const first = [1, 2, 3];
const second = [4, 5, 6];

AsyncEnumerable.create(first).isDisjointFrom(second); // true
```

**See Also**

- [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/isDisjointFrom](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/isDisjointFrom)

---

### isSubsetOf

#### `isSubsetOf<TSecond>(second)`

Determines whether a sequence is a subset of a specified sequence.

**Type Parameters**

- `TSecond`: The type of elements in the second sequence.

**Parameters**

- `second`: The sequence to compare to the current sequence. Can be array,
  iterable, or async iterable.

**Returns**: A Promise that resolves to true if the current sequence is a subset
of the specified sequence; otherwise, false.

**Throws**

- `NotIterableException`: If second is not iterable.

**Examples**

```typescript
const first = [1, 2, 3];
const second = [1, 2, 3, 4, 5];

AsyncEnumerable.create(first).isSubsetOfAsync(second); // true

const first = [1, 2, 3];
const second = [1, 2, 4, 5, 6];

AsyncEnumerable.create(first).isSubsetOfAsync(second); // false
```

**See Also**

- [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/isSubsetOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/isSubsetOf)

---

### isSupersetOf

#### `isSupersetOf<TSecond>(second)`

Determines whether a sequence is a superset of a specified sequence.

**Type Parameters**

- `TSecond`: The type of elements in the second sequence.

**Parameters**

- `second`: The sequence to compare to the current sequence. Can be array,
  iterable, or async iterable.

**Returns**: A Promise that resolves to true if the current sequence is a
superset of the specified sequence; otherwise, false.

**Throws**

- `NotIterableException`: If second is not iterable.

**Examples**

```typescript
const first = [1, 2, 3, 4, 5];
const second = [1, 2, 3];

AsyncEnumerable.create(first).isSupersetOfAsync(second); // true

const first = [1, 2, 3];
const second = [1, 2, 3, 4, 5];

AsyncEnumerable.create(first).isSupersetOfAsync(second); // false
```

**See Also**

- [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/isSupersetOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/isSupersetOf)

---

### join

#### `join<TInner, TKey, TResult>(inner, outerKeySelector, innerKeySelector, resultSelector, comparer)`

Correlates elements of two sequences based on matching keys.

**Type Parameters**

- `TInner`: The type of elements in the inner sequence.
- `TKey`: The type of the keys returned by the key selector functions.
- `TResult`: The type of the result elements.

**Parameters**

- `inner`: The sequence to join with the first sequence. Can be array, iterable,
  or async iterable.
- `outerKeySelector`: An async function to extract join key from outer sequence
  element.
- `innerKeySelector`: An async function to extract join key from inner sequence
  element.
- `resultSelector`: An async function to create result element from one outer
  and one inner element.
- `comparer`: Optional. An equality comparer to compare keys. Can be async or
  sync comparer.

**Returns**: An IAsyncEnumerable\<TResult> containing results from matching
elements from both sequences.

**Throws**

- `InvalidArgumentException`: If any required parameter is not a function.
- `NotIterableException`: If inner is not iterable.

**Examples**

```typescript
const orders = [
  { id: 1, customerId: 1, total: 100 },
  { id: 2, customerId: 2, total: 200 },
  { id: 3, customerId: 1, total: 300 },
];

const customers = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
];

await AsyncEnumerable.create(orders)
  .join(
    customers,
    (order) => order.customerId,
    (customer) => customer.id,
    (order, customer) => ({
      orderId: order.id,
      customerName: customer.name,
      total: order.total,
    }),
  )
  .toArray();
// [
//   { orderId: 1, customerName: 'John', total: 100 },
//   { orderId: 2, customerName: 'Jane', total: 200 },
//   { orderId: 3, customerName: 'John', total: 300 }
// ]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.join](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.join)

---

### last

#### `last<T>(predicate)`

Returns the last element in a sequence, or the last element that satisfies a
condition.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `predicate`: Optional. A function to test each element for a condition. Can be
  async or sync predicate.

**Returns**: A Promise that resolves to the last element in the sequence that
passes the test if provided, or the last element if no predicate is specified.

**Throws**

- `NoElementsException`: If the sequence is empty.
- `NoElementsSatisfyCondition`: If no element satisfies the predicate.
- `InvalidArgumentException`: If predicate is provided but is not a function.

**Examples**

```typescript
// Last element
await AsyncEnumerable.create([1, 2, 3]).last(); // 3

// Last matching element
await AsyncEnumerable.create([1, 2, 3, 2]).last((x) => x === 2); // 2

// With async predicate
await AsyncEnumerable.create([1, 2, 3, 2]).last(async (x) => x === 2); // 2

// Empty sequence throws
await AsyncEnumerable.create([]).last(); // throws InvalidOperationException

// No matches throws
await AsyncEnumerable.create([1, 2]).last((x) => x > 5); // throws InvalidOperationException
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.last](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.last)

---

### lastOrDefault

#### `lastOrDefault<T>(defaultValue, predicate)`

Returns the last element in a sequence that satisfies a condition, or a default
value if no element exists or matches the condition.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `defaultValue`: The value to return if no element exists or matches the
  condition.
- `predicate`: Optional. A function to test each element for a condition. Can be
  async or sync predicate.

**Returns**: A Promise that resolves to the last element that passes the
predicate if provided, or the last element if no predicate specified; returns
defaultValue if the sequence is empty or no element matches.

**Examples**

```typescript
// Last element or default
await AsyncEnumerable.create([1, 2]).lastOrDefault(0); // 2
await AsyncEnumerable.create<number>([]).lastOrDefault(0); // 0

// With predicate
await AsyncEnumerable.create([1, 2, 3, 2]).lastOrDefault(0, (x) => x === 2); // 2

// With async predicate
await AsyncEnumerable.create([1, 2, 3, 2]).lastOrDefault(
  0,
  async (x) => x === 2,
); // 2

// No matches returns default
await AsyncEnumerable.create([1, 2]).lastOrDefault(0, (x) => x > 5); // 0

// With objects
const defaultPerson = { id: 0, name: "default" };
await AsyncEnumerable.create<typeof defaultPerson>([]).lastOrDefault(
  defaultPerson,
); // { id: 0, name: 'default' }
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.lastordefault](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.lastordefault)

---

### max

#### `max()`

Returns the maximum value in a sequence of numbers.

**Returns**: A Promise that resolves to the maximum value in the sequence.

**Throws**

- `NoElementsException`: If the sequence is empty.
- `InvalidElementsCollection`: If any element in the sequence is not a number.

**Examples**

```typescript
// Basic maximum
await AsyncEnumerable.create([1, 2, 3]).max(); // 3

// Single element
await AsyncEnumerable.create([1]).max(); // 1

// Empty sequence throws
await AsyncEnumerable.create([]).max(); // throws InvalidOperationException

// Mixed types throw
await AsyncEnumerable.create([1, "2"]).max(); // throws TypeError
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.max](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.max)

---

#### `max<T>(comparer)`

Returns the maximum value in a sequence using a custom comparer.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `comparer`: A Comparer\<T> or ComparerAsync\<T> to compare elements.

**Returns**: A Promise that resolves to the maximum value in the sequence
according to the comparer.

**Throws**

- `InvalidOperationException`: If the sequence is empty.

**Examples**

```typescript
// Custom object comparison
class PersonComparer extends Comparer<{ age: number }> {
  compare(x?: { age: number }, y?: { age: number }): number {
    return (x?.age ?? 0) - (y?.age ?? 0);
  }
}

const people = [{ age: 25 }, { age: 30 }, { age: 20 }];

await AsyncEnumerable.create(people).max(new PersonComparer()); // { age: 30 }

// Custom string length comparison with async comparer
class StringLengthComparerAsync extends ComparerAsync<string> {
  async compare(x?: string, y?: string): Promise<number> {
    return (x?.length ?? 0) - (y?.length ?? 0);
  }
}

await AsyncEnumerable.create(["a", "bbb", "cc"]).max(
  new StringLengthComparerAsync(),
); // 'bbb'
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.max](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.max)

---

### maxBy

#### `maxBy<T, T>(transformer, keySelector, comparer)`

Returns the maximum value in a sequence by using a key selector function to
extract numeric values from elements.

**Type Parameters**

- `T`: The type of elements in the sequence.
- `T`: The type of elements in the sequence.

**Parameters**

- `transformer`: A function to extract a numeric value from each element.
- `keySelector`: A function to extract a numeric value from each element.
- `comparer`: Optional. A ComparerAsync\<number> to compare the extracted
  values.

**Returns**: A Promise that resolves to the maximum numeric value extracted from
the sequence.

**Throws**

- `InvalidOperationException`: If the sequence is empty.
- `InvalidArgumentException`: If transformer is not a function.
- `InvalidElementsCollection`: If any extracted value is not a number.
- `InvalidOperationException`: If the sequence is empty.
- `InvalidArgumentException`: If keySelector is not a function.
- `InvalidElementsCollection`: If any extracted value is not a number.

**Examples**

```typescript
// Object property maximum
const items = [
  { id: 1, value: 10 },
  { id: 2, value: 30 },
  { id: 3, value: 20 },
];

await AsyncEnumerable.create(items).max((x) => x.value); // 30

// String length maximum
await AsyncEnumerable.create(["a", "bbb", "cc"]).max((x) => x.length); // 3
```

```typescript
// Find object with maximum value
const items = [
  { id: 1, value: 10, name: "A" },
  { id: 2, value: 30, name: "B" },
  { id: 3, value: 20, name: "C" },
];

await AsyncEnumerable.create(items).maxBy((x) => x.value); // { id: 2, value: 30, name: 'B' }

// With custom comparer
class AbsoluteComparerAsync extends ComparerAsync<number> {
  async compare(x?: number, y?: number): Promise<number> {
    return Math.abs(x ?? 0) - Math.abs(y ?? 0);
  }
}

await AsyncEnumerable.create([{ val: -5 }, { val: 3 }]).maxBy(
  (x) => x.val,
  new AbsoluteComparerAsync(),
); // { val: -5 }
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.maxby](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.maxby)

---

### min

#### `min()`

Returns the minimum value in a sequence of numbers.

**Returns**: A Promise that resolves to the minimum value in the sequence.

**Throws**

- `InvalidOperationException`: If the sequence is empty.
- `InvalidElementsCollection`: If any element in the sequence is not a number.

**Examples**

```typescript
// Basic minimum
await AsyncEnumerable.create([1, 2, 3]).min(); // 1

// Single element
await AsyncEnumerable.create([5]).min(); // 5

// Empty sequence throws
await AsyncEnumerable.create([]).min(); // throws InvalidOperationException

// Mixed types throw
await AsyncEnumerable.create([1, "2"]).min(); // throws TypeError
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.min](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.min)

---

#### `min<T>(comparer)`

Returns the minimum value in a sequence using a custom comparer.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `comparer`: A ComparerAsync\<T> to compare elements.

**Returns**: A Promise that resolves to the minimum value in the sequence
according to the comparer.

**Throws**

- `InvalidOperationException`: If the sequence is empty.

**Examples**

```typescript
// Custom object comparison
class PersonComparerAsync extends ComparerAsync<{ age: number }> {
  async compare(x?: { age: number }, y?: { age: number }): Promise<number> {
    return (x?.age ?? 0) - (y?.age ?? 0);
  }
}

const people = [{ age: 25 }, { age: 30 }, { age: 20 }];

await AsyncEnumerable.create(people).min(new PersonComparerAsync()); // { age: 20 }

// Custom string length comparison
class StringLengthComparerAsync extends ComparerAsync<string> {
  async compare(x?: string, y?: string): Promise<number> {
    return (x?.length ?? 0) - (y?.length ?? 0);
  }
}

await AsyncEnumerable.create(["aaa", "b", "cc"]).min(
  new StringLengthComparerAsync(),
); // 'b'
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.min](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.min)

---

### minBy

#### `minBy<T, T>(keySelector, keySelector, comparer)`

Returns the minimum value in a sequence by using a key selector function to
extract numeric values from elements.

**Type Parameters**

- `T`: The type of elements in the sequence.
- `T`: The type of elements in the sequence.

**Parameters**

- `keySelector`: A function to extract a numeric value from each element.
- `keySelector`: A function to extract a numeric value from each element.
- `comparer`: Optional. A ComparerAsync\<number> to compare the extracted
  values.

**Returns**: A Promise that resolves to the minimum numeric value extracted from
the sequence.

**Throws**

- `NoElementsException`: If the sequence is empty.
- `InvalidArgumentException`: If transformer is not a function.
- `InvalidElementsCollection`: If any extracted value is not a number.
- `InvalidOperationException`: If the sequence is empty.
- `InvalidArgumentException`: If keySelector is not a function.
- `InvalidElementsCollection`: If any extracted value is not a number.

**Examples**

```typescript
// Object property minimum
const items = [
  { id: 1, value: 10 },
  { id: 2, value: 30 },
  { id: 3, value: 20 },
];

await AsyncEnumerable.create(items).min((x) => x.value); // 10

// String length minimum
await AsyncEnumerable.create(["aaa", "b", "cc"]).min((x) => x.length); // 1
```

```typescript
// Find object with minimum value
const items = [
  { id: 1, value: 10, name: "A" },
  { id: 2, value: 30, name: "B" },
  { id: 3, value: 20, name: "C" },
];

await AsyncEnumerable.create(items).minBy((x) => x.value); // { id: 1, value: 10, name: 'A' }

// With custom comparer
class AbsoluteComparerAsync extends ComparerAsync<number> {
  async compare(x?: number, y?: number): Promise<number> {
    return Math.abs(x ?? 0) - Math.abs(y ?? 0);
  }
}

await AsyncEnumerable.create([{ val: -5 }, { val: 3 }]).minBy(
  (x) => x.val,
  new AbsoluteComparerAsync(),
); // { val: 3 }
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.minby](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.minby)

---

### ofType

#### `ofType<TType>(type)`

Filters elements of a sequence based on a specified type.

**Type Parameters**

- `TType`: The type to filter the elements to. Must be one of the supported
  OfType values.

**Parameters**

- `type`: The type to filter by (e.g., String, Number, Boolean).

**Returns**: An IAsyncEnumerable\<TType> containing only the elements of the
specified type.

**Examples**

```typescript
// Filter numbers
await AsyncEnumerable.create([1, "a", 2, "b", 3]).ofType("number").toArray(); // [1, 2, 3]

// Filter strings
await AsyncEnumerable.create([1, "a", 2, "b"]).ofType("string").toArray(); // ['a', 'b']

// Filter String objects
await AsyncEnumerable.create([1, "a", 2, "b", new String("c")])
  .ofType(String)
  .toArray(); // ['c']

// Custom class filtering
class Person {}
const items = [new Person(), "a", new Person()];

await AsyncEnumerable.create(items).ofType(Person).toArray(); // [Person {}, Person {}]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.oftype](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.oftype)

---

### order

#### `order<T>(comparer)`

Creates a sorted sequence according to a comparer.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `comparer`: Optional. Comparer to compare elements. Can be a
  ComparerAsync\<T>, "string" for string comparison, or "number" for numeric
  comparison.

**Returns**: An IOrderedAsyncEnumerable\<T> whose elements are sorted.

**Examples**

```typescript
// Basic ordering
const numbers = await AsyncEnumerable.create([3, 1, 2]).order().toArray(); // [1, 2, 3]

// String comparison
const words = await AsyncEnumerable.create(["c", "a", "b"])
  .order("string")
  .toArray(); // ['a', 'b', 'c']

// Custom comparison
class PersonComparerAsync extends ComparerAsync<{ age: number }> {
  async compare(x?: { age: number }, y?: { age: number }): Promise<number> {
    return (x?.age ?? 0) - (y?.age ?? 0);
  }
}

const people = await AsyncEnumerable.create([
  { age: 30, name: "Bob" },
  { age: 20, name: "Alice" },
])
  .order(new PersonComparerAsync())
  .select((x) => x.name)
  .toArray(); // ['Alice', 'Bob']
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.order](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.order)

---

### orderBy

#### `orderBy<T, TKey>(keySelector, comparer)`

Sorts the elements of a sequence according to a key selector function.

**Type Parameters**

- `T`: The type of elements in the sequence.
- `TKey`: The type of the key returned by keySelector.

**Parameters**

- `keySelector`: A function to extract a key from each element.
- `comparer`: Optional. A Comparer\<TKey> to compare keys. If not provided, uses
  the default comparer.

**Returns**: An IOrderedAsyncEnumerable\<T> whose elements are sorted by key.

**Throws**

- `InvalidArgumentException`: If keySelector is not a function.

**Examples**

```typescript
// Basic property ordering
const items = [
  { id: 3, name: "C" },
  { id: 1, name: "A" },
  { id: 2, name: "B" },
];

await AsyncEnumerable.create(items)
  .orderBy((x) => x.id)
  .select((x) => x.name)
  .toArray(); // ['A', 'B', 'C']

// Custom key comparison
class CaseInsensitiveComparer extends Comparer<string> {
  compare(x?: string, y?: string): number {
    return (x || "").toLowerCase().localeCompare((y || "").toLowerCase());
  }
}

const names = [{ name: "bob" }, { name: "Alice" }, { name: "Charlie" }];

await AsyncEnumerable.create(names)
  .orderBy((x) => x.name, new CaseInsensitiveComparer())
  .select((x) => x.name)
  .toArray(); // ['Alice', 'bob', 'Charlie']
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.orderby](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.orderby)

---

### orderByDescending

#### `orderByDescending<T, TKey>(keySelector, comparer)`

Sorts the elements of a sequence in descending order according to a key selector
function.

**Type Parameters**

- `T`: The type of elements in the sequence.
- `TKey`: The type of the key returned by keySelector.

**Parameters**

- `keySelector`: A function to extract a key from each element.
- `comparer`: Optional. A Comparer\<TKey> to compare keys. If not provided, uses
  the default comparer.

**Returns**: An IOrderedAsyncEnumerable\<T> whose elements are sorted in
descending order by key.

**Throws**

- `InvalidArgumentException`: If keySelector is not a function.

**Examples**

```typescript
// Basic descending property order
const items = [
  { id: 1, name: "A" },
  { id: 3, name: "C" },
  { id: 2, name: "B" },
];

await AsyncEnumerable.create(items)
  .orderByDescending((x) => x.id)
  .select((x) => x.name)
  .toArray(); // ['C', 'B', 'A']

// Custom comparison
class ReverseStringComparer extends Comparer<string> {
  compare(x?: string, y?: string): number {
    return -(x || "").localeCompare(y || "");
  }
}

const names = ["Alice", "Bob", "Charlie"];

await AsyncEnumerable.create(names)
  .orderByDescending((x) => x, new ReverseStringComparer())
  .toArray(); // ["Alice", "Bob", "Charlie"]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.orderbydescending](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.orderbydescending)

---

### orderDescending

#### `orderDescending<T>(comparer)`

Creates a sorted sequence in descending order according to a comparer.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `comparer`: Optional. Comparer to compare elements. Can be a Comparer\<T>,
  "string" for string comparison, or "number" for numeric comparison.

**Returns**: An IOrderedAsyncEnumerable\<T> whose elements are sorted in
descending order.

**Examples**

```typescript
// Basic descending order
await AsyncEnumerable.create([1, 3, 2]).orderDescending().toArray(); // [3, 2, 1]

// Custom object comparison
class PersonComparer extends Comparer<{ age: number }> {
  compare(x?: { age: number }, y?: { age: number }): number {
    return (x?.age ?? 0) - (y?.age ?? 0);
  }
}

const people = [
  { age: 20, name: "Alice" },
  { age: 30, name: "Bob" },
  { age: 25, name: "Charlie" },
];

await AsyncEnumerable.create(people)
  .orderDescending(new PersonComparer())
  .select((x) => x.name)
  .toArray(); // ['Bob', 'Charlie', 'Alice']
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.orderdescending](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.orderdescending)

---

### prepend

#### `prepend<T>(item)`

Adds a value to the beginning of the sequence.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `item`: The value to prepend to the sequence.

**Returns**: A new sequence that begins with the specified item.

**Examples**

```typescript
// Basic prepend
await AsyncEnumerable.create([2, 3]).prepend(1).toArray(); // [1, 2, 3]

// Prepend to empty sequence
await AsyncEnumerable.create<number>([]).prepend(1).toArray(); // [1]

// Object prepend
const items = [{ id: 2 }, { id: 3 }];
await AsyncEnumerable.create(items).prepend({ id: 1 }).toArray(); // [{id: 1}, {id: 2}, {id: 3}]

// Multiple prepends
await AsyncEnumerable.create([3]).prepend(2).prepend(1).toArray(); // [1, 2, 3]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.prepend](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.prepend)

---

### reverse

#### `reverse<T>()`

Inverts the order of elements in a sequence.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Returns**: An IAsyncEnumerable\<T> whose elements correspond to those of the
input sequence in reverse order.

**Examples**

```typescript
// Basic number reversal
await AsyncEnumerable.create([1, 2, 3]).reverse().toArray(); // [3, 2, 1]

// String reversal
await AsyncEnumerable.create(["a", "b", "c"]).reverse().toArray(); // ['c', 'b', 'a']

// Object reversal
const items = [
  { id: 1, value: "first" },
  { id: 2, value: "second" },
];

await AsyncEnumerable.create(items)
  .reverse()
  .select((x) => x.value)
  .toArray(); // ['second', 'first']
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.reverse](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.reverse)

---

### select

#### `select<T, TResult>(selector)`

Projects each element of a sequence into a new form using a selector function.

**Type Parameters**

- `T`: The type of elements in the source sequence.
- `TResult`: The type of elements in the result sequence.

**Parameters**

- `selector`: A transform function to apply to each element. Optionally includes
  the index of the source element.

**Returns**: An IAsyncEnumerable\<TResult> whose elements are the result of
applying the transform function to each element of the source.

**Throws**

- `InvalidArgumentException`: If selector is not a function.

**Examples**

```typescript
// Basic transformation
await AsyncEnumerable.create([1, 2, 3])
  .select((x) => x * 2)
  .toArray(); // [2, 4, 6]

// Using index
await AsyncEnumerable.create(["a", "b", "c"])
  .select((x, i) => `${i}:${x}`)
  .toArray(); // ['0:a', '1:b', '2:c']

// Object transformation
const items = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
];

await AsyncEnumerable.create(items)
  .select((x) => ({
    userId: x.id,
    displayName: x.name.toUpperCase(),
  }))
  .toArray();
// [
//   { userId: 1, displayName: 'JOHN' },
//   { userId: 2, displayName: 'JANE' }
// ]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.select](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.select)

---

### selectMany

#### `selectMany<TCollection, TResult>(selector, resultSelector)`

Projects each element of a sequence to an IAsyncEnumerable\<T>, flattens the
resulting sequences into one sequence, and optionally transforms the flattened
elements.

**Type Parameters**

- `TCollection`: The type of collection elements to flatten.
- `TResult`: The type of elements in the result sequence.

**Parameters**

- `selector`: A function that returns a collection for each element.
- `resultSelector`: Optional. A function that transforms each flattened element.

**Returns**: An IAsyncEnumerable\<TResult> whose elements are the result of
invoking the transform function on each element of the flattened sequence.

**Throws**

- `InvalidArgumentException`: If selector is not a function.

**Examples**

```typescript
// Basic array flattening
const arrays = [
  [1, 2],
  [3, 4],
];
await AsyncEnumerable.create(arrays)
  .selectMany((x) => x)
  .toArray(); // [1, 2, 3, 4]

// With result transformation
const items = [
  { id: 1, values: [1, 2] },
  { id: 2, values: [3, 4] },
];

await AsyncEnumerable.create(items)
  .selectMany(
    (x) => x.values,
    async (item, value) => ({
      id: item.id,
      value: value,
    }),
  )
  .toArray();
// [
//   { id: 1, value: 1 },
//   { id: 1, value: 2 },
//   { id: 2, value: 3 },
//   { id: 2, value: 4 }
// ]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.selectmany](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.selectmany)

---

### sequenceEqual

#### `sequenceEqual<T>(second, comparer)`

Determines whether two sequences are equal by comparing their elements.

**Type Parameters**

- `T`: The type of elements in the sequences.

**Parameters**

- `second`: The sequence to compare to the first sequence.
- `comparer`: Optional. An EqualityComparer\<T> to compare elements. If not
  provided, uses the default equality comparer.

**Returns**: true if the sequences are equal; otherwise, false.

**Throws**

- `NotIterableException`: If second is not iterable.

**Examples**

```typescript
// Basic number comparison
await AsyncEnumerable.create([1, 2, 3]).sequenceEqual([1, 2, 3]); // true

await AsyncEnumerable.create([1, 2]).sequenceEqual([1, 2, 3]); // false

// Custom object comparison
class PersonComparer extends EqualityComparer<{ id: number }> {
  equals(x?: { id: number }, y?: { id: number }): boolean {
    return x?.id === y?.id;
  }
}

const seq1 = [{ id: 1 }, { id: 2 }];
const seq2 = [{ id: 1 }, { id: 2 }];

await AsyncEnumerable.create(seq1).sequenceEqual(seq2, new PersonComparer()); // true
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sequenceequal](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sequenceequal)

---

### shuffle

#### `shuffle<T>()`

Randomly reorders the elements in a sequence.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Returns**: A new IAsyncEnumerable\<T> containing all elements from the input
sequence in random order.

**Examples**

```typescript
// Basic number shuffling
const numbers = [1, 2, 3, 4, 5];
await AsyncEnumerable.create(numbers).shuffle().toArray(); // e.g., [3, 1, 5, 2, 4]

// Original sequence remains unchanged
console.log(numbers); // [1, 2, 3, 4, 5]

// Object shuffling
const items = [
  { id: 1, value: "A" },
  { id: 2, value: "B" },
  { id: 3, value: "C" },
];

await AsyncEnumerable.create(items)
  .shuffle()
  .select((x) => x.value)
  .toArray(); // e.g., ['B', 'C', 'A']
```

---

### single

#### `single<T>(predicate)`

Returns the only element in a sequence that satisfies a condition, or the only
element if no condition is specified.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `predicate`: Optional. A function to test each element for a condition.

**Returns**: The single element that satisfies the condition.

**Throws**

- `NoElementsException`: If the sequence is empty.
- `MoreThanOneElementSatisfiesCondition`: If more than one element exists or
  satisfies the condition.
- `InvalidArgumentException`: If predicate is provided but is not a function.
- `NoElementsSatisfyCondition`: If no element satisfies the condition.

**Examples**

```typescript
// Single element
await AsyncEnumerable.create([1]).single(); // 1

// With predicate
await AsyncEnumerable.create([1, 2, 3]).single((x) => x === 2); // 2

// Multiple elements throw
await AsyncEnumerable.create([1, 2]).single(); // throws MoreThanOneElementSatisfiesCondition

// Multiple matches throw
await AsyncEnumerable.create([1, 2, 2]).single((x) => x === 2); // throws MoreThanOneElementSatisfiesCondition
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.single](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.single)

---

### singleOrDefault

#### `singleOrDefault<T>(defaultValue, predicate)`

Returns the only element in a sequence that satisfies a condition, or a default
value if no element exists or if more than one element satisfies the condition.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `defaultValue`: The value to return if no element exists or if multiple
  elements match.
- `predicate`: Optional. A function to test each element for a condition.

**Returns**: The single element that satisfies the condition, or defaultValue if
no such element exists or if multiple elements satisfy the condition.

**Throws**

- `MoreThanOneElementSatisfiesCondition`: If more than one element exists and
  satisfies the condition.

**Examples**

```typescript
// Single element
await AsyncEnumerable.create([1]).singleOrDefault(0); // 1

// Empty sequence returns default
await AsyncEnumerable.create([]).singleOrDefault(0); // 0

// Multiple elements throws MoreThanOneElementSatisfiesCondition
await AsyncEnumerable.create([1, 2]).singleOrDefault(0); // throws MoreThanOneElementSatisfiesCondition

// Single match with predicate
await AsyncEnumerable.create([1, 2, 3]).singleOrDefault(0, (x) => x === 2); // 2

// Multiple matches return default
await AsyncEnumerable.create([1, 2, 2]).singleOrDefault(0, (x) => x === 2); // 0
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.singleordefault](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.singleordefault)

---

### skip

#### `skip<T>(count)`

Bypasses a specified number of elements in a sequence and then returns the
remaining elements.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `count`: The number of elements to skip. Negative values are treated as zero.

**Returns**: An IAsyncEnumerable\<T> that contains the elements that occur after
the specified index.

**Throws**

- `InvalidArgumentException`: If count is not a number.

**Examples**

```typescript
// Basic skip
await AsyncEnumerable.create([1, 2, 3, 4]).skip(2).toArray(); // [3, 4]

// Skip more than length
await AsyncEnumerable.create([1, 2]).skip(5).toArray(); // []

// Skip with negative count
await AsyncEnumerable.create([1, 2, 3]).skip(-1).toArray(); // [1, 2, 3]

// Skip with objects
const items = [
  { id: 1, value: "A" },
  { id: 2, value: "B" },
  { id: 3, value: "C" },
];

await AsyncEnumerable.create(items)
  .skip(1)
  .select((x) => x.value)
  .toArray(); // ['B', 'C']
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skip](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skip)

---

### skipLast

#### `skipLast<T>(count)`

Bypasses a specified number of elements at the end of a sequence.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `count`: The number of elements to skip from the end. Negative values are
  treated as zero.

**Returns**: An IAsyncEnumerable\<T> containing all elements except the last
count elements.

**Throws**

- `InvalidArgumentException`: If count is not a number.

**Examples**

```typescript
// Basic skip last
await AsyncEnumerable.create([1, 2, 3, 4]).skipLast(2).toArray(); // [1, 2]

// Skip more than length
await AsyncEnumerable.create([1, 2]).skipLast(5).toArray(); // []

// Skip with negative count
await AsyncEnumerable.create([1, 2, 3]).skipLast(-1).toArray(); // [1, 2, 3]

// Skip with objects
const items = [
  { id: 1, value: "A" },
  { id: 2, value: "B" },
  { id: 3, value: "C" },
];

await AsyncEnumerable.create(items)
  .skipLast(1)
  .select((x) => x.value)
  .toArray(); // ['A', 'B']
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skiplast](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skiplast)

---

### skipWhile

#### `skipWhile<T>(predicate)`

Bypasses elements in a sequence as long as a specified condition is true and
then returns the remaining elements.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `predicate`: A function to test each element for a condition. Takes the
  element and its index as parameters.

**Returns**: An IAsyncEnumerable\<T> that contains the elements from the input
sequence starting at the first element that does not satisfy the condition.

**Throws**

- `InvalidArgumentException`: If predicate is not a function.

**Examples**

```typescript
// Skip while less than 3
await AsyncEnumerable.create([1, 2, 3, 4, 2])
  .skipWhile((x) => x < 3)
  .toArray(); // [3, 4, 2]

// Using index in predicate
await AsyncEnumerable.create([1, 2, 3, 4])
  .skipWhile((x, i) => i < 2)
  .toArray(); // [3, 4]

// Object sequence
const items = [
  { value: 1, name: "A" },
  { value: 2, name: "B" },
  { value: 3, name: "C" },
  { value: 1, name: "D" },
];

await AsyncEnumerable.create(items)
  .skipWhile((x) => x.value < 3)
  .select((x) => x.name)
  .toArray(); // ['C', 'D']
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skipwhile](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skipwhile)

---

### sum

#### `sum<TResult>()`

Computes the sum of a sequence of numeric values, or concatenates a sequence of
strings.

**Type Parameters**

- `TResult`: The type of the sum result. Defaults to number for numeric
  sequences or string for string sequences.

**Returns**: For numbers: the sum of all values in the sequence. For strings:
the concatenation of all strings in the sequence.

**Throws**

- `NoElementsException`: If the sequence is empty.
- `InvalidElementsCollection`: If elements are not numbers or strings.

**Examples**

```typescript
// Number sum
await AsyncEnumerable.create([1, 2, 3]).sum(); // 6

// String concatenation
await AsyncEnumerable.create(["a", "b", "c"]).sum(); // 'abc'

// Empty sequence throws
await AsyncEnumerable.create([]).sum(); // throws InvalidOperationException

// Mixed types throw
await AsyncEnumerable.create([1, "2"]).sum(); // throws InvalidElementsCollection
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sum](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sum)

---

#### `sum<string>(selector)`

Computes the concatenation of string values selected from sequence elements.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `selector`: A function to extract a string value from each element.

**Returns**: The concatenation of all selected string values.

**Throws**

- `NoElementsException`: If the sequence is empty.
- `InvalidArgumentException`: If selector is not a function.
- `InvalidElementsCollection`: If any selected value is not a string.

**Examples**

```typescript
// Basic string concatenation
const items = [
  { id: 1, text: "Hello" },
  { id: 2, text: " " },
  { id: 3, text: "World" },
];

await AsyncEnumerable.create(items).sum((x) => x.text); // 'Hello World'

// Empty sequence throws
await AsyncEnumerable.create([]).sum((x) => x.toString()); // throws NoElementsException
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sum](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sum)

---

#### `sum<number>(selector)`

Computes the sum of numeric values selected from sequence elements.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `selector`: A function to extract a numeric value from each element.

**Returns**: The sum of the selected numeric values.

**Throws**

- `NoElementsException`: If the sequence is empty.
- `InvalidArgumentException`: If selector is not a function.
- `InvalidElementsCollection`: If any selected value is not a number.

**Examples**

```typescript
// Sum of extracted values
const items = [
  { id: 1, value: 10 },
  { id: 2, value: 20 },
  { id: 3, value: 30 },
];

await AsyncEnumerable.create(items).sum((x) => x.value); // 60

// String length sum
await AsyncEnumerable.create(["a", "bb", "ccc"]).sum((x) => x.length); // 6
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sum](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sum)

---

### take

#### `take<T>(count)`

Returns a specified number of contiguous elements from the start of a sequence.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `count`: The number of elements to return. Negative values are treated as
  zero.

**Returns**: An IAsyncEnumerable\<T> that contains the specified number of
elements from the start of the sequence.

**Throws**

- `InvalidArgumentException`: If count is not a number.

**Examples**

```typescript
// Basic take
await AsyncEnumerable.create([1, 2, 3, 4]).take(2).toArray(); // [1, 2]

// Take more than available
await AsyncEnumerable.create([1, 2]).take(5).toArray(); // [1, 2]

// Take with negative count
await AsyncEnumerable.create([1, 2, 3]).take(-1).toArray(); // []

// Take with objects
const items = [
  { id: 1, value: "A" },
  { id: 2, value: "B" },
  { id: 3, value: "C" },
];

await AsyncEnumerable.create(items)
  .take(2)
  .select((x) => x.value)
  .toArray(); // ['A', 'B']
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.take](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.take)

---

### takeLast

#### `takeLast<T>(count)`

Returns a specified number of contiguous elements from the end of a sequence.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `count`: The number of elements to take from the end. Negative values are
  treated as zero.

**Returns**: An IAsyncEnumerable\<T> that contains the specified number of
elements from the end of the sequence.

**Throws**

- `InvalidArgumentException`: If count is not a number.

**Examples**

```typescript
// Basic take last
await AsyncEnumerable.create([1, 2, 3, 4]).takeLast(2).toArray(); // [3, 4]

// Take more than available
await AsyncEnumerable.create([1, 2]).takeLast(5).toArray(); // [1, 2]

// Take with negative count
await AsyncEnumerable.create([1, 2, 3]).takeLast(-1).toArray(); // []

// Take with objects
const items = [
  { id: 1, value: "A" },
  { id: 2, value: "B" },
  { id: 3, value: "C" },
];

await AsyncEnumerable.create(items)
  .takeLast(2)
  .select((x) => x.value)
  .toArray(); // ['B', 'C']
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.takelast](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.takelast)

---

### takeWhile

#### `takeWhile<T>(predicate)`

Returns elements from a sequence as long as a specified condition is true.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `predicate`: A function to test each element for a condition. Takes the
  element and its index as parameters.

**Returns**: An IAsyncEnumerable\<T> that contains elements from the input
sequence until the predicate returns false.

**Throws**

- `InvalidArgumentException`: If predicate is not a function.

**Examples**

```typescript
// Take while less than 3
await AsyncEnumerable.create([1, 2, 3, 4, 1])
  .takeWhile((x) => x < 3)
  .toArray(); // [1, 2]

// Using index in predicate
await AsyncEnumerable.create([1, 2, 3, 4])
  .takeWhile((x, i) => i < 2)
  .toArray(); // [1, 2]

// Object sequence
const items = [
  { value: 1, name: "A" },
  { value: 2, name: "B" },
  { value: 3, name: "C" },
  { value: 1, name: "D" },
];

await AsyncEnumerable.create(items)
  .takeWhile((x) => x.value < 3)
  .select((x) => x.name)
  .toArray(); // ['A', 'B']
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.takewhile](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.takewhile)

---

### toArray

#### `toArray<T>()`

Creates an array from a sequence.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Returns**: A Promise that resolves to an array containing the elements from
the sequence.

**Examples**

```typescript
// Basic conversion
await AsyncEnumerable.create([1, 2, 3]).toArray(); // [1, 2, 3]

// Empty sequence
await AsyncEnumerable.create([]).toArray(); // []

// Object sequence
const items = [
  { id: 1, value: "A" },
  { id: 2, value: "B" },
];

await AsyncEnumerable.create(items)
  .select((x) => x.value)
  .toArray(); // ['A', 'B']
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.toarray](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.toarray)

---

### toMap

#### `toMap<T, TKey>(selector)`

Creates a Map<TKey, Array\<T>> from a sequence according to a specified key
selector function.

**Type Parameters**

- `T`: The type of elements in the sequence.
- `TKey`: The type of the key returned by selector.

**Parameters**

- `selector`: A function to extract the key from each element.

**Returns**: A Promise that resolves to a Map<TKey, Array\<T>> where each key
contains an array of all elements that share that key.

**Throws**

- `InvalidArgumentException`: If selector is not a function.

**Examples**

```typescript
// Group by number
const items = [
  { category: 1, name: "A" },
  { category: 2, name: "B" },
  { category: 1, name: "C" },
];

const map = await AsyncEnumerable.create(items).toMap((x) => x.category);

map.get(1); // [{ category: 1, name: 'A' }, { category: 1, name: 'C' }]
map.get(2); // [{ category: 2, name: 'B' }]

// Group by string
const people = [
  { dept: "IT", name: "John" },
  { dept: "HR", name: "Jane" },
  { dept: "IT", name: "Bob" },
];

const deptMap = await AsyncEnumerable.create(people).toMap((x) => x.dept);

deptMap.get("IT"); // [{ dept: 'IT', name: 'John' }, { dept: 'IT', name: 'Bob' }]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.todictionary](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.todictionary)

---

### toSet

#### `toSet<T>()`

Creates a Set\<T> from a sequence, automatically removing duplicate elements.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Returns**: A Promise that resolves to a Set\<T> that contains unique elements
from the sequence.

**Examples**

```typescript
// Basic conversion
await AsyncEnumerable.create([1, 2, 2, 3]).toSet(); // Set(3) {1, 2, 3}

// Empty sequence
await AsyncEnumerable.create([]).toSet(); // Set(0) {}

// Object sequence
const items = [
  { id: 1, name: "A" },
  { id: 1, name: "A" }, // Duplicate by value
  { id: 2, name: "B" },
];

await AsyncEnumerable.create(items).toSet(); // Set with 3 objects (unique by reference)
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.tohashset](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.tohashset)

---

### union

#### `union<T>(second, comparer)`

Produces the set union of two sequences using an optional equality comparer.

**Type Parameters**

- `T`: The type of elements in the sequences.

**Parameters**

- `second`: The sequence whose distinct elements form the second iterable.
- `comparer`: Optional. An EqualityComparerAsync\<T> to compare values. If not
  provided, uses the default equality comparer.

**Returns**: An IAsyncEnumerable\<T> that contains the elements from both input
sequences, excluding duplicates.

**Throws**

- `NotIterableException`: If second is not iterable.

**Examples**

```typescript
// Basic number union
await AsyncEnumerable.create([1, 2]).union([2, 3]).toArray(); // [1, 2, 3]

// Custom object comparison
class PersonComparer extends EqualityComparerAsync<{ id: number }> {
  async equals(x?: { id: number }, y?: { id: number }): Promise<boolean> {
    return x?.id === y?.id;
  }
}

const seq1 = [{ id: 1 }, { id: 2 }];
const seq2 = [{ id: 2 }, { id: 3 }];

await AsyncEnumerable.create(seq1)
  .union(seq2, new PersonComparer())
  .select((x) => x.id)
  .toArray(); // [1, 2, 3]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.union](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.union)

---

### unionBy

#### `unionBy<T, TKey>(second, keySelector, comparer)`

Produces the set union of two sequences according to a specified key selector
function.

**Type Parameters**

- `T`: The type of elements in the sequences.
- `TKey`: The type of key to compare elements by.

**Parameters**

- `second`: The sequence whose elements to unite.
- `keySelector`: A function to extract the key for each element.
- `comparer`: Optional. An EqualityComparerAsync\<TKey> to compare keys. If not
  provided, uses the default equality comparer.

**Returns**: An IAsyncEnumerable\<T> containing elements from both sequences,
excluding duplicates based on the selected keys.

**Throws**

- `NotIterableException`: If second is not iterable.
- `InvalidArgumentException`: If keySelector is not a function.

**Examples**

```typescript
// Basic key-based union
const seq1 = [
  { id: 1, val: "A" },
  { id: 2, val: "B" },
];
const seq2 = [
  { id: 2, val: "C" },
  { id: 3, val: "D" },
];

await AsyncEnumerable.create(seq1)
  .unionBy(seq2, (x) => x.id)
  .select((x) => x.val)
  .toArray(); // ['A', 'B', 'D']

// Case insensitive name union
class CaseInsensitiveComparer extends EqualityComparerAsync<string> {
  async equals(x?: string, y?: string): Promise<boolean> {
    return (x || "").toLowerCase() === (y || "").toLowerCase();
  }
}

const names1 = [{ name: "John" }, { name: "JANE" }];
const names2 = [{ name: "jane" }, { name: "Bob" }];

await AsyncEnumerable.create(names1)
  .unionBy(names2, (x) => x.name, new CaseInsensitiveComparer())
  .select((x) => x.name)
  .toArray(); // ['John', 'JANE', 'Bob']
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.unionby](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.unionby)

---

### where

#### `where<T>(predicate)`

Filters a sequence based on a predicate.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `predicate`: A function to test each element for a condition. Takes the
  element and its index as parameters.

**Returns**: An IAsyncEnumerable\<T> that contains elements that satisfy the
condition.

**Throws**

- `InvalidArgumentException`: If predicate is not a function.

**Examples**

```typescript
// Basic number filtering
await AsyncEnumerable.create([1, 2, 3, 4])
  .where((x) => x > 2)
  .toArray(); // [3, 4]

// Using index in predicate
await AsyncEnumerable.create(["a", "b", "c"])
  .where((x, i) => i % 2 === 0)
  .toArray(); // ['a', 'c']

// Object filtering
const items = [
  { id: 1, active: true },
  { id: 2, active: false },
  { id: 3, active: true },
];

await AsyncEnumerable.create(items)
  .where((x) => x.active)
  .select((x) => x.id)
  .toArray(); // [1, 3]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.where](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.where)

---

### zip

#### `zip<T, TSecond>(second)`

Combines two sequences by using the tuple type as the result selector.

**Type Parameters**

- `T`: The type of elements in the first sequence.
- `TSecond`: The type of elements in the second sequence.

**Parameters**

- `second`: The second sequence to combine with the first.

**Returns**: An IAsyncEnumerable<[T, TSecond]> containing tuples with elements
from both sequences. If sequences are of unequal length, the result only
includes pairs up to the length of the shorter sequence.

**Throws**

- `NotIterableException`: If second is not iterable.

**Examples**

```typescript
// Basic number and string zip
await AsyncEnumerable.create([1, 2, 3]).zip(["a", "b", "c"]).toArray(); // [[1, 'a'], [2, 'b'], [3, 'c']]

// Unequal lengths
await AsyncEnumerable.create([1, 2]).zip(["a", "b", "c"]).toArray(); // [[1, 'a'], [2, 'b']]

// Object zip
const numbers = [1, 2];
const letters = ["A", "B"];

await AsyncEnumerable.create(numbers)
  .zip(letters)
  .select(([num, letter]) => ({
    number: num,
    letter: letter,
  }))
  .toArray();
// [
//   { number: 1, letter: 'A' },
//   { number: 2, letter: 'B' }
// ]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.zip](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.zip)

---

#### `zip<T, TSecond, TResult>(second, resultSelector)`

Combines two sequences using a custom result selector function.

**Type Parameters**

- `T`: The type of elements in the first sequence.
- `TSecond`: The type of elements in the second sequence.
- `TResult`: The type of elements in the result sequence.

**Parameters**

- `second`: The second sequence to combine with the first.
- `resultSelector`: A function that specifies how to combine elements.

**Returns**: An IAsyncEnumerable\<TResult> containing combined elements using
the selector. If sequences are of unequal length, pairs up to the shorter
sequence length.

**Throws**

- `NotIterableException`: If second is not iterable
- `InvalidArgumentException`: If resultSelector is not a function.

**Examples**

```typescript
// Combine numbers and strings
await AsyncEnumerable.create([1, 2, 3])
  .zip(["a", "b", "c"], (num, letter) => `${num}-${letter}`)
  .toArray(); // ['1-a', '2-b', '3-c']

// Create objects from pairs
const ids = [1, 2];
const names = ["John", "Jane"];

await AsyncEnumerable.create(ids)
  .zip(names, (id, name) => ({ id, name }))
  .toArray();
// [
//   { id: 1, name: 'John' },
//   { id: 2, name: 'Jane' }
// ]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.zip](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.zip)

---

#### `zip<T, TSecond, TThird>(second, third)`

Combines three sequences using the tuple type as the result selector.

**Type Parameters**

- `T`: The type of elements in the first sequence.
- `TSecond`: The type of elements in the second sequence.
- `TThird`: The type of elements in the third sequence.

**Parameters**

- `second`: The second sequence to combine.
- `third`: The third sequence to combine.

**Returns**: An IAsyncEnumerable<[T, TSecond, TThird]> containing tuples with
elements from all three sequences. If sequences are of unequal length, pairs up
to the shortest sequence length.

**Throws**

- `NotIterableException`: If second or third is not iterable.

**Examples**

```typescript
// Basic three-way zip
await AsyncEnumerable.create([1, 2]).zip(["a", "b"], [true, false]).toArray(); // [[1, 'a', true], [2, 'b', false]]

// Different lengths
await AsyncEnumerable.create([1, 2, 3]).zip(["a", "b"], [true]).toArray(); // [[1, 'a', true]]

// Object creation from triple
const ids = [1, 2];
const names = ["John", "Jane"];
const ages = [25, 30];

await AsyncEnumerable.create(ids)
  .zip(names, ages)
  .select(([id, name, age]) => ({
    id,
    name,
    age,
  }))
  .toArray();
// [
//   { id: 1, name: 'John', age: 25 },
//   { id: 2, name: 'Jane', age: 30 }
// ]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.zip](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.zip)

---
