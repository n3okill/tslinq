import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { AsyncEnumerable, Enumerable } from "../../src/index.ts";

describe("create", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      const e = Enumerable.create([1, 2]);
      assert.ok(e instanceof Enumerable);
      assert.deepStrictEqual(e.toArray(), [1, 2]);
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      const e = AsyncEnumerable.create([1, 2]);
      assert.ok(e instanceof AsyncEnumerable);
      assert.deepStrictEqual(await e.toArray(), [1, 2]);
    });
  });
});
