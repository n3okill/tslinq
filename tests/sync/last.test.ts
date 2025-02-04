import {
  AsyncEnumerable,
  Enumerable,
  NoElementsException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("last", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.create([1, 2, 3]).last(), 3);
      assert.strictEqual(Enumerable.create([1, 2, 3]).except([3]).last(), 2);
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).last((x) => x === 2),
        2,
      );
    });
    test("exception", function () {
      assert.throws(() => Enumerable.create([]).last(), NoElementsException);
      assert.throws(
        () => Enumerable.create([]).last((x) => x > 2),
        NoElementsException,
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2, 3]);
      assert.deepStrictEqual(e.last(), e.last());
    });
    test("performance with large collection", () => {
      const largeArray = Array.from({ length: 100000 }, (_, i) => i);
      const enumerable = Enumerable.create(largeArray);
      const start = performance.now();
      const result = enumerable.last((x) => x > 99990);
      assert.ok(performance.now() - start < 100);
      assert.ok(result > 99990);
    });

    test("mixed type collection", () => {
      const mixed = Enumerable.create([1, "two", 3, "four", 5]);
      assert.strictEqual(mixed.last(), 5);
      assert.strictEqual(
        mixed.last((x) => typeof x === "string"),
        "four",
      );
    });

    test("with null and undefined values", () => {
      const withNull = Enumerable.create([1, null, 3, undefined, 5]);
      assert.strictEqual(withNull.last(), 5);
      assert.strictEqual(
        withNull.last((x) => x === null),
        null,
      );
    });

    test("complex predicate conditions", () => {
      const objects = Enumerable.create([
        { id: 1, value: "a" },
        { id: 2, value: "b" },
        { id: 3, value: "a" },
      ]);
      const result = objects.last((x) => x.value === "a");
      assert.deepStrictEqual(result, { id: 3, value: "a" });
    });

    test("iterator vs array performance", () => {
      const size = 10000;
      const array = Enumerable.create(
        Array.from({ length: size }, (_, i) => i),
      );
      const iterator = Enumerable.create(
        (function* () {
          for (let i = 0; i < size; i++) yield i;
        })(),
      );

      const arrayStart = performance.now();
      array.last();
      const arrayTime = performance.now() - arrayStart;

      const iterStart = performance.now();
      iterator.last();
      const iterTime = performance.now() - iterStart;

      assert.ok(arrayTime <= iterTime, "Array should be faster than iterator");
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.strictEqual(await AsyncEnumerable.create([1, 2, 3]).last(), 3);
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).except([3]).last(),
        2,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).last((x) => x === 2),
        2,
      );
    });
    test("exception", async function () {
      await assert.rejects(
        AsyncEnumerable.create([]).last(),
        NoElementsException,
      );
      await assert.rejects(
        AsyncEnumerable.create([]).last((x) => x > 2),
        NoElementsException,
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 3]);
      assert.deepStrictEqual(await e.last(), await e.last());
    });

    test("async with delayed values", async () => {
      const delayed = AsyncEnumerable.create(
        (async function* () {
          yield 1;
          await new Promise((resolve) => setTimeout(resolve, 10));
          yield 2;
          yield 3;
        })(),
      );
      assert.strictEqual(await delayed.last(), 3);
    });

    test("async predicate timing", async () => {
      const numbers = AsyncEnumerable.create([1, 2, 3, 4, 5]);
      const start = performance.now();
      await numbers.last(async (x) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return x > 3;
      });
      assert.ok(performance.now() - start >= 30);
    });

    test("error in async iterator", async () => {
      const errorEnum = AsyncEnumerable.create(
        (async function* () {
          yield 1;
          throw new Error("Iterator error");
        })(),
      );
      await assert.rejects(() => errorEnum.last());
    });

    test("async with empty chunks", async () => {
      const sparseEnum = AsyncEnumerable.create(
        (async function* () {
          // eslint-disable-next-line no-sparse-arrays
          yield* [1, , 3, , 5];
        })(),
      );
      assert.strictEqual(await sparseEnum.last(), 5);
    });
  });
  describe("AsyncEnumerable async predicate", function () {
    test("basic", async function () {
      assert.strictEqual(await AsyncEnumerable.create([1, 2, 3]).last(), 3);
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).except([3]).last(),
        2,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).last(async (x) =>
          Promise.resolve(x === 2),
        ),
        2,
      );
    });
    test("exception", async function () {
      await assert.rejects(
        AsyncEnumerable.create([]).last(),
        NoElementsException,
      );
      await assert.rejects(
        AsyncEnumerable.create([]).last(async (x) => Promise.resolve(x > 2)),
        NoElementsException,
      );
    });
  });
});
