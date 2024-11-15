import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("asEnumerable", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      const e = Enumerable.asEnumerable([1, 2]);
      assert.ok(e instanceof Enumerable);
      assert.deepStrictEqual(e.toArray(), [1, 2]);
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2]);
      assert.ok(e instanceof EnumerableAsync);
      assert.deepStrictEqual(await e.toArray(), [1, 2]);
    });
  });
});
