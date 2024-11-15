import { Enumerable, EnumerableAsync, Exceptions, Interfaces } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("min", function () {
  class Comparer<T> extends Interfaces.ICompareTo<T> {
    CompareTo(x: T, y: T): -1 | 0 | 1 {
      return x > y ? -1 : x < y ? 1 : 0;
    }
  }
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.asEnumerable([1, 2, 3]).min(), 1);
      assert.strictEqual(
        Enumerable.asEnumerable([1, 2, 3])
          .select((x) => x * x)
          .min(),
        1,
      );
      assert.strictEqual(
        Enumerable.asEnumerable([Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]).min(),
        Number.NEGATIVE_INFINITY,
      );
    });
    test("exceptions", function () {
      assert.throws(() => Enumerable.asEnumerable([]).min(), Exceptions.ThrowNoElementsException);
    });
    test("comparer", function () {
      assert.strictEqual(Enumerable.asEnumerable([1, 2, 3]).min(new Comparer()), 3);
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([1, 2, 3]);
      assert.deepStrictEqual(e.min(), e.min());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).min(), 1);
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2, 3])
          .select((x) => x * x)
          .min(),
        1,
      );
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]).min(),
        Number.NEGATIVE_INFINITY,
      );
    });
    test("exceptions", async function () {
      assert.rejects(EnumerableAsync.asEnumerableAsync([]).min(), Exceptions.ThrowNoElementsException);
    });
    test("comparer", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).min(new Comparer()), 3);
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
      assert.deepStrictEqual(await e.min(), await e.min());
    });
  });
  describe("EnumerableAsync async comparer", function () {
    test("comparer", async function () {
      class ComparerAsync<T> extends Interfaces.IAsyncCompareTo<T> {
        CompareTo(x: T, y: T): Promise<-1 | 0 | 1> {
          return Promise.resolve(x > y ? -1 : x < y ? 1 : 0);
        }
      }
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).min(new ComparerAsync()), 3);
    });
  });
});
