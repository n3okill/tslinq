import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("where", function () {
  const fruits = ["apple", "passionfruit", "banana", "mango", "orange", "blueberry", "grape", "strawberry"];
  const numbers = [0, 30, 20, 15, 90, 85, 40, 75];
  describe("Enumerable", function () {
    test("basic", function () {
      const e = Enumerable.asEnumerable(fruits).where((fruit) => fruit.length < 6);
      const result = ["apple", "mango", "grape"];
      assert.deepStrictEqual(e.toArray(), result);
    });
    test("index", function () {
      const e = Enumerable.asEnumerable(numbers).where((number, index) => number <= index * 10);
      const result = [0, 20, 15, 40];
      assert.deepStrictEqual(e.toArray(), result);
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable(fruits).where((fruit) => fruit.length < 6);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      const e = EnumerableAsync.asEnumerableAsync(fruits).where((fruit) => fruit.length < 6);
      const result = ["apple", "mango", "grape"];
      assert.deepStrictEqual(await e.toArray(), result);
    });
    test("index", async function () {
      const e = EnumerableAsync.asEnumerableAsync(numbers).where((number, index) => number <= index * 10);
      const result = [0, 20, 15, 40];
      assert.deepStrictEqual(await e.toArray(), result);
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync(fruits).where((fruit) => fruit.length < 6);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
  describe("EnumerableAsync async", function () {
    test("basic", async function () {
      const e = EnumerableAsync.asEnumerableAsync(fruits).where(async (fruit) => Promise.resolve(fruit.length < 6));
      const result = ["apple", "mango", "grape"];
      assert.deepStrictEqual(await e.toArray(), result);
    });
    test("index", async function () {
      const e = EnumerableAsync.asEnumerableAsync(numbers).where(async (number, index) =>
        Promise.resolve(number <= index * 10),
      );
      const result = [0, 20, 15, 40];
      assert.deepStrictEqual(await e.toArray(), result);
    });
  });
});
