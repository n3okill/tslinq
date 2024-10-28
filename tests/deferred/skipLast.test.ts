import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("skipLast", function () {
  const arr = [1, 2, 3, 4, 5];
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(Enumerable.asEnumerable(arr).skipLast(3).toArray(), [1, 2]);
      assert.deepStrictEqual(Enumerable.asEnumerable(arr).skipLast(0).toArray(), arr);
      assert.deepStrictEqual(Enumerable.asEnumerable(arr).skipLast(-5).toArray(), arr);
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable(arr).skipLast(3);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync(arr).skipLast(3).toArray(), [1, 2]);
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync(arr).skipLast(0).toArray(), arr);
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync(arr).skipLast(-5).toArray(), arr);
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync(arr).skipLast(3);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
});
