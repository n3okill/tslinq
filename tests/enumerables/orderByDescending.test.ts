import {
  AsyncEnumerable,
  Enumerable,
  InvalidArgumentException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { type Person } from "../shared.ts";

describe("orderDescending", function () {
  describe("Enumerable", function () {
    test("empty sequence returns empty", () => {
      const result = Enumerable.create([])
        .orderByDescending((x) => x)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("orders numbers descending", () => {
      const result = Enumerable.create([1, 3, 2])
        .orderByDescending((x) => x)
        .toArray();
      assert.deepStrictEqual(result, [3, 2, 1]);
    });

    test("orders strings descending", () => {
      const result = Enumerable.create(["a", "c", "b"])
        .orderByDescending((x) => x)
        .toArray();
      assert.deepStrictEqual(result, ["c", "b", "a"]);
    });

    test("orders by object property descending", () => {
      const people: Array<Person> = [
        { name: "John", age: 30 },
        { name: "Alice", age: 25 },
        { name: "Bob", age: 35 },
      ];

      const result = Enumerable.create(people)
        .orderByDescending((p) => p.age)
        .toArray();

      assert.deepStrictEqual(result, [
        { name: "Bob", age: 35 },
        { name: "John", age: 30 },
        { name: "Alice", age: 25 },
      ]);
    });

    test("chaining thenByDescending", () => {
      const people: Array<Person> = [
        { name: "John", age: 30 },
        { name: "Alice", age: 30 },
        { name: "Bob", age: 25 },
      ];

      const result = Enumerable.create(people)
        .orderByDescending((p) => p.age)
        .thenByDescending((p) => p.name)
        .toArray();

      assert.deepStrictEqual(result, [
        { name: "John", age: 30 },
        { name: "Alice", age: 30 },
        { name: "Bob", age: 25 },
      ]);
    });

    test("maintains stable sort", () => {
      const items = [
        { value: 1, order: 1 },
        { value: 1, order: 2 },
        { value: 1, order: 3 },
      ];

      const result = Enumerable.create(items)
        .orderByDescending((x) => x.value)
        .toArray();

      assert.deepStrictEqual(result, items);
    });

    test("handles null values", () => {
      const items = [
        { name: "John", age: null },
        { name: "Alice", age: 25 },
        { name: "Bob", age: null },
      ];

      const result = Enumerable.create(items)
        .orderByDescending((x) => x.age)
        .toArray();

      assert.deepStrictEqual(result, [
        { name: "Alice", age: 25 },
        { name: "John", age: null },
        { name: "Bob", age: null },
      ]);
    });
    test("throws on undefined keySelector", () => {
      assert.throws(
        () => Enumerable.create([1, 2]).orderByDescending(undefined as never),
        InvalidArgumentException,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("async orderByDescending", async () => {
      const result = await AsyncEnumerable.create([1, 3, 2])
        .orderByDescending(async (x) => x)
        .toArray();

      assert.deepStrictEqual(result, [3, 2, 1]);
    });
    test("empty sequence returns empty", async () => {
      const result = await AsyncEnumerable.create([])
        .orderByDescending((x) => x)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("orders numbers descending", async () => {
      const result = await AsyncEnumerable.create([1, 3, 2])
        .orderByDescending((x) => x)
        .toArray();
      assert.deepStrictEqual(result, [3, 2, 1]);
    });

    test("orders strings descending", async () => {
      const result = await AsyncEnumerable.create(["a", "c", "b"])
        .orderByDescending((x) => x)
        .toArray();
      assert.deepStrictEqual(result, ["c", "b", "a"]);
    });

    test("orders by object property descending", async () => {
      const people: Array<Person> = [
        { name: "John", age: 30 },
        { name: "Alice", age: 25 },
        { name: "Bob", age: 35 },
      ];

      const result = await AsyncEnumerable.create(people)
        .orderByDescending((p) => p.age)
        .toArray();

      assert.deepStrictEqual(result, [
        { name: "Bob", age: 35 },
        { name: "John", age: 30 },
        { name: "Alice", age: 25 },
      ]);
    });

    test("chaining thenByDescending", async () => {
      const people: Array<Person> = [
        { name: "John", age: 30 },
        { name: "Alice", age: 30 },
        { name: "Bob", age: 25 },
      ];

      const result = await AsyncEnumerable.create(people)
        .orderByDescending((p) => p.age)
        .thenByDescending((p) => p.name)
        .toArray();

      assert.deepStrictEqual(result, [
        { name: "John", age: 30 },
        { name: "Alice", age: 30 },
        { name: "Bob", age: 25 },
      ]);
    });

    test("maintains stable sort", async () => {
      const items = [
        { value: 1, order: 1 },
        { value: 1, order: 2 },
        { value: 1, order: 3 },
      ];

      const result = await AsyncEnumerable.create(items)
        .orderByDescending((x) => x.value)
        .toArray();

      assert.deepStrictEqual(result, items);
    });

    test("handles null values", async () => {
      const items = [
        { name: "John", age: null },
        { name: "Alice", age: 25 },
        { name: "Bob", age: null },
      ];

      const result = await AsyncEnumerable.create(items)
        .orderByDescending((x) => x.age)
        .toArray();

      assert.deepStrictEqual(result, [
        { name: "Alice", age: 25 },
        { name: "John", age: null },
        { name: "Bob", age: null },
      ]);
    });
    test("throws on undefined keySelector", () => {
      assert.throws(
        () =>
          AsyncEnumerable.create([1, 2]).orderByDescending(undefined as never),
        InvalidArgumentException,
      );
    });
  });
});
