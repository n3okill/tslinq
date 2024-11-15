import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

const evenArray = [0, 2, 4, 6, 8, 10];

describe("All", function () {
  describe("Enumerable", function () {
    test("isEven false", function () {
      assert.ok(!Enumerable.asEnumerable([9999, 0, 888, -1, 66, -777, 1, 2, -12345]).all((x: number) => x % 2 === 0));
    });
    test("isEven true", function () {
      assert.ok(Enumerable.asEnumerable(evenArray).all((x: number) => x % 2 === 0));
    });
    test("repeated calls", function () {
      const c = Enumerable.asEnumerable(evenArray);
      assert.strictEqual(
        c.all((x: number) => x % 2 === 0),
        c.all((x: number) => x % 2 === 0),
      );
    });
    test("String", function () {
      assert.ok(Enumerable.asEnumerable("aaaa").all((x) => x === "a"));
      assert.ok(!Enumerable.asEnumerable("aaab").all((x) => x === "a"));
    });
    test("EmptyString", function () {
      assert.ok(Enumerable.asEnumerable("").all((x) => x === "a"));
    });
    test("Basic", function () {
      // Create an array of Pets.
      const pets = Enumerable.asEnumerable([
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
        !(await EnumerableAsync.asEnumerableAsync([9999, 0, 888, -1, 66, -777, 1, 2, -12345]).all(
          (x: number) => x % 2 === 0,
        )),
      );
    });
    test("isEven true", async function () {
      assert.ok(await EnumerableAsync.asEnumerableAsync(evenArray).all((x: number) => x % 2 === 0));
    });
    test("repeated calls", async function () {
      const c = EnumerableAsync.asEnumerableAsync(evenArray);
      assert.strictEqual(await c.all((x: number) => x % 2 === 0), await c.all((x: number) => x % 2 === 0));
    });
    test("Basic", async function () {
      // Create an array of Pets.
      const pets = EnumerableAsync.asEnumerableAsync([
        { Age: 10, Name: "Barley" },
        { Age: 4, Name: "Boots" },
        { Age: 6, Name: "Whiskers" },
      ]);

      // Determine whether all pet names
      // in the array start with 'B'.
      const allStartWithB = await pets.all((pet) => pet.Name.startsWith("B"));

      assert.ok(!allStartWithB);
    });
  });
  describe("EnumerableAsync async predicate", function () {
    test("isEven false", async function () {
      assert.ok(
        !(await EnumerableAsync.asEnumerableAsync([9999, 0, 888, -1, 66, -777, 1, 2, -12345]).all(async (x: number) =>
          Promise.resolve(x % 2 === 0),
        )),
      );
    });
    test("isEven true", async function () {
      assert.ok(
        await EnumerableAsync.asEnumerableAsync(evenArray).all(async (x: number) => Promise.resolve(x % 2 === 0)),
      );
    });
    test("repeated calls", async function () {
      const c = EnumerableAsync.asEnumerableAsync(evenArray);
      assert.strictEqual(
        await c.all(async (x: number) => Promise.resolve(x % 2 === 0)),
        await c.all((x: number) => x % 2 === 0),
      );
    });
    test("Basic", async function () {
      // Create an array of Pets.
      const pets = EnumerableAsync.asEnumerableAsync([
        { Age: 10, Name: "Barley" },
        { Age: 4, Name: "Boots" },
        { Age: 6, Name: "Whiskers" },
      ]);

      // Determine whether all pet names
      // in the array start with 'B'.
      const allStartWithB = await pets.all(async (pet) => Promise.resolve(pet.Name.startsWith("B")));

      assert.ok(!allStartWithB);
    });
  });
});
