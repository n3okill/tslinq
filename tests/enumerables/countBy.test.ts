import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { CaseInsensitiveEqualityComparer } from "../shared.ts";

describe("Concat", function () {
  describe("Enumerable", function () {
    test("validate 1", function () {
      assert.deepStrictEqual(
        Enumerable.range(0, 10)
          .countBy((x) => x)
          .toArray(),
        Enumerable.range(0, 10)
          .select((x) => [x, 1])
          .toArray(),
      );
    });
    test("validate 2", function () {
      assert.deepStrictEqual(
        Enumerable.range(5, 10)
          .countBy(() => true)
          .toArray(),
        Enumerable.repeat(true, 1)
          .select((x) => [x, 10])
          .toArray(),
      );
    });
    test("validate 3", function () {
      assert.deepStrictEqual(
        Enumerable.range(0, 20)
          .countBy((x) => x % 5)
          .toArray(),
        Enumerable.range(0, 5)
          .select((x) => [x, 4])
          .toArray(),
      );
    });
    test("validate 4", function () {
      assert.deepStrictEqual(
        Enumerable.repeat(5, 20)
          .countBy((x) => x)
          .toArray(),
        Enumerable.repeat(5, 1)
          .select((x) => [x, 20])
          .toArray(),
      );
    });

    test("validate 5", function () {
      assert.deepStrictEqual(
        Enumerable.create(["Bob", "bob", "tim", "Bob", "Tim"])
          .countBy((x) => x)
          .toArray(),
        [
          ["Bob", 2],
          ["bob", 1],
          ["tim", 1],
          ["Tim", 1],
        ],
      );
    });
    test("validate 6", function () {
      assert.deepStrictEqual(
        Enumerable.create([
          { name: "Tom", age: 20 },
          { name: "Dick", age: 30 },
          { name: "Harry", age: 40 },
        ])
          .countBy((x) => x.age)
          .toArray(),
        [20, 30, 40].map((x) => [x, 1]),
      );
    });
    test("validate 7", function () {
      assert.deepStrictEqual(
        Enumerable.create([
          { name: "Tom", age: 20 },
          { name: "Dick", age: 20 },
          { name: "Harry", age: 40 },
        ])
          .countBy((x) => x.age)
          .toArray(),
        [
          [20, 2],
          [40, 1],
        ],
      );
    });
    test("validate 8", function () {
      assert.deepStrictEqual(
        Enumerable.create([
          { name: "Bob", age: 20 },
          { name: "bob", age: 30 },
          { name: "Harry", age: 40 },
        ])
          .countBy((x) => x.name)
          .toArray(),
        ["Bob", "bob", "Harry"].map((x) => [x, 1]),
      );
    });
    test("validate 9", function () {
      assert.deepStrictEqual(
        Enumerable.create(["Bob", "bob", "tim", "Bob", "Tim"])
          .countBy((x) => x, new CaseInsensitiveEqualityComparer())
          .toArray(),
        [
          ["Bob", 3],
          ["tim", 2],
        ],
      );
    });
    test("validate 10", function () {
      assert.deepStrictEqual(
        Enumerable.create([
          { name: "Bob", age: 20 },
          { name: "bob", age: 30 },
          { name: "Harry", age: 40 },
        ])
          .countBy((x) => x.name, new CaseInsensitiveEqualityComparer())
          .toArray(),
        [
          ["Bob", 2],
          ["Harry", 1],
        ],
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("validate 1", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.range(0, 10)
          .countBy((x) => x)
          .toArray(),
        await AsyncEnumerable.range(0, 10)
          .select((x) => [x, 1])
          .toArray(),
      );
    });
    test("validate 2", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.range(5, 10)
          .countBy(() => true)
          .toArray(),
        await AsyncEnumerable.repeat(true, 1)
          .select((x) => [x, 10])
          .toArray(),
      );
    });
    test("validate 3", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.range(0, 20)
          .countBy((x) => x % 5)
          .toArray(),
        await AsyncEnumerable.range(0, 5)
          .select((x) => [x, 4])
          .toArray(),
      );
    });
    test("validate 4", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.repeat(5, 20)
          .countBy((x) => x)
          .toArray(),
        await AsyncEnumerable.repeat(5, 1)
          .select((x) => [x, 20])
          .toArray(),
      );
    });

    test("validate 5", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create(["Bob", "bob", "tim", "Bob", "Tim"])
          .countBy((x) => x)
          .toArray(),
        [
          ["Bob", 2],
          ["bob", 1],
          ["tim", 1],
          ["Tim", 1],
        ],
      );
    });
    test("validate 6", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([
          { name: "Tom", age: 20 },
          { name: "Dick", age: 30 },
          { name: "Harry", age: 40 },
        ])
          .countBy((x) => x.age)
          .toArray(),
        [20, 30, 40].map((x) => [x, 1]),
      );
    });
    test("validate 7", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([
          { name: "Tom", age: 20 },
          { name: "Dick", age: 20 },
          { name: "Harry", age: 40 },
        ])
          .countBy((x) => x.age)
          .toArray(),
        [
          [20, 2],
          [40, 1],
        ],
      );
    });
    test("validate 8", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([
          { name: "Bob", age: 20 },
          { name: "bob", age: 30 },
          { name: "Harry", age: 40 },
        ])
          .countBy((x) => x.name)
          .toArray(),
        ["Bob", "bob", "Harry"].map((x) => [x, 1]),
      );
    });
    test("validate 9", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create(["Bob", "bob", "tim", "Bob", "Tim"])
          .countBy((x) => x, new CaseInsensitiveEqualityComparer())
          .toArray(),
        [
          ["Bob", 3],
          ["tim", 2],
        ],
      );
    });
    test("validate 10", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([
          { name: "Bob", age: 20 },
          { name: "bob", age: 30 },
          { name: "Harry", age: 40 },
        ])
          .countBy((x) => x.name, new CaseInsensitiveEqualityComparer())
          .toArray(),
        [
          ["Bob", 2],
          ["Harry", 1],
        ],
      );
    });
  });
});
