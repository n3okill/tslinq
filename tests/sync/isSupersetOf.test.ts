import {
  AsyncEnumerable,
  Enumerable,
  NotIterableException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("isSupersetOf", function () {
  describe("Enumerable", function () {
    test("should return true for two empty enumerable instances", () => {
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).isSupersetOf([1, 2, 3]),
        true,
      );
    });
    test("should return true for a superset of an enumerable", () => {
      assert.strictEqual(
        Enumerable.create([1, 2, 3, 4, 5]).isSupersetOf([1, 2, 3]),
        true,
      );
    });
    test("should return false for a non-superset of an enumerable", () => {
      assert.strictEqual(
        Enumerable.create([1, 2, 3, 5, 6]).isSupersetOf([1, 2, 4]),
        false,
      );
    });
    test("should return true for a superset of an enumerable with duplicates", () => {
      assert.strictEqual(
        Enumerable.create([1, 2, 3, 3, 4, 5]).isSupersetOf([1, 2, 3]),
        true,
      );
    });
    test("should return false for a non-superset of an enumerable with duplicates", () => {
      assert.strictEqual(
        Enumerable.create([1, 2, 3, 3, 5]).isSupersetOf([1, 2, 4]),
        false,
      );
    });
    test("should throw NotIterableException if second is not iterable", () => {
      assert.throws(
        () => Enumerable.create([1, 2, 3]).isSupersetOf({} as never),
        NotIterableException,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("should return true for two empty async enumerable instances", async () => {
      assert.strictEqual(
        await AsyncEnumerable.create([]).isSupersetOf([]),
        true,
      );
    });
    test("should return true for a superset of an async enumerable", async () => {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3, 4, 5]).isSupersetOf([1, 2, 3]),
        true,
      );
    });
    test("should return false for a non-superset of an async enumerable", async () => {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3, 5, 6]).isSupersetOf([1, 2, 4]),
        false,
      );
    });
    test("should return true for a superset of an async enumerable with duplicates", async () => {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3, 3, 4, 5]).isSupersetOf([
          1, 2, 3,
        ]),
        true,
      );
    });
    test("should return false for a non-superset of an async enumerable with duplicates", async () => {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3, 3, 5]).isSupersetOf([1, 2, 4]),
        false,
      );
    });
    test("should throw NotIterableException if second is not iterable", async () => {
      await assert.rejects(
        AsyncEnumerable.create([1, 2, 3]).isSupersetOf({} as never),
        NotIterableException,
      );
    });
  });
});
