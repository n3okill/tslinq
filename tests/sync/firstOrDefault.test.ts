import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("firstOrDefault", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.create([1, 2, 3]).firstOrDefault(0), 1);
      assert.strictEqual(
        Enumerable.create([]).firstOrDefault(undefined as never),
        undefined,
      );
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).firstOrDefault(0, (x) => x === 5),
        0,
      );
    });
    test("defaultValue", function () {
      const defaultValue = 1000;
      assert.strictEqual(
        Enumerable.create<number>([]).firstOrDefault(defaultValue),
        defaultValue,
      );
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).firstOrDefault(defaultValue, (x) => x > 5),
        defaultValue,
      );
      assert.strictEqual(
        Enumerable.create([]).firstOrDefault(defaultValue as never),
        defaultValue,
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2, 3]);
      assert.strictEqual(e.firstOrDefault(0), e.firstOrDefault(0));
    });
    test("with all elements satisfying condition", function () {
      assert.strictEqual(
        Enumerable.create([2, 2, 2]).firstOrDefault(0, (x) => x === 2),
        2,
      );
    });
    test("one element with default", () => {
      const source = [5];
      assert.strictEqual(Enumerable.create(source).firstOrDefault(3), 5);
    });
    test("many elements first is null", () => {
      const source = [null, -10, 2, 4, 3, 0, 2];
      assert.strictEqual(Enumerable.create(source).firstOrDefault(0), null);
    });
    test("many elements first is not null", () => {
      const source = [19, null, -10, 2, 4, 3, 0, 2];
      assert.strictEqual(Enumerable.create(source).firstOrDefault(0), 19);
    });
    test("empty source different types", () => {
      function* emptySource<T>(): Generator<T> {
        yield* [];
      }

      assert.strictEqual(
        Enumerable.create(emptySource<number>()).firstOrDefault(0),
        0,
      );
      assert.strictEqual(
        Enumerable.create(emptySource<string>()).firstOrDefault(""),
        "",
      );
      assert.deepStrictEqual(
        Enumerable.create(emptySource<Date>()).firstOrDefault(new Date(0)),
        new Date(0),
      );
    });
    test("one element not list", () => {
      assert.strictEqual(Enumerable.range(-5, 1).firstOrDefault(0), -5);
    });
    test("many elements not list", () => {
      assert.strictEqual(Enumerable.range(3, 10).firstOrDefault(0), 3);
    });

    test("empty source with predicate", () => {
      const source: Array<number> = [];
      assert.strictEqual(
        Enumerable.create(source).firstOrDefault(0, () => true),
        0,
      );
      assert.strictEqual(
        Enumerable.create(source).firstOrDefault(0, () => false),
        0,
      );
    });
    test("predicate true only for last", () => {
      const source = [9, 5, 1, 3, 17, 21, 50];
      const predicate = (x: number) => x % 2 === 0;
      assert.strictEqual(
        Enumerable.create(source).firstOrDefault(0, predicate),
        50,
      );
    });
    test("predicate false for all with default", () => {
      const source = [9, 5, 1, 3, 17, 21];
      const predicate = (x: number) => x % 2 === 0;
      assert.strictEqual(
        Enumerable.create(source).firstOrDefault(5, predicate),
        5,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).firstOrDefault(0),
        1,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([]).firstOrDefault(undefined as never),
        undefined,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).firstOrDefault(
          0,
          (x) => x === 5,
        ),
        0,
      );
    });
    test("defaultValue", async function () {
      const defaultValue = 1000;
      assert.strictEqual(
        await AsyncEnumerable.create<number>([]).firstOrDefault(
          defaultValue,
          () => true,
        ),
        defaultValue,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).firstOrDefault(
          defaultValue,
          (x) => x > 5,
        ),
        defaultValue,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([]).firstOrDefault(defaultValue as never),
        defaultValue,
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 3]);
      assert.strictEqual(await e.first(), await e.first());
    });
    test("with all elements satisfying condition", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([2, 2, 2]).firstOrDefault(
          0,
          (x) => x === 2,
        ),
        2,
      );
    });
    test("one element with default", async () => {
      const source = [5];
      assert.strictEqual(
        await AsyncEnumerable.create(source).firstOrDefault(3),
        5,
      );
    });
    test("many elements first is null", async () => {
      const source = [null, -10, 2, 4, 3, 0, 2];
      assert.strictEqual(
        await AsyncEnumerable.create(source).firstOrDefault(0),
        null,
      );
    });
    test("many elements first is not null", async () => {
      const source = [19, null, -10, 2, 4, 3, 0, 2];
      assert.strictEqual(
        await AsyncEnumerable.create(source).firstOrDefault(0),
        19,
      );
    });
    test("empty source different types", async () => {
      function* emptySource<T>(): Generator<T> {
        yield* [];
      }

      assert.strictEqual(
        await AsyncEnumerable.create(emptySource<number>()).firstOrDefault(0),
        0,
      );
      assert.strictEqual(
        await AsyncEnumerable.create(emptySource<string>()).firstOrDefault(""),
        "",
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(emptySource<Date>()).firstOrDefault(
          new Date(0),
        ),
        new Date(0),
      );
    });
    test("one element not list", async () => {
      assert.strictEqual(
        await AsyncEnumerable.range(-5, 1).firstOrDefault(0),
        -5,
      );
    });
    test("many elements not list", async () => {
      assert.strictEqual(
        await AsyncEnumerable.range(3, 10).firstOrDefault(0),
        3,
      );
    });

    test("empty source with predicate", async () => {
      const source: Array<number> = [];
      assert.strictEqual(
        await AsyncEnumerable.create(source).firstOrDefault(0, () => true),
        0,
      );
      assert.strictEqual(
        await AsyncEnumerable.create(source).firstOrDefault(0, () => false),
        0,
      );
    });
    test("predicate true only for last", async () => {
      const source = [9, 5, 1, 3, 17, 21, 50];
      const predicate = (x: number) => x % 2 === 0;
      assert.strictEqual(
        await AsyncEnumerable.create(source).firstOrDefault(0, predicate),
        50,
      );
    });
    test("predicate false for all with default", async () => {
      const source = [9, 5, 1, 3, 17, 21];
      const predicate = (x: number) => x % 2 === 0;
      assert.strictEqual(
        await AsyncEnumerable.create(source).firstOrDefault(5, predicate),
        5,
      );
    });
  });
  describe("AsyncEnumerable async predicate", function () {
    test("basic", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).firstOrDefault(0),
        1,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([]).firstOrDefault(undefined as never),
        undefined,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).firstOrDefault(0, async (x) =>
          Promise.resolve(x === 5),
        ),
        0,
      );
    });
    test("defaultValue", async function () {
      const defaultValue = 1000;
      assert.strictEqual(
        await AsyncEnumerable.create<number>([]).firstOrDefault(
          defaultValue,
          () => true,
        ),
        defaultValue,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).firstOrDefault(
          defaultValue,
          (x) => x > 5,
        ),
        defaultValue,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).firstOrDefault(
          defaultValue,
          async (x) => Promise.resolve(x === 4),
        ),
        defaultValue,
      );
    });
    test("with all elements satisfying condition", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([2, 2, 2]).firstOrDefault(0, async (x) =>
          Promise.resolve(x === 2),
        ),
        2,
      );
    });
  });
});
