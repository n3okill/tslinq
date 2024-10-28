import { Enumerable, EnumerableAsync, Exceptions } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("last", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.asEnumerable([1, 2, 3]).last(), 3);
      assert.strictEqual(Enumerable.asEnumerable([1, 2, 3]).except([3]).last(), 2);
      assert.strictEqual(
        Enumerable.asEnumerable([1, 2, 3]).last((x) => x === 2),
        2,
      );
    });
    test("exception", function () {
      assert.throws(() => Enumerable.asEnumerable([]).last(), Exceptions.ThrowNoElementsException);
      assert.throws(() => Enumerable.asEnumerable([]).last((x) => x > 2), Exceptions.ThrowNoElementsException);
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([1, 2, 3]);
      assert.deepStrictEqual(e.last(), e.last());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).last(), 3);
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).except([3]).last(), 2);
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).last((x) => x === 2), 2);
    });
    test("exception", async function () {
      assert.rejects(EnumerableAsync.asEnumerableAsync([]).last(), Exceptions.ThrowNoElementsException);
      assert.rejects(
        EnumerableAsync.asEnumerableAsync([]).last((x) => x > 2),
        Exceptions.ThrowNoElementsException,
      );
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
      assert.deepStrictEqual(await e.last(), await e.last());
    });
  });
  describe("EnumerableAsync async predicate", function () {
    test("basic", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).last(), 3);
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).except([3]).last(), 2);
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2, 3]).last(async (x) => Promise.resolve(x === 2)),
        2,
      );
    });
    test("exception", async function () {
      assert.rejects(EnumerableAsync.asEnumerableAsync([]).last(), Exceptions.ThrowNoElementsException);
      assert.rejects(
        EnumerableAsync.asEnumerableAsync([]).last(async (x) => Promise.resolve(x > 2)),
        Exceptions.ThrowNoElementsException,
      );
    });
  });
});
