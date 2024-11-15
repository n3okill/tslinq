import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("toArray", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      const e = Enumerable.asEnumerable([1, 2, 3]);
      const result = e.toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
      assert.strictEqual(result.length, e.count());
      assert.deepStrictEqual(e.toArray(), result);
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([1, 2, 3]);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
      const result = await e.toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
      assert.strictEqual(result.length, await e.count());
      assert.deepStrictEqual(await e.toArray(), result);
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
});
