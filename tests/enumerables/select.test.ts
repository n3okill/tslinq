import {
  AsyncEnumerable,
  Enumerable,
  InvalidArgumentException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("select", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3])
          .select((x) => x * 2)
          .toArray(),
        [2, 4, 6],
      );
      assert.deepStrictEqual(
        Enumerable.create(["hello", "2", "world"])
          .select((x) => (x === "hello" || x === "world" ? x : ""))
          .toArray(),
        ["hello", "", "world"],
      );
      assert.deepStrictEqual(
        Enumerable.create(["1", "2", "3"])
          .select((num) => Number.parseInt(num, undefined))
          .toArray(),
        [1, 2, 3],
      );
      assert.deepStrictEqual(
        Enumerable.create([2, 1, 0])
          .select((x, index) => index as number)
          .toArray(),
        [0, 1, 2],
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2, 3]).select((x) => x * 2);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    test("complex", function () {
      const e = Enumerable.create([1, 2, 3])
        .select((x) => x * 2)
        .where((x) => x > 4)
        .select((x) => x / 2);
      assert.deepStrictEqual(e.toArray(), [3]);
    });
    test("basic number transformation", () => {
      const result = Enumerable.create([1, 2, 3])
        .select((x) => x * 2)
        .toArray();
      assert.deepStrictEqual(result, [2, 4, 6]);
    });

    test("with index parameter", () => {
      const result = Enumerable.create(["a", "b", "c"])
        .select((x, i) => `${x}${i}`)
        .toArray();
      assert.deepStrictEqual(result, ["a0", "b1", "c2"]);
    });

    test("type conversion", () => {
      const result = Enumerable.create([1, 2, 3])
        .select((x) => x.toString())
        .toArray();
      assert.deepStrictEqual(result, ["1", "2", "3"]);
    });

    test("object transformation", () => {
      const source = [{ value: 1 }, { value: 2 }];
      const result = Enumerable.create(source)
        .select((x) => x.value)
        .toArray();
      assert.deepStrictEqual(result, [1, 2]);
    });

    test("empty source", () => {
      const result = Enumerable.create([])
        .select((x) => x)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("chaining operations", () => {
      const result = Enumerable.create([1, 2, 3, 4])
        .select((x) => x * 2)
        .where((x) => x > 4)
        .toArray();
      assert.deepStrictEqual(result, [6, 8]);
    });

    test("throws with null selector", () => {
      assert.throws(
        () => Enumerable.create([1]).select(null as never),
        InvalidArgumentException,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3])
          .select((x) => x * 2)
          .toArray(),
        [2, 4, 6],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(["hello", "2", "world"])
          .select((x) => (x === "hello" || x === "world" ? x : ""))
          .toArray(),
        ["hello", "", "world"],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(["1", "2", "3"])
          .select((num) => Number.parseInt(num, undefined))
          .toArray(),
        [1, 2, 3],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([2, 1, 0])
          .select((x, index) => index as number)
          .toArray(),
        [0, 1, 2],
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 3]).select((x) => x * 2);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("complex", async function () {
      const e = await AsyncEnumerable.create([1, 2, 3])
        .select((x) => x * 2)
        .where((x) => x > 4)
        .select((x) => x / 2)
        .toArray();
      assert.deepStrictEqual(e, [3]);
    });
    test("basic number transformation", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .select((x) => x * 2)
        .toArray();
      assert.deepStrictEqual(result, [2, 4, 6]);
    });

    test("with index parameter", async () => {
      const result = await AsyncEnumerable.create(["a", "b", "c"])
        .select((x, i) => `${x}${i}`)
        .toArray();
      assert.deepStrictEqual(result, ["a0", "b1", "c2"]);
    });

    test("type conversion", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .select((x) => x.toString())
        .toArray();
      assert.deepStrictEqual(result, ["1", "2", "3"]);
    });

    test("object transformation", async () => {
      const source = [{ value: 1 }, { value: 2 }];
      const result = await AsyncEnumerable.create(source)
        .select((x) => x.value)
        .toArray();
      assert.deepStrictEqual(result, [1, 2]);
    });

    test("empty source", async () => {
      const result = await AsyncEnumerable.create([])
        .select((x) => x)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("chaining operations", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3, 4])
        .select((x) => x * 2)
        .where((x) => x > 4)
        .toArray();
      assert.deepStrictEqual(result, [6, 8]);
    });

    test("throws with null selector", () => {
      assert.throws(
        () => AsyncEnumerable.create([1]).select(null as never),
        InvalidArgumentException,
      );
    });
  });
  describe("AsyncEnumerable async", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3])
          .select(async (x) => Promise.resolve(x * 2))
          .toArray(),
        [2, 4, 6],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(["hello", "2", "world"])
          .select(async (x) =>
            Promise.resolve(x === "hello" || x === "world" ? x : ""),
          )
          .toArray(),
        ["hello", "", "world"],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(["1", "2", "3"])
          .select(async (num) =>
            Promise.resolve(Number.parseInt(num, undefined)),
          )
          .toArray(),
        [1, 2, 3],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([2, 1, 0])
          .select(async (x, index) => Promise.resolve(index as number))
          .toArray(),
        [0, 1, 2],
      );
    });
    test("async with promises", async () => {
      const result = await AsyncEnumerable.create([
        Promise.resolve(1),
        Promise.resolve(2),
      ])
        .select(async (x) => (await x) * 2)
        .toArray();
      assert.deepStrictEqual(result, [2, 4]);
    });
  });
});
