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

describe("max", function () {
  class MaxComparer<T> extends Comparer<T> {
    compare(x: T, y: T): -1 | 0 | 1 {
      return x > y ? -1 : x < y ? 1 : 0;
    }
  }
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.create([1, 2, 3]).max(), 3);
      assert.strictEqual(
        Enumerable.create([1, 2, 3])
          .select((x) => x * x)
          .max(),
        9,
      );
      assert.strictEqual(
        Enumerable.create([
          Number.NEGATIVE_INFINITY,
          Number.POSITIVE_INFINITY,
        ]).max(),
        Number.POSITIVE_INFINITY,
      );
    });
    test("exceptions", function () {
      assert.throws(() => Enumerable.create([]).max(), NoElementsException);
    });
    test("comparer", function () {
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).max(new MaxComparer()),
        1,
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2, 3]);
      assert.deepStrictEqual(e.max(), e.max());
    });
    test("floating point numbers", () => {
      assert.strictEqual(Enumerable.create([0.1, 0.2, 0.3]).max(), 0.3);
    });

    test("large numbers", () => {
      assert.strictEqual(
        Enumerable.create([Number.MAX_SAFE_INTEGER, Number.MAX_VALUE]).max(),
        Number.MAX_VALUE,
      );
    });
    test("invalid type throwing", () => {
      assert.throws(
        () => Enumerable.create(["1", "2"]).max(),
        InvalidElementsCollection,
      );
    });

    test("custom comparer with NaN", () => {
      class NaNComparer extends Comparer<number> {
        compare(x: number, y: number): -1 | 0 | 1 {
          if (isNaN(x) && isNaN(y)) return 0;
          if (isNaN(x)) return -1;
          if (isNaN(y)) return 1;
          return x > y ? 1 : x < y ? -1 : 0;
        }
      }
      assert.strictEqual(
        Enumerable.create([1, NaN, 2]).max(new NaNComparer()),
        2,
      );
      assert.strictEqual(
        Enumerable.create([NaN, 1, 2]).max(new NaNComparer()),
        2,
      );
    });
    test("custom object comparer", () => {
      class VersionComparer extends Comparer<string> {
        compare(x: string, y: string): -1 | 0 | 1 {
          const [xMajor, xMinor] = x.split(".").map(Number);
          const [yMajor, yMinor] = y.split(".").map(Number);
          if (xMajor !== yMajor) return xMajor > yMajor ? 1 : -1;
          return xMinor > yMinor ? 1 : xMinor < yMinor ? -1 : 0;
        }
      }
      const versions = Enumerable.create(["1.0", "2.0", "1.9"]);
      assert.strictEqual(versions.max(new VersionComparer()), "2.0");
    });
    describe(".net tests", () => {
      function* enumerables(): Generator<[Array<number>, number]> {
        yield [[42], 42];
        yield [Enumerable.range(1, 10).toArray(), 10];
        yield [[-100, -15, -50, -10], -10];
        yield [[-16, 0, 50, 100, 1000], 1000];
        yield [
          [-16, 0, 50, 100, 1000, Number.MAX_SAFE_INTEGER],
          Number.MAX_SAFE_INTEGER,
        ];
        yield [[20], 20];
        yield [Enumerable.repeat(-2, 5).toArray(), -2];
        yield [[16, 9, 10, 7, 8], 16];
        yield [[6, 9, 10, 0, 50], 50];
        yield [[-6, 0, -9, 0, -10, 0], 0];
      }
      for (const item of enumerables()) {
        test(`max ${item[0]}`, function () {
          const e = Enumerable.create(item[0]);
          assert.strictEqual(e.max(), item[1]);
          assert.strictEqual(
            e.max((x) => x),
            item[1],
          );
        });
      }

      test("max with selector accessing property", function () {
        const source = [
          { name: "Tim", num: 10 },
          { name: "John", num: -105 },
          { name: "Bob", num: 30 },
        ];

        assert.strictEqual(
          Enumerable.create(source).max((e) => e.num),
          30,
        );
      });
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.strictEqual(await AsyncEnumerable.create([1, 2, 3]).max(), 3);
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3])
          .select((x) => x * x)
          .max(),
        9,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([
          Number.NEGATIVE_INFINITY,
          Number.POSITIVE_INFINITY,
        ]).max(),
        Number.POSITIVE_INFINITY,
      );
    });
    test("exceptions", async function () {
      await assert.rejects(
        AsyncEnumerable.create([]).max(),
        NoElementsException,
      );
    });
    test("comparer", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).max(new MaxComparer()),
        1,
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 3]);
      assert.deepStrictEqual(await e.max(), await e.max());
    });

    test("floating point numbers", async () => {
      assert.strictEqual(
        await AsyncEnumerable.create([0.1, 0.2, 0.3]).max(),
        0.3,
      );
    });

    test("large numbers", async () => {
      assert.strictEqual(
        await AsyncEnumerable.create([
          Number.MAX_SAFE_INTEGER,
          Number.MAX_VALUE,
        ]).max(),
        Number.MAX_VALUE,
      );
    });

    test("invalid type throwing", async () => {
      await assert.rejects(
        AsyncEnumerable.create(["1", "2"]).max(),
        InvalidElementsCollection,
      );
    });
    test("async with delayed values", async () => {
      const delayed = AsyncEnumerable.create(
        (async function* () {
          yield 1;
          await new Promise((resolve) => setTimeout(resolve, 10));
          yield 3;
          yield 2;
        })(),
      );
      assert.strictEqual(await delayed.max(), 3);
    });

    test("async with error handling", async () => {
      const errorEnum = AsyncEnumerable.create(
        (async function* () {
          yield 1;
          throw new Error("Iterator error");
        })(),
      );
      await assert.rejects(() => errorEnum.max());
    });

    test("async with custom delayed comparer", async () => {
      class DelayedComparer extends ComparerAsync<number> {
        async compare(x: number, y: number): Promise<-1 | 0 | 1> {
          await new Promise((resolve) => setTimeout(resolve, 10));
          return x > y ? 1 : x < y ? -1 : 0;
        }
      }
      const result = await AsyncEnumerable.create([1, 3, 2]).max(
        new DelayedComparer(),
      );
      assert.strictEqual(result, 3);
    });
    test("custom object comparer", async () => {
      class VersionComparer extends ComparerAsync<string> {
        async compare(x: string, y: string): Promise<-1 | 0 | 1> {
          const [xMajor, xMinor] = x.split(".").map(Number);
          const [yMajor, yMinor] = y.split(".").map(Number);
          if (xMajor !== yMajor) return xMajor > yMajor ? 1 : -1;
          return xMinor > yMinor ? 1 : xMinor < yMinor ? -1 : 0;
        }
      }
      const versions = AsyncEnumerable.create(["1.0", "2.0", "1.9"]);
      assert.strictEqual(await versions.max(new VersionComparer()), "2.0");
    });
    describe(".net tests", () => {
      function* enumerables(): Generator<[Array<number>, number]> {
        yield [[42], 42];
        yield [Enumerable.range(1, 10).toArray(), 10];
        yield [[-100, -15, -50, -10], -10];
        yield [[-16, 0, 50, 100, 1000], 1000];
        yield [
          [-16, 0, 50, 100, 1000, Number.MAX_SAFE_INTEGER],
          Number.MAX_SAFE_INTEGER,
        ];
        yield [[20], 20];
        yield [Enumerable.repeat(-2, 5).toArray(), -2];
        yield [[16, 9, 10, 7, 8], 16];
        yield [[6, 9, 10, 0, 50], 50];
        yield [[-6, 0, -9, 0, -10, 0], 0];
      }
      for (const item of enumerables()) {
        test(`max ${item[0]}`, async function () {
          const e = AsyncEnumerable.create(item[0]);
          assert.strictEqual(await e.max(), item[1]);
          assert.strictEqual(await e.max((x) => x), item[1]);
        });
      }
      test("max with selector accessing property", async function () {
        const source = [
          { name: "Tim", num: 10 },
          { name: "John", num: -105 },
          { name: "Bob", num: 30 },
        ];

        assert.strictEqual(
          await AsyncEnumerable.create(source).max((e) => e.num),
          30,
        );
      });
    });
  });
  describe("AsyncEnumerable async comparer", function () {
    test("comparer", async function () {
      class MaxComparerAsync<T> extends ComparerAsync<T> {
        compare(x: T, y: T): Promise<-1 | 0 | 1> {
          return Promise.resolve(x > y ? -1 : x < y ? 1 : 0);
        }
      }
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).max(new MaxComparerAsync()),
        1,
      );
    });
  });
});
