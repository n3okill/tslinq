import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import {
  CaseInsensitiveEqualityComparer,
  Person,
  PersonComparer,
  Product,
  ProductEqualityComparer,
  ProductEqualityComparerAsync,
} from "../shared.ts";

describe("except", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3, 4, 5]).except([3, 4]).toArray(),
        [1, 2, 5],
      );
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3, 4, 5]).except([2]).except([4]).toArray(),
        [1, 3, 5],
      );
    });
    test("Comparer", function () {
      const p1: Product = new Product("apple", 9);
      const p2: Product = new Product("orange", 4);
      const p3: Product = new Product("apple", 9);
      const p4: Product = new Product("lemon", 12);
      const products = [p1, p2, p3, p4];
      assert.deepStrictEqual(
        Enumerable.create(products)
          .except([{ name: "apple", code: 9 }], new ProductEqualityComparer())
          .toArray(),
        [p2, p4],
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2]).except([2]);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    test("empty first returns empty", () => {
      assert.deepStrictEqual(
        Enumerable.create<number>([]).except([1, 2, 3]).toArray(),
        [],
      );
    });

    test("empty second returns first", () => {
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3]).except([]).toArray(),
        [1, 2, 3],
      );
    });

    test("basic except numbers", () => {
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3, 4]).except([2, 4]).toArray(),
        [1, 3],
      );
    });

    test("handles duplicates in first", () => {
      assert.deepStrictEqual(
        Enumerable.create([1, 1, 2, 3, 3]).except([2]).toArray(),
        [1, 3],
      );
    });

    test("handles duplicates in second", () => {
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3]).except([2, 2, 3, 3]).toArray(),
        [1],
      );
    });

    test("case sensitive strings by default", () => {
      assert.deepStrictEqual(
        Enumerable.create(["a", "b", "A"]).except(["A", "b"]).toArray(),
        ["a"],
      );
    });

    test("with custom case insensitive comparer", () => {
      assert.deepStrictEqual(
        Enumerable.create(["a", "b", "A"])
          .except(["A", "b"], new CaseInsensitiveEqualityComparer())
          .toArray(),
        [],
      );
    });

    test("with complex objects", () => {
      const first: Array<Person> = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
        { id: 3, name: "Bob" },
      ];
      const second: Array<Person> = [
        { id: 2, name: "Jane" },
        { id: 3, name: "Bob" },
      ];

      assert.deepStrictEqual(
        Enumerable.create(first).except(second, new PersonComparer()).toArray(),
        [{ id: 1, name: "John" }],
      );
    });

    test("handles null values", () => {
      assert.deepStrictEqual(
        Enumerable.create([1, null, 2, null]).except([2, null]).toArray(),
        [1],
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3, 4, 5]).except([3, 4]).toArray(),
        [1, 2, 5],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3, 4, 5])
          .except([2])
          .except([4])
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
          .except([p1], new ProductEqualityComparer())
          .toArray(),
        [p2, p4],
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2]).except([2]);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("empty first returns empty", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create<number>([]).except([1, 2, 3]).toArray(),
        [],
      );
    });

    test("empty second returns first", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3]).except([]).toArray(),
        [1, 2, 3],
      );
    });

    test("basic except numbers", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3, 4]).except([2, 4]).toArray(),
        [1, 3],
      );
    });

    test("handles duplicates in first", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 1, 2, 3, 3]).except([2]).toArray(),
        [1, 3],
      );
    });

    test("handles duplicates in second", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3]).except([2, 2, 3, 3]).toArray(),
        [1],
      );
    });

    test("case sensitive strings by default", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create(["a", "b", "A"])
          .except(["A", "b"])
          .toArray(),
        ["a"],
      );
    });

    test("with custom case insensitive comparer", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create(["a", "b", "A"])
          .except(["A", "b"], new CaseInsensitiveEqualityComparer())
          .toArray(),
        [],
      );
    });

    test("with complex objects", async () => {
      const first: Array<Person> = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
        { id: 3, name: "Bob" },
      ];
      const second: Array<Person> = [
        { id: 2, name: "Jane" },
        { id: 3, name: "Bob" },
      ];

      assert.deepStrictEqual(
        await AsyncEnumerable.create(first)
          .except(second, new PersonComparer())
          .toArray(),
        [{ id: 1, name: "John" }],
      );
    });

    test("handles null values", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, null, 2, null])
          .except([2, null])
          .toArray(),
        [1],
      );
    });
  });
  describe("AsyncEnumerable comparer async", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3, 4, 5]).except([3, 4]).toArray(),
        [1, 2, 5],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3, 4, 5])
          .except([2])
          .except([4])
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
          .except([p1], new ProductEqualityComparerAsync())
          .toArray(),
        [p2, p4],
      );
    });
  });
});
