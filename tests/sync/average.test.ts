import {
  AsyncEnumerable,
  Enumerable,
  NoElementsException,
  NotNumberException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("Average", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.create([1, 2, 3]).average(), 2);
      assert.strictEqual(
        Enumerable.create(["a", "bc", "def"]).average((x: string) => x.length),
        2,
      );
      assert.strictEqual(Enumerable.create([0, 10]).average(), 5);
    });
    test("EmptyThrowsException", function () {
      assert.throws(() => Enumerable.create([]).average(), NoElementsException);
      assert.throws(
        () => Enumerable.create([] as Array<number>).average((x) => x * 10),
        NoElementsException,
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2, 3]);
      assert.deepStrictEqual(e.average(), e.average());
    });
    test("decimal numbers", function () {
      assert.strictEqual(Enumerable.create([1.5, 2.5, 3.5]).average(), 2.5);
    });

    test("negative numbers", function () {
      assert.strictEqual(Enumerable.create([-1, -2, -3]).average(), -2);
    });

    test("mixed positive negative", function () {
      assert.strictEqual(Enumerable.create([-2, 0, 2]).average(), 0);
    });

    test("single element", function () {
      assert.strictEqual(Enumerable.create([42]).average(), 42);
    });

    test("large numbers", function () {
      assert.strictEqual(
        Enumerable.create([
          Number.MAX_SAFE_INTEGER,
          Number.MAX_SAFE_INTEGER,
        ]).average(),
        Number.MAX_SAFE_INTEGER,
      );
    });

    test("custom selector with multiplication", function () {
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).average((x) => x * 2),
        4,
      );
    });
    test("overflow handling", () => {
      const maxValue = Number.MAX_SAFE_INTEGER;
      assert.strictEqual(
        Enumerable.create([maxValue, maxValue, maxValue]).average(),
        maxValue,
      );
    });
    test("with selector", () => {
      const source = [
        { name: "Tim", num: 10 },
        { name: "John", num: -10 },
        { name: "Bob", num: 40 },
      ];
      assert.strictEqual(
        Enumerable.create(source).average((x) => x.num),
        13.333333333333334,
      );
    });
    test("with null values in selector", () => {
      const source = [
        { name: "Tim", num: null },
        { name: "John", num: 40 },
        { name: "Bob", num: null },
      ];
      assert.strictEqual(
        Enumerable.create(source).average((x) => (x.num === null ? 0 : x.num)),
        13.333333333333334,
      );
    });
    test("throws on not a number", () => {
      assert.throws(
        () => Enumerable.create(["a", "b", "c"]).average(),
        NotNumberException,
      );
    });
    test("throws nullable numbers", () => {
      assert.throws(
        () => Enumerable.create([null, 1, null, 2, 3, null]).average(),
        NotNumberException,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.strictEqual(await AsyncEnumerable.create([1, 2, 3]).average(), 2);
      assert.strictEqual(
        await AsyncEnumerable.create(["a", "bc", "def"]).average(
          (x: string) => x.length,
        ),
        2,
      );
      assert.strictEqual(await AsyncEnumerable.create([0, 10]).average(), 5);
    });
    test("EmptyThrowsException", async function () {
      await assert.rejects(
        AsyncEnumerable.create([]).average(),
        NoElementsException,
      );
      await assert.rejects(
        AsyncEnumerable.create([] as Array<number>).average((x) => x * 10),
        NoElementsException,
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 3]);
      assert.deepStrictEqual(await e.average(), await e.average());
    });
    test("decimal numbers", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([1.5, 2.5, 3.5]).average(),
        2.5,
      );
    });

    test("negative numbers", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([-1, -2, -3]).average(),
        -2,
      );
    });

    test("mixed positive negative", async function () {
      assert.strictEqual(await AsyncEnumerable.create([-2, 0, 2]).average(), 0);
    });

    test("single element", async function () {
      assert.strictEqual(await AsyncEnumerable.create([42]).average(), 42);
    });

    test("large numbers", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([
          Number.MAX_SAFE_INTEGER,
          Number.MAX_SAFE_INTEGER,
        ]).average(),
        Number.MAX_SAFE_INTEGER,
      );
    });
    test("custom selector with multiplication", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).average((x) => x * 2),
        4,
      );
    });
    test("overflow handling", async () => {
      const maxValue = Number.MAX_SAFE_INTEGER;
      assert.strictEqual(
        await AsyncEnumerable.create([maxValue, maxValue, maxValue]).average(),
        maxValue,
      );
    });
    test("with selector", async () => {
      const source = [
        { name: "Tim", num: 10 },
        { name: "John", num: -10 },
        { name: "Bob", num: 40 },
      ];
      assert.strictEqual(
        await AsyncEnumerable.create(source).average((x) => x.num),
        13.333333333333334,
      );
    });
    test("with async selector", async () => {
      const source = [
        { name: "Tim", num: Promise.resolve(10) },
        { name: "John", num: -10 },
        { name: "Bob", num: Promise.resolve(40) },
      ];
      assert.strictEqual(
        await AsyncEnumerable.create(source).average(async (x) => {
          const num = await x.num;
          return typeof num === "number" ? num : -10;
        }),
        13.333333333333334,
      );
    });
    test("with null values in selector", async () => {
      const source = [
        { name: "Tim", num: null },
        { name: "John", num: 40 },
        { name: "Bob", num: null },
      ];
      assert.strictEqual(
        await AsyncEnumerable.create(source).average((x) =>
          x.num === null ? 0 : x.num,
        ),
        13.333333333333334,
      );
    });
    test("throws on not a number", async () => {
      await assert.rejects(
        AsyncEnumerable.create(["a", "b", "c"]).average(),
        NotNumberException,
      );
    });
    test("throws nullable numbers", async () => {
      await assert.rejects(
        AsyncEnumerable.create([null, 1, null, 2, 3, null]).average(),
        NotNumberException,
      );
    });
  });
  describe("AsyncEnumerable async selector", function () {
    test("basic", async function () {
      assert.strictEqual(await AsyncEnumerable.create([1, 2, 3]).average(), 2);
      assert.strictEqual(
        await AsyncEnumerable.create(["a", "bc", "def"]).average(
          async (x: string) => Promise.resolve(x.length),
        ),
        2,
      );
      assert.strictEqual(await AsyncEnumerable.create([0, 10]).average(), 5);
    });
    test("EmptyThrowsException", async function () {
      await assert.rejects(
        async () => AsyncEnumerable.create([]).average(),
        NoElementsException,
      );
      await assert.rejects(
        AsyncEnumerable.create([] as Array<number>).average(async (x) =>
          Promise.resolve(x * 10),
        ),
        NoElementsException,
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 3]);
      assert.deepStrictEqual(await e.average(), await e.average());
    });
    test("decimal numbers with async selector", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([1.5, 2.5, 3.5]).average(async (x) =>
          Promise.resolve(x * 2),
        ),
        5,
      );
    });

    test("selector returning promises", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).average(async (x) => {
          await new Promise((resolve) => setTimeout(resolve, 1));
          return x * 2;
        }),
        4,
      );
    });

    test("error in async selector", async function () {
      await assert.rejects(
        AsyncEnumerable.create([1, 2, 3]).average(async () => {
          throw new Error("Test error");
        }),
      );
    });
  });
});
