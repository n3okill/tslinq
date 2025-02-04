import {
  AsyncEnumerable,
  Comparer,
  ComparerAsync,
  Enumerable,
  InvalidElementsCollection,
  NoElementsException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("min", function () {
  class MinComparer<T> extends Comparer<T> {
    compare(x: T, y: T): -1 | 0 | 1 {
      return x > y ? -1 : x < y ? 1 : 0;
    }
  }
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.create([1, 2, 3]).min(), 1);
      assert.strictEqual(
        Enumerable.create([1, 2, 3])
          .select((x) => x * x)
          .min(),
        1,
      );
      assert.strictEqual(
        Enumerable.create([
          Number.NEGATIVE_INFINITY,
          Number.POSITIVE_INFINITY,
        ]).min(),
        Number.NEGATIVE_INFINITY,
      );
    });
    test("exceptions", function () {
      assert.throws(() => Enumerable.create([]).min(), NoElementsException);
    });
    test("comparer", function () {
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).min(new MinComparer()),
        3,
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2, 3]);
      assert.deepStrictEqual(e.min(), e.min());
    });
    test("edge number cases", () => {
      const numbers = Enumerable.create([
        undefined,
        null,
        0,
        -0,
        Infinity,
        -Infinity,
      ]);
      assert.throws(() => numbers.min(), InvalidElementsCollection);
    });

    test("performance with large collection", () => {
      const large = Enumerable.create(
        Array.from({ length: 100000 }, (_, i) => i),
      );
      const start = performance.now();
      const result = large.min();
      assert.ok(performance.now() - start < 100);
      assert.strictEqual(result, 0);
    });

    test("custom comparer with float precision", () => {
      class FloatComparer extends Comparer<number> {
        compare(x: number, y: number): -1 | 0 | 1 {
          const epsilon = 0.00001;
          const diff = x - y;
          return Math.abs(diff) < epsilon ? 0 : diff < 0 ? -1 : 1;
        }
      }
      assert.strictEqual(
        Enumerable.create([0.1, 0.2, 0.3]).min(new FloatComparer()),
        0.1,
      );
    });

    test("invalid type handling", () => {
      assert.throws(
        () => Enumerable.create(["1", "2"]).min(),
        InvalidElementsCollection,
      );
    });
    describe(".net tests", () => {
      function* enumerables(): Generator<[Array<number>, number]> {
        yield [[42], 42];
        yield [Enumerable.range(1, 10).toArray(), 1];
        yield [[-1, -10, 10, 200, 1000], -10];
        yield [[3000, 100, 200, 1000], 100];
        yield [
          [3000, 100, 200, 1000, Number.MIN_SAFE_INTEGER],
          Number.MIN_SAFE_INTEGER,
        ];
        yield [[20], 20];
        yield [Array(5).fill(-2), -2];
        yield [Enumerable.range(1, 10).toArray(), 1];
        yield [[6, 9, 10, 7, 8], 6];
        yield [[6, 9, 10, 0, -5], -5];
        yield [[6, 0, 9, 0, 10, 0], 0];
      }

      for (const item of enumerables()) {
        test(`min ${item[0]}`, function () {
          const e = Enumerable.create(item[0]);
          assert.strictEqual(e.min(), item[1]);
          assert.strictEqual(
            e.min((x) => x),
            item[1],
          );
        });
      }

      test("min with selector accessing property", function () {
        const source = [
          { name: "Tim", num: 10 },
          { name: "John", num: -105 },
          { name: "Bob", num: 30 },
        ];

        assert.strictEqual(
          Enumerable.create(source).min((e) => e.num),
          -105,
        );
      });
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.strictEqual(await AsyncEnumerable.create([1, 2, 3]).min(), 1);
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3])
          .select((x) => x * x)
          .min(),
        1,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([
          Number.NEGATIVE_INFINITY,
          Number.POSITIVE_INFINITY,
        ]).min(),
        Number.NEGATIVE_INFINITY,
      );
    });
    test("exceptions", async function () {
      await assert.rejects(
        AsyncEnumerable.create([]).min(),
        NoElementsException,
      );
    });
    test("comparer", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).min(new MinComparer()),
        3,
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 3]);
      assert.deepStrictEqual(await e.min(), await e.min());
    });
    test("edge number cases", async () => {
      const numbers = AsyncEnumerable.create([
        undefined,
        null,
        0,
        -0,
        Infinity,
        -Infinity,
      ]);
      await assert.rejects(numbers.min(), InvalidElementsCollection);
    });
    test("async with delayed values", async () => {
      const delayed = AsyncEnumerable.create(
        (async function* () {
          yield 3;
          await new Promise((resolve) => setTimeout(resolve, 10));
          yield 1;
          yield 2;
        })(),
      );
      assert.strictEqual(await delayed.min(), 1);
    });

    test("async comparer with timing verification", async () => {
      class TimedComparer extends ComparerAsync<number> {
        async compare(x: number, y: number): Promise<-1 | 0 | 1> {
          await new Promise((resolve) => setTimeout(resolve, 10));
          return x < y ? -1 : x > y ? 1 : 0;
        }
      }
      const start = performance.now();
      await AsyncEnumerable.create([3, 1, 2]).min(new TimedComparer());
      assert.ok(performance.now() - start >= 20);
    });

    test("async error propagation", async () => {
      const errorEnum = AsyncEnumerable.create(
        (async function* () {
          yield 1;
          throw new Error("Iterator error");
        })(),
      );
      await assert.rejects(() => errorEnum.min());
    });
    describe(".net tests", () => {
      function* enumerables(): Generator<[Array<number>, number]> {
        yield [[42], 42];
        yield [Enumerable.range(1, 10).toArray(), 1];
        yield [[-1, -10, 10, 200, 1000], -10];
        yield [[3000, 100, 200, 1000], 100];
        yield [
          [3000, 100, 200, 1000, Number.MIN_SAFE_INTEGER],
          Number.MIN_SAFE_INTEGER,
        ];
        yield [[20], 20];
        yield [Array(5).fill(-2), -2];
        yield [Enumerable.range(1, 10).toArray(), 1];
        yield [[6, 9, 10, 7, 8], 6];
        yield [[6, 9, 10, 0, -5], -5];
        yield [[6, 0, 9, 0, 10, 0], 0];
      }

      for (const item of enumerables()) {
        test(`min ${item[0]}`, async function () {
          const e = AsyncEnumerable.create(item[0]);
          assert.strictEqual(await e.min(), item[1]);
          assert.strictEqual(await e.min((x) => x), item[1]);
        });
      }

      test("min with selector accessing property", async function () {
        const source = [
          { name: "Tim", num: 10 },
          { name: "John", num: -105 },
          { name: "Bob", num: 30 },
        ];

        assert.strictEqual(
          await AsyncEnumerable.create(source).min((e) => e.num),
          -105,
        );
      });
    });
  });
  describe("AsyncEnumerable async comparer", function () {
    test("comparer", async function () {
      class MinComparerAsync<T> extends ComparerAsync<T> {
        compare(x: T, y: T): Promise<-1 | 0 | 1> {
          return Promise.resolve(x > y ? -1 : x < y ? 1 : 0);
        }
      }
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).min(new MinComparerAsync()),
        3,
      );
    });
  });
});
