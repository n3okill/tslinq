import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("Count", function () {
  describe("Enumerable", function () {
    test("simple", function () {
      assert.strictEqual(Enumerable.create([0]).count(), 1);
      assert.strictEqual(Enumerable.create([0, 1, 2]).count(), 3);
    });
    test("predicate", function () {
      assert.strictEqual(
        Enumerable.create([0, 1, 2]).count((x: number) => x === 1),
        1,
      );
      assert.strictEqual(
        Enumerable.create([true, true, false]).count((x) => x),
        2,
      );
      assert.strictEqual(
        Enumerable.create([true, true, false]).count((x) => !x),
        1,
      );
    });
    test("Empty array to be zero", function () {
      assert.strictEqual(Enumerable.create([]).count(), 0);
    });
    test("repeated calls", function () {
      const e = Enumerable.create([0]);
      assert.strictEqual(e.count(), e.count());
    });
    test("null and undefined values", () => {
      const withNull = Enumerable.create([null, undefined, 1, null]);
      assert.strictEqual(withNull.count(), 4);
      assert.strictEqual(
        withNull.count((x) => x === null),
        2,
      );
      assert.strictEqual(
        withNull.count((x) => x === undefined),
        1,
      );
    });
    test("contains with custom equality", () => {
      const objects = Enumerable.create([{ id: 1 }, { id: 2 }]);
      assert.strictEqual(
        objects.contains(
          { id: 1 },
          {
            equals: (a, b) => a?.id === b?.id,
          },
        ),
        true,
      );
    });

    test("predicate throwing error", () => {
      const numbers = Enumerable.create([1, 2, 3]);
      assert.throws(() => {
        numbers.count(() => {
          throw new Error("Test error");
        });
      }, /Test error/);
    });

    test("mixed type collection", () => {
      const mixed = Enumerable.create([1, "2", true, null]);
      assert.strictEqual(mixed.count(), 4);
      assert.strictEqual(
        mixed.count((x) => typeof x === "number"),
        1,
      );
    });

    test("with type coercion in predicate", () => {
      const numbers = Enumerable.create(["1", 2, "3"]);
      assert.strictEqual(
        numbers.count((x) => Number(x) > 1),
        2,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("simple", async function () {
      assert.strictEqual(await AsyncEnumerable.create([0]).count(), 1);
      assert.strictEqual(await AsyncEnumerable.create([0, 1, 2]).count(), 3);
    });
    test("predicate", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([0, 1, 2]).count((x: number) => x === 1),
        1,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([true, true, false]).count((x) => x),
        2,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([true, true, false]).count((x) => !x),
        1,
      );
    });
    test("Empty array to be zero", async function () {
      assert.strictEqual(await AsyncEnumerable.create([]).count(), 0);
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([0]);
      assert.strictEqual(await e.count(), await e.count());
    });
    test("async iterator throwing error", async () => {
      const errorIterator = AsyncEnumerable.create(
        (async function* () {
          yield 1;
          throw new Error("Iterator error");
        })(),
      );
      await assert.rejects(
        async () => await errorIterator.count(),
        /Iterator error/,
      );
    });

    test("async predicate timing", async () => {
      const numbers = AsyncEnumerable.create([1, 2, 3]);
      const start = Date.now();
      await numbers.count(async (x) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return x > 1;
      });
      const duration = Date.now() - start;
      assert.ok(duration >= 30);
    });

    test("async with delayed source", async () => {
      const delayed = AsyncEnumerable.create(
        (async function* () {
          await new Promise((resolve) => setTimeout(resolve, 10));
          yield 1;
          yield 2;
        })(),
      );
      assert.strictEqual(await delayed.count(), 2);
    });
    test("async count with error handling", async () => {
      const errorSource = AsyncEnumerable.create(
        (async function* () {
          yield 1;
          throw new Error("Test error");
        })(),
      );
      await assert.rejects(() => errorSource.count());
    });

    test("async with rejected promises", async () => {
      const numbers = AsyncEnumerable.create([1, 2, 3]);
      await assert.rejects(
        async () =>
          await numbers.count(async () =>
            Promise.reject(new Error("Predicate error")),
          ),
        /Predicate error/,
      );
    });
  });
  describe("AsyncEnumerable async predicate", function () {
    test("simple", async function () {
      assert.strictEqual(await AsyncEnumerable.create([0]).count(), 1);
      assert.strictEqual(await AsyncEnumerable.create([0, 1, 2]).count(), 3);
    });
    test("predicate", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([0, 1, 2]).count(async (x: number) =>
          Promise.resolve(x === 1),
        ),
        1,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([true, true, false]).count(async (x) =>
          Promise.resolve(x),
        ),
        2,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([true, true, false]).count(async (x) =>
          Promise.resolve(!x),
        ),
        1,
      );
    });
    test("Empty array to be zero", async function () {
      assert.strictEqual(await AsyncEnumerable.create([]).count(), 0);
    });
  });
});
