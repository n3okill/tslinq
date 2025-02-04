import {
  AsyncEnumerable,
  Enumerable,
  InvalidArgumentException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("skipWhile", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(
        Enumerable.create([59, 82, 70, 56, 92, 98, 85])
          .orderByDescending((grade) => grade)
          .skipWhile((grade) => grade >= 80)
          .toArray(),
        [70, 59, 56],
      );

      assert.deepStrictEqual(
        Enumerable.create([5000, 2500, 9000, 8000, 6500, 4000, 1500, 5500])
          .skipWhile((amount, index) => amount > index * 1000)
          .toArray(),
        [4000, 1500, 5500],
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([59, 82, 70, 56, 92, 98, 85])
        .orderByDescending((grade) => grade)
        .skipWhile((grade) => grade >= 80);

      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    test("empty sequence returns empty", () => {
      const result = Enumerable.create([])
        .skipWhile(() => true)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("skip while less than condition", () => {
      const result = Enumerable.create([1, 2, 3, 4, 1, 2])
        .skipWhile((x) => x < 3)
        .toArray();
      assert.deepStrictEqual(result, [3, 4, 1, 2]);
    });

    test("skip using index", () => {
      const result = Enumerable.create([1, 2, 3, 4])
        .skipWhile((x, i) => i < 2)
        .toArray();
      assert.deepStrictEqual(result, [3, 4]);
    });

    test("skip none when predicate is false", () => {
      const result = Enumerable.create([1, 2, 3])
        .skipWhile(() => false)
        .toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("skip all when predicate is true", () => {
      const result = Enumerable.create([1, 2, 3])
        .skipWhile(() => true)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("stops skipping after first false", () => {
      const result = Enumerable.create([1, 2, 1, 2])
        .skipWhile((x) => x < 2)
        .toArray();
      assert.deepStrictEqual(result, [2, 1, 2]);
    });

    test("throws on null predicate", () => {
      assert.throws(
        () => Enumerable.create([1]).skipWhile(null as never),
        InvalidArgumentException,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([59, 82, 70, 56, 92, 98, 85])
          .orderByDescending((grade) => grade)
          .skipWhile((grade) => grade >= 80)
          .toArray(),
        [70, 59, 56],
      );

      assert.deepStrictEqual(
        await AsyncEnumerable.create([
          5000, 2500, 9000, 8000, 6500, 4000, 1500, 5500,
        ])
          .skipWhile((amount, index) => amount > index * 1000)
          .toArray(),
        [4000, 1500, 5500],
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([59, 82, 70, 56, 92, 98, 85])
        .orderByDescending((grade) => grade)
        .skipWhile((grade) => grade >= 80);

      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("empty sequence returns empty", async () => {
      const result = await AsyncEnumerable.create([])
        .skipWhile(() => true)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("skip while less than condition", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3, 4, 1, 2])
        .skipWhile((x) => x < 3)
        .toArray();
      assert.deepStrictEqual(result, [3, 4, 1, 2]);
    });

    test("skip using index", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3, 4])
        .skipWhile((x, i) => i < 2)
        .toArray();
      assert.deepStrictEqual(result, [3, 4]);
    });

    test("skip none when predicate is false", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .skipWhile(() => false)
        .toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("skip all when predicate is true", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .skipWhile(() => true)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("stops skipping after first false", async () => {
      const result = await AsyncEnumerable.create([1, 2, 1, 2])
        .skipWhile((x) => x < 2)
        .toArray();
      assert.deepStrictEqual(result, [2, 1, 2]);
    });

    test("throws on null predicate", () => {
      assert.throws(
        () => AsyncEnumerable.create([1]).skipWhile(null as never),
        InvalidArgumentException,
      );
    });
    test("async with promises", async () => {
      const result = await AsyncEnumerable.create([
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3),
      ])
        .skipWhile(async (x) => (await x) < 2)
        .toArray();
      assert.deepStrictEqual(await Promise.all(result), [2, 3]);
    });
  });
  describe("AsyncEnumerable async", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([59, 82, 70, 56, 92, 98, 85])
          .orderByDescending(async (grade) => Promise.resolve(grade))
          .skipWhile(async (grade) => Promise.resolve(grade >= 80))
          .toArray(),
        [70, 59, 56],
      );

      assert.deepStrictEqual(
        await AsyncEnumerable.create([
          5000, 2500, 9000, 8000, 6500, 4000, 1500, 5500,
        ])
          .skipWhile(async (amount, index) =>
            Promise.resolve(amount > index * 1000),
          )
          .toArray(),
        [4000, 1500, 5500],
      );
    });
  });
});
