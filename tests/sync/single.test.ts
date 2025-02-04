import {
  AsyncEnumerable,
  Enumerable,
  MoreThanOneElementSatisfiesCondition,
  NoElementsException,
  NoElementsSatisfyCondition,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("single", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.create([1]).single(), 1);
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).single((x) => x === 2),
        2,
      );
    });
    test("exceptions", function () {
      assert.throws(
        () => Enumerable.create([1, 2]).single(),
        MoreThanOneElementSatisfiesCondition,
      );
      assert.throws(() => Enumerable.create([]).single(), NoElementsException);
      assert.throws(
        () => Enumerable.create([1, 2]).single((x) => x === 3),
        NoElementsSatisfyCondition,
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1]);
      assert.deepStrictEqual(e.single(), e.single());
    });
    test("performance with large collection", () => {
      const large = Enumerable.create(
        Array.from({ length: 100000 }, (_, i) => i),
      );
      const start = performance.now();
      assert.ok(large.single((x) => x === 99999) === 99999);
      assert.ok(performance.now() - start < 100);
    });

    test("with null and undefined values", () => {
      assert.strictEqual(Enumerable.create([null]).single(), null);
      assert.strictEqual(Enumerable.create([undefined]).single(), undefined);
    });

    test("complex predicate conditions", () => {
      const objects = [
        { id: 1, value: "a" },
        { id: 2, value: "b" },
        { id: 3, value: "a" },
      ];
      assert.throws(
        () => Enumerable.create(objects).single((x) => x.value === "a"),
        MoreThanOneElementSatisfiesCondition,
      );
    });

    test("type coercion behavior", () => {
      const mixed = Enumerable.create(["1", 1, true]);
      assert.strictEqual(
        mixed.single((x) => x === "1"),
        "1",
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.strictEqual(await AsyncEnumerable.create([1]).single(), 1);
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).single((x) => x === 2),
        2,
      );
    });
    test("exceptions", async function () {
      await assert.rejects(
        AsyncEnumerable.create([1, 2]).single(),
        MoreThanOneElementSatisfiesCondition,
      );
      await assert.rejects(
        AsyncEnumerable.create([]).single(),
        NoElementsException,
      );
      await assert.rejects(
        AsyncEnumerable.create([1, 2]).single((x) => x === 3),
        NoElementsSatisfyCondition,
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1]);
      assert.deepStrictEqual(await e.single(), await e.single());
    });
    test("async with delayed predicate", async () => {
      const delayed = AsyncEnumerable.create([1, 2, 3]);
      const start = performance.now();
      await delayed.single(async (x) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return x === 2;
      });
      assert.ok(performance.now() - start >= 10);
    });

    test("async error propagation", async () => {
      const errorEnum = AsyncEnumerable.create(
        (async function* () {
          yield 1;
          throw new Error("Iterator error");
        })(),
      );
      await assert.rejects(() => errorEnum.single());
    });
  });
  describe("AsyncEnumerable async predicate", function () {
    test("basic", async function () {
      assert.strictEqual(await AsyncEnumerable.create([1]).single(), 1);
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).single(async (x) =>
          Promise.resolve(x === 2),
        ),
        2,
      );
    });
    test("exceptions", async function () {
      await assert.rejects(
        AsyncEnumerable.create([1, 2]).single(),
        MoreThanOneElementSatisfiesCondition,
      );
      await assert.rejects(
        AsyncEnumerable.create([]).single(),
        NoElementsException,
      );
      await assert.rejects(
        AsyncEnumerable.create([1, 2]).single(async (x) =>
          Promise.resolve(x === 3),
        ),
        NoElementsSatisfyCondition,
      );
    });
  });
});
