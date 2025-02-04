import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

const evenArray = [0, 2, 4, 6, 8, 10];

describe("All", function () {
  describe("Enumerable", function () {
    test("isEven false", function () {
      assert.ok(
        !Enumerable.create([9999, 0, 888, -1, 66, -777, 1, 2, -12345]).all(
          (x: number) => x % 2 === 0,
        ),
      );
    });
    test("isEven true", function () {
      assert.ok(Enumerable.create(evenArray).all((x: number) => x % 2 === 0));
      assert.ok(
        Enumerable.create(new Set(evenArray)).all((x: number) => x % 2 === 0),
      );
      assert.ok(
        Enumerable.create(new Map(evenArray.map((x) => [x, x]))).all(
          (x: [number, number]) => x[1] % 2 === 0,
        ),
      );
    });
    test("repeated calls", function () {
      const c = Enumerable.create(evenArray);
      assert.strictEqual(
        c.all((x: number) => x % 2 === 0),
        c.all((x: number) => x % 2 === 0),
      );
    });
    test("String", function () {
      assert.ok(Enumerable.create("aaaa").all((x) => x === "a"));
      assert.ok(!Enumerable.create("aaab").all((x) => x === "a"));
    });
    test("EmptyString", function () {
      assert.ok(Enumerable.create("").all((x) => x === "a"));
    });
    test("Basic", function () {
      // Create an array of Pets.
      const pets = Enumerable.create([
        { Age: 10, Name: "Barley" },
        { Age: 4, Name: "Boots" },
        { Age: 6, Name: "Whiskers" },
      ]);

      // Determine whether all pet names
      // in the array start with 'B'.
      const allStartWithB = pets.all((pet) => pet.Name.startsWith("B"));

      assert.ok(!allStartWithB);
    });
  });

  describe("EnumerableAsync", function () {
    test("isEven false", async function () {
      assert.ok(
        !(await AsyncEnumerable.create([
          9999, 0, 888, -1, 66, -777, 1, 2, -12345,
        ]).all((x: number) => x % 2 === 0)),
      );
    });
    test("isEven true", async function () {
      assert.ok(
        await AsyncEnumerable.create(evenArray).all((x: number) => x % 2 === 0),
      );
    });
    test("repeated calls", async function () {
      const c = AsyncEnumerable.create(evenArray);
      assert.strictEqual(
        await c.all((x: number) => x % 2 === 0),
        await c.all((x: number) => x % 2 === 0),
      );
    });
    test("Basic", async function () {
      // Create an array of Pets.
      const pets = AsyncEnumerable.create([
        { Age: 10, Name: "Barley" },
        { Age: 4, Name: "Boots" },
        { Age: 6, Name: "Whiskers" },
      ]);

      // Determine whether all pet names
      // in the array start with 'B'.
      const allStartWithB = await pets.all((pet) => pet.Name.startsWith("B"));

      assert.ok(!allStartWithB);
    });

    test("empty enumerable", function () {
      assert.ok(Enumerable.create([]).all((x: number) => x > 0));
    });
    test("null check in predicate", function () {
      const data = Enumerable.create([1, null, 3, undefined, 5]);
      assert.ok(!data.all((x) => x !== null));
    });

    test("throws in predicate", function () {
      const data = Enumerable.create([1, 2, 3]);
      assert.throws(() =>
        data.all(() => {
          throw new Error("Test error");
        }),
      );
    });

    test("large array", function () {
      const largeArray = Array.from({ length: 10000 }, (_, i) => i);
      const result = Enumerable.create(largeArray).all((x) => x >= 0);
      assert.ok(result);
    });
  });
  describe("EnumerableAsync async predicate", function () {
    test("isEven false", async function () {
      assert.ok(
        !(await AsyncEnumerable.create([
          9999, 0, 888, -1, 66, -777, 1, 2, -12345,
        ]).all(async (x: number) => Promise.resolve(x % 2 === 0))),
      );
    });
    test("isEven true", async function () {
      assert.ok(
        await AsyncEnumerable.create(evenArray).all(async (x: number) =>
          Promise.resolve(x % 2 === 0),
        ),
      );
    });
    test("repeated calls", async function () {
      const c = AsyncEnumerable.create(evenArray);
      assert.strictEqual(
        await c.all(async (x: number) => Promise.resolve(x % 2 === 0)),
        await c.all((x: number) => x % 2 === 0),
      );
    });
    test("Basic", async function () {
      // Create an array of Pets.
      const pets = AsyncEnumerable.create([
        { Age: 10, Name: "Barley" },
        { Age: 4, Name: "Boots" },
        { Age: 6, Name: "Whiskers" },
      ]);

      // Determine whether all pet names
      // in the array start with 'B'.
      const allStartWithB = await pets.all(async (pet) =>
        Promise.resolve(pet.Name.startsWith("B")),
      );

      assert.ok(!allStartWithB);
    });
    test("empty async enumerable", async function () {
      assert.ok(await AsyncEnumerable.create([]).all((x: number) => x > 0));
    });
    test("null check in predicate", async function () {
      const data = AsyncEnumerable.create([1, null, 3, undefined, 5]);
      assert.ok(!(await data.all((x) => x !== null)));
    });

    test("throws in predicate", async function () {
      const data = AsyncEnumerable.create([1, 2, 3]);
      await assert.rejects(async () => {
        await data.all(async () => {
          throw new Error("Test error");
        });
      });
    });

    test("large array", async function () {
      const largeArray = Array.from({ length: 10000 }, (_, i) => i);
      const result = await AsyncEnumerable.create(largeArray).all(
        (x) => x >= 0,
      );
      assert.ok(result);
    });

    test("mixed async/sync operations", async function () {
      const data = AsyncEnumerable.create([1, 2, 3, 4]);
      const result = await data.all(async (x) => {
        await new Promise((resolve) => setTimeout(resolve, 1));
        return x > 0;
      });
      assert.ok(result);
    });

    test("rejected promise in predicate", async function () {
      const data = AsyncEnumerable.create([1, 2, 3]);
      await assert.rejects(async () => {
        await data.all(async () => Promise.reject(new Error("Test rejection")));
      });
    });
  });
});
