import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("reverse", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3]).reverse().toArray(),
        [3, 2, 1],
      );
      assert.deepStrictEqual(Enumerable.create([]).reverse().toArray(), []);
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2, 3]).reverse();
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    test("empty sequence returns empty", () => {
      const result = Enumerable.create([]).reverse().toArray();
      assert.deepStrictEqual(result, []);
    });

    test("single element returns same element", () => {
      const result = Enumerable.create([1]).reverse().toArray();
      assert.deepStrictEqual(result, [1]);
    });

    test("reverses number sequence", () => {
      const result = Enumerable.create([1, 2, 3]).reverse().toArray();
      assert.deepStrictEqual(result, [3, 2, 1]);
    });

    test("reverses string sequence", () => {
      const result = Enumerable.create(["a", "b", "c"]).reverse().toArray();
      assert.deepStrictEqual(result, ["c", "b", "a"]);
    });

    test("maintains object references", () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const result = Enumerable.create([obj1, obj2]).reverse().toArray();
      assert.strictEqual(result[0], obj2);
      assert.strictEqual(result[1], obj1);
    });

    test("multiple reverse operations", () => {
      const source = [1, 2, 3];
      const result = Enumerable.create(source).reverse().reverse().toArray();
      assert.deepStrictEqual(result, source);
    });

    test("chaining with where", () => {
      const result = Enumerable.create([1, 2, 3, 4])
        .reverse()
        .where((x) => x % 2 === 0)
        .toArray();
      assert.deepStrictEqual(result, [4, 2]);
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3]).reverse().toArray(),
        [3, 2, 1],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([]).reverse().toArray(),
        [],
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 3]).reverse();
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("empty sequence returns empty", async () => {
      const result = await AsyncEnumerable.create([]).reverse().toArray();
      assert.deepStrictEqual(result, []);
    });

    test("single element returns same element", async () => {
      const result = await AsyncEnumerable.create([1]).reverse().toArray();
      assert.deepStrictEqual(result, [1]);
    });

    test("reverses number sequence", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .reverse()
        .toArray();
      assert.deepStrictEqual(result, [3, 2, 1]);
    });

    test("reverses string sequence", async () => {
      const result = await AsyncEnumerable.create(["a", "b", "c"])
        .reverse()
        .toArray();
      assert.deepStrictEqual(result, ["c", "b", "a"]);
    });

    test("maintains object references", async () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const result = await AsyncEnumerable.create([obj1, obj2])
        .reverse()
        .toArray();
      assert.strictEqual(result[0], obj2);
      assert.strictEqual(result[1], obj1);
    });

    test("multiple reverse operations", async () => {
      const source = [1, 2, 3];
      const result = await AsyncEnumerable.create(source)
        .reverse()
        .reverse()
        .toArray();
      assert.deepStrictEqual(result, source);
    });

    test("chaining with where", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3, 4])
        .reverse()
        .where((x) => x % 2 === 0)
        .toArray();
      assert.deepStrictEqual(result, [4, 2]);
    });
    test("async with promises", async () => {
      const result = await AsyncEnumerable.create([
        Promise.resolve(1),
        Promise.resolve(2),
      ])
        .reverse()
        .toArray();
      assert.deepStrictEqual(result, [2, 1]);
    });
  });
});
