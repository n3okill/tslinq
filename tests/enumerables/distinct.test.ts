import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import {
  AnagramEqualityComparer,
  Product,
  ProductEqualityComparer,
  ProductEqualityComparerAsync,
  WeakEqualityComparer,
  WeakEqualityComparerAsync,
} from "../shared.ts";

describe("distinct", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 1, 2]).distinct().toArray(),
        [1, 2],
      );
      assert.deepStrictEqual(
        Enumerable.create([1, 2])
          .concat([3, 4])
          .concat([1, 3])
          .distinct()
          .toArray(),
        [1, 2, 3, 4],
      );
      assert.deepStrictEqual(
        Enumerable.create(["f", "o", "o"]).distinct().toArray(),
        ["f", "o"],
      );
      assert.deepStrictEqual(Enumerable.create([]).distinct().toArray(), []);
    });
    test("Comparer", function () {
      const p1: Product = new Product("apple", 9);
      const p2: Product = new Product("orange", 4);
      const p3: Product = new Product("apple", 9);
      const p4: Product = new Product("lemon", 12);
      const products = [p1, p2, p3, p4];
      assert.deepStrictEqual(
        Enumerable.create(products)
          .distinct(new ProductEqualityComparer())
          .toArray(),
        [p1, p2, p4],
      );
      assert.deepStrictEqual(
        Enumerable.create(["1", 1, 2, 2, 3, "3"])
          .distinct(new WeakEqualityComparer())
          .toArray(),
        ["1", 2, 3],
      );
    });
    test("same results on repeated calls with number query", () => {
      const numbers = [
        0, 9999, 0, 888, -1, 66, -1, -777, 1, 2, -12345, 66, 66, -1, -1,
      ];
      const q = Enumerable.create(numbers).where(
        (x) => x > Number.MIN_SAFE_INTEGER,
      );

      assert.deepStrictEqual(q.distinct().toArray(), q.distinct().toArray());
    });

    test("same results on repeated calls with string query", () => {
      const strings = ["!@#$%^", "C", "AAA", "Calling Twice", "SoS"];
      const q = Enumerable.create(strings).where((x) => !x);

      assert.deepStrictEqual(q.distinct().toArray(), q.distinct().toArray());
    });

    test("empty source", () => {
      assert.deepStrictEqual(Enumerable.create([]).distinct().toArray(), []);
    });

    test("single null element with default comparer", () => {
      assert.deepStrictEqual(Enumerable.create([null]).distinct().toArray(), [
        null,
      ]);
    });

    test("empty string distinct from null", () => {
      assert.deepStrictEqual(
        Enumerable.create([null, null, ""]).distinct().toArray(),
        [null, ""],
      );
    });

    test("collapse duplicate nulls", () => {
      assert.deepStrictEqual(
        Enumerable.create([null, null]).distinct().toArray(),
        [null],
      );
    });

    test("source all duplicates", () => {
      assert.deepStrictEqual(
        Enumerable.create([5, 5, 5, 5, 5, 5]).distinct().toArray(),
        [5],
      );
    });

    test("all unique", () => {
      const source = [2, -5, 0, 6, 10, 9];
      assert.deepStrictEqual(
        Enumerable.create(source).distinct().toArray(),
        source,
      );
    });

    test("some duplicates including nulls", () => {
      assert.deepStrictEqual(
        Enumerable.create([1, 1, 1, 2, 2, 2, null, null]).distinct().toArray(),
        [1, 2, null],
      );
    });

    test("repeats non consecutive", () => {
      assert.deepStrictEqual(
        Enumerable.create([1, 1, 2, 2, 4, 3, 1, 3, 2]).distinct().toArray(),
        [1, 2, 4, 3],
      );
    });

    test("custom equality comparer", () => {
      const source = ["Bob", "Tim", "bBo", "miT", "Robert", "iTm"];
      assert.deepStrictEqual(
        Enumerable.create(source)
          .distinct(new AnagramEqualityComparer())
          .toArray(),
        ["Bob", "Tim", "Robert"],
      );
    });

    test("sequences with duplicates", () => {
      const testSequences = [
        [1, 1, 1, 2, 3, 5, 5, 6, 6, 10],
        ["add", "add", "subtract", "multiply", "divide", "divide2", "subtract"],
      ];

      for (const sequence of testSequences) {
        const distinct = Enumerable.create(sequence as never)
          .distinct()
          .toArray();
        const set = new Set(distinct);
        assert.strictEqual(set.size, distinct.length);

        const originalSet = new Set(sequence as never);
        for (const item of distinct) {
          assert.ok(originalSet.has(item));
        }
      }
    });

    test("repeat enumerating", () => {
      const source = [1, 1, 1, 2, 2, 2, null, null];
      const result = Enumerable.create(source).distinct();
      assert.deepStrictEqual(result.toArray(), result.toArray());
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 1, 2]).distinct().toArray(),
        [1, 2],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2])
          .concat([3, 4])
          .concat([1, 3])
          .distinct()
          .toArray(),
        [1, 2, 3, 4],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(["f", "o", "o"]).distinct().toArray(),
        ["f", "o"],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([]).distinct().toArray(),
        [],
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
          .distinct(new ProductEqualityComparer())
          .toArray(),
        [p1, p2, p4],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(["1", 1, 2, 2, 3, "3"])
          .distinct(new WeakEqualityComparer())
          .toArray(),
        ["1", 2, 3],
      );
    });
    test("repeated calls", async () => {
      const e = AsyncEnumerable.create([1, 2, 2]).distinct();
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("same results on repeated calls with number query", async () => {
      const numbers = [
        0, 9999, 0, 888, -1, 66, -1, -777, 1, 2, -12345, 66, 66, -1, -1,
      ];
      const q = AsyncEnumerable.create(numbers).where(
        (x) => x > Number.MIN_SAFE_INTEGER,
      );

      assert.deepStrictEqual(
        await q.distinct().toArray(),
        await q.distinct().toArray(),
      );
    });

    test("same results on repeated calls with string query", async () => {
      const strings = ["!@#$%^", "C", "AAA", "Calling Twice", "SoS"];
      const q = AsyncEnumerable.create(strings).where((x) => !x);

      assert.deepStrictEqual(
        await q.distinct().toArray(),
        await q.distinct().toArray(),
      );
    });

    test("empty source", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([]).distinct().toArray(),
        [],
      );
    });

    test("single null element with default comparer", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([null]).distinct().toArray(),
        [null],
      );
    });

    test("empty string distinct from null", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([null, null, ""]).distinct().toArray(),
        [null, ""],
      );
    });

    test("collapse duplicate nulls", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([null, null]).distinct().toArray(),
        [null],
      );
    });

    test("source all duplicates", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([5, 5, 5, 5, 5, 5]).distinct().toArray(),
        [5],
      );
    });

    test("all unique", async () => {
      const source = [2, -5, 0, 6, 10, 9];
      assert.deepStrictEqual(
        await AsyncEnumerable.create(source).distinct().toArray(),
        source,
      );
    });

    test("some duplicates including nulls", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 1, 1, 2, 2, 2, null, null])
          .distinct()
          .toArray(),
        [1, 2, null],
      );
    });

    test("repeats non consecutive", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 1, 2, 2, 4, 3, 1, 3, 2])
          .distinct()
          .toArray(),
        [1, 2, 4, 3],
      );
    });

    test("custom equality comparer", async () => {
      const source = ["Bob", "Tim", "bBo", "miT", "Robert", "iTm"];
      assert.deepStrictEqual(
        await AsyncEnumerable.create(source)
          .distinct(new AnagramEqualityComparer())
          .toArray(),
        ["Bob", "Tim", "Robert"],
      );
    });

    test("sequences with duplicates", async () => {
      const testSequences = [
        [1, 1, 1, 2, 3, 5, 5, 6, 6, 10],
        ["add", "add", "subtract", "multiply", "divide", "divide2", "subtract"],
      ];

      for (const sequence of testSequences) {
        const distinct = await AsyncEnumerable.create(sequence as never)
          .distinct()
          .toArray();
        const set = new Set(distinct);
        assert.strictEqual(set.size, distinct.length);

        const originalSet = new Set(sequence as never);
        for (const item of distinct) {
          assert.ok(originalSet.has(item));
        }
      }
    });
  });
  describe("AsyncEnumerable async comparer", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 1, 2]).distinct().toArray(),
        [1, 2],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2])
          .concat([3, 4])
          .concat([1, 3])
          .distinct()
          .toArray(),
        [1, 2, 3, 4],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(["f", "o", "o"]).distinct().toArray(),
        ["f", "o"],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([]).distinct().toArray(),
        [],
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
          .distinct(new ProductEqualityComparerAsync())
          .toArray(),
        [p1, p2, p4],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(["1", 1, 2, 2, 3, "3"])
          .distinct(new WeakEqualityComparerAsync())
          .toArray(),
        ["1", 2, 3],
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 2]).distinct();
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
});
