import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { AsyncEnumerable, Enumerable } from "../../src/index.ts";

describe("repeat", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(Enumerable.repeat("a", 3).toArray(), [
        "a",
        "a",
        "a",
      ]);
      assert.deepStrictEqual(
        Enumerable.repeat(1, 5).toArray(),
        [1, 1, 1, 1, 1],
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.repeat(1, 5);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepStrictEqual(await AsyncEnumerable.repeat("a", 3).toArray(), [
        "a",
        "a",
        "a",
      ]);
      assert.deepStrictEqual(
        await AsyncEnumerable.repeat(1, 5).toArray(),
        [1, 1, 1, 1, 1],
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.range(1, 5);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
});
