import { Enumerable, EnumerableAsync, Interfaces } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
describe("intersect", function () {
  class Comparer<T> implements Interfaces.IEqualityComparer<T> {
    Equals(x: T, y: T): boolean {
      return x == y;
    }
  }
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(
        Enumerable.asEnumerable([1, 2, 2, 3, 4, 5, 5, 6]).intersect([1, 1, 3, 3, 5]).toArray(),
        [1, 3, 5],
      );
      assert.deepStrictEqual(
        Enumerable.asEnumerable([1, 2, 3])
          .intersect(["1", "2"] as unknown as Array<number>, new Comparer())
          .toArray(),
        [1, 2],
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([1, 2, 2, 3, 4, 5, 5, 6]).intersect([1, 1, 3, 3, 5]);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2, 2, 3, 4, 5, 5, 6]).intersect([1, 1, 3, 3, 5]).toArray(),
        [1, 3, 5],
      );
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2, 3])
          .intersect(["1", "2"] as unknown as Array<number>, new Comparer())
          .toArray(),
        [1, 2],
      );
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2, 2, 3, 4, 5, 5, 6]).intersect([1, 1, 3, 3, 5]);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
});
