import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("ofType", function () {
  const array = ["str", "str2", 1, 2, 3, {}, true, new Number(1)];
  describe("Enumerable", function () {
    test("basic", function () {
      const e = Enumerable.asEnumerable(array);
      assert.deepStrictEqual(e.ofType("string").toArray(), ["str", "str2"]);
      assert.deepStrictEqual(e.ofType("number").toArray(), [1, 2, 3]);
      assert.deepStrictEqual(e.ofType("object").toArray(), [{}, new Number(1)]);
      assert.deepStrictEqual(e.ofType("boolean").toArray(), [true]);
      assert.deepStrictEqual(e.ofType(Number).toArray(), [new Number(1)]);
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable(array).ofType("string");
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      const e = EnumerableAsync.asEnumerableAsync(array);
      assert.deepStrictEqual(await e.ofType("string").toArray(), ["str", "str2"]);
      assert.deepStrictEqual(await e.ofType("number").toArray(), [1, 2, 3]);
      assert.deepStrictEqual(await e.ofType("object").toArray(), [{}, new Number(1)]);
      assert.deepStrictEqual(await e.ofType("boolean").toArray(), [true]);
      assert.deepStrictEqual(await e.ofType(Number).toArray(), [new Number(1)]);
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync(array).ofType("string");
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
});
