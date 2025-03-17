import {
  AsyncEnumerable,
  Comparer,
  Enumerable,
  InvalidArgumentException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { type Person } from "../shared.ts";

describe("order", function () {
  class ReverseComparer extends Comparer<number> {
    compare(x?: number, y?: number): number {
      if (x === undefined || y === undefined) return 0;
      return y - x;
    }
  }
  describe("Enumerable", function () {
    test("empty sequence returns empty", () => {
      const result = Enumerable.create([])
        .orderBy((x) => x)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("orders numbers", () => {
      const result = Enumerable.create([3, 1, 2])
        .orderBy((x) => x)
        .toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("orders strings", () => {
      const result = Enumerable.create(["c", "a", "b"])
        .orderBy((x) => x)
        .toArray();
      assert.deepStrictEqual(result, ["a", "b", "c"]);
    });

    test("orders by object property", () => {
      const people: Array<Person> = [
        { name: "John", age: 30 },
        { name: "Alice", age: 25 },
        { name: "Bob", age: 35 },
      ];

      const result = Enumerable.create(people)
        .orderBy((p) => p.age)
        .toArray();

      assert.deepStrictEqual(result, [
        { name: "Alice", age: 25 },
        { name: "John", age: 30 },
        { name: "Bob", age: 35 },
      ]);
    });

    test("chaining thenBy", () => {
      const people: Array<Person> = [
        { name: "John", age: 30 },
        { name: "Alice", age: 25 },
        { name: "Bob", age: 25 },
      ];

      const result = Enumerable.create(people)
        .orderBy((p) => p.age)
        .thenBy((p) => p.name)
        .toArray();

      assert.deepStrictEqual(result, [
        { name: "Alice", age: 25 },
        { name: "Bob", age: 25 },
        { name: "John", age: 30 },
      ]);
    });

    test("custom comparer", () => {
      const result = Enumerable.create([1, 2, 3])
        .orderBy((x) => x, new ReverseComparer())
        .toArray();

      assert.deepStrictEqual(result, [3, 2, 1]);
    });

    test("maintains stable sort", () => {
      const items = [
        { value: 1, order: 1 },
        { value: 1, order: 2 },
        { value: 1, order: 3 },
      ];

      const result = Enumerable.create(items)
        .orderBy((x) => x.value)
        .toArray();

      assert.deepStrictEqual(result, items);
    });
    test("throws on undefined keySelector", () => {
      assert.throws(
        () => Enumerable.create([1, 2]).orderBy(undefined as never),
        InvalidArgumentException,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("empty sequence returns empty", async () => {
      const result = await AsyncEnumerable.create([])
        .orderBy((x) => x)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("orders numbers", async () => {
      const result = await AsyncEnumerable.create([3, 1, 2])
        .orderBy((x) => x)
        .toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("orders strings", async () => {
      const result = await AsyncEnumerable.create(["c", "a", "b"])
        .orderBy((x) => x)
        .toArray();
      assert.deepStrictEqual(result, ["a", "b", "c"]);
    });

    test("orders by object property", async () => {
      const people: Array<Person> = [
        { name: "John", age: 30 },
        { name: "Alice", age: 25 },
        { name: "Bob", age: 35 },
      ];

      const result = await AsyncEnumerable.create(people)
        .orderBy((p) => p.age)
        .toArray();

      assert.deepStrictEqual(result, [
        { name: "Alice", age: 25 },
        { name: "John", age: 30 },
        { name: "Bob", age: 35 },
      ]);
    });

    test("chaining thenBy", async () => {
      const people: Array<Person> = [
        { name: "John", age: 30 },
        { name: "Alice", age: 25 },
        { name: "Bob", age: 25 },
      ];

      const result = await AsyncEnumerable.create(people)
        .orderBy((p) => p.age)
        .thenBy((p) => p.name)
        .toArray();

      assert.deepStrictEqual(result, [
        { name: "Alice", age: 25 },
        { name: "Bob", age: 25 },
        { name: "John", age: 30 },
      ]);
    });

    test("custom comparer", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .orderBy((x) => x, new ReverseComparer())
        .toArray();

      assert.deepStrictEqual(result, [3, 2, 1]);
    });

    test("maintains stable sort", async () => {
      const items = [
        { value: 1, order: 1 },
        { value: 1, order: 2 },
        { value: 1, order: 3 },
      ];

      const result = await AsyncEnumerable.create(items)
        .orderBy((x) => x.value)
        .toArray();

      assert.deepStrictEqual(result, items);
    });
    test("async orderBy", async () => {
      const result = await AsyncEnumerable.create([3, 1, 2])
        .orderBy(async (x) => x)
        .toArray();

      assert.deepStrictEqual(result, [1, 2, 3]);
    });
    test("throws on undefined keySelector", () => {
      assert.throws(
        () => AsyncEnumerable.create([1, 2]).orderBy(undefined as never),
        InvalidArgumentException,
      );
    });
  });
});
