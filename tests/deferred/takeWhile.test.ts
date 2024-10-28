import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("takeWhile", function () {
  const fruits = ["apple", "banana", "mango", "orange", "passionfruit", "grape"];
  const fruits2 = ["apple", "passionfruit", "banana", "mango", "orange", "blueberry", "grape", "strawberry"];
  describe("Enumerable", function () {
    test("basic", function () {
      const e = Enumerable.asEnumerable(fruits).takeWhile((fruit) => fruit !== "orange");
      assert.deepStrictEqual(e.toArray(), ["apple", "banana", "mango"]);
      const e2 = Enumerable.asEnumerable(fruits2).takeWhile((fruit, index) => fruit.length >= index);
      assert.deepStrictEqual(e2.toArray(), ["apple", "passionfruit", "banana", "mango", "orange", "blueberry"]);
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable(fruits).takeWhile((fruit) => fruit !== "orange");
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      const e = EnumerableAsync.asEnumerableAsync(fruits).takeWhile((fruit) => fruit !== "orange");
      assert.deepStrictEqual(await e.toArray(), ["apple", "banana", "mango"]);
      const e2 = EnumerableAsync.asEnumerableAsync(fruits2).takeWhile((fruit, index) => fruit.length >= index);
      assert.deepStrictEqual(await e2.toArray(), ["apple", "passionfruit", "banana", "mango", "orange", "blueberry"]);
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync(fruits).takeWhile((fruit) => fruit !== "orange");
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
  describe("EnumerableAsync async", function () {
    test("basic", async function () {
      const e = EnumerableAsync.asEnumerableAsync(fruits).takeWhile(async (fruit) =>
        Promise.resolve(fruit !== "orange"),
      );
      assert.deepStrictEqual(await e.toArray(), ["apple", "banana", "mango"]);
      const e2 = EnumerableAsync.asEnumerableAsync(fruits2).takeWhile(async (fruit, index) =>
        Promise.resolve(fruit.length >= index),
      );
      assert.deepStrictEqual(await e2.toArray(), ["apple", "passionfruit", "banana", "mango", "orange", "blueberry"]);
    });
  });
});
