import {
  AsyncEnumerable,
  Enumerable,
  MoreThanOneElementSatisfiesCondition,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("singleOrDefault", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.create([1]).singleOrDefault(0), 1);
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).singleOrDefault(0, (x) => x === 2),
        2,
      );
      assert.strictEqual(
        Enumerable.create([1, 2]).singleOrDefault(0, (x) => x === 3),
        0,
      );
      assert.strictEqual(
        Enumerable.create([]).singleOrDefault(undefined as never),
        undefined,
      );
    });
    test("exception", function () {
      assert.throws(
        () => Enumerable.create([1, 2, 1]).singleOrDefault(0),
        MoreThanOneElementSatisfiesCondition,
      );
    });
    test("defaultValue", function () {
      const defaultValue = 1000;
      assert.strictEqual(
        Enumerable.create<number>([]).singleOrDefault(defaultValue, () => true),
        defaultValue,
      );
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).singleOrDefault(
          defaultValue,
          (x) => x > 5,
        ),
        defaultValue,
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1]);
      assert.deepStrictEqual(e.singleOrDefault(0), e.singleOrDefault(0));
    });
    test("complex objects with default", () => {
      const objects = Enumerable.create([
        { id: 1, value: "a" },
        { id: 2, value: "b" },
      ]);
      const defaultObj = { id: 0, value: "default" };

      assert.deepStrictEqual(
        objects.singleOrDefault(defaultObj, (x) => x.value === "c"),
        defaultObj,
      );
    });
    test("with null/undefined predicates", () => {
      const collection = Enumerable.create([null, undefined, 1]);
      assert.strictEqual(
        collection.singleOrDefault(0, (x) => x === null),
        null,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([1]).singleOrDefault(0),
        1,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).singleOrDefault(
          0,
          (x) => x === 2,
        ),
        2,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2]).singleOrDefault(0, (x) => x === 3),
        0,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([]).singleOrDefault(undefined as never),
        undefined,
      );
    });
    test("exception", async function () {
      await assert.rejects(
        AsyncEnumerable.create([1, 2]).singleOrDefault(0),
        MoreThanOneElementSatisfiesCondition,
      );
    });
    test("defaultValue", async function () {
      const defaultValue = 1000;
      assert.strictEqual(
        await AsyncEnumerable.create<number>([]).singleOrDefault(
          defaultValue,
          () => true,
        ),
        defaultValue,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).singleOrDefault(
          defaultValue,
          (x) => x > 5,
        ),
        defaultValue,
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1]);
      assert.deepStrictEqual(
        await e.singleOrDefault(0),
        await e.singleOrDefault(0),
      );
    });
    test("async error handling", async () => {
      const errorEnum = AsyncEnumerable.create(
        (async function* () {
          yield 1;
          throw new Error("Iterator error");
        })(),
      );
      const result = await errorEnum.singleOrDefault(0);
      assert.strictEqual(result, 0);
    });

    test("async with mixed types", async () => {
      const mixed = AsyncEnumerable.create(["1", 2, true]);
      assert.strictEqual(
        await mixed.singleOrDefault("default", (x) => typeof x === "boolean"),
        true,
      );
    });

    test("async with concurrent operations", async () => {
      const enum1 = AsyncEnumerable.create([1]);
      const enum2 = AsyncEnumerable.create([2]);
      const results = await Promise.all([
        enum1.singleOrDefault(0),
        enum2.singleOrDefault(0),
      ]);
      assert.deepStrictEqual(results, [1, 2]);
    });
  });
  describe("AsyncEnumerable async predicate", function () {
    test("basic", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([1]).singleOrDefault(0),
        1,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).singleOrDefault(0, async (x) =>
          Promise.resolve(x === 2),
        ),
        2,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2]).singleOrDefault(0, async (x) =>
          Promise.resolve(x === 3),
        ),
        0,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([]).singleOrDefault(undefined as never),
        undefined,
      );
    });
    test("exception", async function () {
      await assert.rejects(
        AsyncEnumerable.create([1, 2]).singleOrDefault(0),
        MoreThanOneElementSatisfiesCondition,
      );
    });
    test("defaultValue", async function () {
      const defaultValue = 1000;
      assert.strictEqual(
        await AsyncEnumerable.create<number>([]).singleOrDefault(
          defaultValue,
          () => true,
        ),
        defaultValue,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).singleOrDefault(
          defaultValue,
          (x) => x > 5,
        ),
        defaultValue,
      );
    });
  });
});
