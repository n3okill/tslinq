import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("chunk", function () {
  const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(Enumerable.create(testArray).chunk(3).toArray(), [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);
    });
    test("Append before iterating", function () {
      const a = Enumerable.create(testArray).append(10);
      assert.deepStrictEqual(a.chunk(3).toArray(), [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [10],
      ]);
    });
    test("Except before iterating", function () {
      const a = Enumerable.create(testArray).except([3, 6, 9]);
      assert.deepStrictEqual(a.chunk(3).toArray(), [
        [1, 2, 4],
        [5, 7, 8],
      ]);
    });
    test("repeated calls", function () {
      const e = Enumerable.create(testArray);
      assert.deepStrictEqual(e.chunk(3).toArray(), e.chunk(3).toArray());
    });
    test("empty collection", () => {
      const empty = Enumerable.create([]);
      const chunks = empty.chunk(2).toArray();
      assert.deepEqual(chunks, []);
    });
    test("single element", () => {
      const single = Enumerable.create([1]);
      const chunks = single.chunk(2).toArray();
      assert.deepEqual(chunks, [[1]]);
    });
    test("chunk size equals array length", () => {
      const numbers = Enumerable.create([1, 2, 3]);
      const chunks = numbers.chunk(3).toArray();
      assert.deepEqual(chunks, [[1, 2, 3]]);
    });
    test("negative chunk size throws", () => {
      const numbers = Enumerable.create([1, 2, 3]);
      assert.throws(() => numbers.chunk(-1), RangeError);
    });
    test("chunk size of 1", () => {
      const numbers = Enumerable.create([1, 2, 3]);
      assert.deepStrictEqual(numbers.chunk(1).toArray(), [[1], [2], [3]]);
    });

    test("chunk size of 0 throws", () => {
      const numbers = Enumerable.create([1, 2, 3]);
      assert.throws(() => numbers.chunk(0), RangeError);
    });

    test("collection with null values", () => {
      const mixed = Enumerable.create([1, null, 3, null]);
      assert.deepStrictEqual(mixed.chunk(2).toArray(), [
        [1, null],
        [3, null],
      ]);
    });

    test("mixed type collection", () => {
      const mixed = Enumerable.create([1, "a", true, null]);
      assert.deepStrictEqual(mixed.chunk(2).toArray(), [
        [1, "a"],
        [true, null],
      ]);
    });

    test("very large chunk size", () => {
      const numbers = Enumerable.create([1, 2, 3]);
      assert.deepStrictEqual(numbers.chunk(1000).toArray(), [[1, 2, 3]]);
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create(testArray).chunk(3).toArray(),
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
      );
    });
    test("Append before iterating", async function () {
      const a = AsyncEnumerable.create(testArray).append(10);
      assert.deepStrictEqual(await a.chunk(3).toArray(), [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [10],
      ]);
    });
    test("Except before iterating", async function () {
      const a = AsyncEnumerable.create(testArray).except([3, 6, 9]);
      assert.deepStrictEqual(await a.chunk(3).toArray(), [
        [1, 2, 4],
        [5, 7, 8],
      ]);
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create(testArray);
      assert.deepStrictEqual(
        await e.chunk(3).toArray(),
        await e.chunk(3).toArray(),
      );
    });
    test("async empty collection", async () => {
      const empty = AsyncEnumerable.create([]);
      const chunks = await empty.chunk(2).toArray();
      assert.deepEqual(chunks, []);
    });
    test("async large chunk size", async () => {
      const numbers = AsyncEnumerable.create([1, 2]);
      const chunks = await numbers.chunk(5).toArray();
      assert.deepEqual(chunks, [[1, 2]]);
    });

    test("async negative chunk size throws", async () => {
      const numbers = AsyncEnumerable.create([1, 2, 3]);
      assert.throws(() => numbers.chunk(-1), RangeError);
    });
    test("async chunk size of 1", async () => {
      const numbers = AsyncEnumerable.create([1, 2, 3]);
      assert.deepStrictEqual(await numbers.chunk(1).toArray(), [[1], [2], [3]]);
    });

    test("async chunk size of 0 throws", () => {
      const numbers = AsyncEnumerable.create([1, 2, 3]);
      assert.throws(() => numbers.chunk(0), RangeError);
    });

    test("async collection with undefined values", async () => {
      const mixed = AsyncEnumerable.create([1, undefined, 3]);
      assert.deepStrictEqual(await mixed.chunk(2).toArray(), [
        [1, undefined],
        [3],
      ]);
    });

    test("async with delayed values", async () => {
      const delayed = AsyncEnumerable.create(
        (async function* () {
          yield await Promise.resolve(1);
          yield await Promise.resolve(2);
          yield await Promise.resolve(3);
        })(),
      );
      assert.deepStrictEqual(await delayed.chunk(2).toArray(), [[1, 2], [3]]);
    });

    test("async iterator with errors", async () => {
      const errorIterator = AsyncEnumerable.create(
        (async function* () {
          yield 1;
          throw new Error("Test error");
        })(),
      );
      await assert.rejects(
        async () => await errorIterator.chunk(2).toArray(),
        /Test error/,
      );
    });
  });
});
