import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("groupBy", function () {
  class Pet {
    constructor(
      public Name: string,
      public Age: number,
    ) {}
  }
  const pets = [new Pet("Barley", 8.3), new Pet("Boots", 4.9), new Pet("Whiskers", 1.5), new Pet("Daisy", 4.3)];
  describe("Enumerable", function () {
    test("basic", function () {
      const e = Enumerable.asEnumerable(pets);
      const grouping = e.groupBy(
        (pet) => Math.floor(pet.Age),
        (pet) => pet.Age,
        (baseAge, ages) => {
          return {
            Key: baseAge,
            Count: ages.count(),
            Min: ages.min(),
            Max: ages.max(),
          };
        },
      );
      assert.deepStrictEqual(grouping.toArray(), [
        { Count: 1, Key: 8, Max: 8.3, Min: 8.3 },
        { Count: 2, Key: 4, Max: 4.9, Min: 4.3 },
        { Count: 1, Key: 1, Max: 1.5, Min: 1.5 },
      ]);
    });
    test("OddEven", function () {
      const groupBy = Enumerable.asEnumerable([1, 2, 3, 4, 5, 6, 7, 8, 9]).groupBy((x) => x % 2);
      assert.deepStrictEqual(groupBy.toArray(), [
        [1, 3, 5, 7, 9],
        [2, 4, 6, 8],
      ]);
    });
    test("repeated calls", function () {
      const groupBy = Enumerable.asEnumerable([1, 2, 3, 4, 5, 6, 7, 8, 9]).groupBy((x) => x % 2);
      assert.deepStrictEqual(groupBy.toArray(), groupBy.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      const e = EnumerableAsync.asEnumerableAsync(pets);
      const grouping = e.groupBy(
        (pet) => Math.floor(pet.Age),
        (pet) => pet.Age,
        (baseAge, ages) => {
          return {
            Key: baseAge,
            Count: ages.count(),
            Min: ages.min(),
            Max: ages.max(),
          };
        },
      );
      assert.deepStrictEqual(await grouping.toArray(), [
        { Count: 1, Key: 8, Max: 8.3, Min: 8.3 },
        { Count: 2, Key: 4, Max: 4.9, Min: 4.3 },
        { Count: 1, Key: 1, Max: 1.5, Min: 1.5 },
      ]);
    });
    test("OddEven", async function () {
      const groupBy = EnumerableAsync.asEnumerableAsync([1, 2, 3, 4, 5, 6, 7, 8, 9]).groupBy((x) => x % 2);
      assert.deepStrictEqual(await groupBy.toArray(), [
        [1, 3, 5, 7, 9],
        [2, 4, 6, 8],
      ]);
    });
    test("repeated calls", async function () {
      const groupBy = EnumerableAsync.asEnumerableAsync([1, 2, 3, 4, 5, 6, 7, 8, 9]).groupBy((x) => x % 2);
      assert.deepStrictEqual(await groupBy.toArray(), await groupBy.toArray());
    });
  });
  describe("EnumerableAsync async", function () {
    test("basic", async function () {
      const e = EnumerableAsync.asEnumerableAsync(pets);
      const grouping = e.groupBy(
        async (pet) => Promise.resolve(Math.floor(pet.Age)),
        async (pet) => Promise.resolve(pet.Age),
        async (baseAge, ages) => {
          return {
            Key: baseAge,
            Count: await ages.count(),
            Min: await ages.min(),
            Max: await ages.max(),
          };
        },
      );
      assert.deepStrictEqual(await grouping.toArray(), [
        { Count: 1, Key: 8, Max: 8.3, Min: 8.3 },
        { Count: 2, Key: 4, Max: 4.9, Min: 4.3 },
        { Count: 1, Key: 1, Max: 1.5, Min: 1.5 },
      ]);
    });
    test("OddEven", async function () {
      const groupBy = EnumerableAsync.asEnumerableAsync([1, 2, 3, 4, 5, 6, 7, 8, 9]).groupBy(async (x) =>
        Promise.resolve(x % 2),
      );
      assert.deepStrictEqual(await groupBy.toArray(), [
        [1, 3, 5, 7, 9],
        [2, 4, 6, 8],
      ]);
    });
  });
});
