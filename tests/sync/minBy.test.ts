import {
  AsyncEnumerable,
  Comparer,
  ComparerAsync,
  Enumerable,
  NoElementsException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("minBy", function () {
  class MinByComparer<T> extends Comparer<T> {
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
        Enumerable.create([1, 2, 3]).minBy((x) => x),
        1,
      );
      assert.strictEqual(
        Enumerable.create([1, 2, 3])
          .select((x) => x * x)
          .minBy((x) => x),
        1,
      );
      assert.strictEqual(
        Enumerable.create([
          Number.NEGATIVE_INFINITY,
          Number.POSITIVE_INFINITY,
        ]).minBy((x) => x),
        Number.NEGATIVE_INFINITY,
      );
      assert.strictEqual(
        Enumerable.create(persons).minBy((x) => x.age).name,
        "Harry",
      );
    });
    test("exceptions", function () {
      assert.throws(
        () => Enumerable.create([]).minBy((x) => x),
        NoElementsException,
      );
    });
    test("comparer", function () {
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).minBy((x) => x, new MinByComparer()),
        3,
      );
      assert.strictEqual(
        Enumerable.create(persons).minBy((x) => x.age, new MinByComparer())
          .name,
        "Dick",
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2, 3]);
      assert.deepStrictEqual(
        e.minBy((x) => x),
        e.minBy((x) => x),
      );
    });

    test("with NaN and Infinity values", () => {
      const items = [
        { value: NaN },
        { value: Infinity },
        { value: -Infinity },
        { value: 1 },
      ];
      assert.deepStrictEqual(
        Enumerable.create(items).minBy((x) => x.value),
        { value: -Infinity },
      );
    });

    test("nested object comparison", () => {
      class ComplexPerson {
        public name: string;
        public details: { age: number; score: number };

        constructor(name: string, details: { age: number; score: number }) {
          this.name = name;
          this.details = details;
        }
      }
      const people = [
        new ComplexPerson("Alice", { age: 30, score: 100 }),
        new ComplexPerson("Bob", { age: 25, score: 90 }),
        new ComplexPerson("Charlie", { age: 35, score: 95 }),
      ];
      assert.strictEqual(
        Enumerable.create(people).minBy((x) => x.details.age).name,
        "Bob",
      );
    });
    test("custom precision comparer", () => {
      class PrecisionComparer extends Comparer<number> {
        compare(x: number, y: number): -1 | 0 | 1 {
          const diff = Math.abs(x - y);
          return diff < 0.000001 ? 0 : x < y ? -1 : 1;
        }
      }
      const numbers = [{ value: 0.1 }, { value: 0.3 }, { value: 0.4 }];
      assert.deepStrictEqual(
        Enumerable.create(numbers).minBy(
          (x) => x.value,
          new PrecisionComparer(),
        ),
        { value: 0.1 },
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).minBy((x) => x),
        1,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3])
          .select((x) => x * x)
          .minBy((x) => x),
        1,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([
          Number.NEGATIVE_INFINITY,
          Number.POSITIVE_INFINITY,
        ]).minBy((x) => x),
        Number.NEGATIVE_INFINITY,
      );
      assert.strictEqual(
        (await AsyncEnumerable.create(persons).minBy((x) => x.age)).name,
        "Harry",
      );
    });
    test("exceptions", async function () {
      await assert.rejects(
        AsyncEnumerable.create([]).minBy((x) => x),
        NoElementsException,
      );
    });
    test("comparer", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).minBy(
          (x) => x,
          new MinByComparer(),
        ),
        3,
      );
      assert.strictEqual(
        (
          await AsyncEnumerable.create(persons).minBy(
            (x) => x.age,
            new MinByComparer(),
          )
        ).name,
        "Dick",
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 3]);
      assert.deepStrictEqual(await e.minBy((x) => x), await e.minBy((x) => x));
    });
    test("async with delayed keySelector", async () => {
      const items = AsyncEnumerable.create([
        { id: 1, value: 10 },
        { id: 2, value: 5 },
        { id: 3, value: 15 },
      ]);
      const result = await items.minBy(async (x) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return x.value;
      });
      assert.deepStrictEqual(result, { id: 2, value: 5 });
    });

    test("async error propagation", async () => {
      const errorEnum = AsyncEnumerable.create([1, 2, 3]);
      await assert.rejects(
        async () =>
          await errorEnum.minBy(() => {
            throw new Error("Selector error");
          }),
        /Selector error/,
      );
    });
  });
  describe("AsyncEnumerable async comparer", function () {
    test("comparer", async function () {
      class MinByComparerAsync<T> extends ComparerAsync<T> {
        compare(x: T, y: T): Promise<-1 | 0 | 1> {
          return Promise.resolve(x > y ? -1 : x < y ? 1 : 0);
        }
      }
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).minBy(
          (x) => x,
          new MinByComparerAsync(),
        ),
        3,
      );
    });
  });
});
