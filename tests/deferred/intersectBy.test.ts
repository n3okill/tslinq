import { Enumerable, EnumerableAsync, Interfaces } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("intersectBy", function () {
  class Comparer<T> implements Interfaces.IEqualityComparer<T> {
    Equals(x: T, y: T): boolean {
      return x == y;
    }
  }
  class Product {
    constructor(
      public Name: string,
      public Code: number,
    ) {}
  }
  const p1: Product = new Product("apple", 9);
  const p2: Product = new Product("orange", 4);
  const p3: Product = new Product("apple", 9);
  const p4: Product = new Product("lemon", 12);
  const p5: Product = new Product("apple", 10);
  const products = [p1, p2, p3, p4, p5];
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(
        Enumerable.asEnumerable([1, 2, 2, 3, 4, 5, 5, 6]).intersectBy([1, 1, 3, 3, 5]).toArray(),
        [1, 3, 5],
      );
      assert.deepStrictEqual(
        Enumerable.asEnumerable([1, 2, 3])
          .intersectBy(["1", "2"] as unknown as Array<number>, (x) => x, new Comparer())
          .toArray(),
        [1, 2],
      );
      assert.deepStrictEqual(
        Enumerable.asEnumerable(products)
          .intersectBy([4, 10], (x) => x.Code)
          .toArray(),
        [p2, p5],
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([1, 2, 2, 3, 4, 5, 5, 6]).intersectBy([1, 1, 3, 3, 5]);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2, 2, 3, 4, 5, 5, 6]).intersectBy([1, 1, 3, 3, 5]).toArray(),
        [1, 3, 5],
      );
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2, 3])
          .intersectBy(["1", "2"] as unknown as Array<number>, (x) => x, new Comparer())
          .toArray(),
        [1, 2],
      );
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync(products)
          .intersectBy([4, 10], (x) => x.Code)
          .toArray(),
        [p2, p5],
      );
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2, 2, 3, 4, 5, 5, 6]).intersectBy([1, 1, 3, 3, 5]);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
});
