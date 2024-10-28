import { Enumerable, EnumerableAsync, Interfaces } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("thenByDescending", function () {
  class Comparer extends Intl.Collator implements Interfaces.ICompareTo<string> {
    CompareTo = (x: string, y?: string) => super.compare(x, y as string);
  }

  const fruits = ["apPLe", "baNanA", "apple", "APple", "orange", "BAnana", "ORANGE", "apPLE"];
  const result = ["apPLe", "apple", "APple", "apPLE", "orange", "ORANGE", "baNanA", "BAnana"];
  describe("Enumerable", function () {
    test("basic", function () {
      const e = Enumerable.asEnumerable(fruits)
        .orderBy((fruit) => fruit.length)
        .thenByDescending((fruit) => fruit, new Comparer(undefined, { sensitivity: "base" }));
      assert.deepStrictEqual(e.toArray(), result);
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable(fruits)
        .orderBy((fruit) => fruit.length)
        .thenByDescending((fruit) => fruit, new Comparer(undefined, { sensitivity: "base" }));
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      const e = EnumerableAsync.asEnumerableAsync(fruits)
        .orderBy((fruit) => fruit.length)
        .thenByDescending((fruit) => fruit, new Comparer(undefined, { sensitivity: "base" }));
      assert.deepStrictEqual(await e.toArray(), result);
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync(fruits)
        .orderBy((fruit) => fruit.length)
        .thenByDescending((fruit) => fruit, new Comparer(undefined, { sensitivity: "base" }));
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
  describe("EnumerableAsync async", function () {
    test("basic", async function () {
      const e = EnumerableAsync.asEnumerableAsync(fruits)
        .orderBy(async (fruit) => Promise.resolve(fruit.length))
        .thenByDescending(async (fruit) => Promise.resolve(fruit), new Comparer(undefined, { sensitivity: "base" }));
      assert.deepStrictEqual(await e.toArray(), result);
    });
  });
});
