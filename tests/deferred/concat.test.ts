import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("Concat", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.asEnumerable([1, 2]).concat([3, 4]).count(), 4);
      assert.strictEqual(
        Enumerable.asEnumerable(["a", "b"])
          .concat(Enumerable.asEnumerable(["c", "d"]))
          .count(),
        4,
      );
      assert.deepStrictEqual(
        Enumerable.asEnumerable([1, 2]).concat([3, 4]).concat([5, 6]).toArray(),
        [1, 2, 3, 4, 5, 6],
      );
      assert.strictEqual(
        Enumerable.asEnumerable(
          new Map([
            ["a", 1],
            ["b", 2],
          ]),
        )
          .concat(new Map([["c", 3]]))
          .count(),
        3,
      );
    });
    test("handles two empty arrays", function () {
      assert.deepStrictEqual(Enumerable.asEnumerable([]).concat([]).toArray(), []);
    });
    test("handles calling array being empty", function () {
      assert.deepStrictEqual(Enumerable.asEnumerable<number>([]).concat([1]).toArray(), [1]);
    });
    test("handles concat with empty array", function () {
      assert.deepStrictEqual(Enumerable.asEnumerable([2]).concat([]).toArray(), [2]);
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([1, 2]).concat([3]);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2]).concat([3, 4]).count(), 4);
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync(["a", "b"])
          .concat(EnumerableAsync.asEnumerableAsync(["c", "d"]))
          .count(),
        4,
      );
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2]).concat([3, 4]).concat([5, 6]).toArray(),
        [1, 2, 3, 4, 5, 6],
      );
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync(
          new Map([
            ["a", 1],
            ["b", 2],
          ]),
        )
          .concat(new Map([["c", 3]]))
          .count(),
        3,
      );
    });
    test("handles two empty arrays", async function () {
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync([]).concat([]).toArray(), []);
    });
    test("handles calling array being empty", async function () {
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync<number>([]).concat([1]).toArray(), [1]);
    });
    test("handles concat with empty array", async function () {
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync([2]).concat([]).toArray(), [2]);
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2]).concat([3]);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
});
