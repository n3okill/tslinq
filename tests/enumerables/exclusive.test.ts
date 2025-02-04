import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import {
  CaseInsensitiveEqualityComparer,
  PersonComparer,
  WeakEqualityComparer,
} from "../shared.ts";

describe("exclusive", function () {
  interface Person {
    id: number;
    name: string;
  }
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 2, 3, 4, 5, 5, 6])
          .exclusive([1, 1, 3, 3, 5, 7])
          .toArray(),
        [2, 2, 4, 6, 7],
      );
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3])
          .exclusive(
            ["0", "1", "2"] as unknown as Array<number>,
            new WeakEqualityComparer(),
          )
          .toArray(),
        [3, "0"],
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2, 2, 3, 4, 5, 5, 6]).exclusive([
        1, 1, 3, 3, 5,
      ]);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    test("empty sequences return empty", () => {
      assert.deepStrictEqual(Enumerable.create([]).exclusive([]).toArray(), []);
    });

    test("empty first returns second", () => {
      assert.deepStrictEqual(
        Enumerable.create<number>([]).exclusive([1, 2]).toArray(),
        [1, 2],
      );
    });

    test("empty second returns first", () => {
      assert.deepStrictEqual(
        Enumerable.create([1, 2]).exclusive([]).toArray(),
        [1, 2],
      );
    });

    test("basic exclusive numbers", () => {
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3]).exclusive([2, 3, 4]).toArray(),
        [1, 4],
      );
    });

    test("handles duplicates", () => {
      assert.deepStrictEqual(
        Enumerable.create([1, 1, 2, 3]).exclusive([2, 2, 3, 4]).toArray(),
        [1, 1, 4],
      );
    });

    test("case sensitive strings by default", () => {
      assert.deepStrictEqual(
        Enumerable.create(["a", "b"]).exclusive(["A", "b"]).toArray(),
        ["a", "A"],
      );
    });

    test("with custom case insensitive comparer", () => {
      assert.deepStrictEqual(
        Enumerable.create(["a", "b"])
          .exclusive(["A", "b"], new CaseInsensitiveEqualityComparer())
          .toArray(),
        [],
      );
    });

    test("with complex objects", () => {
      const first: Array<Person> = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];
      const second: Array<Person> = [
        { id: 2, name: "Jane" },
        { id: 3, name: "Bob" },
      ];

      assert.deepStrictEqual(
        Enumerable.create(first)
          .exclusive(second, new PersonComparer())
          .toArray(),
        [
          { id: 1, name: "John" },
          { id: 3, name: "Bob" },
        ],
      );
    });

    test("handles null values", () => {
      assert.deepStrictEqual(
        Enumerable.create([1, null, 2]).exclusive([2, null, 3]).toArray(),
        [1, 3],
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 2, 3, 4, 5, 5, 6])
          .exclusive([1, 1, 3, 3, 5, 7])
          .toArray(),
        [2, 2, 4, 6, 7],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3])
          .exclusive(
            ["0", "1", "2"] as unknown as Array<number>,
            new WeakEqualityComparer(),
          )
          .toArray(),
        [3, "0"],
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 2, 3, 4, 5, 5, 6]).exclusive([
        1, 1, 3, 3, 5,
      ]);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("empty sequences return empty", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([]).exclusive([]).toArray(),
        [],
      );
    });

    test("empty first returns second", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create<number>([]).exclusive([1, 2]).toArray(),
        [1, 2],
      );
    });

    test("empty second returns first", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2]).exclusive([]).toArray(),
        [1, 2],
      );
    });

    test("basic exclusive numbers", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3]).exclusive([2, 3, 4]).toArray(),
        [1, 4],
      );
    });

    test("handles duplicates", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 1, 2, 3])
          .exclusive([2, 2, 3, 4])
          .toArray(),
        [1, 1, 4],
      );
    });

    test("case sensitive strings by default", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create(["a", "b"])
          .exclusive(["A", "b"])
          .toArray(),
        ["a", "A"],
      );
    });

    test("with custom case insensitive comparer", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create(["a", "b"])
          .exclusive(["A", "b"], new CaseInsensitiveEqualityComparer())
          .toArray(),
        [],
      );
    });

    test("with complex objects", async () => {
      const first: Array<Person> = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];
      const second: Array<Person> = [
        { id: 2, name: "Jane" },
        { id: 3, name: "Bob" },
      ];

      assert.deepStrictEqual(
        await AsyncEnumerable.create(first)
          .exclusive(second, new PersonComparer())
          .toArray(),
        [
          { id: 1, name: "John" },
          { id: 3, name: "Bob" },
        ],
      );
    });

    test("handles null values", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, null, 2])
          .exclusive([2, null, 3])
          .toArray(),
        [1, 3],
      );
    });
  });
});
