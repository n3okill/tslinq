import {
  AsyncEnumerable,
  Enumerable,
  InvalidArgumentException,
  OutOfRangeException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("reverse", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(Enumerable.range(1, 3).toArray(), [1, 2, 3]);
      assert.deepStrictEqual(Enumerable.range("a", 3).toArray(), [
        "a",
        "b",
        "c",
      ]);
    });
    describe("number sequences", () => {
      test("generates sequence from zero", () => {
        const result = Enumerable.range(0, 3).toArray();
        assert.deepStrictEqual(result, [0, 1, 2]);
      });

      test("generates sequence from positive number", () => {
        const result = Enumerable.range(5, 3).toArray();
        assert.deepStrictEqual(result, [5, 6, 7]);
      });

      test("generates sequence from negative number", () => {
        const result = Enumerable.range(-2, 4).toArray();
        assert.deepStrictEqual(result, [-2, -1, 0, 1]);
      });

      test("count zero returns empty", () => {
        const result = Enumerable.range(1, 0).toArray();
        assert.deepStrictEqual(result, []);
      });
    });

    describe("string sequences", () => {
      test("generates sequence from a", () => {
        const result = Enumerable.range("a", 3).toArray();
        assert.deepStrictEqual(result, ["a", "b", "c"]);
      });

      test("generates sequence from Z", () => {
        const result = Enumerable.range("Z", 3).toArray();
        assert.deepStrictEqual(result, ["Z", "[", "\\"]);
      });
    });

    describe("validation", () => {
      test("throws on invalid start element type", () => {
        assert.throws(
          () => Enumerable.range({} as never, 3),
          InvalidArgumentException,
        );
      });

      test("throws on invalid count type", () => {
        assert.throws(
          () => Enumerable.range(1, "3" as never),
          InvalidArgumentException,
        );
      });

      test("throws on negative count", () => {
        assert.throws(() => Enumerable.range(1, -1), OutOfRangeException);
      });
    });

    describe("chaining operations", () => {
      test("can be used with where", () => {
        const result = Enumerable.range(0, 5)
          .where((x) => x % 2 === 0)
          .toArray();
        assert.deepStrictEqual(result, [0, 2, 4]);
      });

      test("can be used with select", () => {
        const result = Enumerable.range(1, 3)
          .select((x) => x * 2)
          .toArray();
        assert.deepStrictEqual(result, [2, 4, 6]);
      });
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.range(1, 3).toArray(),
        [1, 2, 3],
      );
      assert.deepStrictEqual(await AsyncEnumerable.range("a", 3).toArray(), [
        "a",
        "b",
        "c",
      ]);
    });
    describe("number sequences", () => {
      test("generates sequence from zero", async () => {
        const result = await AsyncEnumerable.range(0, 3).toArray();
        assert.deepStrictEqual(result, [0, 1, 2]);
      });

      test("generates sequence from positive number", async () => {
        const result = await AsyncEnumerable.range(5, 3).toArray();
        assert.deepStrictEqual(result, [5, 6, 7]);
      });

      test("generates sequence from negative number", async () => {
        const result = await AsyncEnumerable.range(-2, 4).toArray();
        assert.deepStrictEqual(result, [-2, -1, 0, 1]);
      });

      test("count zero returns empty", async () => {
        const result = await AsyncEnumerable.range(1, 0).toArray();
        assert.deepStrictEqual(result, []);
      });
    });

    describe("string sequences", () => {
      test("generates sequence from a", async () => {
        const result = await AsyncEnumerable.range("a", 3).toArray();
        assert.deepStrictEqual(result, ["a", "b", "c"]);
      });

      test("generates sequence from Z", async () => {
        const result = await AsyncEnumerable.range("Z", 3).toArray();
        assert.deepStrictEqual(result, ["Z", "[", "\\"]);
      });
    });

    describe("validation", () => {
      test("throws on invalid start element type", () => {
        assert.throws(
          () => Enumerable.range({} as never, 3),
          InvalidArgumentException,
        );
      });

      test("throws on invalid count type", () => {
        assert.throws(
          () => Enumerable.range(1, "3" as never),
          InvalidArgumentException,
        );
      });

      test("throws on negative count", () => {
        assert.throws(() => Enumerable.range(1, -1), OutOfRangeException);
      });
    });

    describe("chaining operations", () => {
      test("can be used with where", async () => {
        const result = await AsyncEnumerable.range(0, 5)
          .where((x) => x % 2 === 0)
          .toArray();
        assert.deepStrictEqual(result, [0, 2, 4]);
      });

      test("can be used with select", async () => {
        const result = await AsyncEnumerable.range(1, 3)
          .select((x) => x * 2)
          .toArray();
        assert.deepStrictEqual(result, [2, 4, 6]);
      });
    });
  });
});
