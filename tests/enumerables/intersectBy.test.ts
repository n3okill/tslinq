import {
  AsyncEnumerable,
  Enumerable,
  InvalidArgumentException,
  NotIterableException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import {
  CaseInsensitiveEqualityComparer,
  Person,
  Product,
  WeakEqualityComparer,
} from "../shared.ts";

describe("intersectBy", function () {
  const p1: Product = new Product("apple", 9);
  const p2: Product = new Product("orange", 4);
  const p3: Product = new Product("apple", 9);
  const p4: Product = new Product("lemon", 12);
  const p5: Product = new Product("apple", 10);
  const products = [p1, p2, p3, p4, p5];
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 2, 3, 4, 5, 5, 6])
          .intersectBy([1, 1, 3, 3, 5], (x) => x)
          .toArray(),
        [1, 3, 5, 5],
      );
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3])
          .intersectBy(
            ["1", "2"] as unknown as Array<number>,
            (x) => x,
            new WeakEqualityComparer(),
          )
          .toArray(),
        [1, 2],
      );
      assert.deepStrictEqual(
        Enumerable.create(products)
          .intersectBy([4, 10], (x) => x.code)
          .toArray(),
        [p2, p5],
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2, 2, 3, 4, 5, 5, 6]).intersectBy(
        [1, 1, 3, 3, 5],
        (x) => x,
      );
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    test("empty sequences", () => {
      const result = Enumerable.create([])
        .intersectBy([], (x) => x)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("number key selector", () => {
      const first = [2, 4, 6, 8];
      const second = [1, 2, 3, 4];
      const result = Enumerable.create(first)
        .intersectBy(second, (x) => x / 2)
        .toArray();
      assert.deepStrictEqual(result, [2, 4, 6, 8]);
    });

    test("object key selector", () => {
      const people: Array<Person> = [
        { id: 1, name: "John", age: 20 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 20 },
      ];
      const ages = [20, 30];
      const result = Enumerable.create(people)
        .intersectBy(ages, (p) => p.age)
        .toArray();
      assert.deepStrictEqual(result, [
        { id: 1, name: "John", age: 20 },
        { id: 3, name: "Bob", age: 20 },
      ]);
    });

    test("case sensitive by default", () => {
      const items = ["Apple", "Banana", "cherry"];
      const keys = ["apple", "banana"];
      const result = Enumerable.create(items)
        .intersectBy(keys, (x) => x)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("case insensitive with custom comparer", () => {
      const items = ["Apple", "Banana", "cherry"];
      const keys = ["apple", "banana"];
      const result = Enumerable.create(items)
        .intersectBy(keys, (x) => x, new CaseInsensitiveEqualityComparer())
        .toArray();
      assert.deepStrictEqual(result, ["Apple", "Banana"]);
    });

    test("null key handling", () => {
      const items = [{ value: "a" }, { value: null }, { value: "b" }];
      const keys = [null, "b"];
      const result = Enumerable.create(items)
        .intersectBy(keys, (x) => x.value)
        .toArray();
      assert.deepStrictEqual(result, [{ value: null }, { value: "b" }]);
    });
    test("should throw not iterable", () => {
      assert.throws(
        () => Enumerable.create([]).intersectBy(undefined as never, (x) => x),
        NotIterableException,
      );
    });
    test("should throw keySelector not a function", () => {
      assert.throws(
        () => Enumerable.create([]).intersectBy([], undefined as never),
        InvalidArgumentException,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 2, 3, 4, 5, 5, 6])
          .intersectBy([1, 1, 3, 3, 5], (x) => x)
          .toArray(),
        [1, 3, 5, 5],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3])
          .intersectBy(
            ["1", "2"] as unknown as Array<number>,
            (x) => x,
            new WeakEqualityComparer(),
          )
          .toArray(),
        [1, 2],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(products)
          .intersectBy([4, 10], (x) => x.code)
          .toArray(),
        [p2, p5],
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 2, 3, 4, 5, 5, 6]).intersectBy(
        [1, 1, 3, 3, 5],
        (x) => x,
      );
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("empty sequences", async () => {
      const result = await AsyncEnumerable.create([])
        .intersectBy([], (x) => x)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("number key selector", async () => {
      const first = [2, 4, 6, 8];
      const second = [1, 2, 3, 4];
      const result = await AsyncEnumerable.create(first)
        .intersectBy(second, (x) => x / 2)
        .toArray();
      assert.deepStrictEqual(result, [2, 4, 6, 8]);
    });

    test("object key selector", async () => {
      const people: Array<Person> = [
        { id: 1, name: "John", age: 20 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 20 },
      ];
      const ages = [20, 30];
      const result = await AsyncEnumerable.create(people)
        .intersectBy(ages, (p) => p.age)
        .toArray();
      assert.deepStrictEqual(result, [
        { id: 1, name: "John", age: 20 },
        { id: 3, name: "Bob", age: 20 },
      ]);
    });

    test("case sensitive by default", async () => {
      const items = ["Apple", "Banana", "cherry"];
      const keys = ["apple", "banana"];
      const result = await AsyncEnumerable.create(items)
        .intersectBy(keys, (x) => x)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("case insensitive with custom comparer", async () => {
      const items = ["Apple", "Banana", "cherry"];
      const keys = ["apple", "banana"];
      const result = await AsyncEnumerable.create(items)
        .intersectBy(keys, (x) => x, new CaseInsensitiveEqualityComparer())
        .toArray();
      assert.deepStrictEqual(result, ["Apple", "Banana"]);
    });

    test("null key handling", async () => {
      const items = [{ value: "a" }, { value: null }, { value: "b" }];
      const keys = [null, "b"];
      const result = await AsyncEnumerable.create(items)
        .intersectBy(keys, (x) => x.value)
        .toArray();
      assert.deepStrictEqual(result, [{ value: null }, { value: "b" }]);
    });
    test("should throw not iterable", async () => {
      assert.throws(
        () =>
          AsyncEnumerable.create([]).intersectBy(undefined as never, (x) => x),
        NotIterableException,
      );
    });
    test("should throw keySelector not a function", async () => {
      assert.throws(
        () => AsyncEnumerable.create([]).intersectBy([], undefined as never),
        InvalidArgumentException,
      );
    });
    test("async with promises", async () => {
      const items = [
        Promise.resolve({ id: 1, value: "a" }),
        Promise.resolve({ id: 2, value: "b" }),
      ];
      const result = await AsyncEnumerable.create(items)
        .intersectBy(["a", "c"], async (x) => (await x).value)
        .toArray();
      assert.deepStrictEqual(result, [{ id: 1, value: "a" }]);
    });
  });
});
