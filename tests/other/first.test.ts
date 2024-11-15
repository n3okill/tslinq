import { Enumerable, EnumerableAsync, Exceptions } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("first", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.asEnumerable([1, 2, 3]).first(), 1);
      assert.strictEqual(Enumerable.asEnumerable([1, 2, 3]).except([1]).first(), 2);
      assert.strictEqual(
        Enumerable.asEnumerable([1, 2, 3]).first((x) => x === 2),
        2,
      );
    });
    test("exceptions", function () {
      assert.throws(() => Enumerable.asEnumerable([]).first(), Exceptions.ThrowNoElementsException);
      assert.throws(
        () => Enumerable.asEnumerable([1, 2, 3]).first((x) => x === 4),
        Exceptions.ThrowNoElementsSatisfyCondition,
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([1, 2, 3]);
      assert.deepStrictEqual(e.first(), e.first());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).first(), 1);
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).except([1]).first(), 2);
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).first((x) => x === 2), 2);
    });
    test("exceptions", async function () {
      assert.rejects(EnumerableAsync.asEnumerableAsync([]).first(), Exceptions.ThrowNoElementsException);
      assert.rejects(
        EnumerableAsync.asEnumerableAsync([1, 2, 3]).first((x) => x === 4),
        Exceptions.ThrowNoElementsSatisfyCondition,
      );
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
      assert.deepStrictEqual(await e.first(), await e.first());
    });
  });
  describe("EnumerableAsync async predicate", function () {
    test("basic", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).first(), 1);
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).except([1]).first(), 2);
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2, 3]).first(async (x) => Promise.resolve(x === 2)),
        2,
      );
    });
    test("exceptions", async function () {
      assert.rejects(EnumerableAsync.asEnumerableAsync([]).first(), Exceptions.ThrowNoElementsException);
      assert.rejects(
        EnumerableAsync.asEnumerableAsync([1, 2, 3]).first(async (x) => Promise.resolve(x === 4)),
        Exceptions.ThrowNoElementsSatisfyCondition,
      );
    });
  });
});
