import { Enumerable, EnumerableAsync, Exceptions } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("singleOrDefault", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.asEnumerable([1]).singleOrDefault(), 1);
      assert.strictEqual(
        Enumerable.asEnumerable([1, 2, 3]).singleOrDefault((x) => x === 2),
        2,
      );
      assert.strictEqual(
        Enumerable.asEnumerable([1, 2]).singleOrDefault((x) => x === 3),
        0,
      );
      assert.strictEqual(Enumerable.asEnumerable([]).singleOrDefault(), undefined);
    });
    test("exception", function () {
      assert.throws(
        () => Enumerable.asEnumerable([1, 2]).singleOrDefault(),
        Exceptions.ThrowMoreThanOneElementSatisfiesCondition,
      );
    });
    test("defaultValue", function () {
      const defaultValue = 1000;
      assert.strictEqual(
        Enumerable.asEnumerable<number>([]).singleOrDefault(() => true, defaultValue),
        defaultValue,
      );
      assert.strictEqual(
        Enumerable.asEnumerable([1, 2, 3]).singleOrDefault((x) => x > 5, defaultValue),
        defaultValue,
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([1]);
      assert.deepStrictEqual(e.singleOrDefault(), e.singleOrDefault());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1]).singleOrDefault(), 1);
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).singleOrDefault((x) => x === 2), 2);
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2]).singleOrDefault((x) => x === 3), 0);
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([]).singleOrDefault(), undefined);
    });
    test("exception", async function () {
      assert.rejects(
        EnumerableAsync.asEnumerableAsync([1, 2]).singleOrDefault(),
        Exceptions.ThrowMoreThanOneElementSatisfiesCondition,
      );
    });
    test("defaultValue", async function () {
      const defaultValue = 1000;
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync<number>([]).singleOrDefault(() => true, defaultValue),
        defaultValue,
      );
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2, 3]).singleOrDefault((x) => x > 5, defaultValue),
        defaultValue,
      );
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1]);
      assert.deepStrictEqual(await e.singleOrDefault(), await e.singleOrDefault());
    });
  });
  describe("EnumerableAsync async predicate", function () {
    test("basic", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1]).singleOrDefault(), 1);
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2, 3]).singleOrDefault(async (x) => Promise.resolve(x === 2)),
        2,
      );
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2]).singleOrDefault(async (x) => Promise.resolve(x === 3)),
        0,
      );
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([]).singleOrDefault(), undefined);
    });
    test("exception", async function () {
      assert.rejects(
        EnumerableAsync.asEnumerableAsync([1, 2]).singleOrDefault(),
        Exceptions.ThrowMoreThanOneElementSatisfiesCondition,
      );
    });
    test("defaultValue", async function () {
      const defaultValue = 1000;
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync<number>([]).singleOrDefault(() => true, defaultValue),
        defaultValue,
      );
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2, 3]).singleOrDefault((x) => x > 5, defaultValue),
        defaultValue,
      );
    });
  });
});
