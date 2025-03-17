import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("Any", function () {
  const evenArray = [0, 2, 4, 6, 8, 10];
  describe("Enumerable", function () {
    test("No predicate", function () {
      assert.ok(Enumerable.create(evenArray).any());
      assert.ok(Enumerable.create(new Set(evenArray)).any());
      assert.ok(Enumerable.create(new Map(evenArray.map((x) => [x, x]))).any());
    });
    test("True", function () {
      assert.ok(Enumerable.create(evenArray).any((x: number) => x > 5));
      assert.ok(
        Enumerable.create(new Set(evenArray)).any((x: number) => x > 5),
      );
      assert.ok(
        Enumerable.create(new Map(evenArray.map((x) => [x, x]))).any(
          (x: [number, number]) => x[1] > 5,
        ),
      );
    });
    test("False", function () {
      assert.ok(!Enumerable.create(evenArray).any((x: number) => x > 10));
    });
    test("repeated calls", function () {
      const c = Enumerable.create(evenArray);
      assert.deepStrictEqual(
        c.any((x: number) => x % 2 !== 0),
        c.any((x: number) => x % 2 !== 0),
      );
    });
    test("Empty", function () {
      const array = Enumerable.create([]);

      assert.ok(!array.any());
      assert.ok(!array.any(() => true));
      assert.ok(!array.any(() => false));
    });
    test("AnyExists", function () {
      const array = Enumerable.create([1, 2]);

      assert.ok(array.any());
      assert.ok(array.any(() => true));
      assert.ok(!array.any(() => false));

      assert.ok(array.any((x) => x === 1));
      assert.ok(array.any((x) => x === 2));
    });
    test("EmptyPredicate", function () {
      assert.ok(!Enumerable.create([]).any((x) => x === 0));
    });
    test("null values in array", function () {
      const array = Enumerable.create([null, undefined, 1]);
      assert.ok(array.any());
      assert.ok(array.any((x) => x === null));
      assert.ok(array.any((x) => x === undefined));
    });
    test("throws in predicate", function () {
      const array = Enumerable.create([1, 2, 3]);
      assert.throws(() => {
        array.any(() => {
          throw new Error("Test error");
        });
      });
    });
  });
  describe("AsyncEnumerable", function () {
    test("No predicate", async function () {
      assert.ok(await AsyncEnumerable.create(evenArray).any());
    });
    test("True", async function () {
      assert.ok(
        await AsyncEnumerable.create(evenArray).any((x: number) => x > 5),
      );
    });
    test("False", async function () {
      assert.ok(
        !(await AsyncEnumerable.create(evenArray).any((x: number) => x > 10)),
      );
    });
    test("repeated calls", async function () {
      const c = AsyncEnumerable.create(evenArray);
      assert.deepStrictEqual(
        await c.any((x: number) => x % 2 !== 0),
        await c.any((x: number) => x % 2 !== 0),
      );
    });
    test("Empty", async function () {
      const a = AsyncEnumerable.create([]);

      assert.ok(!(await a.any()));
      assert.ok(!(await a.any(() => true)));
      assert.ok(!(await a.any(() => false)));
    });
    test("AnyExists", async function () {
      const a = AsyncEnumerable.create([1, 2]);

      assert.ok(await a.any());
      assert.ok(await a.any(() => true));
      assert.ok(!(await a.any(() => false)));

      assert.ok(await a.any((x) => x === 1));
      assert.ok(await a.any((x) => x === 2));
    });
    test("EmptyPredicate", async function () {
      assert.ok(!(await AsyncEnumerable.create([]).any((x) => x === 0)));
    });
    test("null values in array", async function () {
      const array = AsyncEnumerable.create([null, undefined, 1]);
      assert.ok(await array.any());
      assert.ok(await array.any((x) => x === null));
      assert.ok(await array.any((x) => x === undefined));
    });

    test("throws in predicate", async function () {
      const array = AsyncEnumerable.create([1, 2, 3]);
      await assert.rejects(async () => {
        await array.any(() => {
          throw new Error("Test error");
        });
      });
    });

    test("promise rejection in predicate", async function () {
      const array = AsyncEnumerable.create([1, 2, 3]);
      await assert.rejects(async () => {
        await array.any(async () =>
          Promise.reject(new Error("Test rejection")),
        );
      });
    });
    test("mixed sync/async predicates", async function () {
      const array = AsyncEnumerable.create([1, 2, 3]);
      const syncResult = await array.any((x) => x === 2);
      const asyncResult = await array.any(async (x) =>
        Promise.resolve(x === 2),
      );
      assert.strictEqual(syncResult, asyncResult);
    });
  });
  describe("AsyncEnumerable async predicate", function () {
    test("No predicate", async function () {
      assert.ok(await AsyncEnumerable.create(evenArray).any());
    });
    test("True", async function () {
      assert.ok(
        await AsyncEnumerable.create(evenArray).any(async (x: number) =>
          Promise.resolve(x > 5),
        ),
      );
    });
    test("False", async function () {
      assert.ok(
        !(await AsyncEnumerable.create(evenArray).any(async (x: number) =>
          Promise.resolve(x > 10),
        )),
      );
    });
    test("repeated calls", async function () {
      const c = AsyncEnumerable.create(evenArray);
      assert.deepStrictEqual(
        await c.any((x: number) => x % 2 !== 0),
        await c.any(async (x: number) => Promise.resolve(x % 2 !== 0)),
      );
    });
    test("Empty", async function () {
      const a = AsyncEnumerable.create([]);

      assert.ok(!(await a.any()));
      assert.ok(!(await a.any(async () => Promise.resolve(true))));
      assert.ok(!(await a.any(async () => Promise.resolve(false))));
    });
    test("AnyExists", async function () {
      const a = AsyncEnumerable.create([1, 2]);

      assert.ok(await a.any());
      assert.ok(await a.any(async () => Promise.resolve(true)));
      assert.ok(!(await a.any(async () => Promise.resolve(false))));

      assert.ok(await a.any(async (x) => Promise.resolve(x === 1)));
      assert.ok(await a.any(async (x) => Promise.resolve(x === 2)));
    });
    test("EmptyPredicate", async function () {
      assert.ok(
        !(await AsyncEnumerable.create([]).any(async (x) =>
          Promise.resolve(x === 0),
        )),
      );
    });
  });
});
