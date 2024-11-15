import { Enumerable, EnumerableAsync, Interfaces } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("sequenceEqual", function () {
  class Pet {
    constructor(
      public Name: string,
      public Age: number,
    ) {}
  }
  const pet1 = new Pet("Turbo", 2);
  const pet2 = new Pet("Peanut", 8);
  const pets1 = [pet1, pet2];
  const pets2 = [pet1, pet2];
  const pets3 = [pet1, pet2];
  const pets4 = [new Pet("Turbo", 2), new Pet("Peanut", 8)];
  class Comparer implements Interfaces.IEqualityComparer<Pet> {
    Equals(x: Pet, y: Pet) {
      if (x.Name === y.Name) {
        return true;
      }
      return false;
    }
  }
  describe("Enumerable", function () {
    test("basic", function () {
      assert.ok(Enumerable.asEnumerable(pets1).sequenceEqual(pets2));
      assert.ok(!Enumerable.asEnumerable(pets3).sequenceEqual(pets4));
      assert.ok(!Enumerable.asEnumerable([pet1]).sequenceEqual([pet1, pet2]));
    });
    test("compare", function () {
      assert.ok(Enumerable.asEnumerable(pets1).sequenceEqual(pets2, new Comparer()));
      assert.ok(Enumerable.asEnumerable(pets3).sequenceEqual(pets4, new Comparer()));
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable(pets1);
      assert.deepStrictEqual(e.sequenceEqual(pets2), e.sequenceEqual(pets2));
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.ok(await EnumerableAsync.asEnumerableAsync(pets1).sequenceEqual(pets2));
      assert.ok(!(await EnumerableAsync.asEnumerableAsync(pets3).sequenceEqual(pets4)));
      assert.ok(!(await EnumerableAsync.asEnumerableAsync([pet1]).sequenceEqual([pet1, pet2])));
    });
    test("compare", async function () {
      assert.ok(await EnumerableAsync.asEnumerableAsync(pets1).sequenceEqual(pets2, new Comparer()));
      assert.ok(await EnumerableAsync.asEnumerableAsync(pets3).sequenceEqual(pets4, new Comparer()));
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync(pets1);
      assert.deepStrictEqual(await e.sequenceEqual(pets2), await e.sequenceEqual(pets2));
    });
  });
  describe("EnumerableAsync async comparer", function () {
    class ComparerAsync implements Interfaces.IAsyncEqualityComparer<Pet> {
      async Equals(x: Pet, y: Pet) {
        if (x.Name === y.Name) {
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      }
    }
    test("compare", async function () {
      assert.ok(await EnumerableAsync.asEnumerableAsync(pets1).sequenceEqual(pets2, new ComparerAsync()));
      assert.ok(await EnumerableAsync.asEnumerableAsync(pets3).sequenceEqual(pets4, new ComparerAsync()));
    });
  });
});
