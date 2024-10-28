import { Enumerable, EnumerableAsync, Interfaces } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("distinct", function () {
  class Product {
    Name: string;
    Code: number;
    constructor(name: string, code: number) {
      this.Name = name;
      this.Code = code;
    }
  }
  class WeakComparer<T> implements Interfaces.IEqualityComparer<T> {
    Equals(x: T, y: T) {
      return x == y;
    }
  }
  class Comparer implements Interfaces.IEqualityComparer<Product> {
    Equals(x?: Product, y?: Product): boolean {
      return x?.Code === y?.Code && x?.Name === y?.Name;
    }
  }
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(Enumerable.asEnumerable([1, 2, 1, 2]).distinct().toArray(), [1, 2]);
      assert.deepStrictEqual(
        Enumerable.asEnumerable([1, 2]).concat([3, 4]).concat([1, 3]).distinct().toArray(),
        [1, 2, 3, 4],
      );
      assert.deepStrictEqual(Enumerable.asEnumerable(["f", "o", "o"]).distinct().toArray(), ["f", "o"]);
      assert.deepStrictEqual(Enumerable.asEnumerable([]).distinct().toArray(), []);
    });
    test("Comparer", function () {
      const p1: Product = new Product("apple", 9);
      const p2: Product = new Product("orange", 4);
      const p3: Product = new Product("apple", 9);
      const p4: Product = new Product("lemon", 12);
      const products = [p1, p2, p3, p4];
      assert.deepStrictEqual(Enumerable.asEnumerable(products).distinct(new Comparer()).toArray(), [p1, p2, p4]);
      assert.deepStrictEqual(Enumerable.asEnumerable(["1", 1, 2, 2, 3, "3"]).distinct(new WeakComparer()).toArray(), [
        "1",
        2,
        3,
      ]);
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 1, 2]).distinct().toArray(), [1, 2]);
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2]).concat([3, 4]).concat([1, 3]).distinct().toArray(),
        [1, 2, 3, 4],
      );
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync(["f", "o", "o"]).distinct().toArray(), ["f", "o"]);
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync([]).distinct().toArray(), []);
    });
    test("Comparer", async function () {
      const p1: Product = new Product("apple", 9);
      const p2: Product = new Product("orange", 4);
      const p3: Product = new Product("apple", 9);
      const p4: Product = new Product("lemon", 12);
      const products = [p1, p2, p3, p4];
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync(products).distinct(new Comparer()).toArray(), [
        p1,
        p2,
        p4,
      ]);
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync(["1", 1, 2, 2, 3, "3"]).distinct(new WeakComparer()).toArray(),
        ["1", 2, 3],
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([1, 2, 2]).distinct();
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("EnumerableAsync async comparer", function () {
    test("basic", async function () {
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 1, 2]).distinct().toArray(), [1, 2]);
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2]).concat([3, 4]).concat([1, 3]).distinct().toArray(),
        [1, 2, 3, 4],
      );
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync(["f", "o", "o"]).distinct().toArray(), ["f", "o"]);
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync([]).distinct().toArray(), []);
    });
    test("Comparer", async function () {
      class WeakComparerAsync<T> implements Interfaces.IAsyncEqualityComparer<T> {
        async Equals(x: T, y: T) {
          return Promise.resolve(x == y);
        }
      }
      class ComparerAsync implements Interfaces.IAsyncEqualityComparer<Product> {
        async Equals(x?: Product, y?: Product): Promise<boolean> {
          return Promise.resolve(x?.Code === y?.Code && x?.Name === y?.Name);
        }
      }
      const p1: Product = new Product("apple", 9);
      const p2: Product = new Product("orange", 4);
      const p3: Product = new Product("apple", 9);
      const p4: Product = new Product("lemon", 12);
      const products = [p1, p2, p3, p4];
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync(products).distinct(new ComparerAsync()).toArray(),
        [p1, p2, p4],
      );
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync(["1", 1, 2, 2, 3, "3"]).distinct(new WeakComparerAsync()).toArray(),
        ["1", 2, 3],
      );
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2, 2]).distinct();
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
});
