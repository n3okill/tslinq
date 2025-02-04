import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { Person } from "../shared.ts";

describe("forEach", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      const a = [1, 2, 3];
      let count = 0;
      Enumerable.create(a)
        .forEach((x) => {
          assert.strictEqual(x, a[count++]);
        })
        .toArray();
      assert.strictEqual(count, a.length);
      const result = Enumerable.create(a)
        .forEach((x) => x * 2)
        .toArray();
      assert.deepStrictEqual(result, [2, 4, 6]);
    });
    test("repeated calls", function () {
      const a = [1, 2, 3];
      const enumerable = Enumerable.create(a);
      const _for = enumerable.forEach((x) => x * 2);
      const result1 = _for.toArray();
      const result2 = _for.toArray();
      assert.deepStrictEqual(result1, [2, 4, 6]);
      assert.deepStrictEqual(result2, result1);
    });
    test("basic transformation", () => {
      const result = Enumerable.create([1, 2, 3])
        .forEach((x) => x * 2)
        .toArray();
      assert.deepStrictEqual(result, [2, 4, 6]);
    });

    test("side effects", () => {
      const sideEffects: Array<number> = [];
      Enumerable.create([1, 2, 3])
        .forEach((x) => {
          sideEffects.push(x);
          return x;
        })
        .toArray();
      assert.deepStrictEqual(sideEffects, [1, 2, 3]);
    });

    test("empty sequence", () => {
      const result = Enumerable.create([])
        .forEach((x) => x)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("transform objects", () => {
      interface Person {
        name: string;
      }
      const people: Array<Person> = [{ name: "John" }, { name: "Jane" }];
      const result = Enumerable.create(people)
        .forEach((p) => p.name.toUpperCase())
        .toArray();
      assert.deepStrictEqual(result, ["JOHN", "JANE"]);
    });

    test("chaining operations", () => {
      const result = Enumerable.create([1, 2, 3, 4])
        .forEach((x) => x * 2)
        .where((x) => x > 4)
        .toArray();
      assert.deepStrictEqual(result, [6, 8]);
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      const a = [1, 2, 3];
      let count = 0;
      await AsyncEnumerable.create(a)
        .forEach((x) => {
          assert.strictEqual(x, a[count++]);
        })
        .toArray();
      assert.strictEqual(count, a.length);
    });
    test("async action", async function () {
      const a = [1, 2, 3, 4, 5];
      let count = 0;
      const enumerable = AsyncEnumerable.create(a);
      const result = await enumerable
        .forEach(async (x) => {
          count++;
          return await Promise.resolve(x * 2);
        })
        .toArray();
      assert.strictEqual(count, 5);
      assert.deepStrictEqual(result, [2, 4, 6, 8, 10]);
    });
    test("repeated calls", async function () {
      const a = [1, 2, 3];
      const enumerable = AsyncEnumerable.create(a);
      const _for = enumerable.forEach((x) => x * 2);
      const result1 = await _for.toArray();
      const result2 = await _for.toArray();
      assert.deepStrictEqual(result1, [2, 4, 6]);
      assert.deepStrictEqual(result2, result1);
    });
    test("basic transformation", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .forEach((x) => x * 2)
        .toArray();
      assert.deepStrictEqual(result, [2, 4, 6]);
    });

    test("side effects", async () => {
      const sideEffects: Array<number> = [];
      await AsyncEnumerable.create([1, 2, 3])
        .forEach((x) => {
          sideEffects.push(x);
          return x;
        })
        .toArray();
      assert.deepStrictEqual(sideEffects, [1, 2, 3]);
    });

    test("empty sequence", async () => {
      const result = await AsyncEnumerable.create([])
        .forEach((x) => x)
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("transform objects", async () => {
      const people: Array<Person> = [{ name: "John" }, { name: "Jane" }];
      const result = await AsyncEnumerable.create(people)
        .forEach((p) => p.name?.toUpperCase())
        .toArray();
      assert.deepStrictEqual(result, ["JOHN", "JANE"]);
    });

    test("chaining operations", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3, 4])
        .forEach((x) => x * 2)
        .where((x) => x > 4)
        .toArray();
      assert.deepStrictEqual(result, [6, 8]);
    });
    test("async transformation", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .forEach(async (x) => x * 2)
        .toArray();
      assert.deepStrictEqual(result, [2, 4, 6]);
    });

    test("async side effects", async () => {
      const sideEffects: Array<number> = [];
      await AsyncEnumerable.create([1, 2, 3])
        .forEach(async (x) => {
          sideEffects.push(x);
          return x;
        })
        .toArray();
      assert.deepStrictEqual(sideEffects, [1, 2, 3]);
    });

    test("async with promises", async () => {
      const result = await AsyncEnumerable.create([
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3),
      ])
        .forEach(async (x) => (await x) * 2)
        .toArray();
      assert.deepStrictEqual(result, [2, 4, 6]);
    });
  });
});
