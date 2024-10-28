import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("chunk", function () {
  const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(Enumerable.asEnumerable(testArray).chunk(3).toArray(), [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);
    });
    test("Append before iterating", function () {
      const a = Enumerable.asEnumerable(testArray).append(10);
      assert.deepStrictEqual(a.chunk(3).toArray(), [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]);
    });
    test("Except before iterating", function () {
      const a = Enumerable.asEnumerable(testArray).except([3, 6, 9]);
      assert.deepStrictEqual(a.chunk(3).toArray(), [
        [1, 2, 4],
        [5, 7, 8],
      ]);
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable(testArray);
      assert.deepStrictEqual(e.chunk(3).toArray(), e.chunk(3).toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync(testArray).chunk(3).toArray(), [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);
    });
    test("Append before iterating", async function () {
      const a = EnumerableAsync.asEnumerableAsync(testArray).append(10);
      assert.deepStrictEqual(await a.chunk(3).toArray(), [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]);
    });
    test("Except before iterating", async function () {
      const a = EnumerableAsync.asEnumerableAsync(testArray).except([3, 6, 9]);
      assert.deepStrictEqual(await a.chunk(3).toArray(), [
        [1, 2, 4],
        [5, 7, 8],
      ]);
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync(testArray);
      assert.deepStrictEqual(await e.chunk(3).toArray(), await e.chunk(3).toArray());
    });
  });
});
