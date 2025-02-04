import {
  AsyncEnumerable,
  Enumerable,
  InvalidArgumentException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("take", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(
        Enumerable.create([59, 82, 70, 56, 92, 98, 85])
          .orderByDescending((grade) => grade)
          .take(3)
          .toArray(),
        [98, 92, 85],
      );
      assert.deepStrictEqual(Enumerable.create([]).take(3).toArray(), []);
      assert.deepStrictEqual(
        Enumerable.create([59, 82, 70, 56, 92, 98, 85])
          .orderByDescending((grade) => grade)
          .take(-3)
          .toArray(),
        [],
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([59, 82, 70, 56, 92, 98, 85])
        .orderByDescending((grade) => grade)
        .take(3);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    test("take zero returns empty", () => {
      const result = Enumerable.create([1, 2, 3]).take(0).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("take negative returns empty", () => {
      const result = Enumerable.create([1, 2, 3]).take(-1).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("take partial sequence", () => {
      const result = Enumerable.create([1, 2, 3, 4]).take(2).toArray();
      assert.deepStrictEqual(result, [1, 2]);
    });

    test("take from empty sequence", () => {
      const result = Enumerable.create([]).take(1).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("take all elements", () => {
      const result = Enumerable.create([1, 2, 3]).take(3).toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("take beyond length", () => {
      const result = Enumerable.create([1, 2]).take(5).toArray();
      assert.deepStrictEqual(result, [1, 2]);
    });

    test("take from iterator source", () => {
      const result = Enumerable.range(1, 5).take(3).toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("throws on invalid count type", () => {
      assert.throws(
        () => Enumerable.create([1]).take("1" as never),
        InvalidArgumentException,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([59, 82, 70, 56, 92, 98, 85])
          .orderByDescending((grade) => grade)
          .take(3)
          .toArray(),
        [98, 92, 85],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([]).take(3).toArray(),
        [],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([59, 82, 70, 56, 92, 98, 85])
          .orderByDescending((grade) => grade)
          .take(-3)
          .toArray(),
        [],
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([59, 82, 70, 56, 92, 98, 85])
        .orderByDescending((grade) => grade)
        .take(3);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("take zero returns empty", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3]).take(0).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("take negative returns empty", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3]).take(-1).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("take partial sequence", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3, 4])
        .take(2)
        .toArray();
      assert.deepStrictEqual(result, [1, 2]);
    });

    test("take from empty sequence", async () => {
      const result = await AsyncEnumerable.create([]).take(1).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("take all elements", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3]).take(3).toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("take beyond length", async () => {
      const result = await AsyncEnumerable.create([1, 2]).take(5).toArray();
      assert.deepStrictEqual(result, [1, 2]);
    });

    test("take from iterator source", async () => {
      const result = await AsyncEnumerable.range(1, 5).take(3).toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("throws on invalid count type", () => {
      assert.throws(
        () => AsyncEnumerable.create([1]).take("1" as never),
        InvalidArgumentException,
      );
    });
    test("async with promises", async () => {
      const result = await AsyncEnumerable.create([
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3),
      ])
        .take(2)
        .toArray();
      assert.deepStrictEqual(await Promise.all(result), [1, 2]);
    });
  });
});
