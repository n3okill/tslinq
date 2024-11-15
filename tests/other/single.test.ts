import { Enumerable, EnumerableAsync, Exceptions } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("single", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.asEnumerable([1]).single(), 1);
      assert.strictEqual(
        Enumerable.asEnumerable([1, 2, 3]).single((x) => x === 2),
        2,
      );
    });
    test("exceptions", function () {
      assert.throws(() => Enumerable.asEnumerable([1, 2]).single());
      assert.throws(() => Enumerable.asEnumerable([]).single());
      assert.throws(() => Enumerable.asEnumerable([1, 2]).single((x) => x === 3));
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([1]);
      assert.deepStrictEqual(e.single(), e.single());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1]).single(), 1);
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).single((x) => x === 2), 2);
    });
    test("exceptions", async function () {
      assert.rejects(
        EnumerableAsync.asEnumerableAsync([1, 2]).single(),
        Exceptions.ThrowMoreThanOneElementSatisfiesCondition,
      );
      assert.rejects(EnumerableAsync.asEnumerableAsync([]).single(), Exceptions.ThrowNoElementsException);
      assert.rejects(
        EnumerableAsync.asEnumerableAsync([1, 2]).single((x) => x === 3),
        Exceptions.ThrowNoElementsSatisfyCondition,
      );
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1]);
      assert.deepStrictEqual(await e.single(), await e.single());
    });
  });
  describe("EnumerableAsync async predicate", function () {
    test("basic", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1]).single(), 1);
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2, 3]).single(async (x) => Promise.resolve(x === 2)),
        2,
      );
    });
    test("exceptions", async function () {
      assert.rejects(
        EnumerableAsync.asEnumerableAsync([1, 2]).single(),
        Exceptions.ThrowMoreThanOneElementSatisfiesCondition,
      );
      assert.rejects(EnumerableAsync.asEnumerableAsync([]).single(), Exceptions.ThrowNoElementsException);
      assert.rejects(
        EnumerableAsync.asEnumerableAsync([1, 2]).single(async (x) => Promise.resolve(x === 3)),
        Exceptions.ThrowNoElementsSatisfyCondition,
      );
    });
  });
});
