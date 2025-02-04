import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("defaultIfEmpty", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(
        Enumerable.create<number>([]).defaultIfEmpty(0).toArray(),
        [0],
      );
      assert.deepStrictEqual(
        Enumerable.create([1, 2]).defaultIfEmpty(5).toArray(),
        [1, 2],
      );
      assert.deepStrictEqual(Enumerable.create([]).defaultIfEmpty().toArray(), [
        undefined,
      ]);
    });
    test("repeated calls", function () {
      const e = Enumerable.create<number>([]).defaultIfEmpty(0);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    test("First_Last_ElementAt on non-empty", () => {
      const nonEmpty = Enumerable.range(1, 3);
      assert.strictEqual(nonEmpty.first(), 1);
      assert.strictEqual(nonEmpty.last(), 3);
      assert.strictEqual(nonEmpty.elementAt(0), 1);
      assert.strictEqual(nonEmpty.elementAt(1), 2);
      assert.strictEqual(nonEmpty.elementAt(2), 3);
      assert.throws(() => nonEmpty.elementAt(-1));
      assert.throws(() => nonEmpty.elementAt(4));

      const empty: Array<number> = [];
      const withDefault = Enumerable.create(empty).defaultIfEmpty(42);
      assert.strictEqual(withDefault.first(), 42);
      assert.strictEqual(withDefault.last(), 42);
      assert.strictEqual(withDefault.elementAt(0), 42);
      assert.throws(() => withDefault.elementAt(1));
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create<number>([]).defaultIfEmpty(0).toArray(),
        [0],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2]).defaultIfEmpty(5).toArray(),
        [1, 2],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([]).defaultIfEmpty().toArray(),
        [undefined],
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create<number>([]).defaultIfEmpty(0);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("First_Last_ElementAt on non-empty", async () => {
      const nonEmpty = AsyncEnumerable.range(1, 3);
      assert.strictEqual(await nonEmpty.first(), 1);
      assert.strictEqual(await nonEmpty.last(), 3);
      assert.strictEqual(await nonEmpty.elementAt(0), 1);
      assert.strictEqual(await nonEmpty.elementAt(1), 2);
      assert.strictEqual(await nonEmpty.elementAt(2), 3);
      await assert.rejects(nonEmpty.elementAt(-1));
      await assert.rejects(nonEmpty.elementAt(4));

      const empty: Array<number> = [];
      const withDefault = AsyncEnumerable.create(empty).defaultIfEmpty(42);
      assert.strictEqual(await withDefault.first(), 42);
      assert.strictEqual(await withDefault.last(), 42);
      assert.strictEqual(await withDefault.elementAt(0), 42);
      await assert.rejects(withDefault.elementAt(1));
    });
  });
});
