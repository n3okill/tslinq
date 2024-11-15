import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("prepend", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      const c = Enumerable.asEnumerable([1, 2]);
      assert.strictEqual(c.count(), 2);
      assert.strictEqual(c.prepend(3).count(), 3);
      const e = c.prepend(4);
      assert.strictEqual(e.count(), 3);
      assert.deepStrictEqual(e.toArray(), [4, 1, 2]);
    });
    test("repeated calls", function () {
      const c = Enumerable.asEnumerable([1, 2]).prepend(3);
      assert.deepStrictEqual(c.toArray(), c.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      const c = EnumerableAsync.asEnumerableAsync([1, 2]);
      assert.strictEqual(await c.count(), 2);
      assert.strictEqual(await c.prepend(3).count(), 3);
      const e = c.prepend(4);
      assert.strictEqual(await e.count(), 3);
      assert.deepStrictEqual(await e.toArray(), [4, 1, 2]);
    });
    test("repeated calls", async function () {
      const c = EnumerableAsync.asEnumerableAsync([1, 2]).prepend(3);
      assert.deepStrictEqual(await c.toArray(), await c.toArray());
    });
  });
});
