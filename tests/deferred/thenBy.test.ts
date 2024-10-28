import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("thenBy", function () {
  const fruits = ["grape", "passionfruit", "banana", "mango", "orange", "raspberry", "apple", "blueberry"];
  const result = ["apple", "grape", "mango", "banana", "orange", "blueberry", "raspberry", "passionfruit"];
  describe("Enumerable", function () {
    test("basic", function () {
      const e = Enumerable.asEnumerable(fruits)
        .orderBy((fruit) => fruit.length)
        .thenBy((fruit) => fruit);
      assert.deepStrictEqual(e.toArray(), result);
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable(fruits)
        .orderBy((fruit) => fruit.length)
        .thenBy((fruit) => fruit);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      const e = EnumerableAsync.asEnumerableAsync(fruits)
        .orderBy((fruit) => fruit.length)
        .thenBy((fruit) => fruit);
      assert.deepStrictEqual(await e.toArray(), result);
    });
  });
  describe("EnumerableAsync async", function () {
    test("basic", async function () {
      const e = EnumerableAsync.asEnumerableAsync(fruits)
        .orderBy(async (fruit) => Promise.resolve(fruit.length))
        .thenBy(async (fruit) => Promise.resolve(fruit));
      assert.deepStrictEqual(await e.toArray(), result);
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync(fruits)
        .orderBy(async (fruit) => Promise.resolve(fruit.length))
        .thenBy(async (fruit) => Promise.resolve(fruit));
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
});
