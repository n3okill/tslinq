<!-- markdownlint-disable MD036 -->
<!-- omit in toc -->

# selectors

- [TKeySelector (type)](#tkeyselector-type)
- [TKeySelectorAsync (type)](#tkeyselectorasync-type)
- [TElementSelector (type)](#telementselector-type)
- [TResultSelector (type)](#tresultselector-type)
- [TElementSelectorAsync (type)](#telementselectorasync-type)
- [TResultSelectorAsync (type)](#tresultselectorasync-type)
- [TResultSelectorJoin (type)](#tresultselectorjoin-type)
- [TResultSelectorJoinAsync (type)](#tresultselectorjoinasync-type)
- [TZipResultSelector (type)](#tzipresultselector-type)
- [TZipResult (type)](#tzipresult-type)
- [TZipResultSelectorAsync (type)](#tzipresultselectorasync-type)
- [SelectManySelector (type)](#selectmanyselector-type)
- [SelectManyResultSelector (type)](#selectmanyresultselector-type)
- [SelectManySelectorAsync (type)](#selectmanyselectorasync-type)
- [SelectManyResultSelectorAsync (type)](#selectmanyresultselectorasync-type)

## TKeySelector (type)

**Description**

Represents a synchronous function that selects a key from an element.

**Definition**

```typescript
export type TKeySelector<T, TKey> = (x: T) => TKey;
```

**Type Parameters**

- `T`: The type of the source element.
- `TKey`: The type of the key to be selected.

**Remarks**

```code
Used in sorting, grouping, and other operations where a key needs to be extracted from an element.
```

**Example**

```typescript
// Select age as a key for sorting people
const ageSelector: TKeySelector<Person, number> = (person) => person.age;
const sortedPeople = people.orderBy(ageSelector);
```

---

## TKeySelectorAsync (type)

**Description**

Represents a synchronous function that selects a key from an element.

**Definition**

```typescript
export type TKeySelectorAsync<T, TKey> = (x: T) => TKey | Promise<TKey>;
```

**Type Parameters**

- `T`: The type of the source element.
- `TKey`: The type of the key to be selected.

**Remarks**

```code
Used in asynchronous sorting, grouping, and other operations where a key needs to be
extracted from an element, potentially involving async computation.
```

**Example**

```typescript
// Async key selector that fetches age from a database
const asyncAgeSelector: TKeySelectorAsync<Person, number> = async (person) =>
  await person.fetchAge();
const sortedPeople = await asyncPeople.orderBy(asyncAgeSelector);
```

---

## TElementSelector (type)

**Description**

Represents a synchronous function that selects a key from an element.

**Definition**

```typescript
export type TElementSelector<T, TElement> = (x: T) => TElement;
```

**Type Parameters**

- `T`: The type of the source element.
- `TElement`: The type of the selected element.

**Remarks**

```code
Used in operations like grouping or transforming elements.
```

**Example**

```typescript
// Select name from a person object
const nameSelector: TElementSelector<Person, string> = (person) => person.name;
```

---

## TResultSelector (type)

**Description**

Represents a synchronous function that selects a key from an element.

**Definition**

```typescript
export type TResultSelector<TKey, TElement, TResult> = (
  x: TKey,
  y: IEnumerable<TElement>,
) => TResult;
```

**Type Parameters**

- `TKey`: The type of the grouping key.
- `TElement`: The type of elements in the group.
- `TResult`: The type of the result.

**Remarks**

```code
Used in group transformations to create a new result from a key and its associated elements.
```

**Example**

```typescript
// Create a summary for each age group
const resultSelector: TResultSelector<number, Person, string> = (
  age,
  peopleGroup,
) => `Age ${age}: ${peopleGroup.count()} people`;
```

---

## TElementSelectorAsync (type)

**Description**

Represents a synchronous function that selects a key from an element.

**Definition**

```typescript
export type TElementSelectorAsync<T, TElement> = (
  x: T,
) => TElement | Promise<TElement>;
```

**Type Parameters**

- `T`: The type of the source element.
- `TElement`: The type of the selected element.

**Remarks**

```code
Used in async operations like grouping or transforming elements with potential async computation.
```

**Example**

```typescript
// Async name selector that might fetch from a database
const asyncNameSelector: TElementSelectorAsync<Person, string> = async (
  person,
) => await person.fetchDisplayName();
```

---

## TResultSelectorAsync (type)

**Description**

Represents a synchronous function that selects a key from an element.

**Definition**

```typescript
export type TResultSelectorAsync<TKey, TElement, TResult> = (
  x: TKey,
  y: IAsyncEnumerable<TElement>,
) => Promise<TResult>;
```

**Type Parameters**

- `TKey`: The type of the grouping key.
- `TElement`: The type of elements in the group.
- `TResult`: The type of the result.

**Remarks**

```code
Used in async group transformations to create a new result from a key and its associated async elements.
```

**Example**

```typescript
// Create an async summary for each age group
const asyncResultSelector: TResultSelectorAsync<
  number,
  Person,
  string
> = async (age, peopleGroup) => {
  const count = await peopleGroup.countAsync();
  return `Age ${age}: ${count} people`;
};
```

---

## TResultSelectorJoin (type)

**Description**

Represents a synchronous function that selects a key from an element.

**Definition**

```typescript
export type TResultSelectorJoin<TKey, TElement, TResult> = (
  x: TKey,
  y: TElement,
) => TResult;
```

**Type Parameters**

- `TKey`: The type of the join key.
- `TElement`: The type of the element.
- `TResult`: The type of the result.

**Remarks**

```code
Used to transform elements during join operations.
```

**Example**

```typescript
// Combine order with customer details
const joinResultSelector: TResultSelectorJoin<
  number,
  Customer,
  OrderSummary
> = (orderId, customer) => ({
  orderId,
  customerName: customer.name,
});
```

---

## TResultSelectorJoinAsync (type)

**Description**

Represents a synchronous function that selects a key from an element.

**Definition**

```typescript
export type TResultSelectorJoinAsync<TKey, TElement, TResult> = (
  x: TKey,
  y: TElement,
) => TResult | Promise<TResult>;
```

**Type Parameters**

- `TKey`: The type of the join key.
- `TElement`: The type of the element.
- `TResult`: The type of the result.

**Remarks**

```code
Used to transform elements during async join operations.
```

**Example**

```typescript
// Async combine of order with customer details
const asyncJoinResultSelector: TResultSelectorJoinAsync<
  number,
  Customer,
  OrderSummary
> = async (orderId, customer) => ({
  orderId,
  customerName: await customer.fetchDisplayName(),
});
```

---

## TZipResultSelector (type)

**Description**

Represents a synchronous function that selects a key from an element.

**Definition**

```typescript
export type TZipResultSelector<T, TSecond, TResult> = (
  x: T,
  y: TSecond,
) => TResult;
```

**Type Parameters**

- `T`: The type of the first element.
- `TSecond`: The type of the second element.
- `TResult`: The type of the result.

**Remarks**

```code
Used in zip operations to combine elements from two collections.
```

**Example**

```typescript
// Combine names and ages
const zipResultSelector: TZipResultSelector<string, number, Person> = (
  name,
  age,
) => ({ name, age });
```

---

## TZipResult (type)

**Description**

Represents a synchronous function that selects a key from an element.

**Definition**

```typescript
export type TZipResult<T, TSecond, TThird, TResult> =
  | [T, TSecond]
  | [T, TSecond, TThird]
  | TResult;
```

**Type Parameters**

- `T`: The type of the first element.
- `TSecond`: The type of the second element.
- `TThird`: Optional type of a third element.
- `TResult`: The type of a custom result.

**Remarks**

```code
Allows returning either a tuple of elements or a custom transformed result.
```

**Example**

```typescript
// Can be a tuple or a custom result
const zipResult1: TZipResult<string, number, null, Person> = ["John", 30];
const zipResult2: TZipResult<string, number, null, Person> = {
  name: "John",
  age: 30,
};
```

---

## TZipResultSelectorAsync (type)

**Description**

Represents a synchronous function that selects a key from an element.

**Definition**

```typescript
export type TZipResultSelectorAsync<T, TSecond, TResult> = (
  x: T,
  y: TSecond,
) => TResult | Promise<TResult>;
```

**Type Parameters**

- `T`: The type of the first element.
- `TSecond`: The type of the second element.
- `TResult`: The type of the result.

**Remarks**

```code
Used in async zip operations to combine elements from two collections with potential async computation.
```

**Example**

```typescript
// Async combine of names and ages
const asyncZipResultSelector: TZipResultSelectorAsync<
  string,
  number,
  Person
> = async (name, age) => {
  const formattedName = await formatName(name);
  return { name: formattedName, age };
};
```

---

## SelectManySelector (type)

**Description**

Represents a synchronous function that selects a key from an element.

**Definition**

```typescript
export type SelectManySelector<T, TCollection> = (
  x: T,
  y: number,
) => Iterable<TCollection>;
```

**Type Parameters**

- `T`: The type of the source element.
- `TCollection`: The type of elements in the selected collection.

**Remarks**

```code
Used to flatten a collection by selecting a subcollection from each element.
```

**Example**

```typescript
// Select tags from a blog post
const selectManySelector: SelectManySelector<BlogPost, string> = (post) =>
  post.tags;
```

---

## SelectManyResultSelector (type)

**Description**

Represents a synchronous function that selects a key from an element.

**Definition**

```typescript
export type SelectManyResultSelector<T, TCollection, TResult> = (
  x: T,
  y: TCollection,
) => TResult;
```

**Type Parameters**

- `T`: The type of the source element.
- `TCollection`: The type of elements in the selected collection.
- `TResult`: The type of the result.

**Remarks**

```code
Used to transform elements during a SelectMany operation.
```

**Example**

```typescript
// Transform blog post and its tags
const selectManyResultSelector: SelectManyResultSelector<
  BlogPost,
  string,
  TagInfo
> = (post, tag) => ({ postTitle: post.title, tag });
```

---

## SelectManySelectorAsync (type)

**Description**

Represents a synchronous function that selects a key from an element.

**Definition**

```typescript
export type SelectManySelectorAsync<T, TCollection> = (
  x: T,
  y: number,
) =>
  | AsyncIterable<TCollection>
  | Promise<AsyncIterable<TCollection>>
  | Iterable<TCollection>
  | Promise<Iterable<TCollection>>;
```

**Type Parameters**

- `T`: The type of the source element.
- `TCollection`: The type of elements in the selected collection.

**Remarks**

```code
Used to flatten a collection by selecting a subcollection from each element with potential async computation.
```

**Example**

```typescript
// Async select tags from a blog post
const asyncSelectManySelector: SelectManySelectorAsync<
  BlogPost,
  string
> = async (post) => await post.fetchTags();
```

---

## SelectManyResultSelectorAsync (type)

**Description**

Represents a synchronous function that selects a key from an element.

**Definition**

```typescript
export type SelectManyResultSelectorAsync<T, TCollection, TResult> = (
  x: T,
  y: TCollection,
) => TResult | Promise<TResult>;
```

**Type Parameters**

- `T`: The type of the source element.
- `TCollection`: The type of elements in the selected collection.
- `TResult`: The type of the result.

**Remarks**

```code
Used to transform elements during an async SelectMany operation.
```

**Example**

```typescript
// Async transform of blog post and its tags
const asyncSelectManyResultSelector: SelectManyResultSelectorAsync<
  BlogPost,
  string,
  TagInfo
> = async (post, tag) => {
  const processedTag = await processTag(tag);
  return { postTitle: post.title, tag: processedTag };
};
```

---
