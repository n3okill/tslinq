import {
  AsyncEnumerable,
  Enumerable,
  EqualityComparer,
  NotIterableException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { type Person, PersonComparer } from "../shared.ts";

describe("union", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3]).union([3, 4, 5]).toArray(),
        [1, 2, 3, 4, 5],
      );
      assert.deepStrictEqual(
        Enumerable.create([1, 3, 5])
          .union([2, 4, 6])
          .union([1, 2, 3, 7])
          .union([4, 5, 6, 8])
          .toArray(),
        [1, 3, 5, 2, 4, 6, 7, 8],
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2, 3]).union([3, 4, 5]);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    test("empty sequences return empty", () => {
      const result = Enumerable.create([]).union([]).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("empty first returns second", () => {
      const result = Enumerable.create<number>([]).union([1, 2]).toArray();
      assert.deepStrictEqual(result, [1, 2]);
    });

    test("empty second returns first", () => {
      const result = Enumerable.create([1, 2]).union([]).toArray();
      assert.deepStrictEqual(result, [1, 2]);
    });

    test("basic number union", () => {
      const result = Enumerable.create([1, 2, 3]).union([2, 3, 4]).toArray();
      assert.deepStrictEqual(result, [1, 2, 3, 4]);
    });

    test("handles duplicates", () => {
      const result = Enumerable.create([1, 1, 2]).union([2, 2, 3]).toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("object union with default comparer", () => {
      const first: Array<Person> = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];
      const second: Array<Person> = [
        { id: 2, name: "Jane" },
        { id: 3, name: "Bob" },
      ];

      const result = Enumerable.create(first).union(second).toArray();
      assert.deepStrictEqual(result, [...first, ...second]);
    });

    test("object union with custom comparer", () => {
      const first: Array<Person> = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];
      const second: Array<Person> = [
        { id: 2, name: "Jane Modified" },
        { id: 3, name: "Bob" },
      ];

      const result = Enumerable.create(first)
        .union(second, new PersonComparer())
        .toArray();
      assert.deepStrictEqual(result, [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
        { id: 3, name: "Bob" },
      ]);
    });

    test("throws on invalid second parameter", () => {
      assert.throws(
        () => Enumerable.create([1]).union(null as never),
        NotIterableException,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3]).union([3, 4, 5]).toArray(),
        [1, 2, 3, 4, 5],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 3, 5])
          .union([2, 4, 6])
          .union([1, 2, 3, 7])
          .union([4, 5, 6, 8])
          .toArray(),
        [1, 3, 5, 2, 4, 6, 7, 8],
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 3]).union([3, 4, 5]);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("empty sequences return empty", async () => {
      const result = await AsyncEnumerable.create([]).union([]).toArray();
      assert.deepStrictEqual(result, []);
    });

    test("empty first returns second", async () => {
      const result = await AsyncEnumerable.create<number>([])
        .union([1, 2])
        .toArray();
      assert.deepStrictEqual(result, [1, 2]);
    });

    test("empty second returns first", async () => {
      const result = await AsyncEnumerable.create([1, 2]).union([]).toArray();
      assert.deepStrictEqual(result, [1, 2]);
    });

    test("basic number union", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .union([2, 3, 4])
        .toArray();
      assert.deepStrictEqual(result, [1, 2, 3, 4]);
    });

    test("handles duplicates", async () => {
      const result = await AsyncEnumerable.create([1, 1, 2])
        .union([2, 2, 3])
        .toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("object union with default comparer", async () => {
      const first: Array<Person> = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];
      const second: Array<Person> = [
        { id: 2, name: "Jane" },
        { id: 3, name: "Bob" },
      ];

      const result = await AsyncEnumerable.create(first)
        .union(second)
        .toArray();
      assert.deepStrictEqual(result, [...first, ...second]);
    });

    test("object union with custom comparer", async () => {
      class PersonComparer extends EqualityComparer<Person> {
        equals(x?: Person, y?: Person): boolean {
          if (!x || !y) return x === y;
          return x.id === y.id;
        }
      }

      const first: Array<Person> = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];
      const second: Array<Person> = [
        { id: 2, name: "Jane Modified" },
        { id: 3, name: "Bob" },
      ];

      const result = await AsyncEnumerable.create(first)
        .union(second, new PersonComparer())
        .toArray();
      assert.deepStrictEqual(result, [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
        { id: 3, name: "Bob" },
      ]);
    });

    test("throws on invalid second parameter", async () => {
      await assert.rejects(
        async () => AsyncEnumerable.create([1]).union(null as never),
        NotIterableException,
      );
    });
  });
});
