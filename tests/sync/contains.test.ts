import {
  AsyncEnumerable,
  Enumerable,
  EqualityComparer,
  EqualityComparerAsync,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("Contains", function () {
  class Comparer extends EqualityComparer<number> {
    equals(x?: number, y?: number): boolean {
      return (x as number) + 1 == y;
    }
  }
  describe("Enumerable", function () {
    test("true", function () {
      const c = Enumerable.create([-1, 0, 2]);
      assert.ok(c.contains(-1));
      assert.strictEqual(c.contains(-1), c.contains(-1));
      assert.ok(c.contains(3, new Comparer()));
    });
    test("false", function () {
      const c = Enumerable.create([-1, 0, 2]);
      assert.ok(!c.contains(3));
      assert.ok(!c.contains(4, new Comparer()));
      assert.ok(!c.contains("2" as unknown as number));
    });
    test("repeated calls", function () {
      const e = Enumerable.create([-1, 0, 2]);
      assert.strictEqual(e.contains(-1), e.contains(-1));
    });
    test("empty collection", () => {
      const empty = Enumerable.create([]);
      assert.strictEqual(empty.contains(1 as never), false);
    });

    test("with null values", () => {
      const withNull = Enumerable.create([null, 1, 2]);
      assert.strictEqual(withNull.contains(null), true);
      assert.strictEqual(withNull.contains(undefined as never), false);
    });

    test("with custom objects", () => {
      class Person {
        public name: string;
        constructor(name: string) {
          this.name = name;
        }
      }
      class PersonComparer extends EqualityComparer<Person> {
        equals(x?: Person, y?: Person): boolean {
          return x?.name === y?.name;
        }
      }
      const people = Enumerable.create([
        new Person("Alice"),
        new Person("Bob"),
      ]);
      assert.strictEqual(
        people.contains(new Person("Alice"), new PersonComparer()),
        true,
      );
    });

    test("with duplicate values", () => {
      const duplicates = Enumerable.create([1, 1, 2, 2, 3]);
      assert.strictEqual(duplicates.contains(1), true);
      assert.strictEqual(duplicates.contains(4), false);
    });
    test("mixed type comparisons", () => {
      const mixed = Enumerable.create(["1", 2, true, null]);
      assert.strictEqual(mixed.contains("2"), false);
      assert.strictEqual(mixed.contains(2), true);
    });
  });
  describe("AsyncEnumerable", function () {
    test("true", async function () {
      const c = AsyncEnumerable.create([-1, 0, 2]);
      assert.ok(await c.contains(-1));
      assert.strictEqual(await c.contains(-1), await c.contains(-1));
      assert.ok(await c.contains(3, new Comparer()));
    });
    test("false", async function () {
      const c = AsyncEnumerable.create([-1, 0, 2]);
      assert.ok(!(await c.contains(3)));
      assert.ok(!(await c.contains(4, new Comparer())));
      assert.ok(!(await c.contains("2" as unknown as number)));
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([-1, 0, 2]);
      assert.strictEqual(await e.contains(-1), await e.contains(-1));
    });
    test("async empty collection", async () => {
      const empty = AsyncEnumerable.create([]);
      assert.strictEqual(await empty.contains(1 as never), false);
    });

    test("async with delayed values", async () => {
      const delayed = AsyncEnumerable.create(
        (async function* () {
          yield await Promise.resolve(1);
          yield await Promise.resolve(2);
        })(),
      );
      assert.strictEqual(await delayed.contains(1), true);
      assert.strictEqual(await delayed.contains(3), false);
    });

    test("async with custom async comparer", async () => {
      class DelayedComparer extends EqualityComparerAsync<number> {
        async equals(x?: number, y?: number): Promise<boolean> {
          await new Promise((resolve) => setTimeout(resolve, 10));
          return x === y;
        }
      }
      const numbers = AsyncEnumerable.create([1, 2, 3]);
      assert.strictEqual(
        await numbers.contains(2, new DelayedComparer()),
        true,
      );
    });

    test("async with error in iterator", async () => {
      const errorIterator = AsyncEnumerable.create(
        (async function* () {
          yield 1;
          throw new Error("Iterator error");
        })(),
      );
      await assert.rejects(
        async () => await errorIterator.contains(2),
        /Iterator error/,
      );
    });
    test("mixed type comparisons", async () => {
      const mixed = AsyncEnumerable.create(["1", 2, true, null]);
      assert.strictEqual(await mixed.contains("2"), false);
      assert.strictEqual(await mixed.contains(2), true);
    });
  });
  describe("AsyncEnumerable async comparer", function () {
    class ComparerAsync extends EqualityComparerAsync<number> {
      async equals(x?: number, y?: number): Promise<boolean> {
        return Promise.resolve((x as number) + 1 == y);
      }
    }
    test("true", async function () {
      const c = AsyncEnumerable.create([-1, 0, 2]);
      assert.ok(await c.contains(-1));
      assert.strictEqual(await c.contains(-1), await c.contains(-1));
      assert.ok(await c.contains(3, new ComparerAsync()));
    });
    test("false", async function () {
      const c = AsyncEnumerable.create([-1, 0, 2]);
      assert.ok(!(await c.contains(3)));
      assert.ok(!(await c.contains(4, new ComparerAsync())));
      assert.ok(!(await c.contains("2" as unknown as number)));
    });
  });
});
