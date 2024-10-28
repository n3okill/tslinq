import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("defaultIfEmpty", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(Enumerable.asEnumerable<number>([]).defaultIfEmpty(0).toArray(), [0]);
      assert.deepStrictEqual(Enumerable.asEnumerable([1, 2]).defaultIfEmpty(5).toArray(), [1, 2]);
      assert.deepStrictEqual(Enumerable.asEnumerable([]).defaultIfEmpty().toArray(), [undefined]);
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable<number>([]).defaultIfEmpty(0);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync<number>([]).defaultIfEmpty(0).toArray(), [0]);
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync([1, 2]).defaultIfEmpty(5).toArray(), [1, 2]);
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync([]).defaultIfEmpty().toArray(), [undefined]);
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync<number>([]).defaultIfEmpty(0);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
});
