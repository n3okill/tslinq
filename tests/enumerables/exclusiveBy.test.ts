import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import {
  CaseInsensitiveEqualityComparer,
  Person,
  WeakEqualityComparer,
} from "../shared.ts";

describe("exclusiveBy", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 2, 3, 4, 5, 5, 6])
          .exclusiveBy([1, 1, 3, 3, 5, 7], (x) => x)
          .toArray(),
        [2, 2, 4, 6, 7],
      );
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3])
          .exclusiveBy(
            ["0", "1", "2"] as unknown as Array<number>,
            (x) => x,
            new WeakEqualityComparer(),
          )
          .toArray(),
        [3, "0"],
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2, 2, 3, 4, 5, 5, 6]).exclusiveBy(
        [1, 1, 3, 3, 5],
        (x) => x,
      );
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    test("empty sequences return empty", () => {
      assert.deepStrictEqual(
        Enumerable.create([])
          .exclusiveBy([], (x) => x)
          .toArray(),
        [],
      );
    });

    test("basic key selector with numbers", () => {
      const first = [1, 2, 3, 4];
      const second = [2, 3, 4, 5];

      assert.deepStrictEqual(
        Enumerable.create(first)
          .exclusiveBy(second, (x) => x % 3)
          .toArray(),
        [],
      );
    });

    test("object property key selector", () => {
      const first: Array<Person> = [
        { id: 1, name: "John", age: 25 },
        { id: 2, name: "Jane", age: 30 },
      ];
      const second: Array<Person> = [
        { id: 3, name: "Bob", age: 25 },
        { id: 4, name: "Alice", age: 35 },
      ];

      assert.deepStrictEqual(
        Enumerable.create(first)
          .exclusiveBy(second, (p) => p.age)
          .toArray(),
        [
          { id: 2, name: "Jane", age: 30 },
          { id: 4, name: "Alice", age: 35 },
        ],
      );
    });

    test("case sensitive string keys", () => {
      const first = ["Apple", "banana", "Cherry"];
      const second = ["apple", "Banana", "cherry"];

      assert.deepStrictEqual(
        Enumerable.create(first)
          .exclusiveBy(second, (x) => x)
          .toArray(),
        ["Apple", "banana", "Cherry", "apple", "Banana", "cherry"],
      );
    });

    test("case insensitive string keys", () => {
      const first = ["Apple", "banana", "Cherry"];
      const second = ["apple", "Banana", "cherry"];

      assert.deepStrictEqual(
        Enumerable.create(first)
          .exclusiveBy(second, (x) => x, new CaseInsensitiveEqualityComparer())
          .toArray(),
        [],
      );
    });

    test("handles null values in key selector", () => {
      const first = [
        { id: 1, value: "a" },
        { id: 2, value: null },
      ];
      const second = [
        { id: 3, value: null },
        { id: 4, value: "b" },
      ];

      assert.deepStrictEqual(
        Enumerable.create(first)
          .exclusiveBy(second, (x) => x.value)
          .toArray(),
        [
          { id: 1, value: "a" },
          { id: 4, value: "b" },
        ],
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 2, 3, 4, 5, 5, 6])
          .exclusiveBy([1, 1, 3, 3, 5, 7], (x) => x)
          .toArray(),
        [2, 2, 4, 6, 7],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3])
          .exclusiveBy(
            ["0", "1", "2"] as unknown as Array<number>,
            (x) => x,
            new WeakEqualityComparer(),
          )
          .toArray(),
        [3, "0"],
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 2, 3, 4, 5, 5, 6]).exclusiveBy(
        [1, 1, 3, 3, 5],
        (x) => x,
      );
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("empty sequences return empty", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([])
          .exclusiveBy([], (x) => x)
          .toArray(),
        [],
      );
    });

    test("basic key selector with numbers", async () => {
      const first = [1, 2, 3, 4];
      const second = [2, 3, 4, 5];

      assert.deepStrictEqual(
        await AsyncEnumerable.create(first)
          .exclusiveBy(second, (x) => x % 3)
          .toArray(),
        [],
      );
    });

    test("object property key selector", async () => {
      const first: Array<Person> = [
        { id: 1, name: "John", age: 25 },
        { id: 2, name: "Jane", age: 30 },
      ];
      const second: Array<Person> = [
        { id: 3, name: "Bob", age: 25 },
        { id: 4, name: "Alice", age: 35 },
      ];

      assert.deepStrictEqual(
        await AsyncEnumerable.create(first)
          .exclusiveBy(second, (p) => p.age)
          .toArray(),
        [
          { id: 2, name: "Jane", age: 30 },
          { id: 4, name: "Alice", age: 35 },
        ],
      );
    });

    test("case sensitive string keys", async () => {
      const first = ["Apple", "banana", "Cherry"];
      const second = ["apple", "Banana", "cherry"];

      assert.deepStrictEqual(
        await AsyncEnumerable.create(first)
          .exclusiveBy(second, (x) => x)
          .toArray(),
        ["Apple", "banana", "Cherry", "apple", "Banana", "cherry"],
      );
    });

    test("case insensitive string keys", async () => {
      const first = ["Apple", "banana", "Cherry"];
      const second = ["apple", "Banana", "cherry"];

      assert.deepStrictEqual(
        await AsyncEnumerable.create(first)
          .exclusiveBy(second, (x) => x, new CaseInsensitiveEqualityComparer())
          .toArray(),
        [],
      );
    });

    test("handles null values in key selector", async () => {
      const first = [
        { id: 1, value: "a" },
        { id: 2, value: null },
      ];
      const second = [
        { id: 3, value: null },
        { id: 4, value: "b" },
      ];

      assert.deepStrictEqual(
        await AsyncEnumerable.create(first)
          .exclusiveBy(second, (x) => x.value)
          .toArray(),
        [
          { id: 1, value: "a" },
          { id: 4, value: "b" },
        ],
      );
    });
  });
});
