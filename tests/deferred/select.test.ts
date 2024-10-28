import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("select", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(
        Enumerable.asEnumerable([1, 2, 3])
          .select((x) => x * 2)
          .toArray(),
        [2, 4, 6],
      );
      assert.deepStrictEqual(
        Enumerable.asEnumerable(["hello", "2", "world"])
          .select((x) => (x === "hello" || x === "world" ? x : ""))
          .toArray(),
        ["hello", "", "world"],
      );
      assert.deepStrictEqual(
        Enumerable.asEnumerable(["1", "2", "3"])
          .select((num) => Number.parseInt(num, undefined))
          .toArray(),
        [1, 2, 3],
      );
      assert.deepStrictEqual(
        Enumerable.asEnumerable([2, 1, 0])
          .select((x, index) => index as number)
          .toArray(),
        [0, 1, 2],
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([1, 2, 3]).select((x) => x * 2);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2, 3])
          .select((x) => x * 2)
          .toArray(),
        [2, 4, 6],
      );
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync(["hello", "2", "world"])
          .select((x) => (x === "hello" || x === "world" ? x : ""))
          .toArray(),
        ["hello", "", "world"],
      );
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync(["1", "2", "3"])
          .select((num) => Number.parseInt(num, undefined))
          .toArray(),
        [1, 2, 3],
      );
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync([2, 1, 0])
          .select((x, index) => index as number)
          .toArray(),
        [0, 1, 2],
      );
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]).select((x) => x * 2);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
  describe("EnumerableAsync async", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2, 3])
          .select(async (x) => Promise.resolve(x * 2))
          .toArray(),
        [2, 4, 6],
      );
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync(["hello", "2", "world"])
          .select(async (x) => Promise.resolve(x === "hello" || x === "world" ? x : ""))
          .toArray(),
        ["hello", "", "world"],
      );
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync(["1", "2", "3"])
          .select(async (num) => Promise.resolve(Number.parseInt(num, undefined)))
          .toArray(),
        [1, 2, 3],
      );
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync([2, 1, 0])
          .select(async (x, index) => Promise.resolve(index as number))
          .toArray(),
        [0, 1, 2],
      );
    });
  });
});
