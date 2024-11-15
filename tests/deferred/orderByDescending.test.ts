import { Enumerable, EnumerableAsync, Interfaces } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("orderByDescending", function () {
  const unsorted = [9, 8, 7, 6, 5, 5, 4, 3, 9, 1, 0];
  const sorted = [9, 9, 8, 7, 6, 5, 5, 4, 3, 1, 0];
  class Comparer implements Interfaces.ICompareTo<number> {
    CompareTo(x: number, y: number): number {
      return x - y;
    }
  }
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(Enumerable.asEnumerable(["b", "c", "a"]).orderByDescending().toArray(), ["c", "b", "a"]);
      assert.deepStrictEqual(Enumerable.asEnumerable(unsorted).orderByDescending().toArray(), sorted);
    });
    test("comparer", function () {
      assert.deepStrictEqual(
        Enumerable.asEnumerable(unsorted)
          .orderByDescending((x) => x, new Comparer())
          .toArray(),
        sorted,
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable(["b", "c", "a"]).orderByDescending();
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync(["b", "c", "a"]).orderByDescending().toArray(), [
        "c",
        "b",
        "a",
      ]);
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync(unsorted).orderByDescending().toArray(), sorted);
    });
    test("comparer", async function () {
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync(unsorted)
          .orderByDescending((x) => x, new Comparer())
          .toArray(),
        sorted,
      );
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync(["b", "c", "a"]).orderByDescending();
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
  describe("EnumerableAsync async", function () {
    test("basic", async function () {
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync(["b", "c", "a"]).orderByDescending().toArray(), [
        "c",
        "b",
        "a",
      ]);
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync(unsorted).orderByDescending().toArray(), sorted);
    });
    test("comparer", async function () {
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync(unsorted)
          .orderByDescending(async (x) => Promise.resolve(x), new Comparer())
          .toArray(),
        sorted,
      );
    });
  });
});
