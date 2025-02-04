import {
  AsyncEnumerable,
  Enumerable,
  InvalidArgumentException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("skip", function () {
  const arr = [1, 2, 3, 4, 5];
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(Enumerable.create(arr).skip(3).toArray(), [4, 5]);
      assert.deepStrictEqual(Enumerable.create(arr).skip(0).toArray(), arr);
      assert.deepStrictEqual(Enumerable.create(arr).skip(-5).toArray(), arr);
    });
    test("repeated calls", function () {
      const e = Enumerable.create(arr).skip(3);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    test("skip zero returns same sequence", () => {
      const result = Enumerable.create([1, 2, 3]).skip(0).toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("skip negative count returns same sequence", () => {
      const result = Enumerable.create([1, 2, 3]).skip(-1).toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("skip partial sequence", () => {
      const result = Enumerable.create([1, 2, 3, 4]).skip(2).toArray();
      assert.deepStrictEqual(result, [3, 4]);
    });

    test("skip all elements returns empty", () => {
      const result = Enumerable.create([1, 2, 3]).skip(3).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("skip beyond length returns empty", () => {
      const result = Enumerable.create([1, 2, 3]).skip(5).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("skip from iterator source", () => {
      const result = Enumerable.range(1, 5).skip(3).toArray();
      assert.deepStrictEqual(result, [4, 5]);
    });

    test("skip from empty sequence", () => {
      const result = Enumerable.create([]).skip(1).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("throws on invalid count type", () => {
      assert.throws(
        () => Enumerable.create([1]).skip("1" as never),
        InvalidArgumentException,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create(arr).skip(3).toArray(),
        [4, 5],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(arr).skip(0).toArray(),
        arr,
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(arr).skip(-5).toArray(),
        arr,
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create(arr).skip(3);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("skip zero returns same sequence", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3]).skip(0).toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("skip negative count returns same sequence", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3]).skip(-1).toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("skip partial sequence", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3, 4])
        .skip(2)
        .toArray();
      assert.deepStrictEqual(result, [3, 4]);
    });

    test("skip all elements returns empty", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3]).skip(3).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("skip beyond length returns empty", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3]).skip(5).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("skip from iterator source", async () => {
      const result = await AsyncEnumerable.range(1, 5).skip(3).toArray();
      assert.deepStrictEqual(result, [4, 5]);
    });

    test("skip from empty sequence", async () => {
      const result = await AsyncEnumerable.create([]).skip(1).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("throws on invalid count type", () => {
      assert.throws(
        () => AsyncEnumerable.create([1]).skip("1" as never),
        InvalidArgumentException,
      );
    });
    test("async with promises", async () => {
      const result = await AsyncEnumerable.create([
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3),
      ])
        .skip(2)
        .toArray();
      assert.deepStrictEqual(await Promise.all(result), [3]);
    });
  });
});
