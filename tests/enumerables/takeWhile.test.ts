import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("takeWhile", function () {
  const fruits = [
    "apple",
    "banana",
    "mango",
    "orange",
    "passionfruit",
    "grape",
  ];
  const fruits2 = [
    "apple",
    "passionfruit",
    "banana",
    "mango",
    "orange",
    "blueberry",
    "grape",
    "strawberry",
  ];
  describe("Enumerable", function () {
    test("basic", function () {
      const e = Enumerable.create(fruits).takeWhile(
        (fruit) => fruit !== "orange",
      );
      assert.deepStrictEqual(e.toArray(), ["apple", "banana", "mango"]);
      const e2 = Enumerable.create(fruits2).takeWhile(
        (fruit, index) => fruit.length >= index,
      );
      assert.deepStrictEqual(e2.toArray(), [
        "apple",
        "passionfruit",
        "banana",
        "mango",
        "orange",
        "blueberry",
      ]);
    });
    test("repeated calls", function () {
      const e = Enumerable.create(fruits).takeWhile(
        (fruit) => fruit !== "orange",
      );
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    test("empty sequence returns empty", () => {
      const result = Enumerable.create([])
        .takeWhile(() => true)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("take while less than condition", () => {
      const result = Enumerable.create([1, 2, 3, 4, 1, 2])
        .takeWhile((x) => x < 3)
        .toArray();
      assert.deepStrictEqual(result, [1, 2]);
    });

    test("take using index", () => {
      const result = Enumerable.create([1, 2, 3, 4])
        .takeWhile((_x, i) => i < 2)
        .toArray();
      assert.deepStrictEqual(result, [1, 2]);
    });

    test("false predicate returns empty", () => {
      const result = Enumerable.create([1, 2, 3])
        .takeWhile(() => false)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("true predicate takes all", () => {
      const result = Enumerable.create([1, 2, 3])
        .takeWhile(() => true)
        .toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("stops at first false condition", () => {
      const result = Enumerable.create([1, 2, 1, 2])
        .takeWhile((x) => x < 2)
        .toArray();
      assert.deepStrictEqual(result, [1]);
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      const e = AsyncEnumerable.create(fruits).takeWhile(
        (fruit) => fruit !== "orange",
      );
      assert.deepStrictEqual(await e.toArray(), ["apple", "banana", "mango"]);
      const e2 = AsyncEnumerable.create(fruits2).takeWhile(
        (fruit, index) => fruit.length >= index,
      );
      assert.deepStrictEqual(await e2.toArray(), [
        "apple",
        "passionfruit",
        "banana",
        "mango",
        "orange",
        "blueberry",
      ]);
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create(fruits).takeWhile(
        (fruit) => fruit !== "orange",
      );
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("empty sequence returns empty", async () => {
      const result = await AsyncEnumerable.create([])
        .takeWhile(() => true)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("take while less than condition", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3, 4, 1, 2])
        .takeWhile((x) => x < 3)
        .toArray();
      assert.deepStrictEqual(result, [1, 2]);
    });

    test("take using index", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3, 4])
        .takeWhile((_x, i) => i < 2)
        .toArray();
      assert.deepStrictEqual(result, [1, 2]);
    });

    test("false predicate returns empty", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .takeWhile(() => false)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("true predicate takes all", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .takeWhile(() => true)
        .toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("stops at first false condition", async () => {
      const result = await AsyncEnumerable.create([1, 2, 1, 2])
        .takeWhile((x) => x < 2)
        .toArray();
      assert.deepStrictEqual(result, [1]);
    });
  });
  describe("AsyncEnumerable async", function () {
    test("basic", async function () {
      const e = AsyncEnumerable.create(fruits).takeWhile(async (fruit) =>
        Promise.resolve(fruit !== "orange"),
      );
      assert.deepStrictEqual(await e.toArray(), ["apple", "banana", "mango"]);
      const e2 = AsyncEnumerable.create(fruits2).takeWhile(
        async (fruit, index) => Promise.resolve(fruit.length >= index),
      );
      assert.deepStrictEqual(await e2.toArray(), [
        "apple",
        "passionfruit",
        "banana",
        "mango",
        "orange",
        "blueberry",
      ]);
    });
    test("async with promises", async () => {
      const result = await AsyncEnumerable.create([
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3),
      ])
        .takeWhile(async (x) => (await x) < 3)
        .toArray();
      assert.deepStrictEqual(await Promise.all(result), [1, 2]);
    });
  });
});
