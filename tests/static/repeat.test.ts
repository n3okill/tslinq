import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("repeat", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(Enumerable.repeat("a", 3).toArray(), ["a", "a", "a"]);
      assert.deepStrictEqual(Enumerable.repeat(1, 5).toArray(), [1, 1, 1, 1, 1]);
    });
    test("repeated calls", function () {
      const e = Enumerable.repeat(1, 5);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.deepStrictEqual(await EnumerableAsync.repeat("a", 3).toArray(), ["a", "a", "a"]);
      assert.deepStrictEqual(await EnumerableAsync.repeat(1, 5).toArray(), [1, 1, 1, 1, 1]);
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.range(1, 5);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
});
