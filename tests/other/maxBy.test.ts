import { Enumerable, EnumerableAsync, Exceptions, Interfaces } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("maxBy", function () {
  class Comparer<T> extends Interfaces.ICompareTo<T> {
    CompareTo(x: T, y: T): -1 | 0 | 1 {
      return x > y ? -1 : x < y ? 1 : 0;
    }
  }
  class Person {
    constructor(
      public name: string,
      public age: number,
    ) {}
  }
  const persons = [new Person("Tom", 43), new Person("Dick", 55), new Person("Harry", 20)];
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.asEnumerable([1, 2, 3]).maxBy(), 3);
      assert.strictEqual(
        Enumerable.asEnumerable([1, 2, 3])
          .select((x) => x * x)
          .maxBy(),
        9,
      );
      assert.strictEqual(
        Enumerable.asEnumerable([Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]).maxBy(),
        Number.POSITIVE_INFINITY,
      );
      assert.strictEqual(Enumerable.asEnumerable(persons).maxBy((x) => x.age).name, "Dick");
    });
    test("exceptions", function () {
      assert.throws(() => Enumerable.asEnumerable([]).maxBy(), Exceptions.ThrowNoElementsException);
    });
    test("comparer", function () {
      assert.strictEqual(
        Enumerable.asEnumerable([1, 2, 3]).maxBy((x) => x, new Comparer()),
        1,
      );
      assert.strictEqual(Enumerable.asEnumerable(persons).maxBy((x) => x.age, new Comparer()).name, "Harry");
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([1, 2, 3]);
      assert.deepStrictEqual(e.maxBy(), e.maxBy());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).maxBy(), 3);
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2, 3])
          .select((x) => x * x)
          .maxBy(),
        9,
      );
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]).maxBy(),
        Number.POSITIVE_INFINITY,
      );
      assert.strictEqual((await EnumerableAsync.asEnumerableAsync(persons).maxBy((x) => x.age)).name, "Dick");
    });
    test("exceptions", async function () {
      assert.rejects(EnumerableAsync.asEnumerableAsync([]).maxBy(), Exceptions.ThrowNoElementsException);
    });
    test("comparer", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).maxBy((x) => x, new Comparer()), 1);
      assert.strictEqual(
        (await EnumerableAsync.asEnumerableAsync(persons).maxBy((x) => x.age, new Comparer())).name,
        "Harry",
      );
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
      assert.deepStrictEqual(await e.maxBy(), await e.maxBy());
    });
  });
  describe("EnumerableAsync async comparer", function () {
    test("comparer", async function () {
      class ComparerAsync<T> extends Interfaces.IAsyncCompareTo<T> {
        CompareTo(x: T, y: T): Promise<-1 | 0 | 1> {
          return Promise.resolve(x > y ? -1 : x < y ? 1 : 0);
        }
      }
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).maxBy((x) => x, new ComparerAsync()), 1);
    });
  });
});
