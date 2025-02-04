<!-- markdownlint-disable MD036 -->
<!-- omit in toc -->

# Enumerable API Documentation

<!-- TOC depthFrom:1 depthTo:4 -->

- [Methods](#methods)
  - [aggregate](#aggregate)
    - [`aggregate<T, TResult>(func)`](#aggregatet-tresultfunc)
    - [`aggregate<T, TAccumulate>(func, seed)`](#aggregatet-taccumulatefunc-seed)
    - [`aggregate<T, TAccumulate, TResult>(func, seed, resultSelector)`](#aggregatet-taccumulate-tresultfunc-seed-resultselector)
  - [aggregateBy](#aggregateby)
    - [`aggregateBy<TKey, TAccumulate>(keySelector, seed, func, comparer)`](#aggregatebytkey-taccumulatekeyselector-seed-func-comparer)
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

#### `aggregate<T, TResult>(func)`

Applies an accumulator function over a sequence.

**Type Parameters**

- `T`: The type of elements in the sequence.
- `TResult`: The type of the accumulated result.

**Parameters**

- `func`: An accumulator function to be invoked on each element. Takes two
  parameters: the accumulator value and current element, returns the new
  accumulator value.

**Returns**: The final accumulator value.

**Throws**

- `NoElementsException`: If the sequence is empty.
- `InvalidArgumentException`: If func is not a function.

**Examples**

```typescript
// Sum all numbers
Enumerable.create([1, 2, 3]).aggregate((acc, val) => acc + val); // 6

// Find maximum value
Enumerable.create([1, 5, 3]).aggregate((acc, val) => Math.max(acc, val)); // 5

// Concatenate strings
Enumerable.create(["a", "b", "c"]).aggregate((acc, val) => acc + val); // 'abc'
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.aggregate](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.aggregate)

---

#### `aggregate<T, TAccumulate>(func, seed)`

Applies an accumulator function over a sequence with an optional seed value.

**Type Parameters**

- `T`: The type of elements in the sequence.
- `TAccumulate`: The type of the accumulator value.

**Parameters**

- `func`: An accumulator function to be invoked on each element. Takes two
  parameters: the current accumulator value and element, returns the new
  accumulator value.
- `seed`: Optional. The initial accumulator value. If not provided, the first
  element is used as the initial value.

**Returns**: The final accumulator value.

**Throws**

- `InvalidOperationException`: If the sequence is empty and no seed is provided.
- `InvalidArgumentException`: If func is not a function.

**Examples**

```typescript
// Sum with initial value
Enumerable.create([1, 2, 3]).aggregate((acc, val) => acc + val, 10); // 16

// Custom accumulation with seed
Enumerable.create(["a", "b"]).aggregate((acc, val) => acc + "," + val, "start"); // 'start,a,b'

// Empty sequence with seed returns seed
Enumerable.create([]).aggregate((acc, val) => acc + val, 0); // 0
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.aggregate](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.aggregate)

---

#### `aggregate<T, TAccumulate, TResult>(func, seed, resultSelector)`

Applies an accumulator function over a sequence with an optional seed value and
transforms the result using a selector function.

**Type Parameters**

- `T`: The type of elements in the sequence.
- `TAccumulate`: The type of the accumulator value.
- `TResult`: The type of the result value.

**Parameters**

- `func`: An accumulator function to be invoked on each element. Takes two
  parameters: the current accumulator value and element, returns the new
  accumulator value.
- `seed`: Optional. The initial accumulator value. If not provided, the first
  element is used as the initial value.
- `resultSelector`: Optional. A function to transform the final accumulator
  value into the result value.

**Returns**: The transformed final accumulator value.

**Throws**

- `InvalidOperationException`: If the sequence is empty and no seed is provided.
- `InvalidArgumentException`: If func is not a function.

**Examples**

```typescript
// Sum and convert to string
Enumerable.create([1, 2, 3]).aggregate(
  (acc, val) => acc + val,
  0,
  (sum) => `Total: ${sum}`,
);
// "Total: 6"

// Calculate average
Enumerable.create([1, 2, 3, 4]).aggregate(
  (acc, val) => ({ sum: acc.sum + val, count: acc.count + 1 }),
  { sum: 0, count: 0 },
  (result) => result.sum / result.count,
); // 2.5
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.aggregate](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.aggregate)

---

### aggregateBy

#### `aggregateBy<TKey, TAccumulate>(keySelector, seed, func, comparer)`

Groups and aggregates elements in a sequence based on a key selector.

**Type Parameters**

- `TKey`: The type of the key used for grouping.
- `TAccumulate`: The type of the accumulator value.

**Parameters**

- `keySelector`: A function to extract the key for each element.
- `seed`: An initial accumulator value, or a function that returns the initial
  value for each key.
- `func`: An accumulator function to be invoked on each element within a group.
  Takes two parameters: the current accumulator value and element, returns the
  new accumulator value.
- `comparer`: Optional. An EqualityComparer\<TKey> to compare keys.

**Returns**: An IEnumerable<[TKey, TAccumulate]> where each element is a tuple
of key and aggregated value.

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

Enumerable.create(items)
  .aggregateBy(
    (x) => x.category,
    0,
    (acc, item) => acc + item.value,
  )
  .toArray();
// [['A', 40], ['B', 20]]

// Using seed selector
Enumerable.create(items)
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

Determines whether all elements in a sequence satisfy a condition.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `predicate`: A function to test each element for a condition. The predicate
  takes an element of type T and returns a boolean.

**Returns**: `true` if every element of the sequence passes the test in the
specified predicate, or if the sequence is empty; otherwise, `false`.

**Throws**

- `InvalidArgumentException`: If predicate is not a function.

**Examples**

```typescript
// Check if all numbers are positive
Enumerable.create([1, 2, 3]).all((x) => x > 0); // true

// Check if all numbers are even
Enumerable.create([1, 2, 3]).all((x) => x % 2 === 0); // false

// Empty sequence returns true
Enumerable.create([]).all((x) => true); // true
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.all](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.all)

---

### any

#### `any<T>(predicate)`

Determines whether any element of a sequence exists or satisfies a condition.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `predicate`: Optional. A function to test each element for a condition. If not
  provided, checks if the sequence contains any elements.

**Returns**: When predicate is provided: `true` if any element satisfies the
condition; otherwise, `false`. When predicate is not provided: `true` if the
sequence contains any elements; otherwise, `false`.

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

Appends a value to the end of the sequence.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `item`: The value to append to the sequence.

**Returns**: A new sequence that ends with the specified item.

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

Computes the average of a sequence of numeric values, or values selected by a
transform function.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `selector`: Optional. A transform function to apply to each element before
  computing the average. If not provided, the sequence must contain numeric
  values.

**Returns**: The average of the sequence of values.

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

Splits the sequence into chunks of the specified size.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `size`: The size of each chunk. Must be greater than 0.

**Returns**: An IEnumerable\<Array\<T>> containing chunks of the original
sequence. The last chunk may contain fewer elements if the sequence length is
not evenly divisible by size.

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

Concatenates two sequences into a single sequence.

**Type Parameters**

- `T`: The type of elements in both sequences.

**Parameters**

- `second`: The sequence to concatenate to the first sequence. The elements are
  added after all elements from the first sequence.

**Returns**: A new sequence that contains the elements from the first sequence
followed by the elements from the second sequence.

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

Determines whether a sequence contains a specified element.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `value`: The value to locate in the sequence.
- `comparer`: Optional. An EqualityComparer\<T> to compare values. If not
  provided, uses the default equality comparer.

**Returns**: `true` if the sequence contains the specified value; otherwise,
`false`.

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

- `predicate`: Optional. A function to test each element for a condition. If not
  provided, returns the total number of elements in the sequence.

**Returns**: The number of elements that satisfy the condition if predicate is
provided; otherwise, the total number of elements in the sequence.

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

Groups elements by key and counts the number of elements in each group.

**Type Parameters**

- `T`: The type of elements in the sequence.
- `TKey`: The type of the key returned by keySelector.

**Parameters**

- `keySelector`: Optional. A function to extract the key from each element. If
  not provided, uses the element itself as the key.
- `comparer`: Optional. An EqualityComparer\<TKey> to compare keys.

**Returns**: An IEnumerable<[TKey, number]> containing key-count pairs, where
each pair consists of a unique key and the number of elements with that key.

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

Returns the elements of a sequence, or a singleton sequence containing the
default value if the sequence is empty.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `defaultValue`: Optional. The value to return in a singleton sequence if the
  source sequence is empty. If not provided, returns undefined.

**Returns**: An IEnumerable\<T> that contains defaultValue if source is empty;
otherwise, returns the elements from the source sequence.

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

Returns distinct elements from a sequence using an optional equality comparer.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `comparer`: Optional. An EqualityComparer\<T> to compare values. If not
  provided, uses the default equality comparer.

**Returns**: An IEnumerable\<T> that contains distinct elements from the
sequence.

**Examples**

```typescript
// Basic distinct numbers
Enumerable.create([1, 1, 2, 3, 2]).distinct().toArray(); // [1, 2, 3]

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

Enumerable.create(people).distinct(new PersonComparer()).toArray(); // [{id: 1, name: 'John'}, {id: 2, name: 'Bob'}]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.distinct](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.distinct)

---

### distinctBy

#### `distinctBy<T, TKey>(keySelector, comparer)`

Returns distinct elements from a sequence using a key selector function and an
optional comparer.

**Type Parameters**

- `T`: The type of elements in the sequence.
- `TKey`: The type of the key returned by keySelector.

**Parameters**

- `keySelector`: A function to extract the key for comparison.
- `comparer`: Optional. An EqualityComparer\<TKey> to compare keys. If not
  provided, uses the default equality comparer.

**Returns**: An IEnumerable\<T> that contains elements with distinct keys from
the sequence.

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

Enumerable.create(items)
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

Enumerable.create(names)
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

- `index`: The zero-based index of the element to retrieve.

**Returns**: The element at the specified index.

**Throws**

- `InvalidArgumentException`: If index is not a number.
- `OutOfRangeException`: If index is less than 0 or greater than or equal to the
  number of elements.

**Examples**

```typescript
// Basic index access
Enumerable.create([1, 2, 3]).elementAt(1); // 2

// Object access
Enumerable.create([{ id: 1 }, { id: 2 }]).elementAt(0); // {id: 1}

// Out of range throws
Enumerable.create([1]).elementAt(1); // throws OutOfRangeException

// Empty sequence throws
Enumerable.create([]).elementAt(0); // throws OutOfRangeException
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.elementat](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.elementat)

---

### elementAtOrDefault

#### `elementAtOrDefault<T>(defaultValue, index)`

Returns the element at a specified index in a sequence or a default value if the
index is out of range.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `defaultValue`: The value to return if index is out of range.
- `index`: The zero-based index of the element to retrieve.

**Returns**: The element at the specified index if it exists; otherwise, the
default value.

**Examples**

```typescript
// Valid index
Enumerable.create([1, 2, 3]).elementAtOrDefault(0, 1); // 2

// Out of range returns default
Enumerable.create([1, 2]).elementAtOrDefault(999, 5); // 999

// Empty sequence returns default
Enumerable.create([]).elementAtOrDefault(0, 0); // 0

// With objects
const defaultObj = { id: 0, name: "default" };
Enumerable.create([{ id: 1, name: "one" }]).elementAtOrDefault(defaultObj, 1); // {id: 0, name: 'default'}
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.elementatordefault](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.elementatordefault)

---

### except

#### `except<T>(second, comparer)`

Produces the set difference of two sequences.

**Type Parameters**

- `T`: The type of elements in the sequences.

**Parameters**

- `second`: The sequence whose elements will be excluded.
- `comparer`: Optional. An EqualityComparer\<T> to compare values. If not
  provided, uses the default equality comparer.

**Returns**: An IEnumerable\<T> containing elements that exist in the first
sequence but not in the second sequence.

**Throws**

- `NotIterableException`: If second is not iterable.

**Examples**

```typescript
// Basic number difference
Enumerable.create([1, 2, 3]).except([2, 3, 4]).toArray(); // [1]

// With custom comparer
class PersonComparer extends EqualityComparer<{ id: number }> {
  equals(x?: { id: number }, y?: { id: number }): boolean {
    return x?.id === y?.id;
  }
}

const seq1 = [{ id: 1 }, { id: 2 }];
const seq2 = [{ id: 2 }, { id: 3 }];

Enumerable.create(seq1).except(seq2, new PersonComparer()).toArray(); // [{id: 1}]
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

- `second`: The sequence whose keys will be excluded.
- `keySelector`: A function to extract the key for each element.
- `comparer`: Optional. An EqualityComparer\<TKey> to compare keys. If not
  provided, uses the default equality comparer.

**Returns**: An IEnumerable\<T> containing elements from the first sequence
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

Enumerable.create(items)
  .exceptBy(excludeIds, (x) => x.id)
  .toArray(); // [{ id: 1, name: 'John' }]

// Case insensitive comparison
class CaseInsensitiveComparer extends EqualityComparer<string> {
  equals(x?: string, y?: string): boolean {
    return (x || "").toLowerCase() === (y || "").toLowerCase();
  }
}

const names = [{ name: "John" }, { name: "JANE" }];
const excludeNames = ["jane", "bob"];

Enumerable.create(names)
  .exceptBy(excludeNames, (x) => x.name, new CaseInsensitiveComparer())
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

- `second`: The sequence to compare against.
- `comparer`: Optional. An EqualityComparer\<T> to compare values. If not
  provided, uses the default equality comparer.

**Returns**: An IEnumerable\<T> containing elements that are present in only one
of the sequences.

**Throws**

- `NotIterableException`: If second is not iterable.

**Examples**

```typescript
// Basic number difference
Enumerable.create([1, 2, 3]).exclusive([2, 3, 4]).toArray(); // [1, 4]

// Object comparison
class PersonComparer extends EqualityComparer<{ id: number }> {
  equals(x?: { id: number }, y?: { id: number }): boolean {
    return x?.id === y?.id;
  }
}

const seq1 = [{ id: 1 }, { id: 2 }];
const seq2 = [{ id: 2 }, { id: 3 }];

Enumerable.create(seq1).exclusive(seq2, new PersonComparer()).toArray(); // [{id: 1}, {id: 3}]
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

- `second`: The sequence to compare against.
- `keySelector`: A function to extract the key for each element.
- `comparer`: Optional. An EqualityComparer\<TKey> to compare keys. If not
  provided, uses the default equality comparer.

**Returns**: An IEnumerable\<T> containing elements whose keys are present in
only one of the sequences.

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

Enumerable.create(seq1)
  .exclusiveBy(seq2, (x) => x.id)
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

Enumerable.create(names1)
  .exclusiveBy(names2, (x) => x.name, new CaseInsensitiveComparer())
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

- `predicate`: Optional. A function to test each element for a condition.

**Returns**: The first element in the sequence that passes the test if provided,
or the first element if no predicate is specified.

**Throws**

- `NoElementsException`: If the sequence is empty.
- `NoElementsSatisfyCondition`: If no element satisfies the predicate.
- `InvalidArgumentException`: If predicate is provided but is not a function.

**Examples**

```typescript
// First element
Enumerable.create([1, 2, 3]).first(); // 1

// First matching element
Enumerable.create([1, 2, 3]).first((x) => x > 1); // 2

// Empty sequence throws
Enumerable.create([]).first(); // throws InvalidOperationException

// No matches throws
Enumerable.create([1, 2]).first((x) => x > 5); // throws InvalidOperationException
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
- `predicate`: Optional. A function to test each element for a condition.

**Returns**: The first element that passes the predicate if provided, or the
first element if no predicate specified; returns defaultValue if the sequence is
empty or no element matches.

**Examples**

```typescript
// First element or default
Enumerable.create([1, 2]).firstOrDefault(0); // 1
Enumerable.create([]).firstOrDefault(0); // 0

// With predicate
Enumerable.create([1, 2, 3]).firstOrDefault(0, (x) => x > 2); // 3

// No matches returns default
Enumerable.create([1, 2]).firstOrDefault(0, (x) => x > 5); // 0

// With objects
const defaultPerson = { id: 0, name: "default" };
Enumerable.create([]).firstOrDefault(defaultPerson); // { id: 0, name: 'default' }
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.firstordefault](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.firstordefault)

---

### forEach

#### `forEach<T, TResult>(action)`

Performs an action on each element of a sequence and returns a sequence of the
results.

**Type Parameters**

- `T`: The type of elements in the source sequence.
- `TResult`: The type of elements in the result sequence.

**Parameters**

- `action`: A function to execute on each element, returning a result.

**Returns**: An IEnumerable\<TResult> containing the results of executing the
action on each element.

**Throws**

- `InvalidArgumentException`: If action is not a function.

**Examples**

```typescript
// Basic transformation
Enumerable.create([1, 2, 3])
  .forEach((x) => x * 2)
  .toArray(); // [2, 4, 6]

// Object transformation
Enumerable.create([{ value: 1 }, { value: 2 }])
  .forEach((x) => ({ doubled: x.value * 2 }))
  .toArray(); // [{ doubled: 2 }, { doubled: 4 }]

// Side effects with logging
Enumerable.create([1, 2])
  .forEach((x) => {
    console.log(x);
    return x;
  })
  .toArray();
```

---

### groupBy

#### `groupBy<T, TKey>(keySelector, comparer)`

Groups elements in a sequence according to a specified key selector function.

**Type Parameters**

- `T`: The type of elements in the sequence.
- `TKey`: The type of the key returned by keySelector.

**Parameters**

- `keySelector`: A function to extract the key for each element.
- `comparer`: Optional. An EqualityComparer\<TKey> to compare keys. If not
  provided, uses the default equality comparer.

**Returns**: An IEnumerable<IGrouping<TKey, T>> where each IGrouping object
contains a sequence of objects and a key.

**Throws**

- `InvalidArgumentException`: If keySelector is not a function.

**Examples**

```typescript
// Basic number grouping
const numbers = [1, 2, 3, 4, 5];
Enumerable.create(numbers)
  .groupBy((x) => x % 2)
  .select((g) => ({ key: g.key, values: g.toArray() }))
  .toArray();
// [
//   { key: 1, values: [1, 3, 5] },
//   { key: 0, values: [2, 4] }
// ]

// Object grouping
const items = [
  { category: "A", value: 1 },
  { category: "B", value: 2 },
  { category: "A", value: 3 },
];

Enumerable.create(items)
  .groupBy((x) => x.category)
  .select((g) => ({
    category: g.key,
    sum: g.sum((x) => x.value),
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

Groups and transforms elements in a sequence according to a specified key
selector function.

**Type Parameters**

- `T`: The type of elements in the source sequence.
- `TKey`: The type of the key returned by keySelector.
- `TElement`: The type of the elements in the resulting groups.

**Parameters**

- `keySelector`: A function to extract the key for each element.
- `elementSelector`: A function to transform each source element into the output
  type.
- `comparer`: Optional. An EqualityComparer\<TKey> to compare keys. If not
  provided, uses the default equality comparer.

**Returns**: An IEnumerable<IGrouping<TKey, TElement>> where each IGrouping
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

Enumerable.create(orders)
  .groupBy(
    (x) => x.category,
    (x) => ({ orderId: x.id, value: x.amount }),
  )
  .select((g) => ({
    category: g.key,
    orders: g.toArray(),
  }))
  .toArray();
// [
//   {
//     category: 'A',
//     orders: [
//       { orderId: 1, value: 100 },
//       { orderId: 3, value: 300 }
//     ]
//   },
//   {
//     category: 'B',
//     orders: [
//       { orderId: 2, value: 200 }
//     ]
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

- `keySelector`: A function to extract the key for each element.
- `elementSelector`: A function to transform each source element.
- `resultSelector`: A function to transform each group into a result value.
- `comparer`: Optional. An EqualityComparer\<TKey> to compare keys.

**Returns**: An IEnumerable\<TResult> containing the transformed groups.

**Throws**

- `InvalidArgumentException`: If keySelector or elementorSelector or
  resultSelector is not a function.

**Examples**

```typescript
// Group, transform elements, and compute results
const orders = [
  { id: 1, category: "A", amount: 100 },
  { id: 2, category: "B", amount: 200 },
  { id: 3, category: "A", amount: 300 },
];

Enumerable.create(orders)
  .groupBy(
    (x) => x.category, // key selector
    (x) => x.amount, // element selector
    (key, elements) => ({
      // result selector
      category: key,
      totalAmount: elements.sum(),
      count: elements.count(),
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

Enumerable.create(["A", "a", "B", "b"])
  .groupBy(
    (x) => x,
    undefined,
    (key, elements) => ({
      key: key,
      count: elements.count(),
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

- `inner`: The sequence to join to the first sequence.
- `outerKeySelector`: A function to extract the join key from each element of
  the first sequence.
- `innerKeySelector`: A function to extract the join key from each element of
  the second sequence.
- `resultSelector`: A function to create a result element from an outer element
  and its matching inner elements.
- `comparer`: Optional. An EqualityComparer\<TKey> to compare keys.

**Returns**: An IEnumerable\<TResult> containing elements obtained by performing
a grouped join on two sequences.

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

Enumerable.create(departments)
  .groupJoin(
    employees,
    (dept) => dept.id,
    (emp) => emp.deptId,
    (dept, emps) => ({
      department: dept.name,
      employees: emps.select((e) => e.name).toArray(),
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

**Returns**: An IEnumerable<[number, T]> containing tuples of index and element
pairs.

**Examples**

```typescript
// Basic indexing
Enumerable.create(["a", "b", "c"]).index().toArray(); // [[0, 'a'], [1, 'b'], [2, 'c']]

// Object indexing
Enumerable.create([{ id: 1 }, { id: 2 }])
  .index()
  .toArray(); // [[0, { id: 1 }], [1, { id: 2 }]]

// Empty sequence
Enumerable.create([]).index().toArray(); // []
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

- `second`: The sequence to intersect with the first sequence.
- `comparer`: Optional. An EqualityComparer\<T> to compare values. If not
  provided, uses the default equality comparer.

**Returns**: An IEnumerable\<T> containing elements that exist in both
sequences.

**Throws**

- `NotIterableException`: If second is not iterable.

**Examples**

```typescript
// Basic number intersection
Enumerable.create([1, 2, 3]).intersect([2, 3, 4]).toArray(); // [2, 3]

// Object intersection with custom comparer
class PersonComparer extends EqualityComparer<{ id: number }> {
  equals(x?: { id: number }, y?: { id: number }): boolean {
    return x?.id === y?.id;
  }
}

const seq1 = [{ id: 1 }, { id: 2 }];
const seq2 = [{ id: 2 }, { id: 3 }];

Enumerable.create(seq1).intersect(seq2, new PersonComparer()).toArray(); // [{id: 2}]
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

- `second`: The sequence whose keys will be used for intersection.
- `keySelector`: A function to extract the key for each element.
- `comparer`: Optional. An EqualityComparer\<TKey> to compare keys. If not
  provided, uses the default equality comparer.

**Returns**: An IEnumerable\<T> containing elements from the first sequence
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

Enumerable.create(items)
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

Enumerable.create(names)
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

- `second`: The sequence to compare to the current sequence.

**Returns**: true if the current sequence and the specified sequence have no
elements in common; otherwise, false.

**Throws**

- `NotIterableException`: If second is not iterable.

**Examples**

```typescript
const first = [1, 2, 3];
const second = [4, 5, 6];

Enumerable.create(first).isDisjointFrom(second); // true
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

- `second`: The sequence to compare to the current sequence.

**Returns**: true if the current sequence is a subset of the specified sequence;
otherwise, false.

**Throws**

- `NotIterableException`: If second is not iterable.

**Examples**

```typescript
const first = [1, 2, 3];
const second = [1, 2, 3, 4, 5];

Enumerable.create(first).isSubsetOf(second); // true

const first = [1, 2, 3];
const second = [1, 2, 4, 5, 6];

Enumerable.create(first).isSubsetOf(second); // false
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

- `second`: The sequence to compare to the current sequence.

**Returns**: true if the current sequence is a superset of the specified
sequence; otherwise, false.

**Throws**

- `NotIterableException`: If second is not iterable.

**Examples**

```typescript
const first = [1, 2, 3, 4, 5];
const second = [1, 2, 3];

Enumerable.create(first).isSupersetOf(second); // true

const first = [1, 2, 3];
const second = [1, 2, 3, 4, 5];

Enumerable.create(first).isSupersetOf(second); // false
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

- `inner`: The sequence to join with the first sequence.
- `outerKeySelector`: Function to extract join key from outer sequence element.
- `innerKeySelector`: Function to extract join key from inner sequence element.
- `resultSelector`: Function to create result element from one outer and one
  inner element.
- `comparer`: Optional. An EqualityComparer\<TKey> to compare keys.

**Returns**: An IEnumerable\<TResult> containing results from matching elements
from both sequences.

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

Enumerable.create(orders)
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

- `predicate`: Optional. A function to test each element for a condition.

**Returns**: The last element in the sequence that passes the test if provided,
or the last element if no predicate is specified.

**Throws**

- `NoElementsException`: If the sequence is empty.
- `NoElementsSatisfyCondition`: If no element satisfies the predicate.
- `InvalidArgumentException`: If predicate is provided but is not a function.

**Examples**

```typescript
// Last element
Enumerable.create([1, 2, 3]).last(); // 3

// Last matching element
Enumerable.create([1, 2, 3, 2]).last((x) => x === 2); // 2

// Empty sequence throws
Enumerable.create([]).last(); // throws InvalidOperationException

// No matches throws
Enumerable.create([1, 2]).last((x) => x > 5); // throws InvalidOperationException
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
- `predicate`: Optional. A function to test each element for a condition.

**Returns**: The last element that passes the predicate if provided, or the last
element if no predicate specified; returns defaultValue if the sequence is empty
or no element matches.

**Examples**

```typescript
// Last element or default
Enumerable.create([1, 2]).lastOrDefault(0); // 2
Enumerable.create<number>([]).lastOrDefault(0); // 0

// With predicate
Enumerable.create([1, 2, 3, 2]).lastOrDefault(0, (x) => x === 2); // 2

// No matches returns default
Enumerable.create([1, 2]).lastOrDefault(0, (x) => x > 5); // 0

// With objects
const defaultPerson = { id: 0, name: "default" };
Enumerable.create<typeof defaultPerson>([]).lastOrDefault(defaultPerson); // { id: 0, name: 'default' }
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.lastordefault](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.lastordefault)

---

### max

#### `max()`

Returns the maximum value in a sequence of numbers.

**Returns**: The maximum value in the sequence.

**Throws**

- `NoElementsException`: If the sequence is empty.
- `InvalidElementsCollection`: If any element in the sequence is not a number.

**Examples**

```typescript
// Basic maximum
Enumerable.create([1, 2, 3]).max(); // 3

// Single element
Enumerable.create([1]).max(); // 1

// Empty sequence throws
Enumerable.create([]).max(); // throws InvalidOperationException

// Mixed types throw
Enumerable.create([1, "2"]).max(); // throws TypeError
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.max](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.max)

---

#### `max<T>(comparer)`

Returns the maximum value in a sequence using a custom comparer.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `comparer`: A Comparer\<T> to compare elements.

**Returns**: The maximum value in the sequence according to the comparer.

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

Enumerable.create(people).max(new PersonComparer()); // { age: 30 }

// Custom string length comparison
class StringLengthComparer extends Comparer<string> {
  compare(x?: string, y?: string): number {
    return (x?.length ?? 0) - (y?.length ?? 0);
  }
}

Enumerable.create(["a", "bbb", "cc"]).max(new StringLengthComparer()); // 'bbb'
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
- `comparer`: Optional. A Comparer\<number> to compare the extracted values.

**Returns**: The maximum numeric value extracted from the sequence.

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

Enumerable.create(items).max((x) => x.value); // 30

// String length maximum
Enumerable.create(["a", "bbb", "cc"]).max((x) => x.length); // 3
```

```typescript
// Find object with maximum value
const items = [
  { id: 1, value: 10, name: "A" },
  { id: 2, value: 30, name: "B" },
  { id: 3, value: 20, name: "C" },
];

Enumerable.create(items).maxBy((x) => x.value); // { id: 2, value: 30, name: 'B' }

// With custom comparer
class AbsoluteComparer extends Comparer<number> {
  compare(x?: number, y?: number): number {
    return Math.abs(x ?? 0) - Math.abs(y ?? 0);
  }
}

Enumerable.create([{ val: -5 }, { val: 3 }]).maxBy(
  (x) => x.val,
  new AbsoluteComparer(),
); // { val: -5 }
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.maxby](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.maxby)

---

### min

#### `min()`

Returns the minimum value in a sequence of numbers.

**Returns**: The minimum value in the sequence.

**Throws**

- `InvalidOperationException`: If the sequence is empty.
- `InvalidElementsCollection`: If any element in the sequence is not a number.

**Examples**

```typescript
// Basic minimum
Enumerable.create([1, 2, 3]).min(); // 1

// Single element
Enumerable.create([5]).min(); // 5

// Empty sequence throws
Enumerable.create([]).min(); // throws InvalidOperationException

// Mixed types throw
Enumerable.create([1, "2"]).min(); // throws TypeError
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.min](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.min)

---

#### `min<T>(comparer)`

Returns the minimum value in a sequence using a custom comparer.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Parameters**

- `comparer`: A Comparer\<T> to compare elements.

**Returns**: The minimum value in the sequence according to the comparer.

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

Enumerable.create(people).min(new PersonComparer()); // { age: 20 }

// Custom string length comparison
class StringLengthComparer extends Comparer<string> {
  compare(x?: string, y?: string): number {
    return (x?.length ?? 0) - (y?.length ?? 0);
  }
}

Enumerable.create(["aaa", "b", "cc"]).min(new StringLengthComparer()); // 'b'
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
- `comparer`: Optional. A Comparer\<number> to compare the extracted values.

**Returns**: The minimum numeric value extracted from the sequence.

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

Enumerable.create(items).min((x) => x.value); // 10

// String length minimum
Enumerable.create(["aaa", "b", "cc"]).min((x) => x.length); // 1
```

```typescript
// Find object with minimum value
const items = [
  { id: 1, value: 10, name: "A" },
  { id: 2, value: 30, name: "B" },
  { id: 3, value: 20, name: "C" },
];

Enumerable.create(items).minBy((x) => x.value); // { id: 1, value: 10, name: 'A' }

// With custom comparer
class AbsoluteComparer extends Comparer<number> {
  compare(x?: number, y?: number): number {
    return Math.abs(x ?? 0) - Math.abs(y ?? 0);
  }
}

Enumerable.create([{ val: -5 }, { val: 3 }]).minBy(
  (x) => x.val,
  new AbsoluteComparer(),
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

**Returns**: An IEnumerable\<TType> containing only the elements of the
specified type.

**Examples**

```typescript
// Filter numbers
Enumerable.create([1, "a", 2, "b", 3]).ofType("number").toArray(); // [1, 2, 3]

// Filter strings
Enumerable.create([1, "a", 2, "b"]).ofType("string").toArray(); // ['a', 'b']

// Filter String objects
Enumerable.create([1, "a", 2, "b", new String("c")])
  .ofType(String)
  .toArray(); // ['c']

// Custom class filtering
class Person {}
const items = [new Person(), "a", new Person()];

Enumerable.create(items).ofType(Person).toArray(); // [Person {}, Person {}]
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

- `comparer`: Optional. Comparer to compare elements. Can be a Comparer\<T>,
  "string" for string comparison, or "number" for numeric comparison.

**Returns**: An IOrderedEnumerable\<T> whose elements are sorted.

**Examples**

```typescript
// Basic ordering
const numbers = Enumerable.create([3, 1, 2]).order().toArray(); // [1, 2, 3]

// String comparison
const words = Enumerable.create(["c", "a", "b"]).order("string").toArray(); // ['a', 'b', 'c']

// Custom comparison
class PersonComparer extends Comparer<{ age: number }> {
  compare(x?: { age: number }, y?: { age: number }): number {
    return (x?.age ?? 0) - (y?.age ?? 0);
  }
}

const people = Enumerable.create([
  { age: 30, name: "Bob" },
  { age: 20, name: "Alice" },
])
  .order(new PersonComparer())
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

**Returns**: An IOrderedEnumerable\<T> whose elements are sorted by key.

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

Enumerable.create(items)
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

Enumerable.create(names)
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

**Returns**: An IOrderedEnumerable\<T> whose elements are sorted in descending
order by key.

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

Enumerable.create(items)
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

Enumerable.create(names)
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

**Returns**: An IOrderedEnumerable\<T> whose elements are sorted in descending
order.

**Examples**

```typescript
// Basic descending order
Enumerable.create([1, 3, 2]).orderDescending().toArray(); // [3, 2, 1]

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

Enumerable.create(people)
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
Enumerable.create([2, 3]).prepend(1).toArray(); // [1, 2, 3]

// Prepend to empty sequence
Enumerable.create<number>([]).prepend(1).toArray(); // [1]

// Object prepend
const items = [{ id: 2 }, { id: 3 }];
Enumerable.create(items).prepend({ id: 1 }).toArray(); // [{id: 1}, {id: 2}, {id: 3}]

// Multiple prepends
Enumerable.create([3]).prepend(2).prepend(1).toArray(); // [1, 2, 3]
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.prepend](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.prepend)

---

### reverse

#### `reverse<T>()`

Inverts the order of elements in a sequence.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Returns**: An IEnumerable\<T> whose elements correspond to those of the input
sequence in reverse order.

**Examples**

```typescript
// Basic number reversal
Enumerable.create([1, 2, 3]).reverse().toArray(); // [3, 2, 1]

// String reversal
Enumerable.create(["a", "b", "c"]).reverse().toArray(); // ['c', 'b', 'a']

// Object reversal
const items = [
  { id: 1, value: "first" },
  { id: 2, value: "second" },
];

Enumerable.create(items)
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

**Returns**: An IEnumerable\<TResult> whose elements are the result of applying
the transform function to each element of the source.

**Throws**

- `InvalidArgumentException`: If selector is not a function.

**Examples**

```typescript
// Basic transformation
Enumerable.create([1, 2, 3])
  .select((x) => x * 2)
  .toArray(); // [2, 4, 6]

// Using index
Enumerable.create(["a", "b", "c"])
  .select((x, i) => `${i}:${x}`)
  .toArray(); // ['0:a', '1:b', '2:c']

// Object transformation
const items = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
];

Enumerable.create(items)
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

Projects each element of a sequence to an IEnumerable\<T>, flattens the
resulting sequences into one sequence, and optionally transforms the flattened
elements.

**Type Parameters**

- `TCollection`: The type of collection elements to flatten.
- `TResult`: The type of elements in the result sequence.

**Parameters**

- `selector`: A function that returns a collection for each element.
- `resultSelector`: Optional. A function that transforms each flattened element.

**Returns**: An IEnumerable\<TResult> whose elements are the result of invoking
the transform function on each element of the flattened sequence.

**Throws**

- `InvalidArgumentException`: If selector is not a function.

**Examples**

```typescript
// Basic array flattening
const arrays = [
  [1, 2],
  [3, 4],
];
Enumerable.create(arrays)
  .selectMany((x) => x)
  .toArray(); // [1, 2, 3, 4]

// With result transformation
const items = [
  { id: 1, values: [1, 2] },
  { id: 2, values: [3, 4] },
];

Enumerable.create(items)
  .selectMany(
    (x) => x.values,
    (item, value) => ({
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
Enumerable.create([1, 2, 3]).sequenceEqual([1, 2, 3]); // true

Enumerable.create([1, 2]).sequenceEqual([1, 2, 3]); // false

// Custom object comparison
class PersonComparer extends EqualityComparer<{ id: number }> {
  equals(x?: { id: number }, y?: { id: number }): boolean {
    return x?.id === y?.id;
  }
}

const seq1 = [{ id: 1 }, { id: 2 }];
const seq2 = [{ id: 1 }, { id: 2 }];

Enumerable.create(seq1).sequenceEqual(seq2, new PersonComparer()); // true
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sequenceequal](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sequenceequal)

---

### shuffle

#### `shuffle<T>()`

Randomly reorders the elements in a sequence.

**Type Parameters**

- `T`: The type of elements in the sequence.

**Returns**: A new IEnumerable\<T> containing all elements from the input
sequence in random order.

**Examples**

```typescript
// Basic number shuffling
const numbers = [1, 2, 3, 4, 5];
Enumerable.create(numbers).shuffle().toArray(); // e.g., [3, 1, 5, 2, 4]

// Original sequence remains unchanged
console.log(numbers); // [1, 2, 3, 4, 5]

// Object shuffling
const items = [
  { id: 1, value: "A" },
  { id: 2, value: "B" },
  { id: 3, value: "C" },
];

Enumerable.create(items)
  .shuffle()
  .select((x) => x.value)
  .toArray(); // e.g., ['B', 'C', 'A']
```

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
Enumerable.create([1]).single(); // 1

// With predicate
Enumerable.create([1, 2, 3]).single((x) => x === 2); // 2

// Multiple elements throw
Enumerable.create([1, 2]).single(); // throws MoreThanOneElementSatisfiesCondition

// Multiple matches throw
Enumerable.create([1, 2, 2]).single((x) => x === 2); // throws MoreThanOneElementSatisfiesCondition
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
Enumerable.create([1]).singleOrDefault(0); // 1

// Empty sequence returns default
Enumerable.create([]).singleOrDefault(0); // 0

// Multiple elements throws MoreThanOneElementSatisfiesCondition
Enumerable.create([1, 2]).singleOrDefault(0); // throws MoreThanOneElementSatisfiesCondition

// Single match with predicate
Enumerable.create([1, 2, 3]).singleOrDefault(0, (x) => x === 2); // 2

// Multiple matches return default
Enumerable.create([1, 2, 2]).singleOrDefault(0, (x) => x === 2); // 0
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

**Returns**: An IEnumerable\<T> that contains the elements that occur after the
specified index.

**Throws**

- `InvalidArgumentException`: If count is not a number.

**Examples**

```typescript
// Basic skip
Enumerable.create([1, 2, 3, 4]).skip(2).toArray(); // [3, 4]

// Skip more than length
Enumerable.create([1, 2]).skip(5).toArray(); // []

// Skip with negative count
Enumerable.create([1, 2, 3]).skip(-1).toArray(); // [1, 2, 3]

// Skip with objects
const items = [
  { id: 1, value: "A" },
  { id: 2, value: "B" },
  { id: 3, value: "C" },
];

Enumerable.create(items)
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

**Returns**: An IEnumerable\<T> containing all elements except the last count
elements.

**Throws**

- `InvalidArgumentException`: If count is not a number.

**Examples**

```typescript
// Basic skip last
Enumerable.create([1, 2, 3, 4]).skipLast(2).toArray(); // [1, 2]

// Skip more than length
Enumerable.create([1, 2]).skipLast(5).toArray(); // []

// Skip with negative count
Enumerable.create([1, 2, 3]).skipLast(-1).toArray(); // [1, 2, 3]

// Skip with objects
const items = [
  { id: 1, value: "A" },
  { id: 2, value: "B" },
  { id: 3, value: "C" },
];

Enumerable.create(items)
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

**Returns**: An IEnumerable\<T> that contains the elements from the input
sequence starting at the first element that does not satisfy the condition.

**Throws**

- `InvalidArgumentException`: If predicate is not a function.

**Examples**

```typescript
// Skip while less than 3
Enumerable.create([1, 2, 3, 4, 2])
  .skipWhile((x) => x < 3)
  .toArray(); // [3, 4, 2]

// Using index in predicate
Enumerable.create([1, 2, 3, 4])
  .skipWhile((x, i) => i < 2)
  .toArray(); // [3, 4]

// Object sequence
const items = [
  { value: 1, name: "A" },
  { value: 2, name: "B" },
  { value: 3, name: "C" },
  { value: 1, name: "D" },
];

Enumerable.create(items)
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
Enumerable.create([1, 2, 3]).sum(); // 6

// String concatenation
Enumerable.create(["a", "b", "c"]).sum(); // 'abc'

// Empty sequence throws
Enumerable.create([]).sum(); // throws InvalidOperationException

// Mixed types throw
Enumerable.create([1, "2"]).sum(); // throws InvalidElementsCollection
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sum](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sum)

---

#### `sum<string>(selector)`

Computes the concatenation of string values selected from sequence elements.

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

Enumerable.create(items).sum((x) => x.text); // 'Hello World'

// Empty sequence throws
Enumerable.create([]).sum((x) => x.toString()); // throws NoElementsException
```

**See Also**

- [https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sum](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.sum)

---

#### `sum<number>(selector)`

Computes the sum of numeric values selected from sequence elements.

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

Enumerable.create(items).sum((x) => x.value); // 60

// String length sum
Enumerable.create(["a", "bb", "ccc"]).sum((x) => x.length); // 6
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

**Returns**: An IEnumerable\<T> that contains the specified number of elements
from the start of the sequence.

**Throws**

- `InvalidArgumentException`: If count is not a number.

**Examples**

```typescript
// Basic take
Enumerable.create([1, 2, 3, 4]).take(2).toArray(); // [1, 2]

// Take more than available
Enumerable.create([1, 2]).take(5).toArray(); // [1, 2]

// Take with negative count
Enumerable.create([1, 2, 3]).take(-1).toArray(); // []

// Take with objects
const items = [
  { id: 1, value: "A" },
  { id: 2, value: "B" },
  { id: 3, value: "C" },
];

Enumerable.create(items)
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

**Returns**: An IEnumerable\<T> that contains the specified number of elements
from the end of the sequence.

**Throws**

- `InvalidArgumentException`: If count is not a number.

**Examples**

```typescript
// Basic take last
Enumerable.create([1, 2, 3, 4]).takeLast(2).toArray(); // [3, 4]

// Take more than available
Enumerable.create([1, 2]).takeLast(5).toArray(); // [1, 2]

// Take with negative count
Enumerable.create([1, 2, 3]).takeLast(-1).toArray(); // []

// Take with objects
const items = [
  { id: 1, value: "A" },
  { id: 2, value: "B" },
  { id: 3, value: "C" },
];

Enumerable.create(items)
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

**Returns**: An IEnumerable\<T> that contains elements from the input sequence
until the predicate returns false.

**Throws**

- `InvalidArgumentException`: If predicate is not a function.

**Examples**

```typescript
// Take while less than 3
Enumerable.create([1, 2, 3, 4, 1])
  .takeWhile((x) => x < 3)
  .toArray(); // [1, 2]

// Using index in predicate
Enumerable.create([1, 2, 3, 4])
  .takeWhile((x, i) => i < 2)
  .toArray(); // [1, 2]

// Object sequence
const items = [
  { value: 1, name: "A" },
  { value: 2, name: "B" },
  { value: 3, name: "C" },
  { value: 1, name: "D" },
];

Enumerable.create(items)
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

**Returns**: An array that contains the elements from the sequence.

**Examples**

```typescript
// Basic conversion
Enumerable.create([1, 2, 3]).toArray(); // [1, 2, 3]

// Empty sequence
Enumerable.create([]).toArray(); // []

// Object sequence
const items = [
  { id: 1, value: "A" },
  { id: 2, value: "B" },
];

Enumerable.create(items)
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

**Returns**: A Map<TKey, Array\<T>> where each key contains an array of all
elements that share that key.

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

const map = Enumerable.create(items).toMap((x) => x.category);

map.get(1); // [{ category: 1, name: 'A' }, { category: 1, name: 'C' }]
map.get(2); // [{ category: 2, name: 'B' }]

// Group by string
const people = [
  { dept: "IT", name: "John" },
  { dept: "HR", name: "Jane" },
  { dept: "IT", name: "Bob" },
];

const deptMap = Enumerable.create(people).toMap((x) => x.dept);

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

**Returns**: A Set\<T> that contains unique elements from the sequence.

**Examples**

```typescript
// Basic conversion
Enumerable.create([1, 2, 2, 3]).toSet(); // Set(3) {1, 2, 3}

// Empty sequence
Enumerable.create([]).toSet(); // Set(0) {}

// Object sequence
const items = [
  { id: 1, name: "A" },
  { id: 1, name: "A" }, // Duplicate by value
  { id: 2, name: "B" },
];

Enumerable.create(items).toSet(); // Set with 3 objects (unique by reference)
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
- `comparer`: Optional. An EqualityComparer\<T> to compare values. If not
  provided, uses the default equality comparer.

**Returns**: An IEnumerable\<T> that contains the elements from both input
sequences, excluding duplicates.

**Throws**

- `NotIterableException`: If second is not iterable.

**Examples**

```typescript
// Basic number union
Enumerable.create([1, 2]).union([2, 3]).toArray(); // [1, 2, 3]

// Custom object comparison
class PersonComparer extends EqualityComparer<{ id: number }> {
  equals(x?: { id: number }, y?: { id: number }): boolean {
    return x?.id === y?.id;
  }
}

const seq1 = [{ id: 1 }, { id: 2 }];
const seq2 = [{ id: 2 }, { id: 3 }];

Enumerable.create(seq1)
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
- `comparer`: Optional. An EqualityComparer\<TKey> to compare keys. If not
  provided, uses the default equality comparer.

**Returns**: An IEnumerable\<T> containing elements from both sequences,
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

Enumerable.create(seq1)
  .unionBy(seq2, (x) => x.id)
  .select((x) => x.val)
  .toArray(); // ['A', 'B', 'D']

// Case insensitive name union
class CaseInsensitiveComparer extends EqualityComparer<string> {
  equals(x?: string, y?: string): boolean {
    return (x || "").toLowerCase() === (y || "").toLowerCase();
  }
}

const names1 = [{ name: "John" }, { name: "JANE" }];
const names2 = [{ name: "jane" }, { name: "Bob" }];

Enumerable.create(names1)
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

**Returns**: An IEnumerable\<T> that contains elements that satisfy the
condition.

**Throws**

- `InvalidArgumentException`: If predicate is not a function.

**Examples**

```typescript
// Basic number filtering
Enumerable.create([1, 2, 3, 4])
  .where((x) => x > 2)
  .toArray(); // [3, 4]

// Using index in predicate
Enumerable.create(["a", "b", "c"])
  .where((x, i) => i % 2 === 0)
  .toArray(); // ['a', 'c']

// Object filtering
const items = [
  { id: 1, active: true },
  { id: 2, active: false },
  { id: 3, active: true },
];

Enumerable.create(items)
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

**Returns**: An IEnumerable<[T, TSecond]> containing tuples with elements from
both sequences. If sequences are of unequal length, the result only includes
pairs up to the length of the shorter sequence.

**Throws**

- `NotIterableException`: If second is not iterable.

**Examples**

```typescript
// Basic number and string zip
Enumerable.create([1, 2, 3]).zip(["a", "b", "c"]).toArray(); // [[1, 'a'], [2, 'b'], [3, 'c']]

// Unequal lengths
Enumerable.create([1, 2]).zip(["a", "b", "c"]).toArray(); // [[1, 'a'], [2, 'b']]

// Object zip
const numbers = [1, 2];
const letters = ["A", "B"];

Enumerable.create(numbers)
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

**Returns**: An IEnumerable\<TResult> containing combined elements using the
selector. If sequences are of unequal length, pairs up to the shorter sequence
length.

**Throws**

- `NotIterableException`: If second is not iterable
- `InvalidArgumentException`: If resultSelector is not a function.

**Examples**

```typescript
// Combine numbers and strings
Enumerable.create([1, 2, 3])
  .zip(["a", "b", "c"], (num, letter) => `${num}-${letter}`)
  .toArray(); // ['1-a', '2-b', '3-c']

// Create objects from pairs
const ids = [1, 2];
const names = ["John", "Jane"];

Enumerable.create(ids)
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

**Returns**: An IEnumerable<[T, TSecond, TThird]> containing tuples with
elements from all three sequences. If sequences are of unequal length, pairs up
to the shortest sequence length.

**Throws**

- `NotIterableException`: If second or third is not iterable.

**Examples**

```typescript
// Basic three-way zip
Enumerable.create([1, 2]).zip(["a", "b"], [true, false]).toArray(); // [[1, 'a', true], [2, 'b', false]]

// Different lengths
Enumerable.create([1, 2, 3]).zip(["a", "b"], [true]).toArray(); // [[1, 'a', true]]

// Object creation from triple
const ids = [1, 2];
const names = ["John", "Jane"];
const ages = [25, 30];

Enumerable.create(ids)
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
