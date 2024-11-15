import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("Count", function () {
  describe("Enumerable", function () {
    test("simple", function () {
      assert.strictEqual(Enumerable.asEnumerable([0]).count(), 1);
      assert.strictEqual(Enumerable.asEnumerable([0, 1, 2]).count(), 3);
    });
    test("predicate", function () {
      assert.strictEqual(
        Enumerable.asEnumerable([0, 1, 2]).count((x: number) => x === 1),
        1,
      );
      assert.strictEqual(
        Enumerable.asEnumerable([true, true, false]).count((x) => x),
        2,
      );
      assert.strictEqual(
        Enumerable.asEnumerable([true, true, false]).count((x) => !x),
        1,
      );
    });
    test("Empty array to be zero", function () {
      assert.strictEqual(Enumerable.asEnumerable([]).count(), 0);
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([0]);
      assert.strictEqual(e.count(), e.count());
    });
  });
  describe("EnumerableAsync", function () {
    test("simple", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([0]).count(), 1);
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([0, 1, 2]).count(), 3);
    });
    test("predicate", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([0, 1, 2]).count((x: number) => x === 1), 1);
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([true, true, false]).count((x) => x), 2);
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([true, true, false]).count((x) => !x), 1);
    });
    test("Empty array to be zero", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([]).count(), 0);
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([0]);
      assert.strictEqual(await e.count(), await e.count());
    });
  });
  describe("EnumerableAsync async predicate", function () {
    test("simple", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([0]).count(), 1);
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([0, 1, 2]).count(), 3);
    });
    test("predicate", async function () {
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([0, 1, 2]).count(async (x: number) => Promise.resolve(x === 1)),
        1,
      );
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([true, true, false]).count(async (x) => Promise.resolve(x)),
        2,
      );
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([true, true, false]).count(async (x) => Promise.resolve(!x)),
        1,
      );
    });
    test("Empty array to be zero", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([]).count(), 0);
    });
  });
});
