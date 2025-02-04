import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("prepend", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      const c = Enumerable.create([1, 2]);
      assert.strictEqual(c.count(), 2);
      assert.strictEqual(c.prepend(3).count(), 3);
      const e = c.prepend(4);
      assert.strictEqual(e.count(), 3);
      assert.deepStrictEqual(e.toArray(), [4, 1, 2]);
    });
    test("repeated calls", function () {
      const c = Enumerable.create([1, 2]).prepend(3);
      assert.deepStrictEqual(c.toArray(), c.toArray());
    });
    test("chained prepend operations", () => {
      const source = Enumerable.range(2, 2).prepend(1).prepend(0);
      const pre0a = source.prepend(5);
      const pre0b = source.prepend(6);
      const pre1aa = pre0a.prepend(7);
      const pre1ab = pre0a.prepend(8);
      const pre1ba = pre0b.prepend(9);
      const pre1bb = pre0b.prepend(10);

      assert.deepStrictEqual(pre0a.toArray(), [5, 0, 1, 2, 3]);
      assert.deepStrictEqual(pre0b.toArray(), [6, 0, 1, 2, 3]);
      assert.deepStrictEqual(pre1aa.toArray(), [7, 5, 0, 1, 2, 3]);
      assert.deepStrictEqual(pre1ab.toArray(), [8, 5, 0, 1, 2, 3]);
      assert.deepStrictEqual(pre1ba.toArray(), [9, 6, 0, 1, 2, 3]);
      assert.deepStrictEqual(pre1bb.toArray(), [10, 6, 0, 1, 2, 3]);
    });
    test("prepend_first_last_elementAt", () => {
      // Array source tests
      assert.strictEqual(Enumerable.create([84]).prepend(42).first(), 42);
      assert.strictEqual(Enumerable.create([84]).prepend(42).last(), 84);
      assert.strictEqual(Enumerable.create([84]).prepend(42).elementAt(0), 42);
      assert.strictEqual(Enumerable.create([84]).prepend(42).elementAt(1), 84);

      // Range source tests
      assert.strictEqual(Enumerable.range(84, 1).prepend(42).first(), 42);
      assert.strictEqual(Enumerable.range(84, 1).prepend(42).last(), 84);
      assert.strictEqual(Enumerable.range(84, 1).prepend(42).elementAt(0), 42);
      assert.strictEqual(Enumerable.range(84, 1).prepend(42).elementAt(1), 84);
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      const c = AsyncEnumerable.create([1, 2]);
      assert.strictEqual(await c.count(), 2);
      assert.strictEqual(await c.prepend(3).count(), 3);
      const e = c.prepend(4);
      assert.strictEqual(await e.count(), 3);
      assert.deepStrictEqual(await e.toArray(), [4, 1, 2]);
    });
    test("repeated calls", async function () {
      const c = AsyncEnumerable.create([1, 2]).prepend(3);
      assert.deepStrictEqual(await c.toArray(), await c.toArray());
    });
    test("chained prepend operations", async () => {
      const source = AsyncEnumerable.range(2, 2).prepend(1).prepend(0);
      const pre0a = source.prepend(5);
      const pre0b = source.prepend(6);
      const pre1aa = pre0a.prepend(7);
      const pre1ab = pre0a.prepend(8);
      const pre1ba = pre0b.prepend(9);
      const pre1bb = pre0b.prepend(10);

      assert.deepStrictEqual(await pre0a.toArray(), [5, 0, 1, 2, 3]);
      assert.deepStrictEqual(await pre0b.toArray(), [6, 0, 1, 2, 3]);
      assert.deepStrictEqual(await pre1aa.toArray(), [7, 5, 0, 1, 2, 3]);
      assert.deepStrictEqual(await pre1ab.toArray(), [8, 5, 0, 1, 2, 3]);
      assert.deepStrictEqual(await pre1ba.toArray(), [9, 6, 0, 1, 2, 3]);
      assert.deepStrictEqual(await pre1bb.toArray(), [10, 6, 0, 1, 2, 3]);
    });
    test("prepend_first_last_elementAt", async () => {
      // Array source tests
      assert.strictEqual(
        await AsyncEnumerable.create([84]).prepend(42).first(),
        42,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([84]).prepend(42).last(),
        84,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([84]).prepend(42).elementAt(0),
        42,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([84]).prepend(42).elementAt(1),
        84,
      );

      // Range source tests
      assert.strictEqual(
        await AsyncEnumerable.range(84, 1).prepend(42).first(),
        42,
      );
      assert.strictEqual(
        await AsyncEnumerable.range(84, 1).prepend(42).last(),
        84,
      );
      assert.strictEqual(
        await AsyncEnumerable.range(84, 1).prepend(42).elementAt(0),
        42,
      );
      assert.strictEqual(
        await AsyncEnumerable.range(84, 1).prepend(42).elementAt(1),
        84,
      );
    });
  });
});
