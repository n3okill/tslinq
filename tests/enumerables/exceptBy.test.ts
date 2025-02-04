import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import {
  CaseInsensitiveEqualityComparer,
  Person,
  Product,
  ProductEqualityComparer,
  ProductEqualityComparerAsync,
} from "../shared.ts";

describe("exceptBy", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3, 4, 5])
          .exceptBy([3, 4], (x) => x)
          .toArray(),
        [1, 2, 5],
      );
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3, 4, 5])
          .exceptBy([2], (x) => x)
          .exceptBy([4], (x) => x)
          .toArray(),
        [1, 3, 5],
      );
    });
    test("Comparer", function () {
      const p1: Product = new Product("apple", 9);
      const p2: Product = new Product("orange", 4);
      const p3: Product = new Product("apple", 9);
      const p4: Product = new Product("lemon", 12);
      const p5: Product = new Product("apple", 10);
      const products = [p1, p2, p3, p4, p5];
      assert.deepStrictEqual(
        Enumerable.create(products)
          .exceptBy([p1, p5], (x) => x, new ProductEqualityComparer())
          .toArray(),
        [p2, p4],
      );
      assert.deepStrictEqual(
        Enumerable.create(products)
          .exceptBy([2, 4, 9], (x) => x.code)
          .toArray(),
        [p4, p5],
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2]).exceptBy([2], (x) => x);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    test("empty first returns empty", () => {
      assert.deepStrictEqual(
        Enumerable.create<number>([])
          .exceptBy([1, 2], (x) => x)
          .toArray(),
        [],
      );
    });

    test("empty second returns first", () => {
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3])
          .exceptBy([], (x) => x)
          .toArray(),
        [1, 2, 3],
      );
    });

    test("basic key selector", () => {
      const first = [1, 2, 3, 4];
      const second = [6, 8];
      assert.deepStrictEqual(
        Enumerable.create(first)
          .exceptBy(second, (x) => x % 2)
          .toArray(),
        [1, 2],
      );
    });

    test("complex object key selector", () => {
      const first: Array<Person> = [
        { id: 1, name: "John", age: 25 },
        { id: 2, name: "Jane", age: 30 },
        { id: 3, name: "Bob", age: 25 },
      ];
      const excludeAges = [25, 35];

      assert.deepStrictEqual(
        Enumerable.create(first)
          .exceptBy(excludeAges, (p) => p.age)
          .toArray(),
        [{ id: 2, name: "Jane", age: 30 }],
      );
    });

    test("case sensitive string keys", () => {
      const items = ["Apple", "Banana", "cherry"];
      const excludeKeys = ["APPLE", "banana"];

      assert.deepStrictEqual(
        Enumerable.create(items)
          .exceptBy(excludeKeys, (x) => x)
          .toArray(),
        ["Apple", "Banana", "cherry"],
      );
    });

    test("case insensitive string keys with custom comparer", () => {
      const items = ["Apple", "Banana", "cherry"];
      const excludeKeys = ["APPLE", "banana"];

      assert.deepStrictEqual(
        Enumerable.create(items)
          .exceptBy(
            excludeKeys,
            (x) => x,
            new CaseInsensitiveEqualityComparer(),
          )
          .toArray(),
        ["cherry"],
      );
    });

    test("handles duplicate keys in source", () => {
      const items = [
        { id: 1, category: "A" },
        { id: 2, category: "A" },
        { id: 3, category: "B" },
      ];
      const excludeCategories = ["A"];

      assert.deepStrictEqual(
        Enumerable.create(items)
          .exceptBy(excludeCategories, (x) => x.category)
          .toArray(),
        [{ id: 3, category: "B" }],
      );
    });

    test("handles null values in key selector", () => {
      const items = [
        { id: 1, value: "a" },
        { id: 2, value: null },
        { id: 3, value: "b" },
      ];
      const excludeValues = [null, "b"];

      assert.deepStrictEqual(
        Enumerable.create(items)
          .exceptBy(excludeValues, (x) => x.value)
          .toArray(),
        [{ id: 1, value: "a" }],
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3, 4, 5])
          .exceptBy([3, 4], (x) => x)
          .toArray(),
        [1, 2, 5],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3, 4, 5])
          .exceptBy([2], (x) => x)
          .exceptBy([4], (x) => x)
          .toArray(),
        [1, 3, 5],
      );
    });
    test("Comparer", async function () {
      const p1: Product = new Product("apple", 9);
      const p2: Product = new Product("orange", 4);
      const p3: Product = new Product("apple", 9);
      const p4: Product = new Product("lemon", 12);
      const p5: Product = new Product("apple", 10);
      const products = [p1, p2, p3, p4, p5];
      assert.deepStrictEqual(
        await AsyncEnumerable.create(products)
          .exceptBy([p1, p5], (x) => x, new ProductEqualityComparer())
          .toArray(),
        [p2, p4],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(products)
          .exceptBy([2, 4, 9], (x) => x.code)
          .toArray(),
        [p4, p5],
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2]).exceptBy([2], (x) => x);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("empty first returns empty", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create<number>([])
          .exceptBy([1, 2], (x) => x)
          .toArray(),
        [],
      );
    });

    test("empty second returns first", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3])
          .exceptBy([], (x) => x)
          .toArray(),
        [1, 2, 3],
      );
    });

    test("basic key selector", async () => {
      const first = [1, 2, 3, 4];
      const second = [6, 8];
      assert.deepStrictEqual(
        await AsyncEnumerable.create(first)
          .exceptBy(second, (x) => x % 2)
          .toArray(),
        [1, 2],
      );
    });

    test("complex object key selector", async () => {
      const first: Array<Person> = [
        { id: 1, name: "John", age: 25 },
        { id: 2, name: "Jane", age: 30 },
        { id: 3, name: "Bob", age: 25 },
      ];
      const excludeAges = [25, 35];

      assert.deepStrictEqual(
        await AsyncEnumerable.create(first)
          .exceptBy(excludeAges, (p) => p.age)
          .toArray(),
        [{ id: 2, name: "Jane", age: 30 }],
      );
    });

    test("case sensitive string keys", async () => {
      const items = ["Apple", "Banana", "cherry"];
      const excludeKeys = ["APPLE", "banana"];

      assert.deepStrictEqual(
        await AsyncEnumerable.create(items)
          .exceptBy(excludeKeys, (x) => x)
          .toArray(),
        ["Apple", "Banana", "cherry"],
      );
    });

    test("case insensitive string keys with custom comparer", async () => {
      const items = ["Apple", "Banana", "cherry"];
      const excludeKeys = ["APPLE", "banana"];

      assert.deepStrictEqual(
        await AsyncEnumerable.create(items)
          .exceptBy(
            excludeKeys,
            (x) => x,
            new CaseInsensitiveEqualityComparer(),
          )
          .toArray(),
        ["cherry"],
      );
    });

    test("handles duplicate keys in source", async () => {
      const items = [
        { id: 1, category: "A" },
        { id: 2, category: "A" },
        { id: 3, category: "B" },
      ];
      const excludeCategories = ["A"];

      assert.deepStrictEqual(
        await AsyncEnumerable.create(items)
          .exceptBy(excludeCategories, (x) => x.category)
          .toArray(),
        [{ id: 3, category: "B" }],
      );
    });

    test("handles null values in key selector", async () => {
      const items = [
        { id: 1, value: "a" },
        { id: 2, value: null },
        { id: 3, value: "b" },
      ];
      const excludeValues = [null, "b"];

      assert.deepStrictEqual(
        await AsyncEnumerable.create(items)
          .exceptBy(excludeValues, (x) => x.value)
          .toArray(),
        [{ id: 1, value: "a" }],
      );
    });
  });
  describe("AsyncEnumerable comparer async", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3, 4, 5])
          .exceptBy([3, 4], (x) => x)
          .toArray(),
        [1, 2, 5],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3, 4, 5])
          .exceptBy([2], (x) => x)
          .exceptBy([4], (x) => x)
          .toArray(),
        [1, 3, 5],
      );
    });
    test("Comparer", async function () {
      const p1: Product = new Product("apple", 9);
      const p2: Product = new Product("orange", 4);
      const p3: Product = new Product("apple", 9);
      const p4: Product = new Product("lemon", 12);
      const products = [p1, p2, p3, p4];
      assert.deepStrictEqual(
        await AsyncEnumerable.create(products)
          .exceptBy([p1], (x) => x, new ProductEqualityComparerAsync())
          .toArray(),
        [p2, p4],
      );
    });
  });
});
