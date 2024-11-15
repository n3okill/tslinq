import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("unionBy", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(Enumerable.asEnumerable([1, 2, 3]).unionBy([3, 4, 5]).toArray(), [1, 2, 3, 4, 5]);
      assert.deepStrictEqual(
        Enumerable.asEnumerable([1, 3, 5]).unionBy([2, 4, 6]).unionBy([1, 2, 3, 7]).unionBy([4, 5, 6, 8]).toArray(),
        [1, 3, 5, 2, 4, 6, 7, 8],
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([1, 2, 3]).unionBy([3, 4, 5]);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2, 3]).unionBy([3, 4, 5]).toArray(),
        [1, 2, 3, 4, 5],
      );
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 3, 5])
          .unionBy([2, 4, 6])
          .unionBy([1, 2, 3, 7])
          .unionBy([4, 5, 6, 8])
          .toArray(),
        [1, 3, 5, 2, 4, 6, 7, 8],
      );
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]).unionBy([3, 4, 5]);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
});
