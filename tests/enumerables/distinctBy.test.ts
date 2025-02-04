import {
  AsyncEnumerable,
  Enumerable,
  EqualityComparer,
  InvalidArgumentException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import {
  AnagramEqualityComparer,
  CaseInsensitiveEqualityComparer,
  Person,
  Product,
  ProductEqualityComparer,
  ProductEqualityComparerAsync,
  WeakEqualityComparer,
  WeakEqualityComparerAsync,
} from "../shared.ts";

describe("distinctBy", function () {
  function* distinctByTestData(): Generator<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [Array<any>, (x: any) => any, EqualityComparer<any> | undefined, Array<any>]
  > {
    // Empty source
    yield [[], (x: number) => x, undefined, []];

    // Range 0-9
    yield [
      Array.from({ length: 10 }, (_, i) => i),
      (x: number) => x,
      undefined,
      Array.from({ length: 10 }, (_, i) => i),
    ];

    // All same key
    yield [
      Array.from({ length: 10 }, (_, i) => i + 5),
      () => true,
      undefined,
      [5],
    ];

    // Modulo key selector
    yield [
      Array.from({ length: 20 }, (_, i) => i),
      (x: number) => x % 5,
      undefined,
      Array.from({ length: 5 }, (_, i) => i),
    ];

    // Repeated values
    yield [Array(20).fill(5), (x: number) => x, undefined, [5]];

    // Case-sensitive strings
    yield [
      ["Bob", "bob", "tim", "Bob", "Tim"],
      (x: string) => x,
      undefined,
      ["Bob", "bob", "tim", "Tim"],
    ];

    // Case-insensitive strings
    yield [
      ["Bob", "bob", "tim", "Bob", "Tim"],
      (x: string) => x,
      new CaseInsensitiveEqualityComparer(),
      ["Bob", "tim"],
    ];

    // Objects with age key
    const people = [
      { name: "Tom", age: 20 },
      { name: "Dick", age: 30 },
      { name: "Harry", age: 40 },
    ];
    yield [people, (x: Person) => x.age, undefined, people];

    // Objects with duplicate ages
    const peopleWithDupes: Array<Person> = [
      { name: "Tom", age: 20 },
      { name: "Dick", age: 20 },
      { name: "Harry", age: 40 },
    ];
    yield [
      peopleWithDupes,
      (x: Person) => x.age,
      undefined,
      [peopleWithDupes[0], peopleWithDupes[2]],
    ];
  }

  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 1, 2])
          .distinctBy((x) => x)
          .toArray(),
        [1, 2],
      );
      assert.deepStrictEqual(
        Enumerable.create([1, 2])
          .concat([3, 4])
          .concat([1, 3])
          .distinctBy((x) => x)
          .toArray(),
        [1, 2, 3, 4],
      );
      assert.deepStrictEqual(
        Enumerable.create(["f", "o", "o"])
          .distinctBy((x) => x)
          .toArray(),
        ["f", "o"],
      );
      assert.deepStrictEqual(
        Enumerable.create([])
          .distinctBy((x) => x)
          .toArray(),
        [],
      );
    });
    test("Comparer", function () {
      const p1: Product = new Product("apple", 9);
      const p2: Product = new Product("orange", 4);
      const p3: Product = new Product("apple", 9);
      const p4: Product = new Product("lemon", 12);
      const products = [p1, p2, p3, p4];
      assert.deepStrictEqual(
        Enumerable.create(products)
          .distinctBy((x) => x.name)
          .toArray(),
        [p1, p2, p4],
      );
      assert.deepStrictEqual(
        Enumerable.create(products)
          .distinctBy((x) => x, new ProductEqualityComparer())
          .toArray(),
        [p1, p2, p4],
      );
      assert.deepStrictEqual(
        Enumerable.create(["1", 1, 2, 2, 3, "3"])
          .distinctBy((x) => x, new WeakEqualityComparer())
          .toArray(),
        ["1", 2, 3],
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2, 2]).distinctBy((x) => x);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    test("key selector null throws", () => {
      const source = ["Bob", "Tim", "Robert", "Chris"];
      const keySelector = null;
      assert.throws(
        () => Enumerable.create(source).distinctBy(keySelector as never),
        InvalidArgumentException,
      );
      assert.throws(
        () =>
          Enumerable.create(source).distinctBy(
            keySelector as never,
            new AnagramEqualityComparer(),
          ),
        InvalidArgumentException,
      );
    });
    test("distinctBy test data", async (t) => {
      let testNumber = 0;
      for (const [
        source,
        keySelector,
        comparer,
        expected,
      ] of distinctByTestData()) {
        await t.test(`Test: ${testNumber++} - ${source}`, () => {
          const result = Enumerable.create(source)
            .distinctBy(keySelector, comparer)
            .toArray();
          assert.deepStrictEqual(result, expected);
        });
      }
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 1, 2])
          .distinctBy((x) => x)
          .toArray(),
        [1, 2],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2])
          .concat([3, 4])
          .concat([1, 3])
          .distinctBy((x) => x)
          .toArray(),
        [1, 2, 3, 4],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(["f", "o", "o"])
          .distinctBy((x) => x)
          .toArray(),
        ["f", "o"],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([])
          .distinctBy((x) => x)
          .toArray(),
        [],
      );
    });
    test("Comparer", async function () {
      const p1: Product = new Product("apple", 9);
      const p2: Product = new Product("orange", 4);
      const p3: Product = new Product("apple", 9);
      const p4: Product = new Product("lemon", 12);
      const products = [p1, p2, p3, p4];
      assert.deepStrictEqual(
        await AsyncEnumerable.create(products)
          .distinctBy((x) => x.name)
          .toArray(),
        [p1, p2, p4],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(products)
          .distinctBy((x) => x, new ProductEqualityComparer())
          .toArray(),
        [p1, p2, p4],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(["1", 1, 2, 2, 3, "3"])
          .distinctBy((x) => x, new WeakEqualityComparer())
          .toArray(),
        ["1", 2, 3],
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 2]).distinctBy((x) => x);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("key selector null throws", async () => {
      const source = ["Bob", "Tim", "Robert", "Chris"];
      const keySelector = null;
      assert.throws(
        () => AsyncEnumerable.create(source).distinctBy(keySelector as never),
        InvalidArgumentException,
      );
      assert.throws(
        () =>
          AsyncEnumerable.create(source).distinctBy(
            keySelector as never,
            new AnagramEqualityComparer(),
          ),
        InvalidArgumentException,
      );
    });
    test("distinctBy test data", async (t) => {
      let testNumber = 0;
      for (const [
        source,
        keySelector,
        comparer,
        expected,
      ] of distinctByTestData()) {
        await t.test(`Test: ${testNumber++} - ${source}`, async () => {
          const result = await AsyncEnumerable.create(source)
            .distinctBy(keySelector, comparer)
            .toArray();
          assert.deepStrictEqual(result, expected);
        });
      }
    });
  });
  describe("AsyncEnumerable async comparer", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2, 1, 2])
          .distinctBy((x) => x)
          .toArray(),
        [1, 2],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([1, 2])
          .concat([3, 4])
          .concat([1, 3])
          .distinctBy((x) => x)
          .toArray(),
        [1, 2, 3, 4],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(["f", "o", "o"])
          .distinctBy((x) => x)
          .toArray(),
        ["f", "o"],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create([])
          .distinctBy((x) => x)
          .toArray(),
        [],
      );
    });
    test("Comparer", async function () {
      const p1: Product = new Product("apple", 9);
      const p2: Product = new Product("orange", 4);
      const p3: Product = new Product("apple", 9);
      const p4: Product = new Product("lemon", 12);
      const products = [p1, p2, p3, p4];
      assert.deepStrictEqual(
        await AsyncEnumerable.create(products)
          .distinctBy((x) => x, new ProductEqualityComparerAsync())
          .toArray(),
        [p1, p2, p4],
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.create(["1", 1, 2, 2, 3, "3"])
          .distinctBy((x) => x, new WeakEqualityComparerAsync())
          .toArray(),
        ["1", 2, 3],
      );
    });
  });
});
