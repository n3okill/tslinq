import { Enumerable, EnumerableAsync, Exceptions } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("Average", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.asEnumerable([1, 2, 3]).average(), 2);
      assert.strictEqual(
        Enumerable.asEnumerable(["a", "bc", "def"]).average((x: string) => x.length),
        2,
      );
      assert.strictEqual(Enumerable.asEnumerable([0, 10]).average(), 5);
    });
    test("EmptyThrowsException", function () {
      assert.throws(() => Enumerable.asEnumerable([]).average(), Exceptions.ThrowNoElementsException);
      assert.throws(
        () => Enumerable.asEnumerable([] as number[]).average((x) => x * 10),
        Exceptions.ThrowNoElementsException,
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([1, 2, 3]);
      assert.deepStrictEqual(e.average(), e.average());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).average(), 2);
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync(["a", "bc", "def"]).average((x: string) => x.length),
        2,
      );
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([0, 10]).average(), 5);
    });
    test("EmptyThrowsException", async function () {
      assert.rejects(EnumerableAsync.asEnumerableAsync([]).average(), Exceptions.ThrowNoElementsException);
      assert.rejects(
        EnumerableAsync.asEnumerableAsync([] as number[]).average((x) => x * 10),
        Exceptions.ThrowNoElementsException,
      );
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
      assert.deepStrictEqual(await e.average(), await e.average());
    });
  });
  describe("EnumerableAsync async selector", function () {
    test("basic", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).average(), 2);
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync(["a", "bc", "def"]).average(async (x: string) =>
          Promise.resolve(x.length),
        ),
        2,
      );
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([0, 10]).average(), 5);
    });
    test("EmptyThrowsException", async function () {
      assert.rejects(EnumerableAsync.asEnumerableAsync([]).average(), Exceptions.ThrowNoElementsException);
      assert.rejects(
        EnumerableAsync.asEnumerableAsync([] as number[]).average(async (x) => Promise.resolve(x * 10)),
        Exceptions.ThrowNoElementsException,
      );
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
      assert.deepStrictEqual(await e.average(), await e.average());
    });
  });
});
