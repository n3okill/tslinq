import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("append", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      const c = Enumerable.asEnumerable([1, 2]);
      assert.strictEqual(c.count(), 2);
      assert.strictEqual(c.append(3).count(), 3);
      const e = c.append(4);
      assert.strictEqual(e.count(), 3);
      assert.deepStrictEqual(e.toArray(), [1, 2, 4]);
      assert.deepStrictEqual(Enumerable.asEnumerable("Hell").append("o").toArray(), ["H", "e", "l", "l", "o"]);
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([1, 2]).append(3);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      const c = EnumerableAsync.asEnumerableAsync([1, 2]);
      assert.strictEqual(await c.count(), 2);
      assert.strictEqual(await c.append(3).count(), 3);
      const e = c.append(4);
      assert.strictEqual(await e.count(), 3);
      assert.deepStrictEqual(await e.toArray(), [1, 2, 4]);
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync("Hell").append("o").toArray(), [
        "H",
        "e",
        "l",
        "l",
        "o",
      ]);
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2]).append(3);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
});
