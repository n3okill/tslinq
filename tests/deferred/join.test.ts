import { Enumerable, EnumerableAsync, Interfaces } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("join", function () {
  class Person {
    constructor(public Name: string) {}
  }
  class Pet {
    constructor(
      public Name: string,
      public Owner: Person,
    ) {}
  }
  const magnus = new Person("Hedlund, Magnus");
  const terry = new Person("Adams, Terry");
  const charlotte = new Person("Weiss, Charlotte");

  const barley = new Pet("Barley", terry);
  const boots = new Pet("Boots", terry);
  const whiskers = new Pet("Whiskers", charlotte);
  const daisy = new Pet("Daisy", magnus);

  const people = [magnus, terry, charlotte];
  const pets = [barley, boots, whiskers, daisy];

  class Comparer<T> implements Interfaces.IEqualityComparer<T> {
    Equals(x: T, y: T): boolean {
      return x == y;
    }
  }
  describe("Enumerable", function () {
    test("basic", function () {
      const result = Enumerable.asEnumerable([1, 2, 3])
        .join(
          [1, 2, 3],
          (x) => x,
          (x) => x,
          (x, y) => ({ x, y }),
        )
        .toArray();
      assert.strictEqual(result.length, 3);
      assert.deepStrictEqual(result, [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
      ]);
    });
    test("object", function () {
      const e = Enumerable.asEnumerable(people);
      const grouping = e.join(
        pets,
        (person) => person,
        (pet) => pet.Owner,
        (person, pet) => {
          return { OwnerName: person.Name, Pet: pet.Name };
        },
      );
      assert.deepStrictEqual(grouping.toArray(), [
        { OwnerName: "Hedlund, Magnus", Pet: "Daisy" },
        { OwnerName: "Adams, Terry", Pet: "Barley" },
        { OwnerName: "Adams, Terry", Pet: "Boots" },
        { OwnerName: "Weiss, Charlotte", Pet: "Whiskers" },
      ]);
    });
    test("comparer", function () {
      const result = Enumerable.asEnumerable(["1", 2, 3])
        .join(
          [1, "2", 3],
          (x) => x,
          (x) => x,
          (x, y) => ({ x, y }),
          new Comparer(),
        )
        .toArray();
      assert.strictEqual(result.length, 3);
      assert.deepStrictEqual(result, [
        { x: "1", y: 1 },
        { x: 2, y: "2" },
        { x: 3, y: 3 },
      ]);
    });
    test("repeated calls", function () {
      const result = Enumerable.asEnumerable([1, 2, 3]).join(
        [1, 2, 3],
        (x) => x,
        (x) => x,
        (x, y) => ({ x, y }),
      );
      assert.deepStrictEqual(result.toArray(), result.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      const result = await EnumerableAsync.asEnumerableAsync([1, 2, 3])
        .join(
          [1, 2, 3],
          (x) => x,
          (x) => x,
          (x, y) => ({ x, y }),
        )
        .toArray();
      assert.strictEqual(result.length, 3);
      assert.deepStrictEqual(result, [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
      ]);
    });
    test("object", async function () {
      const e = EnumerableAsync.asEnumerableAsync(people);
      const grouping = e.join(
        pets,
        (person) => person,
        (pet) => pet.Owner,
        (person, pet) => {
          return { OwnerName: person.Name, Pet: pet.Name };
        },
      );
      assert.deepStrictEqual(await grouping.toArray(), [
        { OwnerName: "Hedlund, Magnus", Pet: "Daisy" },
        { OwnerName: "Adams, Terry", Pet: "Barley" },
        { OwnerName: "Adams, Terry", Pet: "Boots" },
        { OwnerName: "Weiss, Charlotte", Pet: "Whiskers" },
      ]);
    });
    test("comparer", async function () {
      const result = await EnumerableAsync.asEnumerableAsync(["1", 2, 3])
        .join(
          [1, "2", 3],
          (x) => x,
          (x) => x,
          (x, y) => ({ x, y }),
          new Comparer(),
        )
        .toArray();
      assert.strictEqual(result.length, 3);
      assert.deepStrictEqual(result, [
        { x: "1", y: 1 },
        { x: 2, y: "2" },
        { x: 3, y: 3 },
      ]);
    });
    test("repeated calls", async function () {
      const result = EnumerableAsync.asEnumerableAsync([1, 2, 3]).join(
        [1, 2, 3],
        (x) => x,
        (x) => x,
        (x, y) => ({ x, y }),
      );
      assert.deepStrictEqual(await result.toArray(), await result.toArray());
    });
  });
  describe("EnumerableAsync async", function () {
    test("basic", async function () {
      const result = await EnumerableAsync.asEnumerableAsync([1, 2, 3])
        .join(
          [1, 2, 3],
          async (x) => Promise.resolve(x),
          async (x) => Promise.resolve(x),
          async (x, y) => Promise.resolve({ x, y }),
        )
        .toArray();
      assert.strictEqual(result.length, 3);
      assert.deepStrictEqual(result, [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
      ]);
    });
    test("object", async function () {
      const e = EnumerableAsync.asEnumerableAsync(people);
      const grouping = e.join(
        pets,
        async (person) => Promise.resolve(person),
        async (pet) => Promise.resolve(pet.Owner),
        async (person, pet) => Promise.resolve({ OwnerName: person.Name, Pet: pet.Name }),
      );
      assert.deepStrictEqual(await grouping.toArray(), [
        { OwnerName: "Hedlund, Magnus", Pet: "Daisy" },
        { OwnerName: "Adams, Terry", Pet: "Barley" },
        { OwnerName: "Adams, Terry", Pet: "Boots" },
        { OwnerName: "Weiss, Charlotte", Pet: "Whiskers" },
      ]);
    });
    test("comparer", async function () {
      class ComparerAsync<T> implements Interfaces.IAsyncEqualityComparer<T> {
        async Equals(x: T, y: T): Promise<boolean> {
          return Promise.resolve(x == y);
        }
      }
      const result = await EnumerableAsync.asEnumerableAsync(["1", 2, 3])
        .join(
          [1, "2", 3],
          async (x) => Promise.resolve(x),
          async (x) => Promise.resolve(x),
          async (x, y) => Promise.resolve({ x, y }),
          new ComparerAsync(),
        )
        .toArray();
      assert.strictEqual(result.length, 3);
      assert.deepStrictEqual(result, [
        { x: "1", y: 1 },
        { x: 2, y: "2" },
        { x: 3, y: 3 },
      ]);
    });
  });
});
