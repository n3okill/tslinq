import {
  AsyncEnumerable,
  Enumerable,
  NotIterableException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import {
  CaseInsensitiveEqualityComparer,
  type Person,
  PersonComparer,
  WeakEqualityComparer,
} from "../shared.ts";

describe("intersect", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 2, 3, 4, 5, 5, 6])
          .intersect([1, 1, 3, 3, 5])
          .toArray(),
        [1, 3, 5, 5],
      );
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3])
          .intersect(
            ["1", "2"] as unknown as Array<number>,
            new WeakEqualityComparer(),
          )
          .toArray(),
        [1, 2],
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2, 2, 3, 4, 5, 5, 6]).intersect([
        1, 1, 3, 3, 5,
      ]);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    test("empty sequences return empty", () => {
      assert.deepStrictEqual(Enumerable.create([]).intersect([]).toArray(), []);
    });

    test("empty first returns empty", () => {
      assert.deepStrictEqual(
        Enumerable.create<number>([]).intersect([1, 2, 3]).toArray(),
        [],
      );
    });

    test("empty second returns empty", () => {
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3]).intersect([]).toArray(),
        [],
      );
    });

    test("basic number intersection", () => {
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3]).intersect([2, 3, 4]).toArray(),
        [2, 3],
      );
    });

    test("handles duplicates", () => {
      assert.deepStrictEqual(
        Enumerable.create([1, 1, 2, 2]).intersect([2, 2, 3, 3]).toArray(),
        [2, 2],
      );
    });

    test("case sensitive string intersection", () => {
      assert.deepStrictEqual(
        Enumerable.create(["a", "b", "A"]).intersect(["A", "b", "C"]).toArray(),
        ["b", "A"],
      );
    });

    test("case insensitive string intersection", () => {
      assert.deepStrictEqual(
        Enumerable.create(["a", "b", "C"])
          .intersect(["A", "B", "c"], new CaseInsensitiveEqualityComparer())
          .toArray(),
        ["a", "b", "C"],
      );
    });

    test("object intersection with custom comparer", () => {
      const first: Array<Person> = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];
      const second: Array<Person> = [
        { id: 2, name: "Jane Modified" },
        { id: 3, name: "Bob" },
      ];

      assert.deepStrictEqual(
        Enumerable.create(first)
          .intersect(second, new PersonComparer())
          .toArray(),
        [{ id: 2, name: "Jane" }],
      );
    });

    test("handles null values", () => {
      assert.deepStrictEqual(
        Enumerable.create([1, null, 2]).intersect([2, null, 3]).toArray(),
        [null, 2],
      );
    });
    test("throw not iterable", () => {
      assert.throws(
        () => Enumerable.create([]).intersect(undefined as never),
        NotIterableException,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 2, 3, 4, 5, 5, 6])
          .intersect([1, 1, 3, 3, 5])
          .toArray(),
        [1, 3, 5, 5],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3])
          .intersect(
            ["1", "2"] as unknown as Array<number>,
            new WeakEqualityComparer(),
          )
          .toArray(),
        [1, 2],
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 2, 3, 4, 5, 5, 6]).intersect([
        1, 1, 3, 3, 5,
      ]);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("empty sequences return empty", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([]).intersect([]).toArray(),
        [],
      );
    });

    test("empty first returns empty", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create<number>([]).intersect([1, 2, 3]).toArray(),
        [],
      );
    });

    test("empty second returns empty", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3]).intersect([]).toArray(),
        [],
      );
    });

    test("basic number intersection", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3]).intersect([2, 3, 4]).toArray(),
        [2, 3],
      );
    });

    test("handles duplicates", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 1, 2, 2])
          .intersect([2, 2, 3, 3])
          .toArray(),
        [2, 2],
      );
    });

    test("case sensitive string intersection", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create(["a", "b", "A"])
          .intersect(["A", "b", "C"])
          .toArray(),
        ["b", "A"],
      );
    });

    test("case insensitive string intersection", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create(["a", "b", "C"])
          .intersect(["A", "B", "c"], new CaseInsensitiveEqualityComparer())
          .toArray(),
        ["a", "b", "C"],
      );
    });

    test("object intersection with custom comparer", async () => {
      const first: Array<Person> = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];
      const second: Array<Person> = [
        { id: 2, name: "Jane Modified" },
        { id: 3, name: "Bob" },
      ];

      assert.deepStrictEqual(
        await AsyncEnumerable.create(first)
          .intersect(second, new PersonComparer())
          .toArray(),
        [{ id: 2, name: "Jane" }],
      );
    });

    test("handles null values", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, null, 2])
          .intersect([2, null, 3])
          .toArray(),
        [null, 2],
      );
    });
    test("throw not iterable", async () => {
      await assert.rejects(
        async () => AsyncEnumerable.create([]).intersect(undefined as never),
        NotIterableException,
      );
    });
  });
});
