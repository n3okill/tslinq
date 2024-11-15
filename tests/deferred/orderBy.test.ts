import { Enumerable, EnumerableAsync, Interfaces } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("orderBy", function () {
  const unsorted = [9, 8, 7, 6, 5, 5, 4, 3, 9, 1, 0];
  const sorted = [0, 1, 3, 4, 5, 5, 6, 7, 8, 9, 9];
  class Comparer implements Interfaces.ICompareTo<number> {
    CompareTo(x: number, y: number): number {
      return x - y;
    }
  }
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(Enumerable.asEnumerable(["b", "c", "a"]).orderBy().toArray(), ["a", "b", "c"]);
      assert.deepStrictEqual(Enumerable.asEnumerable(unsorted).orderBy().toArray(), sorted);
    });
    test("comparer", function () {
      assert.deepStrictEqual(
        Enumerable.asEnumerable(unsorted)
          .orderBy((x) => x, new Comparer())
          .toArray(),
        sorted,
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable(["b", "c", "a"]).orderBy();
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync(["b", "c", "a"]).orderBy().toArray(), [
        "a",
        "b",
        "c",
      ]);
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync(unsorted).orderBy().toArray(), sorted);
    });
    test("comparer", async function () {
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync(unsorted)
          .orderBy((x) => x, new Comparer())
          .toArray(),
        sorted,
      );
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync(["b", "c", "a"]).orderBy();
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
  describe("EnumerableAsync async", function () {
    test("basic", async function () {
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync(["b", "c", "a"]).orderBy().toArray(), [
        "a",
        "b",
        "c",
      ]);
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync(unsorted).orderBy().toArray(), sorted);
    });
    test("comparer", async function () {
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync(unsorted)
          .orderBy(async (x) => Promise.resolve(x), new Comparer())
          .toArray(),
        sorted,
      );
    });
  });
});
