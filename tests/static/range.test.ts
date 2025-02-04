import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { AsyncEnumerable, Enumerable } from "../../src/index.ts";

describe("range", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepEqual(
        Enumerable.range(1, 5)
          .select((x) => (x as number) * 2)
          .toArray(),
        [2, 4, 6, 8, 10],
      );
      assert.deepEqual(Enumerable.range("a", 3).toArray(), ["a", "b", "c"]);
    });
    test("repeated calls", function () {
      const e = Enumerable.range(1, 5);
      assert.deepEqual(e.toArray(), e.toArray());
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepEqual(
        await AsyncEnumerable.range(1, 5)
          .select((x) => (x as number) * 2)
          .toArray(),
        [2, 4, 6, 8, 10],
      );
      assert.deepEqual(await AsyncEnumerable.range("a", 3).toArray(), [
        "a",
        "b",
        "c",
      ]);
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.range(1, 5);
      assert.deepEqual(await e.toArray(), await e.toArray());
    });
  });
});
