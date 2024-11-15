import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("firstOrDefault", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.asEnumerable([1, 2, 3]).firstOrDefault(), 1);
      assert.strictEqual(Enumerable.asEnumerable([]).firstOrDefault(), undefined);
      assert.strictEqual(
        Enumerable.asEnumerable([1, 2, 3]).firstOrDefault((x) => x === 5),
        0,
      );
    });
    test("defaultValue", function () {
      const defaultValue = 1000;
      assert.strictEqual(
        Enumerable.asEnumerable<number>([]).firstOrDefault(() => true, defaultValue),
        defaultValue,
      );
      assert.strictEqual(
        Enumerable.asEnumerable([1, 2, 3]).firstOrDefault((x) => x > 5, defaultValue),
        defaultValue,
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([1, 2, 3]);
      assert.strictEqual(e.firstOrDefault(), e.firstOrDefault());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).firstOrDefault(), 1);
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([]).firstOrDefault(), undefined);
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).firstOrDefault((x) => x === 5), 0);
    });
    test("defaultValue", async function () {
      const defaultValue = 1000;
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync<number>([]).firstOrDefault(() => true, defaultValue),
        defaultValue,
      );
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2, 3]).firstOrDefault((x) => x > 5, defaultValue),
        defaultValue,
      );
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
      assert.strictEqual(await e.first(), await e.first());
    });
  });
  describe("EnumerableAsync async predicate", function () {
    test("basic", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).firstOrDefault(), 1);
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([]).firstOrDefault(), undefined);
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2, 3]).firstOrDefault(async (x) => Promise.resolve(x === 5)),
        0,
      );
    });
    test("defaultValue", async function () {
      const defaultValue = 1000;
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync<number>([]).firstOrDefault(() => true, defaultValue),
        defaultValue,
      );
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([1, 2, 3]).firstOrDefault((x) => x > 5, defaultValue),
        defaultValue,
      );
    });
  });
});
