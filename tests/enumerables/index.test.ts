import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("index", function () {
  describe("Enumerable", function () {
    test("empty", function () {
      const a = Enumerable.create([]);
      assert.deepStrictEqual(a.index().toArray(), []);
    });
    test("basic", function () {
      const c = Enumerable.create(["Adam", "Eve", "Steve", "Sally"]);
      assert.deepStrictEqual(c.index().toArray(), [
        [0, "Adam"],
        [1, "Eve"],
        [2, "Steve"],
        [3, "Sally"],
      ]);
    });
    test("repeated calls", function () {
      const c = Enumerable.create(["Adam", "Eve", "Steve", "Sally"]);
      assert.deepStrictEqual(c.index().toArray(), c.index().toArray());
    });
    test("empty sequence returns empty", () => {
      const result = Enumerable.create([]).index().toArray();
      assert.deepStrictEqual(result, []);
    });

    test("basic number sequence", () => {
      const result = Enumerable.create([10, 20, 30]).index().toArray();
      assert.deepStrictEqual(result, [
        [0, 10],
        [1, 20],
        [2, 30],
      ]);
    });

    test("string sequence", () => {
      const result = Enumerable.create(["a", "b", "c"]).index().toArray();
      assert.deepStrictEqual(result, [
        [0, "a"],
        [1, "b"],
        [2, "c"],
      ]);
    });

    test("object sequence", () => {
      const items = [{ id: 1 }, { id: 2 }];
      const result = Enumerable.create(items).index().toArray();
      assert.deepStrictEqual(result, [
        [0, items[0]],
        [1, items[1]],
      ]);
    });

    test("chaining with where", () => {
      const result = Enumerable.create([1, 2, 3, 4])
        .index()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .where(([_i, v]) => v % 2 === 0)
        .toArray();
      assert.deepStrictEqual(result, [
        [1, 2],
        [3, 4],
      ]);
    });

    test("multiple iterations reset index", () => {
      const indexed = Enumerable.create([1, 2, 3]).index();
      const first = indexed.toArray();
      const second = indexed.toArray();
      assert.deepStrictEqual(first, second);
    });
  });
  describe("AsyncEnumerable", function () {
    test("empty", async function () {
      const a = AsyncEnumerable.create([]);
      assert.deepStrictEqual(await a.index().toArray(), []);
    });
    test("basic", async function () {
      const c = AsyncEnumerable.create(["Adam", "Eve", "Steve", "Sally"]);
      assert.deepStrictEqual(await c.index().toArray(), [
        [0, "Adam"],
        [1, "Eve"],
        [2, "Steve"],
        [3, "Sally"],
      ]);
    });
    test("repeated calls", async function () {
      const c = AsyncEnumerable.create([
        "Adam",
        "Eve",
        "Steve",
        "Sally",
      ]).index();
      assert.deepStrictEqual(await c.toArray(), await c.toArray());
    });
    test("empty sequence returns empty", async () => {
      const result = await AsyncEnumerable.create([]).index().toArray();
      assert.deepStrictEqual(result, []);
    });

    test("basic number sequence", async () => {
      const result = await AsyncEnumerable.create([10, 20, 30])
        .index()
        .toArray();
      assert.deepStrictEqual(result, [
        [0, 10],
        [1, 20],
        [2, 30],
      ]);
    });

    test("string sequence", async () => {
      const result = await AsyncEnumerable.create(["a", "b", "c"])
        .index()
        .toArray();
      assert.deepStrictEqual(result, [
        [0, "a"],
        [1, "b"],
        [2, "c"],
      ]);
    });

    test("object sequence", async () => {
      const items = [{ id: 1 }, { id: 2 }];
      const result = await AsyncEnumerable.create(items).index().toArray();
      assert.deepStrictEqual(result, [
        [0, items[0]],
        [1, items[1]],
      ]);
    });

    test("chaining with where", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3, 4])
        .index()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .where(([_i, v]) => v % 2 === 0)
        .toArray();
      assert.deepStrictEqual(result, [
        [1, 2],
        [3, 4],
      ]);
    });
  });
});
