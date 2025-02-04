import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("order", function () {
  const sorted = [0, 1, 3, 4, 5, 5, 6, 7, 8, 9, 9];

  function isShuffled(
    original: Array<number>,
    shuffled: Array<number>,
  ): boolean {
    return (
      original.length === shuffled.length &&
      original.every((x) => shuffled.includes(x)) &&
      original.join() !== shuffled.join()
    );
  }

  describe("Enumerable", function () {
    test("basic", function () {
      const e = Enumerable.range("a", 10);
      assert.notDeepStrictEqual(e.shuffle().toArray(), e.toArray());
      assert.notDeepStrictEqual(
        Enumerable.create(sorted).shuffle().toArray(),
        sorted,
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create(["b", "c", "a"]).shuffle();
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    test("empty sequence returns empty", () => {
      const result = Enumerable.create([]).shuffle().toArray();
      assert.deepStrictEqual(result, []);
    });
    test("single element returns same element", () => {
      const result = Enumerable.create([1]).shuffle().toArray();
      assert.deepStrictEqual(result, [1]);
    });
    test("shuffles multiple elements", () => {
      //This test might fail sometimes :)
      const original = [1, 2, 3, 4, 5];
      const result = Enumerable.create(original).shuffle().toArray();

      assert.ok(isShuffled(original, result), "Sequence should be shuffled");
    });
    test("maintains all elements", () => {
      const original = [1, 2, 3, 4, 5];
      const result = Enumerable.create(original).shuffle().toArray();

      assert.deepStrictEqual(
        result.sort((a, b) => a - b),
        original,
      );
    });
    test("different iterations produce same orders", () => {
      const original = [1, 2, 3, 4, 5];
      const enum1 = Enumerable.create(original).shuffle();

      const result1 = enum1.toArray();
      const result2 = enum1.toArray();

      assert.deepStrictEqual(result1, result2);
    });
    test("maintains object references", () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const result = Enumerable.create([obj1, obj2]).shuffle().toArray();

      assert.ok(
        result.includes(obj1) && result.includes(obj2),
        "Should maintain object references",
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      const e = AsyncEnumerable.range("a", 10);
      assert.notDeepStrictEqual(await e.shuffle().toArray(), e.toArray());
      assert.notDeepStrictEqual(
        await AsyncEnumerable.create(sorted).shuffle().toArray(),
        sorted,
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create(["b", "c", "a"]).shuffle();
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("empty sequence returns empty", async () => {
      const result = await AsyncEnumerable.create([]).shuffle().toArray();
      assert.deepStrictEqual(result, []);
    });
    test("single element returns same element", async () => {
      const result = await AsyncEnumerable.create([1]).shuffle().toArray();
      assert.deepStrictEqual(result, [1]);
    });
    test("shuffles multiple elements", async () => {
      const original = [1, 2, 3, 4, 5];
      const result = await AsyncEnumerable.create(original).shuffle().toArray();

      assert.ok(isShuffled(original, result), "Sequence should be shuffled");
    });
    test("maintains all elements", async () => {
      const original = [1, 2, 3, 4, 5];
      const result = await AsyncEnumerable.create(original).shuffle().toArray();

      assert.deepStrictEqual(
        result.sort((a, b) => a - b),
        original,
      );
    });
    test("maintains object references", async () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const result = await AsyncEnumerable.create([obj1, obj2])
        .shuffle()
        .toArray();

      assert.ok(
        result.includes(obj1) && result.includes(obj2),
        "Should maintain object references",
      );
    });
    test("async with promises", async () => {
      const result = await AsyncEnumerable.create([
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3),
      ])
        .shuffle()
        .toArray();

      assert.strictEqual(result.length, 3);
      const result2 = await Promise.all(result);
      assert.ok(result2.includes(1));
      assert.ok(result2.includes(2));
      assert.ok(result2.includes(3));
    });
  });
});
