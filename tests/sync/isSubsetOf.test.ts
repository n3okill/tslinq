import {
  AsyncEnumerable,
  Enumerable,
  NotIterableException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("isSubsetOf", function () {
  describe("Enumerable", function () {
    test("should return true for two empty enumerable instances", () => {
      assert.strictEqual(Enumerable.create([]).isSubsetOf([]), true);
    });
    test("should return true for a subset of an enumerable", () => {
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).isSubsetOf([1, 2, 3, 4, 5]),
        true,
      );
    });
    test("should return false for a non-subset of an enumerable", () => {
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).isSubsetOf([1, 2, 4, 5, 6]),
        false,
      );
    });
    test("should return true for an identical enumerable", () => {
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).isSubsetOf([1, 2, 3]),
        true,
      );
    });
    test("should return true for a subset of an identical enumerable", () => {
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).isSubsetOf([1, 2, 3, 4, 5]),
        true,
      );
    });
    test("should return false for a non-subset of an identical enumerable", () => {
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).isSubsetOf([1, 2, 4, 5, 6]),
        false,
      );
    });
    test("should throw error for non-iterable instance", () => {
      assert.throws(
        () => Enumerable.create([1, 2, 3]).isSubsetOf(1 as never),
        NotIterableException,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("should return true for two empty async enumerable instances", async () => {
      assert.strictEqual(await AsyncEnumerable.create([]).isSubsetOf([]), true);
    });
    test("should return true for a subset of an async enumerable", async () => {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).isSubsetOf([1, 2, 3, 4, 5]),
        true,
      );
    });
    test("should return false for a non-subset of an async enumerable", async () => {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).isSubsetOf([1, 2, 4, 5, 6]),
        false,
      );
    });
    test("should return true for an identical async enumerable", async () => {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).isSubsetOf([1, 2, 3]),
        true,
      );
    });
    test("should return true for a subset of an identical async enumerable", async () => {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).isSubsetOf([1, 2, 3, 4, 5]),
        true,
      );
    });
    test("should return false for a non-subset of an identical async enumerable", async () => {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).isSubsetOf([1, 2, 4, 5, 6]),
        false,
      );
    });
    test("should throw error for non-iterable instance", async () => {
      await assert.rejects(
        () => AsyncEnumerable.create([1, 2, 3]).isSubsetOf(1 as never),
        NotIterableException,
      );
    });
  });
});
