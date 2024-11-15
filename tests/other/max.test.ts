import { Enumerable, EnumerableAsync, Exceptions, Interfaces } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("max", function () {
  class Comparer<T> extends Interfaces.ICompareTo<T> {
    CompareTo(x: T, y: T): -1 | 0 | 1 {
      return x > y ? -1 : x < y ? 1 : 0;
    }
  }
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.asEnumerable([1, 2, 3]).max(), 3);
      assert.strictEqual(
        Enumerable.asEnumerable([1, 2, 3])
          .select((x) => x * x)
          .max(),
        9,
      );
      assert.strictEqual(
        Enumerable.asEnumerable([Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]).max(),
        Number.POSITIVE_INFINITY,
      );
    });
    test("exceptions", function () {
      assert.throws(() => Enumerable.asEnumerable([]).max(), Exceptions.ThrowNoElementsException);
    });
    test("comparer", function () {
      assert.strictEqual(Enumerable.asEnumerable([1, 2, 3]).max(new Comparer()), 1);
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([1, 2, 3]);
      assert.deepStrictEqual(e.max(), e.max());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).max(), 3);
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2, 3])
          .select((x) => x * x)
          .max(),
        9,
      );
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]).max(),
        Number.POSITIVE_INFINITY,
      );
    });
    test("exceptions", async function () {
      assert.rejects(EnumerableAsync.asEnumerableAsync([]).max(), Exceptions.ThrowNoElementsException);
    });
    test("comparer", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).max(new Comparer()), 1);
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
      assert.deepStrictEqual(await e.max(), await e.max());
    });
  });
  describe("EnumerableAsync async comparer", function () {
    test("comparer", async function () {
      class ComparerAsync<T> extends Interfaces.IAsyncCompareTo<T> {
        CompareTo(x: T, y: T): Promise<-1 | 0 | 1> {
          return Promise.resolve(x > y ? -1 : x < y ? 1 : 0);
        }
      }
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).max(new ComparerAsync()), 1);
    });
  });
});
