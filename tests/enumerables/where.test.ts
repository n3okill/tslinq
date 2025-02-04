import {
  AsyncEnumerable,
  Enumerable,
  InvalidArgumentException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("where", function () {
  const fruits = [
    "apple",
    "passionfruit",
    "banana",
    "mango",
    "orange",
    "blueberry",
    "grape",
    "strawberry",
  ];
  const numbers = [0, 30, 20, 15, 90, 85, 40, 75];
  describe("Enumerable", function () {
    test("basic", function () {
      const e = Enumerable.create(fruits).where((fruit) => fruit.length < 6);
      const result = ["apple", "mango", "grape"];
      assert.deepStrictEqual(e.toArray(), result);
    });
    test("index", function () {
      const e = Enumerable.create(numbers).where(
        (number, index) => number <= index * 10,
      );
      const result = [0, 20, 15, 40];
      assert.deepStrictEqual(e.toArray(), result);
    });
    test("repeated calls", function () {
      const e = Enumerable.create(fruits).where((fruit) => fruit.length < 6);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    test("empty sequence returns empty", () => {
      const result = Enumerable.create([])
        .where(() => true)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("filters numbers", () => {
      const result = Enumerable.create([1, 2, 3, 4])
        .where((x) => x % 2 === 0)
        .toArray();
      assert.deepStrictEqual(result, [2, 4]);
    });

    test("filters with index", () => {
      const result = Enumerable.create([1, 2, 3, 4])
        .where((x, i) => i % 2 === 0)
        .toArray();
      assert.deepStrictEqual(result, [1, 3]);
    });

    test("no matches returns empty", () => {
      const result = Enumerable.create([1, 2, 3])
        .where((x) => x > 10)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("all matches returns all", () => {
      const result = Enumerable.create([1, 2, 3])
        .where((x) => x > 0)
        .toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("filters objects", () => {
      const items = [
        { id: 1, active: true },
        { id: 2, active: false },
        { id: 3, active: true },
      ];
      const result = Enumerable.create(items)
        .where((x) => x.active)
        .toArray();
      assert.deepStrictEqual(result, [items[0], items[2]]);
    });

    test("throws on null predicate", () => {
      assert.throws(
        () => Enumerable.create([1]).where(null as never),
        InvalidArgumentException,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      const e = AsyncEnumerable.create(fruits).where(
        (fruit) => fruit.length < 6,
      );
      const result = ["apple", "mango", "grape"];
      assert.deepStrictEqual(await e.toArray(), result);
    });
    test("index", async function () {
      const e = AsyncEnumerable.create(numbers).where(
        (number, index) => number <= index * 10,
      );
      const result = [0, 20, 15, 40];
      assert.deepStrictEqual(await e.toArray(), result);
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create(fruits).where(
        (fruit) => fruit.length < 6,
      );
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("empty sequence returns empty", async () => {
      const result = await AsyncEnumerable.create([])
        .where(() => true)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("filters numbers", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3, 4])
        .where((x) => x % 2 === 0)
        .toArray();
      assert.deepStrictEqual(result, [2, 4]);
    });

    test("filters with index", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3, 4])
        .where((x, i) => i % 2 === 0)
        .toArray();
      assert.deepStrictEqual(result, [1, 3]);
    });

    test("no matches returns empty", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .where((x) => x > 10)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("all matches returns all", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .where((x) => x > 0)
        .toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("filters objects", async () => {
      const items = [
        { id: 1, active: true },
        { id: 2, active: false },
        { id: 3, active: true },
      ];
      const result = await AsyncEnumerable.create(items)
        .where((x) => x.active)
        .toArray();
      assert.deepStrictEqual(result, [items[0], items[2]]);
    });

    test("throws on null predicate", async () => {
      await assert.rejects(
        async () => AsyncEnumerable.create([1]).where(null as never),
        InvalidArgumentException,
      );
    });
  });
  describe("AsyncEnumerable async", function () {
    test("basic", async function () {
      const e = AsyncEnumerable.create(fruits).where(async (fruit) =>
        Promise.resolve(fruit.length < 6),
      );
      const result = ["apple", "mango", "grape"];
      assert.deepStrictEqual(await e.toArray(), result);
    });
    test("index", async function () {
      const e = AsyncEnumerable.create(numbers).where(async (number, index) =>
        Promise.resolve(number <= index * 10),
      );
      const result = [0, 20, 15, 40];
      assert.deepStrictEqual(await e.toArray(), result);
    });
    test("async filtering", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3, 4])
        .where(async (x) => x % 2 === 0)
        .toArray();
      assert.deepStrictEqual(result, [2, 4]);
    });

    test("async with promises", async () => {
      const result = await AsyncEnumerable.create([
        Promise.resolve(1),
        Promise.resolve(2),
      ])
        .where(async (x) => (await x) % 2 === 0)
        .toArray();
      assert.deepStrictEqual(await Promise.all(result), [2]);
    });
  });
});
