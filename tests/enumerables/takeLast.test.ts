import {
  AsyncEnumerable,
  Enumerable,
  InvalidArgumentException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("takeLast", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(
        Enumerable.create([59, 82, 70, 56, 92, 98, 85])
          .orderByDescending((grade) => grade)
          .takeLast(3)
          .toArray(),
        [70, 59, 56],
      );
      assert.deepStrictEqual(Enumerable.create([]).takeLast(3).toArray(), []);
      assert.deepStrictEqual(
        Enumerable.create([59, 82, 70, 56, 92, 98, 85])
          .orderByDescending((grade) => grade)
          .takeLast(-3)
          .toArray(),
        [],
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([59, 82, 70, 56, 92, 98, 85])
        .orderByDescending((grade) => grade)
        .takeLast(3);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    test("takeLast zero returns empty", () => {
      const result = Enumerable.create([1, 2, 3]).takeLast(0).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("takeLast negative returns empty", () => {
      const result = Enumerable.create([1, 2, 3]).takeLast(-1).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("takeLast from empty returns empty", () => {
      const result = Enumerable.create([]).takeLast(1).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("takeLast single element array source", () => {
      const result = Enumerable.create([1, 2, 3]).takeLast(1).toArray();
      assert.deepStrictEqual(result, [3]);
    });

    test("takeLast multiple elements array source", () => {
      const result = Enumerable.create([1, 2, 3, 4]).takeLast(2).toArray();
      assert.deepStrictEqual(result, [3, 4]);
    });

    test("takeLast iterator source", () => {
      const result = Enumerable.range(1, 5).takeLast(3).toArray();
      assert.deepStrictEqual(result, [3, 4, 5]);
    });

    test("takeLast all elements", () => {
      const result = Enumerable.create([1, 2, 3]).takeLast(3).toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("takeLast beyond length returns all", () => {
      const result = Enumerable.create([1, 2, 3]).takeLast(5).toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("throws on invalid count type", () => {
      assert.throws(
        () => Enumerable.create([1]).takeLast("1" as never),
        InvalidArgumentException,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([59, 82, 70, 56, 92, 98, 85])
          .orderByDescending((grade) => grade)
          .takeLast(3)
          .toArray(),
        [70, 59, 56],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([]).takeLast(3).toArray(),
        [],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([59, 82, 70, 56, 92, 98, 85])
          .orderByDescending((grade) => grade)
          .takeLast(-3)
          .toArray(),
        [],
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([59, 82, 70, 56, 92, 98, 85])
        .orderByDescending((grade) => grade)
        .takeLast(3);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("takeLast zero returns empty", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .takeLast(0)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("takeLast negative returns empty", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .takeLast(-1)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("takeLast from empty returns empty", async () => {
      const result = await AsyncEnumerable.create([]).takeLast(1).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("takeLast single element array source", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .takeLast(1)
        .toArray();
      assert.deepStrictEqual(result, [3]);
    });

    test("takeLast multiple elements array source", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3, 4])
        .takeLast(2)
        .toArray();
      assert.deepStrictEqual(result, [3, 4]);
    });

    test("takeLast iterator source", async () => {
      const result = await AsyncEnumerable.range(1, 5).takeLast(3).toArray();
      assert.deepStrictEqual(result, [3, 4, 5]);
    });

    test("takeLast all elements", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .takeLast(3)
        .toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("takeLast beyond length returns all", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .takeLast(5)
        .toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("throws on invalid count type", () => {
      assert.throws(
        () => AsyncEnumerable.create([1]).takeLast("1" as never),
        InvalidArgumentException,
      );
    });
    test("async with promises", async () => {
      const result = await AsyncEnumerable.create([
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3),
      ])
        .takeLast(2)
        .toArray();
      assert.deepStrictEqual(await Promise.all(result), [2, 3]);
    });
  });
});
