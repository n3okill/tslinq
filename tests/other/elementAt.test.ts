import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("elementAt", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.asEnumerable([1, 2, 3]).elementAt(1), 2);
    });
    test("throw", function () {
      assert.throws(() => Enumerable.asEnumerable([1, 2, 3]).elementAt(-1), /'index' is out of range/);
      assert.throws(() => Enumerable.asEnumerable([1, 2, 3]).elementAt(5), /'index' is out of range/);
      assert.throws(() => Enumerable.asEnumerable([]).elementAt(0), /'index' is out of range/);
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([1, 2, 3]);
      assert.deepStrictEqual(e.elementAt(1), e.elementAt(1));
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).elementAt(1), 2);
    });
    test("throw", async function () {
      assert.rejects(EnumerableAsync.asEnumerableAsync([1, 2, 3]).elementAt(-1), /'index' is out of range/);
      assert.rejects(EnumerableAsync.asEnumerableAsync([1, 2, 3]).elementAt(5), /'index' is out of range/);
      assert.rejects(EnumerableAsync.asEnumerableAsync([]).elementAt(0), /'index' is out of range/);
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
      assert.deepStrictEqual(await e.elementAt(1), await e.elementAt(1));
    });
  });
});
