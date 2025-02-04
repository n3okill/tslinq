import {
  AsyncEnumerable,
  Enumerable,
  NotIterableException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("isDisjointFrom", function () {
  describe("Enumerable", function () {
    test("should return true for two empty iterable instances", () => {
      assert.strictEqual(Enumerable.create([]).isDisjointFrom([]), true);
    });

    test("should return true for disjoint iterable instances", () => {
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).isDisjointFrom([4, 5, 6]),
        true,
      );
    });

    test("should return false for overlapping iterable instances", () => {
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).isDisjointFrom([3, 4, 5]),
        false,
      );
    });

    test("should return true for a single element in one not in the other", () => {
      assert.strictEqual(Enumerable.create([1]).isDisjointFrom([2]), true);
    });

    test("should return false for identical iterable", () => {
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).isDisjointFrom([1, 2, 3]),
        false,
      );
    });
    test("perfect squares", () => {
      const primes = Enumerable.create([2, 3, 5, 7, 11, 13, 17, 19]);
      const squares = new Set([1, 4, 9, 16]);
      assert.strictEqual(
        Enumerable.create(primes).isDisjointFrom(squares),
        true,
      );
    });
    test("composite squares", () => {
      const composites = new Set([4, 6, 8, 9, 10, 12, 14, 15, 16, 18]);
      const squares = new Set([1, 4, 9, 16]);
      assert.strictEqual(
        Enumerable.create(composites).isDisjointFrom(squares),
        false,
      );
    });
    test("should throw error for non-iterable instance", () => {
      assert.throws(
        () => Enumerable.create([1, 2, 3]).isDisjointFrom(1 as never),
        NotIterableException,
      );
    });
    test("complex test", () => {
      const complex = [
        "a",
        1,
        true,
        { a: 1, b: 2 },
        [1, 2, 3],
        new Set([1, 2]),
        new Map([
          [1, 2],
          [3, 4],
        ]),
        new Date(),
        new RegExp("a"),
        new Error("a"),
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        function () {},
        // eslint-disable-next-line @typescript-eslint/no-extraneous-class
        class {},
        new Uint8Array([1, 2, 3]),
      ];
      const complex2 = [
        "b",
        2,
        false,
        { c: 3, d: 4 },
        [4, 5, 6],
        new Set([4, 5]),
        new Map([
          [5, 6],
          [7, 8],
        ]),
        new Date(1000),
        new RegExp("b"),
        new Error("b"),
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        function () {},
        // eslint-disable-next-line @typescript-eslint/no-extraneous-class
        class {},
        new Uint8Array([4, 5, 6]),
      ];
      assert.strictEqual(
        Enumerable.create(complex).isDisjointFrom(complex2 as never),
        true,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("should return true for two empty async iterable instances", async () => {
      assert.strictEqual(
        await AsyncEnumerable.create([]).isDisjointFrom([]),
        true,
      );
    });

    test("should return true for disjoint async iterable instances", async () => {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).isDisjointFrom([4, 5, 6]),
        true,
      );
    });

    test("should return false for overlapping async iterable instances", async () => {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).isDisjointFrom([3, 4, 5]),
        false,
      );
    });

    test("should return true for a single element in one not in the other", async () => {
      assert.strictEqual(
        await AsyncEnumerable.create([1]).isDisjointFrom([2]),
        true,
      );
    });

    test("should return false for identical async iterable", async () => {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).isDisjointFrom([1, 2, 3]),
        false,
      );
    });

    test("perfect squares", async () => {
      const primes = AsyncEnumerable.create([2, 3, 5, 7, 11, 13, 17, 19]);
      const squares = new Set([1, 4, 9, 16]);
      assert.strictEqual(
        await AsyncEnumerable.create(primes).isDisjointFrom(squares),
        true,
      );
    });
    test("composite squares", async () => {
      const composites = new Set([4, 6, 8, 9, 10, 12, 14, 15, 16, 18]);
      const squares = new Set([1, 4, 9, 16]);
      assert.strictEqual(
        await AsyncEnumerable.create(composites).isDisjointFrom(squares),
        false,
      );
    });
    test("should throw error for non-iterable instance", async () => {
      await assert.rejects(
        () => AsyncEnumerable.create([1, 2, 3]).isDisjointFrom(1 as never),
        NotIterableException,
      );
    });

    test("complex test", async () => {
      const complex = [
        "a",
        1,
        true,
        { a: 1, b: 2 },
        [1, 2, 3],
        new Set([1, 2]),
        new Map([
          [1, 2],
          [3, 4],
        ]),
        new Date(),
        new RegExp("a"),
        new Error("a"),
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        function () {},
        // eslint-disable-next-line @typescript-eslint/no-extraneous-class
        class {},
        new Uint8Array([1, 2, 3]),
      ];
      const complex2 = [
        "b",
        2,
        false,
        { c: 3, d: 4 },
        [4, 5, 6],
        new Set([4, 5]),
        new Map([
          [5, 6],
          [7, 8],
        ]),
        new Date(1000),
        new RegExp("b"),
        new Error("b"),
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        function () {},
        // eslint-disable-next-line @typescript-eslint/no-extraneous-class
        class {},
        new Uint8Array([4, 5, 6]),
      ];
      assert.strictEqual(
        await AsyncEnumerable.create(complex).isDisjointFrom(complex2 as never),
        true,
      );
    });
  });
});
