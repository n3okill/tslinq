import {
  AsyncEnumerable,
  Comparer,
  ComparerAsync,
  Enumerable,
  NoElementsException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("maxBy", function () {
  class MaxByComparer<T> extends Comparer<T> {
    compare(x: T, y: T): -1 | 0 | 1 {
      return x > y ? -1 : x < y ? 1 : 0;
    }
  }
  class Person {
    public name: string;
    public age: number;

    constructor(name: string, age: number) {
      this.name = name;
      this.age = age;
    }
  }
  const persons = [
    new Person("Tom", 43),
    new Person("Dick", 55),
    new Person("Harry", 20),
  ];
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).maxBy((x) => x),
        3,
      );
      assert.strictEqual(
        Enumerable.create([1, 2, 3])
          .select((x) => x * x)
          .maxBy((x) => x),
        9,
      );
      assert.strictEqual(
        Enumerable.create([
          Number.NEGATIVE_INFINITY,
          Number.POSITIVE_INFINITY,
        ]).maxBy((x) => x),
        Number.POSITIVE_INFINITY,
      );
      assert.strictEqual(
        Enumerable.create(persons).maxBy((x) => x.age).name,
        "Dick",
      );
    });
    test("exceptions", function () {
      assert.throws(
        () => Enumerable.create([]).maxBy((x) => x),
        NoElementsException,
      );
    });
    test("comparer", function () {
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).maxBy((x) => x, new MaxByComparer()),
        1,
      );
      assert.strictEqual(
        Enumerable.create(persons).maxBy((x) => x.age, new MaxByComparer())
          .name,
        "Harry",
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2, 3]);
      assert.deepStrictEqual(
        e.maxBy((x) => x),
        e.maxBy((x) => x),
      );
    });
    test("with NaN values", () => {
      const numbers = Enumerable.create([1, NaN, 3]);
      assert.strictEqual(
        numbers.maxBy((x) => x),
        3,
      );
    });

    test("with complex objects", () => {
      const items = [
        { id: 1, nested: { value: 10 } },
        { id: 2, nested: { value: 5 } },
        { id: 3, nested: { value: 15 } },
      ];
      assert.deepStrictEqual(
        Enumerable.create(items).maxBy((x) => x.nested.value),
        { id: 3, nested: { value: 15 } },
      );
    });

    test("with custom deep comparer", () => {
      class DeepComparer extends Comparer<number> {
        compare(x: number, y: number): -1 | 0 | 1 {
          const xDepth = Math.floor(Math.log10(Math.abs(x || 1)));
          const yDepth = Math.floor(Math.log10(Math.abs(y || 1)));
          return xDepth > yDepth ? 1 : xDepth < yDepth ? -1 : 0;
        }
      }
      assert.strictEqual(
        Enumerable.create([1, 100, 1000]).maxBy((x) => x, new DeepComparer()),
        1000,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).maxBy((x) => x),
        3,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3])
          .select((x) => x * x)
          .maxBy((x) => x),
        9,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([
          Number.NEGATIVE_INFINITY,
          Number.POSITIVE_INFINITY,
        ]).maxBy((x) => x),
        Number.POSITIVE_INFINITY,
      );
      assert.strictEqual(
        (await AsyncEnumerable.create(persons).maxBy((x) => x.age)).name,
        "Dick",
      );
    });
    test("exceptions", async function () {
      await assert.rejects(
        AsyncEnumerable.create([]).maxBy((x) => x),
        NoElementsException,
      );
    });
    test("comparer", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).maxBy(
          (x) => x,
          new MaxByComparer(),
        ),
        1,
      );
      assert.strictEqual(
        (
          await AsyncEnumerable.create(persons).maxBy(
            (x) => x.age,
            new MaxByComparer(),
          )
        ).name,
        "Harry",
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 3]);
      assert.deepStrictEqual(await e.maxBy((x) => x), await e.maxBy((x) => x));
    });
    test("async with timing verification", async () => {
      const delayed = AsyncEnumerable.create(
        (async function* () {
          yield { value: 1 };
          await new Promise((resolve) => setTimeout(resolve, 10));
          yield { value: 2 };
        })(),
      );
      const start = performance.now();
      await delayed.maxBy((x) => x.value);
      assert.ok(performance.now() - start >= 10);
    });

    test("async with error in selector", async () => {
      const enumerable = AsyncEnumerable.create([1, 2, 3]);
      await assert.rejects(
        async () =>
          await enumerable.maxBy(() => {
            throw new Error("Selector error");
          }),
        /Selector error/,
      );
    });

    test("async with mixed promises", async () => {
      const mixed = AsyncEnumerable.create([
        await Promise.resolve({ value: 1 }),
        { value: 2 },
        await Promise.resolve({ value: 3 }),
      ]);
      const result = await mixed.maxBy((x) => x.value);
      assert.strictEqual(result.value, 3);
    });
  });
  describe("AsyncEnumerable async comparer", function () {
    test("comparer", async function () {
      class MaxByComparerAsync<T> extends ComparerAsync<T> {
        compare(x: T, y: T): Promise<-1 | 0 | 1> {
          return Promise.resolve(x > y ? -1 : x < y ? 1 : 0);
        }
      }
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).maxBy(
          (x) => x,
          new MaxByComparerAsync(),
        ),
        1,
      );
    });
  });
});
