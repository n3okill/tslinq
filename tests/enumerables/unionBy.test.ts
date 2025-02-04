import {
  AsyncEnumerable,
  Enumerable,
  InvalidArgumentException,
  NotIterableException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { CaseInsensitiveEqualityComparer, Person } from "../shared.ts";

describe("unionBy", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3])
          .unionBy([3, 4, 5], (x) => x)
          .toArray(),
        [1, 2, 3, 4, 5],
      );
      assert.deepStrictEqual(
        Enumerable.create([1, 3, 5])
          .unionBy([2, 4, 6], (x) => x)
          .unionBy([1, 2, 3, 7], (x) => x)
          .unionBy([4, 5, 6, 8], (x) => x)
          .toArray(),
        [1, 3, 5, 2, 4, 6, 7, 8],
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2, 3]).unionBy([3, 4, 5], (x) => x);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    test("empty sequences return empty", () => {
      const result = Enumerable.create([])
        .unionBy([], (x) => x)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("basic number key selection", () => {
      const first = [
        { value: 1, group: 1 },
        { value: 2, group: 1 },
      ];
      const second = [
        { value: 3, group: 1 },
        { value: 4, group: 2 },
      ];

      const result = Enumerable.create(first)
        .unionBy(second, (x) => x.group)
        .toArray();
      assert.deepStrictEqual(result, [
        { value: 1, group: 1 },
        { value: 4, group: 2 },
      ]);
    });

    test("object key selection", () => {
      const people: Array<Person> = [
        { id: 1, name: "John", age: 25 },
        { id: 2, name: "Jane", age: 25 },
      ];
      const morePeople: Array<Person> = [
        { id: 3, name: "Bob", age: 25 },
        { id: 4, name: "Alice", age: 30 },
      ];

      const result = Enumerable.create(people)
        .unionBy(morePeople, (p) => p.age)
        .toArray();
      assert.deepStrictEqual(result, [
        { id: 1, name: "John", age: 25 },
        { id: 4, name: "Alice", age: 30 },
      ]);
    });

    test("case sensitive by default", () => {
      const first = [{ name: "John" }, { name: "jane" }];
      const second = [{ name: "JOHN" }, { name: "JANE" }];

      const result = Enumerable.create(first)
        .unionBy(second, (x) => x.name)
        .toArray();
      assert.deepStrictEqual(result, [
        { name: "John" },
        { name: "jane" },
        { name: "JOHN" },
        { name: "JANE" },
      ]);
    });

    test("case insensitive with custom comparer", () => {
      const first = [{ name: "John" }, { name: "jane" }];
      const second = [{ name: "JOHN" }, { name: "JANE" }];

      const result = Enumerable.create(first)
        .unionBy(second, (x) => x.name, new CaseInsensitiveEqualityComparer())
        .toArray();
      assert.deepStrictEqual(result, [{ name: "John" }, { name: "jane" }]);
    });

    test("throws on invalid second parameter", () => {
      assert.throws(
        () => Enumerable.create([1]).unionBy(null as never, (x) => x),
        NotIterableException,
      );
    });

    test("throws on invalid keySelector", () => {
      assert.throws(
        () => Enumerable.create([1]).unionBy([2], null as never),
        InvalidArgumentException,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 3])
          .unionBy([3, 4, 5], (x) => x)
          .toArray(),
        [1, 2, 3, 4, 5],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 3, 5])
          .unionBy([2, 4, 6], (x) => x)
          .unionBy([1, 2, 3, 7], (x) => x)
          .unionBy([4, 5, 6, 8], (x) => x)
          .toArray(),
        [1, 3, 5, 2, 4, 6, 7, 8],
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 3]).unionBy([3, 4, 5], (x) => x);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("empty sequences return empty", async () => {
      const result = await AsyncEnumerable.create([])
        .unionBy([], (x) => x)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("basic number key selection", async () => {
      const first = [
        { value: 1, group: 1 },
        { value: 2, group: 1 },
      ];
      const second = [
        { value: 3, group: 1 },
        { value: 4, group: 2 },
      ];

      const result = await AsyncEnumerable.create(first)
        .unionBy(second, (x) => x.group)
        .toArray();
      assert.deepStrictEqual(result, [
        { value: 1, group: 1 },
        { value: 4, group: 2 },
      ]);
    });

    test("object key selection", async () => {
      const people: Array<Person> = [
        { id: 1, name: "John", age: 25 },
        { id: 2, name: "Jane", age: 25 },
      ];
      const morePeople: Array<Person> = [
        { id: 3, name: "Bob", age: 25 },
        { id: 4, name: "Alice", age: 30 },
      ];

      const result = await AsyncEnumerable.create(people)
        .unionBy(morePeople, (p) => p.age)
        .toArray();
      assert.deepStrictEqual(result, [
        { id: 1, name: "John", age: 25 },
        { id: 4, name: "Alice", age: 30 },
      ]);
    });

    test("case sensitive by default", async () => {
      const first = [{ name: "John" }, { name: "jane" }];
      const second = [{ name: "JOHN" }, { name: "JANE" }];

      const result = await AsyncEnumerable.create(first)
        .unionBy(second, (x) => x.name)
        .toArray();
      assert.deepStrictEqual(result, [
        { name: "John" },
        { name: "jane" },
        { name: "JOHN" },
        { name: "JANE" },
      ]);
    });

    test("case insensitive with custom comparer", async () => {
      const first = [{ name: "John" }, { name: "jane" }];
      const second = [{ name: "JOHN" }, { name: "JANE" }];

      const result = await AsyncEnumerable.create(first)
        .unionBy(second, (x) => x.name, new CaseInsensitiveEqualityComparer())
        .toArray();
      assert.deepStrictEqual(result, [{ name: "John" }, { name: "jane" }]);
    });

    test("throws on invalid second parameter", async () => {
      await assert.rejects(
        async () =>
          AsyncEnumerable.create([1]).unionBy(null as never, (x) => x),
        NotIterableException,
      );
    });

    test("throws on invalid keySelector", async () => {
      await assert.rejects(
        async () => AsyncEnumerable.create([1]).unionBy([2], null as never),
        InvalidArgumentException,
      );
    });
  });
});
