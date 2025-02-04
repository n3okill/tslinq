import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("toArray", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      const e = Enumerable.create([1, 2, 3]);
      const result = e.toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
      assert.strictEqual(result.length, e.count());
      assert.deepStrictEqual(e.toArray(), result);
      assert.deepStrictEqual(Enumerable.create(["1", "2", "3"]).toArray(), [
        "1",
        "2",
        "3",
      ]);
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2, 3]);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    test("empty source returns empty array", () => {
      const source = Enumerable.create([]);
      assert.deepStrictEqual(source.toArray(), []);
      assert.deepStrictEqual(source.select((a) => a).toArray(), []);
      assert.deepStrictEqual(source.orderBy((a) => a).toArray(), []);

      assert.deepStrictEqual(
        Enumerable.range(5, 0).toArray(),
        Enumerable.range(3, 0).toArray(),
      );
      assert.deepStrictEqual(
        Enumerable.range(5, 3).take(0).toArray(),
        Enumerable.range(3, 0).toArray(),
      );
      assert.deepStrictEqual(
        Enumerable.range(5, 3).skip(3).toArray(),
        Enumerable.range(3, 0).toArray(),
      );

      assert.deepStrictEqual(
        Enumerable.repeat(42, 0).toArray(),
        Enumerable.range(84, 0).toArray(),
      );
      assert.deepStrictEqual(
        Enumerable.repeat(42, 3).take(0).toArray(),
        Enumerable.range(84, 3).take(0).toArray(),
      );
      assert.deepStrictEqual(
        Enumerable.repeat(42, 3).skip(3).toArray(),
        Enumerable.range(84, 3).skip(3).toArray(),
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      const e = AsyncEnumerable.create([1, 2, 3]);
      const result = await e.toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
      assert.strictEqual(result.length, await e.count());
      assert.deepStrictEqual(await e.toArray(), result);
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 3]);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
});
