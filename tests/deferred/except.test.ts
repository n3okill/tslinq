import { Enumerable, EnumerableAsync, Interfaces } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("except", function () {
  class Comparer extends Interfaces.IEqualityComparer<Product> {
    Equals(x?: Product, y?: Product): boolean {
      return x?.Code === y?.Code && x?.Name === y?.Name;
    }
  }

  class Product {
    Name: string;
    Code: number;
    constructor(name: string, code: number) {
      this.Name = name;
      this.Code = code;
    }
  }
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(Enumerable.asEnumerable([1, 2, 3, 4, 5]).except([3, 4]).toArray(), [1, 2, 5]);
      assert.deepStrictEqual(Enumerable.asEnumerable([1, 2, 3, 4, 5]).except([2]).except([4]).toArray(), [1, 3, 5]);
    });
    test("Comparer", function () {
      const p1: Product = new Product("apple", 9);
      const p2: Product = new Product("orange", 4);
      const p3: Product = new Product("apple", 9);
      const p4: Product = new Product("lemon", 12);
      const products = [p1, p2, p3, p4];
      assert.deepStrictEqual(Enumerable.asEnumerable(products).except([p1], new Comparer()).toArray(), [p2, p4]);
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([1, 2]).except([2]);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2, 3, 4, 5]).except([3, 4]).toArray(),
        [1, 2, 5],
      );
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2, 3, 4, 5]).except([2]).except([4]).toArray(),
        [1, 3, 5],
      );
    });
    test("Comparer", async function () {
      const p1: Product = new Product("apple", 9);
      const p2: Product = new Product("orange", 4);
      const p3: Product = new Product("apple", 9);
      const p4: Product = new Product("lemon", 12);
      const products = [p1, p2, p3, p4];
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync(products).except([p1], new Comparer()).toArray(), [
        p2,
        p4,
      ]);
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2]).except([2]);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
  describe("EnumerableAsync comparer async", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2, 3, 4, 5]).except([3, 4]).toArray(),
        [1, 2, 5],
      );
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2, 3, 4, 5]).except([2]).except([4]).toArray(),
        [1, 3, 5],
      );
    });
    test("Comparer", async function () {
      class ComparerAsync extends Interfaces.IAsyncEqualityComparer<Product> {
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
        await EnumerableAsync.asEnumerableAsync(products).except([p1], new ComparerAsync()).toArray(),
        [p2, p4],
      );
    });
  });
});
