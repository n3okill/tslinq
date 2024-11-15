import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("reverse", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(Enumerable.asEnumerable([1, 2, 3]).reverse().toArray(), [3, 2, 1]);
      assert.deepStrictEqual(Enumerable.asEnumerable([]).reverse().toArray(), []);
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([1, 2, 3]).reverse();
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).reverse().toArray(), [3, 2, 1]);
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync([]).reverse().toArray(), []);
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]).reverse();
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
});
