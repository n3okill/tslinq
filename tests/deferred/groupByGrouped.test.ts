import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("groupByGrouped", function () {
  class Pet {
    constructor(
      public Name: string,
      public Age: number,
    ) {}
  }
  const pets = [new Pet("Barley", 8), new Pet("Boots", 4), new Pet("Whiskers", 1), new Pet("Daisy", 1)];
  describe("Enumerable", function () {
    test("basic", function () {
      const e = Enumerable.asEnumerable(pets);
      const grouping = e.groupByGrouped(
        (pet) => pet.Age,
        (pet) => pet.Name,
      );
      assert.deepStrictEqual(grouping.toArray(), [
        [8, ["Barley"]],
        [4, ["Boots"]],
        [1, ["Whiskers", "Daisy"]],
      ]);
    });
    test("OddEven", function () {
      const groupBy = Enumerable.asEnumerable([1, 2, 3, 4, 5, 6, 7, 8, 9]).groupByGrouped((x) => x % 2);
      assert.deepStrictEqual(groupBy.toArray(), [
        [1, [1, 3, 5, 7, 9]],
        [0, [2, 4, 6, 8]],
      ]);
      assert.deepStrictEqual(
        groupBy
          .select((x) => x.Key)
          .orderBy()
          .toArray(),
        [0, 1],
      );
    });
    test("repeated calls", function () {
      const groupBy = Enumerable.asEnumerable([1, 2, 3, 4, 5, 6, 7, 8, 9]).groupByGrouped((x) => x % 2);
      assert.deepStrictEqual(groupBy.toArray(), groupBy.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      const e = EnumerableAsync.asEnumerableAsync(pets);
      const grouping = e.groupByGrouped(
        (pet) => pet.Age,
        (pet) => pet.Name,
      );
      assert.deepStrictEqual(await grouping.toArray(), [
        [8, ["Barley"]],
        [4, ["Boots"]],
        [1, ["Whiskers", "Daisy"]],
      ]);
    });
    test("OddEven", async function () {
      const groupBy = EnumerableAsync.asEnumerableAsync([1, 2, 3, 4, 5, 6, 7, 8, 9]).groupByGrouped((x) => x % 2);
      assert.deepStrictEqual(await groupBy.toArray(), [
        [1, [1, 3, 5, 7, 9]],
        [0, [2, 4, 6, 8]],
      ]);
      assert.deepStrictEqual(
        await groupBy
          .select((x) => x.Key)
          .orderBy()
          .toArray(),
        [0, 1],
      );
    });
    test("repeated calls", async function () {
      const groupBy = EnumerableAsync.asEnumerableAsync([1, 2, 3, 4, 5, 6, 7, 8, 9]).groupByGrouped((x) => x % 2);
      assert.deepStrictEqual(await groupBy.toArray(), await groupBy.toArray());
    });
  });
  describe("EnumerableAsync async", function () {
    test("basic", async function () {
      const e = EnumerableAsync.asEnumerableAsync(pets);
      const grouping = e.groupByGrouped(
        async (pet) => Promise.resolve(pet.Age),
        async (pet) => Promise.resolve(pet.Name),
      );
      assert.deepStrictEqual(await grouping.toArray(), [
        [8, ["Barley"]],
        [4, ["Boots"]],
        [1, ["Whiskers", "Daisy"]],
      ]);
    });
    test("OddEven", async function () {
      const groupBy = EnumerableAsync.asEnumerableAsync([1, 2, 3, 4, 5, 6, 7, 8, 9]).groupByGrouped(async (x) =>
        Promise.resolve(x % 2),
      );
      assert.deepStrictEqual(await groupBy.toArray(), [
        [1, [1, 3, 5, 7, 9]],
        [0, [2, 4, 6, 8]],
      ]);
      assert.deepStrictEqual(
        await groupBy
          .select((x) => x.Key)
          .orderBy()
          .toArray(),
        [0, 1],
      );
    });
  });
});
