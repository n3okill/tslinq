import {
  AsyncEnumerable,
  Enumerable,
  NotIterableException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("Concat", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.create([1, 2]).concat([3, 4]).count(), 4);
      assert.strictEqual(
        Enumerable.create(["a", "b"])
          .concat(Enumerable.create(["c", "d"]))
          .count(),
        4,
      );
      assert.deepStrictEqual(
        Enumerable.create([1, 2]).concat([3, 4]).concat([5, 6]).toArray(),
        [1, 2, 3, 4, 5, 6],
      );
      assert.strictEqual(
        Enumerable.create(
          new Map([
            ["a", 1],
            ["b", 2],
          ]),
        )
          .concat(new Map([["c", 3]]))
          .count(),
        3,
      );
    });
    test("handles two empty arrays", function () {
      assert.deepStrictEqual(Enumerable.create([]).concat([]).toArray(), []);
    });
    test("handles calling array being empty", function () {
      assert.deepStrictEqual(
        Enumerable.create<number>([]).concat([1]).toArray(),
        [1],
      );
    });
    test("handles concat with empty array", function () {
      assert.deepStrictEqual(Enumerable.create([2]).concat([]).toArray(), [2]);
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2]).concat([3]);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    test("null first throws", () => {
      assert.throws(() => {
        Enumerable.create([1, 2, 3]).concat(null as never);
      }, NotIterableException);
    });
    test("concat with self", () => {
      const source = Enumerable.create([1, 2, 3]);
      const result = source.concat(source);
      assert.deepStrictEqual(result.toArray(), [1, 2, 3, 1, 2, 3]);
    });
    test("Appended Prepended Concat Alternations", () => {
      function* appendedPrependedConcatAlternationsData(): Generator<
        [Array<number>, Array<number>]
      > {
        const enumerableCount = 4; // How many enumerables to concat together per test case

        const foundation: Array<number> = [];
        const expected: Array<number> = [];

        // Iterate through all possible combinations of prepend/append
        for (let i = 0; i < 1 << enumerableCount; i++) {
          // Iterate through all possible combinations of forcing collection
          for (let j = 0; j < 1 << enumerableCount; j++) {
            let actual = Enumerable.create(foundation);

            // Process each position
            for (let k = 0; k < enumerableCount; k++) {
              let nextRange = Enumerable.range(k, 1);
              const prepend = ((i >> k) & 1) !== 0;
              const forceCollection = ((j >> k) & 1) !== 0;

              if (forceCollection) {
                nextRange = Enumerable.create(nextRange.toArray());
              }

              actual = prepend
                ? nextRange.concat(actual)
                : actual.concat(nextRange);

              if (prepend) {
                expected.unshift(k);
              } else {
                expected.push(k);
              }
            }

            yield [expected.slice(), actual.toArray()];

            actual = Enumerable.create(foundation);
            expected.length = 0;
          }
        }
      }
      for (const [
        expected,
        actual,
      ] of appendedPrependedConcatAlternationsData()) {
        assert.deepStrictEqual(actual, expected);
      }
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2]).concat([3, 4]).count(),
        4,
      );
      assert.strictEqual(
        await AsyncEnumerable.create(["a", "b"])
          .concat(AsyncEnumerable.create(["c", "d"]))
          .count(),
        4,
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2])
          .concat([3, 4])
          .concat([5, 6])
          .toArray(),
        [1, 2, 3, 4, 5, 6],
      );
      assert.strictEqual(
        await AsyncEnumerable.create(
          new Map([
            ["a", 1],
            ["b", 2],
          ]),
        )
          .concat(new Map([["c", 3]]))
          .count(),
        3,
      );
    });
    test("handles two empty arrays", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([]).concat([]).toArray(),
        [],
      );
    });
    test("handles calling array being empty", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create<number>([]).concat([1]).toArray(),
        [1],
      );
    });
    test("handles concat with empty array", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([2]).concat([]).toArray(),
        [2],
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2]).concat([3]);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("null first throws", async () => {
      await assert.rejects(
        async () => AsyncEnumerable.create([1, 2, 3]).concat(null as never),
        NotIterableException,
      );
    });
    test("concat with self", async () => {
      const source = AsyncEnumerable.create([1, 2, 3]);
      const result = source.concat(source);
      assert.deepStrictEqual(await result.toArray(), [1, 2, 3, 1, 2, 3]);
    });
    test("Appended Prepended Concat Alternations", async () => {
      async function* appendedPrependedConcatAlternationsData(): AsyncGenerator<
        [Array<number>, Array<number>]
      > {
        const enumerableCount = 4; // How many enumerables to concat together per test case

        const foundation: Array<number> = [];
        const expected: Array<number> = [];

        // Iterate through all possible combinations of prepend/append
        for (let i = 0; i < 1 << enumerableCount; i++) {
          // Iterate through all possible combinations of forcing collection
          for (let j = 0; j < 1 << enumerableCount; j++) {
            let actual = AsyncEnumerable.create(foundation);

            // Process each position
            for (let k = 0; k < enumerableCount; k++) {
              let nextRange = AsyncEnumerable.range(k, 1);
              const prepend = ((i >> k) & 1) !== 0;
              const forceCollection = ((j >> k) & 1) !== 0;

              if (forceCollection) {
                nextRange = AsyncEnumerable.create(await nextRange.toArray());
              }

              actual = prepend
                ? nextRange.concat(actual)
                : actual.concat(nextRange);

              if (prepend) {
                expected.unshift(k);
              } else {
                expected.push(k);
              }
            }

            yield [expected.slice(), await actual.toArray()];

            actual = AsyncEnumerable.create(foundation);
            expected.length = 0;
          }
        }
      }
      for await (const [
        expected,
        actual,
      ] of appendedPrependedConcatAlternationsData()) {
        assert.deepStrictEqual(actual, expected);
      }
    });
  });
});
