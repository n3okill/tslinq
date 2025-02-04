import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("ofType", function () {
  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
  class Test {}
  const array = [
    "str",
    "str2",
    1,
    2,
    3,
    {},
    true,
    new Number(1),
    new String("a"),
    new Test(),
    undefined,
    null,
  ];
  describe("Enumerable", function () {
    test("basic", function () {
      const e = Enumerable.create(array);
      assert.deepStrictEqual(e.ofType("string").toArray(), ["str", "str2"]);
      assert.deepStrictEqual(e.ofType("number").toArray(), [1, 2, 3]);
      assert.deepStrictEqual(e.ofType("object").toArray(), [
        {},
        new Number(1),
        new String("a"),
        new Test(),
        null,
      ]);
      assert.strictEqual(e.ofType("boolean").first(), true);
      assert.strictEqual(e.ofType("undefined").first(), undefined);
      assert.strictEqual(e.ofType(null).first(), null);
      assert.strictEqual(e.ofType(Number).first(), array[7]);
      assert.strictEqual(e.ofType(String).first(), array[8]);
      assert.strictEqual(e.ofType(Test).first(), array[9]);
    });
    test("repeated calls", function () {
      const e = Enumerable.create(array).ofType("string");
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      const e = AsyncEnumerable.create(array);
      assert.deepStrictEqual(await e.ofType("string").toArray(), [
        "str",
        "str2",
      ]);
      assert.deepStrictEqual(await e.ofType("number").toArray(), [1, 2, 3]);
      assert.deepStrictEqual(await e.ofType("object").toArray(), [
        {},
        new Number(1),
        new String("a"),
        new Test(),
        null,
      ]);
      assert.deepStrictEqual(await e.ofType("boolean").toArray(), [true]);
      assert.strictEqual(await e.ofType(Number).first(), array[7]);
      assert.strictEqual(await e.ofType(String).first(), array[8]);
      assert.strictEqual(await e.ofType(Test).first(), array[9]);
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create(array).ofType("string");
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
});
