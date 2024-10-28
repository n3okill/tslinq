import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("Any", function () {
  const evenArray = [0, 2, 4, 6, 8, 10];
  describe("Enumerable", function () {
    test("No predicate", function () {
      assert.ok(Enumerable.asEnumerable(evenArray).any());
    });
    test("True", function () {
      assert.ok(Enumerable.asEnumerable(evenArray).any((x: number) => x > 5));
    });
    test("False", function () {
      assert.ok(!Enumerable.asEnumerable(evenArray).any((x: number) => x > 10));
    });
    test("repeated calls", function () {
      const c = Enumerable.asEnumerable(evenArray);
      assert.deepStrictEqual(
        c.any((x: number) => x % 2 !== 0),
        c.any((x: number) => x % 2 !== 0),
      );
    });
    test("Empty", function () {
      const array = Enumerable.asEnumerable([]);

      assert.ok(!array.any());
      assert.ok(!array.any(() => true));
      assert.ok(!array.any(() => false));
    });
    test("AnyExists", function () {
      const array = Enumerable.asEnumerable([1, 2]);

      assert.ok(array.any());
      assert.ok(array.any(() => true));
      assert.ok(!array.any(() => false));

      assert.ok(array.any((x) => x === 1));
      assert.ok(array.any((x) => x === 2));
    });
    test("EmptyPredicate", function () {
      assert.ok(!Enumerable.asEnumerable([]).any((x) => x === 0));
    });
  });
  describe("EnumerableAsync", function () {
    test("No predicate", async function () {
      assert.ok(await EnumerableAsync.asEnumerableAsync(evenArray).any());
    });
    test("True", async function () {
      assert.ok(await EnumerableAsync.asEnumerableAsync(evenArray).any((x: number) => x > 5));
    });
    test("False", async function () {
      assert.ok(!(await EnumerableAsync.asEnumerableAsync(evenArray).any((x: number) => x > 10)));
    });
    test("repeated calls", async function () {
      const c = EnumerableAsync.asEnumerableAsync(evenArray);
      assert.deepStrictEqual(await c.any((x: number) => x % 2 !== 0), await c.any((x: number) => x % 2 !== 0));
    });
    test("Empty", async function () {
      const a = EnumerableAsync.asEnumerableAsync([]);

      assert.ok(!(await a.any()));
      assert.ok(!(await a.any(() => true)));
      assert.ok(!(await a.any(() => false)));
    });
    test("AnyExists", async function () {
      const a = EnumerableAsync.asEnumerableAsync([1, 2]);

      assert.ok(await a.any());
      assert.ok(await a.any(() => true));
      assert.ok(!(await a.any(() => false)));

      assert.ok(await a.any((x) => x === 1));
      assert.ok(await a.any((x) => x === 2));
    });
    test("EmptyPredicate", async function () {
      assert.ok(!(await EnumerableAsync.asEnumerableAsync([]).any((x) => x === 0)));
    });
  });
  describe("EnumerableAsync async predicate", function () {
    test("No predicate", async function () {
      assert.ok(await EnumerableAsync.asEnumerableAsync(evenArray).any());
    });
    test("True", async function () {
      assert.ok(await EnumerableAsync.asEnumerableAsync(evenArray).any(async (x: number) => Promise.resolve(x > 5)));
    });
    test("False", async function () {
      assert.ok(
        !(await EnumerableAsync.asEnumerableAsync(evenArray).any(async (x: number) => Promise.resolve(x > 10))),
      );
    });
    test("repeated calls", async function () {
      const c = EnumerableAsync.asEnumerableAsync(evenArray);
      assert.deepStrictEqual(
        await c.any((x: number) => x % 2 !== 0),
        await c.any(async (x: number) => Promise.resolve(x % 2 !== 0)),
      );
    });
    test("Empty", async function () {
      const a = EnumerableAsync.asEnumerableAsync([]);

      assert.ok(!(await a.any()));
      assert.ok(!(await a.any(async () => Promise.resolve(true))));
      assert.ok(!(await a.any(async () => Promise.resolve(false))));
    });
    test("AnyExists", async function () {
      const a = EnumerableAsync.asEnumerableAsync([1, 2]);

      assert.ok(await a.any());
      assert.ok(await a.any(async () => Promise.resolve(true)));
      assert.ok(!(await a.any(async () => Promise.resolve(false))));

      assert.ok(await a.any(async (x) => Promise.resolve(x === 1)));
      assert.ok(await a.any(async (x) => Promise.resolve(x === 2)));
    });
    test("EmptyPredicate", async function () {
      assert.ok(!(await EnumerableAsync.asEnumerableAsync([]).any(async (x) => Promise.resolve(x === 0))));
    });
  });
});
