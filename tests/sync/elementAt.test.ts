import {
  AsyncEnumerable,
  Enumerable,
  OutOfRangeException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("elementAt", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.create([1, 2, 3]).elementAt(1), 2);
    });
    test("throw", function () {
      assert.throws(
        () => Enumerable.create([1, 2, 3]).elementAt(-1),
        OutOfRangeException,
      );
      assert.throws(
        () => Enumerable.create([1, 2, 3]).elementAt(5),
        OutOfRangeException,
      );
      assert.throws(
        () => Enumerable.create([]).elementAt(0),
        OutOfRangeException,
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2, 3]);
      assert.deepStrictEqual(e.elementAt(1), e.elementAt(1));
    });
    test("last element access", () => {
      const numbers = Enumerable.create([1, 2, 3]);
      assert.strictEqual(numbers.elementAt(2), 3);
    });

    test("with iterator source", () => {
      function* generator() {
        yield 1;
        yield 2;
        yield 3;
      }
      const iter = Enumerable.create(generator());
      assert.strictEqual(iter.elementAt(1), 2);
    });

    test("with null values", () => {
      const withNull = Enumerable.create([1, null, 3]);
      assert.strictEqual(withNull.elementAt(1), null);
    });

    test("with mixed types", () => {
      const mixed = Enumerable.create([1, "two", true]);
      assert.strictEqual(mixed.elementAt(1), "two");
      assert.strictEqual(mixed.elementAt(2), true);
    });

    test("large index performance", () => {
      const large = Enumerable.create(
        Array.from({ length: 10000 }, (_, i) => i),
      );
      assert.strictEqual(large.elementAt(9999), 9999);
    });
    test("performance comparison array vs iterator", () => {
      const array = Enumerable.create(
        Array.from({ length: 1000 }, (_, i) => i),
      );
      const iterator = Enumerable.create(
        (function* () {
          for (let i = 0; i < 1000; i++) yield i;
        })(),
      );

      const start1 = Date.now();
      array.elementAt(500);
      const arrayTime = Date.now() - start1;

      const start2 = Date.now();
      iterator.elementAt(500);
      const iterTime = Date.now() - start2;

      assert.ok(arrayTime <= iterTime, "Array access should be faster");
    });

    test("type coercion behavior", () => {
      const mixed = Enumerable.create(["1", 2, "3"]);
      assert.strictEqual(typeof mixed.elementAt(0), "string");
      assert.strictEqual(typeof mixed.elementAt(1), "number");
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).elementAt(1),
        2,
      );
    });
    test("throw", async function () {
      await assert.rejects(
        AsyncEnumerable.create([1, 2, 3]).elementAt(-1),
        OutOfRangeException,
      );
      await assert.rejects(
        AsyncEnumerable.create([1, 2, 3]).elementAt(5),
        OutOfRangeException,
      );
      await assert.rejects(
        AsyncEnumerable.create([]).elementAt(0),
        OutOfRangeException,
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 3]);
      assert.deepStrictEqual(await e.elementAt(1), await e.elementAt(1));
    });
    test("async iterator with delays", async () => {
      const delayed = AsyncEnumerable.create(
        (async function* () {
          yield await Promise.resolve(1);
          await new Promise((resolve) => setTimeout(resolve, 10));
          yield 2;
          yield 3;
        })(),
      );
      assert.strictEqual(await delayed.elementAt(1), 2);
    });

    test("async with errors in iterator", async () => {
      const errorIterator = AsyncEnumerable.create(
        (async function* () {
          yield 1;
          throw new Error("Iterator error");
        })(),
      );
      await assert.rejects(
        async () => await errorIterator.elementAt(1),
        /Iterator error/,
      );
    });

    test("async with undefined values", async () => {
      const withUndefined = AsyncEnumerable.create([1, undefined, 3]);
      assert.strictEqual(await withUndefined.elementAt(1), undefined);
    });

    test("async boundary indices", async () => {
      const numbers = AsyncEnumerable.create([1, 2, 3]);
      await assert.rejects(
        async () => await numbers.elementAt(3),
        OutOfRangeException,
      );
      assert.strictEqual(await numbers.elementAt(0), 1);
    });

    test("async with empty source", async () => {
      const empty = AsyncEnumerable.create([]);
      await assert.rejects(
        async () => await empty.elementAt(0),
        OutOfRangeException,
      );
    });
    test("async iterator cancellation", async () => {
      let cancelled = false;
      const asyncIter = AsyncEnumerable.create(
        (async function* () {
          try {
            yield 1;
            await new Promise((resolve) => setTimeout(resolve, 10));
            yield 2;
          } finally {
            cancelled = true;
          }
        })(),
      );

      await asyncIter.elementAt(0);
      assert.strictEqual(cancelled, true);
    });
    test("async elementAt with delay", async () => {
      const delayed = AsyncEnumerable.create(
        (async function* () {
          yield await Promise.resolve(1);
          await new Promise((resolve) => setTimeout(resolve, 10));
          yield 2;
        })(),
      );
      await assert.rejects(() => delayed.elementAt(5));
    });

    test("async memory usage", async () => {
      const largeArray = Array.from({ length: 100_000 }, (_, i) => i);
      const asyncArray = AsyncEnumerable.create(largeArray);
      const result = await asyncArray.elementAt(99999);
      assert.strictEqual(result, 99999);
    });
  });
});
