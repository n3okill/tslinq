import {
  AsyncEnumerable,
  Enumerable,
  NoElementsException,
  NoElementsSatisfyCondition,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("first", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.create([1, 2, 3]).first(), 1);
      assert.strictEqual(Enumerable.create([1, 2, 3]).except([1]).first(), 2);
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).first((x) => x === 2),
        2,
      );
    });
    test("exceptions", function () {
      assert.throws(() => Enumerable.create([]).first(), NoElementsException);
      assert.throws(
        () => Enumerable.create([1, 2, 3]).first((x) => x === 4),
        NoElementsSatisfyCondition,
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2, 3]);
      assert.deepStrictEqual(e.first(), e.first());
    });
    test("with all elements satisfying condition", function () {
      assert.strictEqual(
        Enumerable.create([2, 2, 2]).first((x) => x === 2),
        2,
      );
    });
    test("many elements first is null", () => {
      const source = [null, -10, 2, 4, 3, 0, 2];
      assert.strictEqual(Enumerable.create(source).first(), null);
    });

    test("many elements first is not null", () => {
      const source = [19, null, -10, 2, 4, 3, 0, 2];
      assert.strictEqual(Enumerable.create(source).first(), 19);
    });

    test("empty not list", () => {
      function* emptySource<T>(): Generator<T> {
        yield* [];
      }

      assert.throws(
        () => Enumerable.create(emptySource<number>()).first(),
        NoElementsException,
      );
      assert.throws(
        () => Enumerable.create(emptySource<string>()).first(),
        NoElementsException,
      );
    });

    test("one element not list", () => {
      const source = Enumerable.range(-5, 1);
      assert.strictEqual(source.first(), -5);
    });

    test("many elements not list", () => {
      const source = Enumerable.range(3, 10);
      assert.strictEqual(source.first(), 3);
    });

    test("empty source with predicate", () => {
      const source: Array<number> = [];
      assert.throws(
        () => Enumerable.create(source).first(() => true),
        NoElementsException,
      );
      assert.throws(
        () => Enumerable.create(source).first(() => false),
        NoElementsException,
      );
    });

    test("one element true predicate", () => {
      const source = [4];
      const predicate = (x: number) => x % 2 === 0;
      assert.strictEqual(Enumerable.create(source).first(predicate), 4);
    });

    test("many elements predicate false for all", () => {
      const source = [9, 5, 1, 3, 17, 21];
      const predicate = (x: number) => x % 2 === 0;
      assert.throws(
        () => Enumerable.create(source).first(predicate),
        NoElementsSatisfyCondition,
      );
    });

    test("predicate true only for last", () => {
      const source = [9, 5, 1, 3, 17, 21, 50];
      const predicate = (x: number) => x % 2 === 0;
      assert.strictEqual(Enumerable.create(source).first(predicate), 50);
    });

    test("predicate true for some", () => {
      const source = [3, 7, 10, 7, 9, 2, 11, 17, 13, 8];
      const predicate = (x: number) => x % 2 === 0;
      assert.strictEqual(Enumerable.create(source).first(predicate), 10);
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.strictEqual(await AsyncEnumerable.create([1, 2, 3]).first(), 1);
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).except([1]).first(),
        2,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).first((x) => x === 2),
        2,
      );
    });
    test("exceptions", async function () {
      await assert.rejects(
        AsyncEnumerable.create([]).first(),
        NoElementsException,
      );
      await assert.rejects(
        AsyncEnumerable.create([1, 2, 3]).first((x) => x === 4),
        NoElementsSatisfyCondition,
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 3]);
      assert.deepStrictEqual(await e.first(), await e.first());
    });
    test("with all elements satisfying condition", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([2, 2, 2]).first((x) => x === 2),
        2,
      );
    });
    test("many elements first is null", async () => {
      const source = [null, -10, 2, 4, 3, 0, 2];
      assert.strictEqual(await AsyncEnumerable.create(source).first(), null);
    });

    test("many elements first is not null", async () => {
      const source = [19, null, -10, 2, 4, 3, 0, 2];
      assert.strictEqual(await AsyncEnumerable.create(source).first(), 19);
    });

    test("empty not list", async () => {
      function* emptySource<T>(): Generator<T> {
        yield* [];
      }

      await assert.rejects(
        AsyncEnumerable.create(emptySource<number>()).first(),
        NoElementsException,
      );
      await assert.rejects(
        AsyncEnumerable.create(emptySource<string>()).first(),
        NoElementsException,
      );
    });

    test("one element not list", async () => {
      const source = AsyncEnumerable.range(-5, 1);
      assert.strictEqual(await source.first(), -5);
    });

    test("many elements not list", async () => {
      const source = AsyncEnumerable.range(3, 10);
      assert.strictEqual(await source.first(), 3);
    });

    test("empty source with predicate", async () => {
      const source: Array<number> = [];
      await assert.rejects(
        AsyncEnumerable.create(source).first(() => true),
        NoElementsException,
      );
      await assert.rejects(
        AsyncEnumerable.create(source).first(() => false),
        NoElementsException,
      );
    });

    test("one element true predicate", async () => {
      const source = [4];
      const predicate = (x: number) => x % 2 === 0;
      assert.strictEqual(
        await AsyncEnumerable.create(source).first(predicate),
        4,
      );
    });

    test("many elements predicate false for all", async () => {
      const source = [9, 5, 1, 3, 17, 21];
      const predicate = (x: number) => x % 2 === 0;
      await assert.rejects(
        AsyncEnumerable.create(source).first(predicate),
        NoElementsSatisfyCondition,
      );
    });

    test("predicate true only for last", async () => {
      const source = [9, 5, 1, 3, 17, 21, 50];
      const predicate = (x: number) => x % 2 === 0;
      assert.strictEqual(
        await AsyncEnumerable.create(source).first(predicate),
        50,
      );
    });

    test("predicate true for some", async () => {
      const source = [3, 7, 10, 7, 9, 2, 11, 17, 13, 8];
      const predicate = (x: number) => x % 2 === 0;
      assert.strictEqual(
        await AsyncEnumerable.create(source).first(predicate),
        10,
      );
    });
  });
  describe("AsyncEnumerable async predicate", function () {
    test("basic", async function () {
      assert.strictEqual(await AsyncEnumerable.create([1, 2, 3]).first(), 1);
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).except([1]).first(),
        2,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).first(async (x) =>
          Promise.resolve(x === 2),
        ),
        2,
      );
    });
    test("exceptions", async function () {
      await assert.rejects(
        AsyncEnumerable.create([]).first(),
        NoElementsException,
      );
      await assert.rejects(
        AsyncEnumerable.create([1, 2, 3]).first(async (x) =>
          Promise.resolve(x === 4),
        ),
        NoElementsSatisfyCondition,
      );
    });
    test("with all elements satisfying condition", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([2, 2, 2]).first(async (x) =>
          Promise.resolve(x === 2),
        ),
        2,
      );
    });
  });
});
