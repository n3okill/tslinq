import {
  AsyncEnumerable,
  Enumerable,
  InvalidArgumentException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("skipLast", function () {
  const arr = [1, 2, 3, 4, 5];
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(
        Enumerable.create(arr).skipLast(3).toArray(),
        [1, 2],
      );
      assert.deepStrictEqual(Enumerable.create(arr).skipLast(0).toArray(), arr);
      assert.deepStrictEqual(
        Enumerable.create(arr).skipLast(-5).toArray(),
        arr,
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create(arr).skipLast(3);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    test("skipLast zero returns same sequence", () => {
      const result = Enumerable.create([1, 2, 3]).skipLast(0).toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("skipLast negative returns same sequence", () => {
      const result = Enumerable.create([1, 2, 3]).skipLast(-1).toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("skipLast from empty returns empty", () => {
      const result = Enumerable.create([]).skipLast(1).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("skipLast single element array source", () => {
      const result = Enumerable.create([1, 2, 3]).skipLast(1).toArray();
      assert.deepStrictEqual(result, [1, 2]);
    });

    test("skipLast multiple elements array source", () => {
      const result = Enumerable.create([1, 2, 3, 4]).skipLast(2).toArray();
      assert.deepStrictEqual(result, [1, 2]);
    });

    test("skipLast iterator source", () => {
      const result = Enumerable.range(1, 5).skipLast(2).toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("skipLast all elements returns empty", () => {
      const result = Enumerable.create([1, 2, 3]).skipLast(3).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("skipLast beyond length returns empty", () => {
      const result = Enumerable.create([1, 2, 3]).skipLast(5).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("skipLast maintains element order", () => {
      const result = Enumerable.create([1, 2, 3, 4, 5]).skipLast(2).toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("throws on invalid count type", () => {
      assert.throws(
        () => Enumerable.create([1]).skipLast("1" as never),
        InvalidArgumentException,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create(arr).skipLast(3).toArray(),
        [1, 2],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(arr).skipLast(0).toArray(),
        arr,
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(arr).skipLast(-5).toArray(),
        arr,
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create(arr).skipLast(3);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("skipLast zero returns same sequence", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .skipLast(0)
        .toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("skipLast negative returns same sequence", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .skipLast(-1)
        .toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("skipLast from empty returns empty", async () => {
      const result = await AsyncEnumerable.create([]).skipLast(1).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("skipLast single element array source", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .skipLast(1)
        .toArray();
      assert.deepStrictEqual(result, [1, 2]);
    });

    test("skipLast multiple elements array source", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3, 4])
        .skipLast(2)
        .toArray();
      assert.deepStrictEqual(result, [1, 2]);
    });

    test("skipLast iterator source", async () => {
      const result = await AsyncEnumerable.range(1, 5).skipLast(2).toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("skipLast all elements returns empty", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .skipLast(3)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("skipLast beyond length returns empty", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .skipLast(5)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("skipLast maintains element order", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3, 4, 5])
        .skipLast(2)
        .toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("throws on invalid count type", () => {
      assert.throws(
        () => AsyncEnumerable.create([1]).skipLast("1" as never),
        InvalidArgumentException,
      );
    });
    test("async with promises", async () => {
      const result = await AsyncEnumerable.create([
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3),
      ])
        .skipLast(2)
        .toArray();
      assert.deepStrictEqual(await Promise.all(result), [1]);
    });
  });
});
