import {
  AsyncEnumerable,
  Enumerable,
  EqualityComparer,
  EqualityComparerAsync,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("sequenceEqual", function () {
  class Pet {
    public Name: string;
    public Age: number;

    constructor(Name: string, Age: number) {
      this.Name = Name;
      this.Age = Age;
    }
  }
  const pet1 = new Pet("Turbo", 2);
  const pet2 = new Pet("Peanut", 8);
  const pets1 = [pet1, pet2];
  const pets2 = [pet1, pet2];
  const pets3 = [pet1, pet2];
  const pets4 = [new Pet("Turbo", 2), new Pet("Peanut", 8)];
  class Comparer implements EqualityComparer<Pet> {
    equals(x: Pet, y: Pet) {
      if (x.Name === y.Name) {
        return true;
      }
      return false;
    }
  }
  describe("Enumerable", function () {
    test("basic", function () {
      assert.ok(Enumerable.create(pets1).sequenceEqual(pets2));
      assert.ok(!Enumerable.create(pets3).sequenceEqual(pets4));
      assert.ok(!Enumerable.create([pet1]).sequenceEqual([pet1, pet2]));
    });
    test("compare", function () {
      assert.ok(Enumerable.create(pets1).sequenceEqual(pets2, new Comparer()));
      assert.ok(Enumerable.create(pets3).sequenceEqual(pets4, new Comparer()));
    });
    test("repeated calls", function () {
      const e = Enumerable.create(pets1);
      assert.deepStrictEqual(e.sequenceEqual(pets2), e.sequenceEqual(pets2));
    });
    test("empty sequences", () => {
      assert.ok(Enumerable.create([]).sequenceEqual([]));
      assert.ok(!Enumerable.create([1]).sequenceEqual([]));
      assert.ok(!Enumerable.create([]).sequenceEqual([1] as never));
    });

    test("with null and undefined values", () => {
      assert.ok(
        Enumerable.create([null, undefined]).sequenceEqual([null, undefined]),
      );
      assert.ok(!Enumerable.create([null]).sequenceEqual([undefined] as never));
    });

    test("performance with large sequences", () => {
      const size = 100000;
      const arr1 = Array.from({ length: size }, (_, i) => i);
      const arr2 = Array.from({ length: size }, (_, i) => i);
      const start = performance.now();
      assert.ok(Enumerable.create(arr1).sequenceEqual(arr2));
      assert.ok(performance.now() - start < 150);
    });

    test("custom deep equality comparer", () => {
      class DeepComparer extends EqualityComparer<{ a: { b: number } }> {
        equals(x: { a: { b: number } }, y: { a: { b: number } }): boolean {
          if (x === y) return true;
          if (typeof x !== "object" || typeof y !== "object") return false;
          return JSON.stringify(x) === JSON.stringify(y);
        }
      }
      const seq1 = [{ a: { b: 1 } }, { a: { b: 2 } }];
      const seq2 = [{ a: { b: 1 } }, { a: { b: 2 } }];
      assert.ok(
        Enumerable.create(seq1).sequenceEqual(seq2, new DeepComparer()),
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.ok(await AsyncEnumerable.create(pets1).sequenceEqual(pets2));
      assert.ok(!(await AsyncEnumerable.create(pets3).sequenceEqual(pets4)));
      assert.ok(
        !(await AsyncEnumerable.create([pet1]).sequenceEqual([pet1, pet2])),
      );
    });
    test("compare", async function () {
      assert.ok(
        await AsyncEnumerable.create(pets1).sequenceEqual(
          pets2,
          new Comparer(),
        ),
      );
      assert.ok(
        await AsyncEnumerable.create(pets3).sequenceEqual(
          pets4,
          new Comparer(),
        ),
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create(pets1);
      assert.deepStrictEqual(
        await e.sequenceEqual(pets2),
        await e.sequenceEqual(pets2),
      );
    });
    test("async with delayed values", async () => {
      const delayed = AsyncEnumerable.create(
        (async function* () {
          yield 1;
          await new Promise((resolve) => setTimeout(resolve, 10));
          yield 2;
        })(),
      );
      assert.ok(await delayed.sequenceEqual([1, 2]));
    });

    test("async with mixed timing comparers", async () => {
      class TimedComparer extends EqualityComparerAsync<number> {
        async equals(x: number, y: number): Promise<boolean> {
          await new Promise((resolve) => setTimeout(resolve, x * 10));
          return x === y;
        }
      }
      const start = performance.now();
      await AsyncEnumerable.create([1, 2]).sequenceEqual(
        [1, 2],
        new TimedComparer(),
      );
      assert.ok(performance.now() - start >= 30);
    });

    test("async error propagation", async () => {
      const errorSeq = AsyncEnumerable.create(
        (async function* () {
          yield 1;
          throw new Error("Iterator error");
        })(),
      );
      await assert.rejects(() => errorSeq.sequenceEqual([1, 2]));
    });
  });
  describe("AsyncEnumerable async comparer", function () {
    class ComparerAsync implements EqualityComparerAsync<Pet> {
      async equals(x: Pet, y: Pet) {
        if (x.Name === y.Name) {
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      }
    }
    test("compare", async function () {
      assert.ok(
        await AsyncEnumerable.create(pets1).sequenceEqual(
          pets2,
          new ComparerAsync(),
        ),
      );
      assert.ok(
        await AsyncEnumerable.create(pets3).sequenceEqual(
          pets4,
          new ComparerAsync(),
        ),
      );
    });
  });
});
