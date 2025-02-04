import {
  AsyncEnumerable,
  Enumerable,
  NotIterableException,
} from "../../src/index.ts";
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
        Enumerable.create(numbers)
          .zip(words, (x, y) => `${x} ${y}`)
          .toArray(),
        result1,
      );
      assert.deepStrictEqual(
        Enumerable.create(words).zip(numbers).toArray(),
        result2,
      );
      assert.deepStrictEqual(
        Enumerable.create(words).zip(numbers, words2).toArray(),
        result3,
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create(numbers).zip(words, (x, y) => `${x} ${y}`);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    describe("two sequences", () => {
      test("empty sequences return empty", () => {
        const result = Enumerable.create([])
          .zip([], (x, y) => [x, y])
          .toArray();
        assert.deepStrictEqual(result, []);
      });

      test("with result selector", () => {
        const result = Enumerable.create([1, 2])
          .zip(["a", "b"], (x, y) => `${x}${y}`)
          .toArray();
        assert.deepStrictEqual(result, ["1a", "2b"]);
      });

      test("different length sequences use shortest", () => {
        const result = Enumerable.create([1, 2, 3])
          .zip(["a", "b"], (x, y) => `${x}${y}`)
          .toArray();
        assert.deepStrictEqual(result, ["1a", "2b"]);
      });
    });

    describe("three sequences", () => {
      test("basic three-way zip", () => {
        const result = Enumerable.create([1, 2])
          .zip(["a", "b"], [true, false])
          .toArray();
        assert.deepStrictEqual(result, [
          [1, "a", true],
          [2, "b", false],
        ]);
      });

      test("different length sequences use shortest", () => {
        const result = Enumerable.create([1, 2, 3])
          .zip(["a", "b"], [true])
          .toArray();
        assert.deepStrictEqual(result, [[1, "a", true]]);
      });
    });

    describe("validation", () => {
      test("throws on null second sequence", () => {
        assert.throws(
          () => Enumerable.create([1]).zip(null as never, (x) => x),
          NotIterableException,
        );
      });

      test("throws on null third sequence", () => {
        assert.throws(
          () => Enumerable.create([1]).zip([2], null as never),
          NotIterableException,
        );
      });
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create(numbers)
          .zip(words, (x, y) => `${x} ${y}`)
          .toArray(),
        result1,
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(words).zip(numbers).toArray(),
        result2,
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(words).zip(numbers, words2).toArray(),
        result3,
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create(numbers).zip(
        words,
        (x, y) => `${x} ${y}`,
      );
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    describe("two sequences", () => {
      test("empty sequences return empty", async () => {
        const result = await AsyncEnumerable.create([])
          .zip([], (x, y) => [x, y])
          .toArray();
        assert.deepStrictEqual(result, []);
      });

      test("with result selector", async () => {
        const result = await AsyncEnumerable.create([1, 2])
          .zip(["a", "b"], (x, y) => `${x}${y}`)
          .toArray();
        assert.deepStrictEqual(result, ["1a", "2b"]);
      });

      test("different length sequences use shortest", async () => {
        const result = await AsyncEnumerable.create([1, 2, 3])
          .zip(["a", "b"], (x, y) => `${x}${y}`)
          .toArray();
        assert.deepStrictEqual(result, ["1a", "2b"]);
      });
    });

    describe("three sequences", () => {
      test("basic three-way zip", async () => {
        const result = await AsyncEnumerable.create([1, 2])
          .zip(["a", "b"], [true, false])
          .toArray();
        assert.deepStrictEqual(result, [
          [1, "a", true],
          [2, "b", false],
        ]);
      });

      test("different length sequences use shortest", async () => {
        const result = await AsyncEnumerable.create([1, 2, 3])
          .zip(["a", "b"], [true])
          .toArray();
        assert.deepStrictEqual(result, [[1, "a", true]]);
      });
    });

    describe("validation", () => {
      test("throws on null second sequence", async () => {
        await assert.rejects(
          async () => AsyncEnumerable.create([1]).zip(null as never, (x) => x),
          NotIterableException,
        );
      });

      test("throws on null third sequence", async () => {
        await assert.rejects(
          async () => AsyncEnumerable.create([1]).zip([2], null as never),
          NotIterableException,
        );
      });
    });
  });
  describe("AsyncEnumerable async", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create(numbers)
          .zip(words, async (x, y) => Promise.resolve(`${x} ${y}`))
          .toArray(),
        result1,
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(words).zip(numbers).toArray(),
        result2,
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(words).zip(numbers, words2).toArray(),
        result3,
      );
    });
    test("async with promises", async () => {
      const result = await AsyncEnumerable.create([Promise.resolve(1)])
        .zip([Promise.resolve("a")], async (x, y) => `${await x}${await y}`)
        .toArray();
      assert.deepStrictEqual(result, ["1a"]);
    });
  });
});
