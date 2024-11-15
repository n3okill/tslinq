import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("zip", function () {
  const numbers = [1, 2, 3, 4];
  const words = ["one", "two", "three"];
  const words2 = ["first", "second", "third"];
  const result1 = ["1 one", "2 two", "3 three"];
  const result2 = [
    ["one", 1],
    ["two", 2],
    ["three", 3],
  ];
  const result3 = [
    ["one", 1, "first"],
    ["two", 2, "second"],
    ["three", 3, "third"],
  ];
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(
        Enumerable.asEnumerable(numbers)
          .zip(words, (x, y) => `${x} ${y}`)
          .toArray(),
        result1,
      );
      assert.deepStrictEqual(Enumerable.asEnumerable(words).zip(numbers).toArray(), result2);
      assert.deepStrictEqual(
        Enumerable.asEnumerable(words)
          .zip(numbers, words2, (x, y, z) => [x, y, z])
          .toArray(),
        result3,
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable(numbers).zip(words, (x, y) => `${x} ${y}`);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync(numbers)
          .zip(words, (x, y) => `${x} ${y}`)
          .toArray(),
        result1,
      );
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync(words).zip(numbers).toArray(), result2);
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync(words)
          .zip(numbers, words2, (x, y, z) => [x, y, z])
          .toArray(),
        result3,
      );
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync(numbers).zip(words, (x, y) => `${x} ${y}`);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
  describe("EnumerableAsync async", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync(numbers)
          .zip(words, async (x, y) => Promise.resolve(`${x} ${y}`))
          .toArray(),
        result1,
      );
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync(words).zip(numbers).toArray(), result2);
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync(words)
          .zip(numbers, words2, async (x, y, z) => Promise.resolve([x, y, z]))
          .toArray(),
        result3,
      );
    });
  });
});
