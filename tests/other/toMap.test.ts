import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("toMap", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      const map = Enumerable.asEnumerable([1, 2, 3]).toMap((x) => `Key_${x}`);
      assert.deepStrictEqual(Array.from(map), [
        ["Key_1", [1]],
        ["Key_2", [2]],
        ["Key_3", [3]],
      ]);
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([1, 2, 3]);
      assert.deepStrictEqual(Array.from(e.toMap((x) => x)), Array.from(e.toMap((x) => x)));
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      const map = await EnumerableAsync.asEnumerableAsync([1, 2, 3]).toMap((x) => `Key_${x}`);
      assert.deepStrictEqual(Array.from(map), [
        ["Key_1", [1]],
        ["Key_2", [2]],
        ["Key_3", [3]],
      ]);
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
      assert.deepStrictEqual(Array.from(await e.toMap((x) => x)), Array.from(await e.toMap((x) => x)));
    });
  });
  describe("EnumerableAsync async keySelector", function () {
    test("basic", async function () {
      const map = await EnumerableAsync.asEnumerableAsync([1, 2, 3]).toMap(async (x) => Promise.resolve(`Key_${x}`));
      assert.deepStrictEqual(Array.from(map), [
        ["Key_1", [1]],
        ["Key_2", [2]],
        ["Key_3", [3]],
      ]);
    });
  });
});
