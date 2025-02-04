import {
  AsyncEnumerable,
  Enumerable,
  InvalidArgumentException,
  OutOfRangeException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("repeat", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(Enumerable.repeat(1, 3).toArray(), [1, 1, 1]);
      assert.deepStrictEqual(Enumerable.repeat({}, 1).reverse().toArray(), [
        {},
      ]);
    });
    test("repeats number", () => {
      const result = Enumerable.repeat(42, 3).toArray();
      assert.deepStrictEqual(result, [42, 42, 42]);
    });

    test("repeats string", () => {
      const result = Enumerable.repeat("test", 2).toArray();
      assert.deepStrictEqual(result, ["test", "test"]);
    });

    test("repeats object", () => {
      const obj = { id: 1 };
      const result = Enumerable.repeat(obj, 2).toArray();
      assert.deepStrictEqual(result, [obj, obj]);
    });

    test("zero count returns empty", () => {
      const result = Enumerable.repeat(1, 0).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("can chain with where", () => {
      const result = Enumerable.repeat(1, 5)
        .where((_, i) => i % 2 === 0)
        .toArray();
      assert.deepStrictEqual(result, [1, 1, 1]);
    });
    describe("validation", () => {
      test("throws on invalid count type", () => {
        assert.throws(
          () => Enumerable.repeat(1, "3" as never),
          InvalidArgumentException,
        );
      });

      test("throws on negative count", () => {
        assert.throws(() => Enumerable.repeat(1, -1), OutOfRangeException);
      });
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.repeat(1, 3).toArray(),
        [1, 1, 1],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.repeat({}, 1).reverse().toArray(),
        [{}],
      );
    });
    test("repeats number", async () => {
      const result = await AsyncEnumerable.repeat(42, 3).toArray();
      assert.deepStrictEqual(result, [42, 42, 42]);
    });

    test("repeats string", async () => {
      const result = await AsyncEnumerable.repeat("test", 2).toArray();
      assert.deepStrictEqual(result, ["test", "test"]);
    });

    test("repeats object", async () => {
      const obj = { id: 1 };
      const result = await AsyncEnumerable.repeat(obj, 2).toArray();
      assert.deepStrictEqual(result, [obj, obj]);
    });

    test("zero count returns empty", async () => {
      const result = await AsyncEnumerable.repeat(1, 0).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("can chain with where", async () => {
      const result = await AsyncEnumerable.repeat(1, 5)
        .where((_, i) => i % 2 === 0)
        .toArray();
      assert.deepStrictEqual(result, [1, 1, 1]);
    });
    describe("validation", () => {
      test("throws on invalid count type", () => {
        assert.throws(
          () => AsyncEnumerable.repeat(1, "3" as never),
          InvalidArgumentException,
        );
      });

      test("throws on negative count", () => {
        assert.throws(() => AsyncEnumerable.repeat(1, -1), OutOfRangeException);
      });
    });
  });
});
