import {
  AsyncEnumerable,
  Enumerable,
  EqualityComparer,
  EqualityComparerAsync,
  InvalidArgumentException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { AnagramEqualityComparer } from "../shared.ts";

describe("groupBy", function () {
  class Pet {
    public Name: string;
    public Age: number;

    constructor(Name: string, Age: number) {
      this.Name = Name;
      this.Age = Age;
    }
  }

  interface ScoreRecord {
    name: string;
    score: number;
  }
  const pets = [
    new Pet("Barley", 8.3),
    new Pet("Boots", 4.9),
    new Pet("Whiskers", 1.5),
    new Pet("Daisy", 4.3),
  ];
  describe("Enumerable", function () {
    test("key selector", () => {
      const e = Enumerable.create(pets);
      const grouping = e.groupBy((pet) => Math.floor(pet.Age));
      assert.deepStrictEqual(
        grouping.select((g) => [g.key, g.toArray()]).toArray(),
        [
          [8, [pets[0]]],
          [4, [pets[1], pets[3]]],
          [1, [pets[2]]],
        ],
      );
    });
    test("result selector", function () {
      const e = Enumerable.create(pets);
      const grouping = e.groupBy(
        ({ Age }) => Math.floor(Age), // (pet) => Math.floor(pet.Age),
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
      const groupBy = Enumerable.create([1, 2, 3, 4, 5, 6, 7, 8, 9])
        .groupBy((x) => x % 2)
        .orderBy((x) => x.key);
      assert.deepStrictEqual(
        groupBy.select((g) => [g.key, g.toArray()]).toArray(),
        [
          [0, [2, 4, 6, 8]],
          [1, [1, 3, 5, 7, 9]],
        ],
      );
    });
    test("repeated calls", function () {
      const groupBy = Enumerable.create([1, 2, 3, 4, 5, 6, 7, 8, 9]).groupBy(
        (x) => x % 2,
      );
      assert.deepStrictEqual(groupBy.toArray(), groupBy.toArray());
    });
    test("SingleNullKeySingleNullElement", () => {
      assert.deepStrictEqual(
        Enumerable.create([null])
          .groupBy(
            (e) => e,
            (e) => e,
            EqualityComparer.default,
          )
          .select((g) => [g.key, g.toArray()])
          .toArray(),
        [[null, [null]]],
      );
    });
    test("EmptySource", () => {
      assert.deepStrictEqual(
        Enumerable.create([])
          .groupBy((e) => e)
          .toArray(),
        [],
      );
    });
    test("keySelector null", () => {
      const source = [
        { Name: "Tim", Score: 55 },
        { Name: "Chris", Score: 49 },
        { Name: "Robert", Score: -100 },
        { Name: "Chris", Score: 24 },
        { Name: "Prakash", Score: 9 },
        { Name: "Tim", Score: 25 },
      ];
      assert.throws(
        () => Enumerable.create(source).groupBy(null as never),
        InvalidArgumentException,
      );
    });
    test("elementSelector null", () => {
      const source = [
        { Name: "Tim", Score: 55 },
        { Name: "Chris", Score: 49 },
        { Name: "Robert", Score: -100 },
        { Name: "Chris", Score: 24 },
        { Name: "Prakash", Score: 9 },
        { Name: "Tim", Score: 25 },
      ];
      assert.throws(
        () => Enumerable.create(source).groupBy((e) => e, null as never),
        InvalidArgumentException,
      );
    });
    test("resultSelector null", () => {
      const source = [
        { Name: "Tim", Score: 55 },
        { Name: "Chris", Score: 49 },
        { Name: "Robert", Score: -100 },
        { Name: "Chris", Score: 24 },
        { Name: "Prakash", Score: 9 },
        { Name: "Tim", Score: 25 },
      ];
      assert.throws(
        () =>
          Enumerable.create(source).groupBy(
            (e) => e,
            (e) => e,
            null as never,
          ),
        InvalidArgumentException,
      );
    });
    test("resultSelector null no elementSelector", () => {
      const source = [
        { Name: "Tim", Score: 55 },
        { Name: "Chris", Score: 49 },
        { Name: "Robert", Score: -100 },
        { Name: "Chris", Score: 24 },
        { Name: "Prakash", Score: 9 },
        { Name: "Tim", Score: 25 },
      ];
      assert.throws(
        () =>
          Enumerable.create(source).groupBy((e) => e, undefined, null as never),
        InvalidArgumentException,
      );
    });
    test("duplicate keys", () => {
      const source = [
        { Name: "Tim", Score: 55 },
        { Name: "Chris", Score: 49 },
        { Name: "Robert", Score: -100 },
        { Name: "Chris", Score: 24 },
        { Name: "Prakash", Score: 9 },
        { Name: "Tim", Score: 25 },
      ];
      const expected = [240, 365, -600, 63];

      assert.deepStrictEqual(
        Enumerable.create(source)
          .groupBy(
            (e) => e.Name,
            (e) => e.Score,
            (k, es) => (k ?? " ").length * es.sum(),
          )
          .toArray(),
        expected,
      );
    });
    test("single element", () => {
      assert.deepStrictEqual(
        Enumerable.create([{ name: "Tim", Score: 60 }])
          .groupBy((e) => e.name)
          .select((g) => [g.key, g.toArray()])
          .toArray(),
        [["Tim", [{ name: "Tim", Score: 60 }]]],
      );
    });
    test("all elements same key", () => {
      const key = ["Tim", "Tim", "Tim", "Tim"];
      const scores = [60, -10, 40, 100];

      const source = Enumerable.create(scores).zip(key, (s, k) => ({
        Name: k,
        Score: s,
      }));
      assert.deepStrictEqual(
        source
          .groupBy((e) => e.Name)
          .select((g) => [g.key, g.toArray()])
          .toArray(),
        [["Tim", source.toArray()]],
      );
    });
    test("all elements different key elementSelector used", () => {
      const key = ["Tim", "Chris", "Robert", "Prakash"];
      const element = [60, -10, 40, 100];
      const source = Enumerable.create(key).zip(element, (k, e) => ({
        name: k,
        score: e,
      }));
      assert.deepStrictEqual(
        source
          .groupBy(
            (e) => e.name,
            (e) => e.score,
          )
          .select((g) => [g.key, g.toArray()])
          .toArray(),
        [
          ["Tim", [60]],
          ["Chris", [-10]],
          ["Robert", [40]],
          ["Prakash", [100]],
        ],
      );
    });
    test("some duplicate keys", () => {
      const key = ["Tim", "Tim", "Chris", "Chris", "Robert", "Prakash"];
      const element = [55, 25, 49, 24, -100, 9];
      const source = Enumerable.create(key).zip(element, (k, e) => ({
        name: k,
        score: e,
      }));
      assert.deepStrictEqual(
        source
          .groupBy(
            (e) => e.name,
            (e) => e.score,
          )
          .select((g) => [g.key, g.toArray()])
          .toArray(),
        [
          ["Tim", [55, 25]],
          ["Chris", [49, 24]],
          ["Robert", [-100]],
          ["Prakash", [9]],
        ],
      );
    });
    test("some duplicate keys including nulls", () => {
      const key = [null, null, "Chris", "Chris", "Prakash", "Prakash"];
      const element = [55, 25, 49, 24, 9, 9];
      const source = Enumerable.create(key).zip(element, (k, e) => ({
        name: k,
        score: e,
      }));
      assert.deepStrictEqual(
        source
          .groupBy(
            (e) => e.name,
            (e) => e.score,
          )
          .select((g) => [g.key, g.toArray()])
          .toArray(),
        [
          [null, [55, 25]],
          ["Chris", [49, 24]],
          ["Prakash", [9, 9]],
        ],
      );
    });
    test("single element resultSelector used", () => {
      const key = ["Tim"];
      const element = [60];
      const expected = [180];
      const source = Enumerable.create(key).zip(element, (k, e) => ({
        name: k,
        score: e,
      }));
      assert.deepStrictEqual(
        source
          .groupBy(
            (e) => e.name,
            (e) => e.score,
            (k, es) => k.length * es.sum(),
          )
          .toArray(),
        expected,
      );
    });
    test("GroupedResultCorrectSize", () => {
      const elements = Enumerable.repeat("q", 5);

      const result = elements.groupBy(
        (e) => e,
        undefined,
        (e, f) => ({ Key: e, Element: f }),
      );
      assert.strictEqual(result.count(), 1);

      const grouping = result.first();
      assert.strictEqual(grouping.Element.count(), 5);
      assert.strictEqual(grouping.Key, "q");
      assert.strictEqual(
        grouping.Element.all((e) => e == "q"),
        true,
      );
    });
    test("All Elements Different KeyElementSelector Used ResultSelector", () => {
      const keys = ["Tim", "Chris", "Robert", "Prakash"];
      const elements = [60, -10, 40, 100];
      const source = Enumerable.create(keys).zip(elements, (k, e) => ({
        name: k,
        score: e,
      }));
      const expected = [180, -50, 240, 700];

      const result = source.groupBy(
        (e) => e.name,
        (e) => e.score,
        (k, es) => (k ?? " ").length * es.sum(),
      );

      assert.deepStrictEqual(result.toArray(), expected);
    });
    test("All Elements Same Key ResultSelector Used", () => {
      const source = [
        { name: "Tim", score: 60 },
        { name: "Tim", score: -10 },
        { name: "miT", score: 40 },
        { name: "miT", score: 100 },
      ];
      const expected = [570];

      const result = Enumerable.create(source).groupBy(
        (e) => e.name,
        undefined,
        (k, es) => k.length * es.sum((e) => e.score),
        new AnagramEqualityComparer(),
      );

      assert.deepStrictEqual(result.toArray(), expected);
    });
    test("No Comparer ResultSelector Used", () => {
      const source = [
        { name: "Tim", score: 60 },
        { name: "Tim", score: -10 },
        { name: "miT", score: 40 },
        { name: "miT", score: 100 },
      ];
      const expected = [150, 420];

      const result = Enumerable.create(source).groupBy(
        (e) => e.name,
        undefined,
        (k, es) => k.length * es.sum((e) => e.score),
      );

      assert.deepStrictEqual(result.toArray(), expected);
    });
    test("Grouping ToArray", () => {
      const source = [
        { name: "Tim", score: 55 },
        { name: "Chris", score: 49 },
        { name: "Robert", score: -100 },
        { name: "Chris", score: 24 },
        { name: "Prakash", score: 9 },
        { name: "Tim", score: 25 },
      ];
      const groupSource = Enumerable.create(source);

      const groupedArray = groupSource.groupBy((r) => r.name).toArray();

      assert.strictEqual(groupedArray.length, 4);
      assert.deepStrictEqual(
        groupedArray,
        groupSource.groupBy((r) => r.name).toArray(),
      );
    });
    test("Grouping With ElementSelector ToArray", () => {
      const source: Array<ScoreRecord> = [
        { name: "Tim", score: 55 },
        { name: "Chris", score: 49 },
        { name: "Robert", score: -100 },
        { name: "Chris", score: 24 },
        { name: "Prakash", score: 9 },
        { name: "Tim", score: 25 },
      ];

      const groupedArray = Enumerable.create(source)
        .groupBy(
          (r) => r.name,
          (e) => e.score,
        )
        .toArray();

      assert.strictEqual(groupedArray.length, 4);
      assert.deepStrictEqual(
        groupedArray,
        Enumerable.create(source)
          .groupBy(
            (r) => r.name,
            (e) => e.score,
          )
          .toArray(),
      );
    });
    test("Grouping With Results ToArray", () => {
      const source: Array<ScoreRecord> = [
        { name: "Tim", score: 55 },
        { name: "Chris", score: 49 },
        { name: "Robert", score: -100 },
        { name: "Chris", score: 24 },
        { name: "Prakash", score: 9 },
        { name: "Tim", score: 25 },
      ];

      const groupedArray = Enumerable.create(source)
        .groupBy(
          (r) => r.name,
          undefined,
          (_key, elements) => elements,
        )
        .toArray();

      assert.strictEqual(groupedArray.length, 4);
      assert.deepStrictEqual(
        groupedArray,
        Enumerable.create(source)
          .groupBy(
            (r) => r.name,
            undefined,
            (_key, elements) => elements,
          )
          .toArray(),
      );
    });
    test("Grouping With ElementSelector And Results ToArray", () => {
      const source: Array<ScoreRecord> = [
        { name: "Tim", score: 55 },
        { name: "Chris", score: 49 },
        { name: "Robert", score: -100 },
        { name: "Chris", score: 24 },
        { name: "Prakash", score: 9 },
        { name: "Tim", score: 25 },
      ];

      const groupedArray = Enumerable.create(source)
        .groupBy(
          (r) => r.name,
          (e) => e,
          (_r, e) => e,
        )
        .toArray();

      assert.strictEqual(groupedArray.length, 4);
      assert.deepStrictEqual(
        groupedArray,
        Enumerable.create(source)
          .groupBy(
            (r) => r.name,
            (e) => e,
            (_r, e) => e,
          )
          .toArray(),
      );
    });
    test("Grouping Count", () => {
      const source: Array<ScoreRecord> = [
        { name: "Tim", score: 55 },
        { name: "Chris", score: 49 },
        { name: "Robert", score: -100 },
        { name: "Chris", score: 24 },
        { name: "Prakash", score: 9 },
        { name: "Tim", score: 25 },
      ];

      assert.strictEqual(
        Enumerable.create(source)
          .groupBy((r) => r.name)
          .count(),
        4,
      );
    });
    test("Grouping With ElementSelector Count", () => {
      const source: Array<ScoreRecord> = [
        { name: "Tim", score: 55 },
        { name: "Chris", score: 49 },
        { name: "Robert", score: -100 },
        { name: "Chris", score: 24 },
        { name: "Prakash", score: 9 },
        { name: "Tim", score: 25 },
      ];

      assert.strictEqual(
        Enumerable.create(source)
          .groupBy(
            (r) => r.name,
            (e) => e.score,
          )
          .count(),
        4,
      );
    });
    test("Grouping With Results Count", () => {
      const source: Array<ScoreRecord> = [
        { name: "Tim", score: 55 },
        { name: "Chris", score: 49 },
        { name: "Robert", score: -100 },
        { name: "Chris", score: 24 },
        { name: "Prakash", score: 9 },
        { name: "Tim", score: 25 },
      ];

      assert.strictEqual(
        Enumerable.create(source)
          .groupBy(
            (r) => r.name,
            undefined,
            (_r, e) => e,
          )
          .count(),
        4,
      );
    });
    test("Grouping With ElementSelector And Results Count", () => {
      const source: Array<ScoreRecord> = [
        { name: "Tim", score: 55 },
        { name: "Chris", score: 49 },
        { name: "Robert", score: -100 },
        { name: "Chris", score: 24 },
        { name: "Prakash", score: 9 },
        { name: "Tim", score: 25 },
      ];

      assert.strictEqual(
        Enumerable.create(source)
          .groupBy(
            (r) => r.name,
            (e) => e,
            (_r, e) => e,
          )
          .count(),
        4,
      );
    });
    test("Empty Grouping ToArray", () => {
      assert.deepStrictEqual(
        Enumerable.empty<number>()
          .groupBy((i) => i)
          .toArray(),
        [],
      );
    });
    test("Empty Grouping Count", () => {
      assert.strictEqual(
        Enumerable.empty<number>()
          .groupBy((i) => i)
          .count(),
        0,
      );
    });
    test("Empty Grouping With Result ToArray", () => {
      assert.deepStrictEqual(
        Enumerable.empty<number>()
          .groupBy(
            (i) => i,
            undefined,
            (x, y) => x + y.count(),
          )
          .toArray(),
        [],
      );
    });
    test("Empty Grouping With Result Count", () => {
      assert.strictEqual(
        Enumerable.empty<number>()
          .groupBy(
            (i) => i,
            undefined,
            (x, y) => x + y.count(),
          )
          .count(),
        0,
      );
    });
    test("Multiple Iterations Of Same Enumerable", () => {
      const enumerables = [
        Enumerable.range(0, 10).groupBy((i) => i),
        Enumerable.range(0, 10).groupBy(
          (i) => i,
          (i) => i,
        ),
      ];

      for (const e1 of enumerables) {
        for (let trial = 0; trial < 3; trial++) {
          let count = 0;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          for (const _g of e1) count++;
          assert.strictEqual(count, 10);
        }
      }

      const resultEnumerables = [
        Enumerable.range(0, 10).groupBy(
          (i) => i,
          undefined,
          (i) => i,
        ),
        Enumerable.range(0, 10).groupBy(
          (i) => i,
          (i) => i,
          (i) => i,
        ),
      ];

      for (const e2 of resultEnumerables) {
        for (let trial = 0; trial < 3; trial++) {
          let count = 0;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          for (const _i of e2) count++;
          assert.strictEqual(count, 10);
        }
      }
    });
    test("Enumerate Grouping", () => {
      const g = Enumerable.range(0, 42)
        .groupBy(() => "onegroup")
        .first();
      assert.strictEqual(g.key, "onegroup");
      assert.strictEqual(g.count(), 42);

      const iterator = g.iterator();
      const values = new Set<number>();

      let result = iterator.next();
      while (!result.done) {
        values.add(result.value);
        result = iterator.next();
      }

      assert.strictEqual(values.size, 42);
      assert.deepStrictEqual(
        Array.from(values).sort((a, b) => a - b),
        Array.from({ length: 42 }, (_, i) => i),
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("key selector", async () => {
      const e = AsyncEnumerable.create(pets);
      const grouping = e.groupBy((pet) => Math.floor(pet.Age));
      assert.deepStrictEqual(
        await grouping.select((g) => [g.key, g.toArray()]).toArray(),
        [
          [8, [pets[0]]],
          [4, [pets[1], pets[3]]],
          [1, [pets[2]]],
        ],
      );
    });
    test("result selector", async function () {
      const e = AsyncEnumerable.create(pets);
      const grouping = e.groupBy(
        ({ Age }) => Math.floor(Age), // (pet) => Math.floor(pet.Age),
        (pet) => pet.Age,
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
      const groupBy = AsyncEnumerable.create([1, 2, 3, 4, 5, 6, 7, 8, 9])
        .groupBy((x) => x % 2)
        .orderBy((x) => x.key);
      assert.deepStrictEqual(
        await groupBy.select((g) => [g.key, g.toArray()]).toArray(),
        [
          [0, [2, 4, 6, 8]],
          [1, [1, 3, 5, 7, 9]],
        ],
      );
    });
    test("repeated calls", async function () {
      const groupBy = AsyncEnumerable.create([
        1, 2, 3, 4, 5, 6, 7, 8, 9,
      ]).groupBy((x) => x % 2);
      assert.deepStrictEqual(await groupBy.toArray(), await groupBy.toArray());
    });
    test("SingleNullKeySingleNullElement", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([null])
          .groupBy(
            (e) => e,
            (e) => e,
            EqualityComparerAsync.default,
          )
          .select((g) => [g.key, g.toArray()])
          .toArray(),
        [[null, [null]]],
      );
    });
    test("EmptySource", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([])
          .groupBy((e) => e)
          .toArray(),
        [],
      );
    });
    test("keySelector null", async () => {
      const source = [
        { Name: "Tim", Score: 55 },
        { Name: "Chris", Score: 49 },
        { Name: "Robert", Score: -100 },
        { Name: "Chris", Score: 24 },
        { Name: "Prakash", Score: 9 },
        { Name: "Tim", Score: 25 },
      ];
      assert.throws(
        () => AsyncEnumerable.create(source).groupBy(null as never),
        InvalidArgumentException,
      );
    });
    test("elementSelector null", async () => {
      const source = [
        { Name: "Tim", Score: 55 },
        { Name: "Chris", Score: 49 },
        { Name: "Robert", Score: -100 },
        { Name: "Chris", Score: 24 },
        { Name: "Prakash", Score: 9 },
        { Name: "Tim", Score: 25 },
      ];
      assert.throws(
        () => AsyncEnumerable.create(source).groupBy((e) => e, null as never),
        InvalidArgumentException,
      );
    });
    test("resultSelector null", async () => {
      const source = [
        { Name: "Tim", Score: 55 },
        { Name: "Chris", Score: 49 },
        { Name: "Robert", Score: -100 },
        { Name: "Chris", Score: 24 },
        { Name: "Prakash", Score: 9 },
        { Name: "Tim", Score: 25 },
      ];
      assert.throws(
        () =>
          AsyncEnumerable.create(source).groupBy(
            (e) => e,
            (e) => e,
            null as never,
          ),
        InvalidArgumentException,
      );
    });
    test("resultSelector null no elementSelector", async () => {
      const source = [
        { Name: "Tim", Score: 55 },
        { Name: "Chris", Score: 49 },
        { Name: "Robert", Score: -100 },
        { Name: "Chris", Score: 24 },
        { Name: "Prakash", Score: 9 },
        { Name: "Tim", Score: 25 },
      ];
      assert.throws(
        () =>
          AsyncEnumerable.create(source).groupBy(
            (e) => e,
            undefined,
            null as never,
          ),
        InvalidArgumentException,
      );
    });
    test("duplicate keys", async () => {
      const source = [
        { Name: "Tim", Score: 55 },
        { Name: "Chris", Score: 49 },
        { Name: "Robert", Score: -100 },
        { Name: "Chris", Score: 24 },
        { Name: "Prakash", Score: 9 },
        { Name: "Tim", Score: 25 },
      ];
      const expected = [240, 365, -600, 63];

      assert.deepStrictEqual(
        await AsyncEnumerable.create(source)
          .groupBy(
            (e) => e.Name,
            (e) => e.Score,
            async (k, es) => (k ?? " ").length * (await es.sum()),
          )
          .toArray(),
        expected,
      );
    });
    test("single element", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.create([{ name: "Tim", Score: 60 }])
          .groupBy((e) => e.name)
          .select((g) => [g.key, g.toArray()])
          .toArray(),
        [["Tim", [{ name: "Tim", Score: 60 }]]],
      );
    });
    test("all elements same key", async () => {
      const key = ["Tim", "Tim", "Tim", "Tim"];
      const scores = [60, -10, 40, 100];

      const source = AsyncEnumerable.create(scores).zip(key, (s, k) => ({
        Name: k,
        Score: s,
      }));
      assert.deepStrictEqual(
        await source
          .groupBy((e) => e.Name)
          .select((g) => [g.key, g.toArray()])
          .toArray(),
        [["Tim", await source.toArray()]],
      );
    });
    test("all elements different key elementSelector used", async () => {
      const key = ["Tim", "Chris", "Robert", "Prakash"];
      const element = [60, -10, 40, 100];
      const source = AsyncEnumerable.create(key).zip(element, (k, e) => ({
        name: k,
        score: e,
      }));
      assert.deepStrictEqual(
        await source
          .groupBy(
            (e) => e.name,
            (e) => e.score,
          )
          .select((g) => [g.key, g.toArray()])
          .toArray(),
        [
          ["Tim", [60]],
          ["Chris", [-10]],
          ["Robert", [40]],
          ["Prakash", [100]],
        ],
      );
    });
    test("some duplicate keys", async () => {
      const key = ["Tim", "Tim", "Chris", "Chris", "Robert", "Prakash"];
      const element = [55, 25, 49, 24, -100, 9];
      const source = AsyncEnumerable.create(key).zip(element, (k, e) => ({
        name: k,
        score: e,
      }));
      assert.deepStrictEqual(
        await source
          .groupBy(
            (e) => e.name,
            (e) => e.score,
          )
          .select((g) => [g.key, g.toArray()])
          .toArray(),
        [
          ["Tim", [55, 25]],
          ["Chris", [49, 24]],
          ["Robert", [-100]],
          ["Prakash", [9]],
        ],
      );
    });
    test("some duplicate keys including nulls", async () => {
      const key = [null, null, "Chris", "Chris", "Prakash", "Prakash"];
      const element = [55, 25, 49, 24, 9, 9];
      const source = AsyncEnumerable.create(key).zip(element, (k, e) => ({
        name: k,
        score: e,
      }));
      assert.deepStrictEqual(
        await source
          .groupBy(
            (e) => e.name,
            (e) => e.score,
          )
          .select((g) => [g.key, g.toArray()])
          .toArray(),
        [
          [null, [55, 25]],
          ["Chris", [49, 24]],
          ["Prakash", [9, 9]],
        ],
      );
    });
    test("single element resultSelector used", async () => {
      const key = ["Tim"];
      const element = [60];
      const expected = [180];
      const source = AsyncEnumerable.create(key).zip(element, (k, e) => ({
        name: k,
        score: e,
      }));
      assert.deepStrictEqual(
        await source
          .groupBy(
            (e) => e.name,
            (e) => e.score,
            async (k, es) => k.length * (await es.sum()),
          )
          .toArray(),
        expected,
      );
    });
    test("GroupedResultCorrectSize", async () => {
      const elements = AsyncEnumerable.repeat("q", 5);

      const result = elements.groupBy(
        (e) => e,
        undefined,
        async (e, f) => ({ Key: e, Element: f }),
      );
      assert.strictEqual(await result.count(), 1);

      const grouping = await result.first();
      assert.strictEqual(await grouping.Element.count(), 5);
      assert.strictEqual(grouping.Key, "q");
      assert.strictEqual(await grouping.Element.all((e) => e == "q"), true);
    });
    test("All Elements Different KeyElementSelector Used ResultSelector", async () => {
      const keys = ["Tim", "Chris", "Robert", "Prakash"];
      const elements = [60, -10, 40, 100];
      const source = AsyncEnumerable.create(keys).zip(elements, (k, e) => ({
        name: k,
        score: e,
      }));
      const expected = [180, -50, 240, 700];

      const result = source.groupBy(
        (e) => e.name,
        (e) => e.score,
        async (k, es) => (k ?? " ").length * (await es.sum()),
      );

      assert.deepStrictEqual(await result.toArray(), expected);
    });
    test("All Elements Same Key ResultSelector Used", async () => {
      const source = [
        { name: "Tim", score: 60 },
        { name: "Tim", score: -10 },
        { name: "miT", score: 40 },
        { name: "miT", score: 100 },
      ];
      const expected = [570];

      const result = AsyncEnumerable.create(source).groupBy(
        (e) => e.name,
        undefined,
        async (k, es) => k.length * (await es.sum((e) => e.score)),
        new AnagramEqualityComparer(),
      );

      assert.deepStrictEqual(await result.toArray(), expected);
    });
    test("No Comparer ResultSelector Used", async () => {
      const source = [
        { name: "Tim", score: 60 },
        { name: "Tim", score: -10 },
        { name: "miT", score: 40 },
        { name: "miT", score: 100 },
      ];
      const expected = [150, 420];

      const result = AsyncEnumerable.create(source).groupBy(
        (e) => e.name,
        undefined,
        async (k, es) => k.length * (await es.sum((e) => e.score)),
      );

      assert.deepStrictEqual(await result.toArray(), expected);
    });
    test("Grouping ToArray", async () => {
      const source = [
        { name: "Tim", score: 55 },
        { name: "Chris", score: 49 },
        { name: "Robert", score: -100 },
        { name: "Chris", score: 24 },
        { name: "Prakash", score: 9 },
        { name: "Tim", score: 25 },
      ];
      const groupSource = AsyncEnumerable.create(source);

      const groupedArray = await groupSource.groupBy((r) => r.name).toArray();

      assert.strictEqual(groupedArray.length, 4);
      assert.deepStrictEqual(
        groupedArray,
        await groupSource.groupBy((r) => r.name).toArray(),
      );
    });
    test("Grouping With ElementSelector ToArray", async () => {
      const source: Array<ScoreRecord> = [
        { name: "Tim", score: 55 },
        { name: "Chris", score: 49 },
        { name: "Robert", score: -100 },
        { name: "Chris", score: 24 },
        { name: "Prakash", score: 9 },
        { name: "Tim", score: 25 },
      ];

      const groupedArray = await AsyncEnumerable.create(source)
        .groupBy(
          (r) => r.name,
          (e) => e.score,
        )
        .toArray();

      assert.strictEqual(groupedArray.length, 4);
      assert.deepStrictEqual(
        groupedArray,
        await AsyncEnumerable.create(source)
          .groupBy(
            (r) => r.name,
            (e) => e.score,
          )
          .toArray(),
      );
    });
    test("Grouping With Results ToArray", async () => {
      const source: Array<ScoreRecord> = [
        { name: "Tim", score: 55 },
        { name: "Chris", score: 49 },
        { name: "Robert", score: -100 },
        { name: "Chris", score: 24 },
        { name: "Prakash", score: 9 },
        { name: "Tim", score: 25 },
      ];

      const groupedArray = await AsyncEnumerable.create(source)
        .groupBy(
          (r) => r.name,
          undefined,
          async (_key, elements) => elements,
        )
        .toArray();

      assert.strictEqual(groupedArray.length, 4);
      assert.deepStrictEqual(
        groupedArray,
        await AsyncEnumerable.create(source)
          .groupBy(
            (r) => r.name,
            undefined,
            async (_key, elements) => elements,
          )
          .toArray(),
      );
    });
    test("Grouping With ElementSelector And Results ToArray", async () => {
      const source: Array<ScoreRecord> = [
        { name: "Tim", score: 55 },
        { name: "Chris", score: 49 },
        { name: "Robert", score: -100 },
        { name: "Chris", score: 24 },
        { name: "Prakash", score: 9 },
        { name: "Tim", score: 25 },
      ];

      const groupedArray = await AsyncEnumerable.create(source)
        .groupBy(
          (r) => r.name,
          (e) => e,
          async (_r, e) => e,
        )
        .toArray();

      assert.strictEqual(groupedArray.length, 4);
      assert.deepStrictEqual(
        groupedArray,
        await AsyncEnumerable.create(source)
          .groupBy(
            (r) => r.name,
            (e) => e,
            async (_r, e) => e,
          )
          .toArray(),
      );
    });
    test("Grouping Count", async () => {
      const source: Array<ScoreRecord> = [
        { name: "Tim", score: 55 },
        { name: "Chris", score: 49 },
        { name: "Robert", score: -100 },
        { name: "Chris", score: 24 },
        { name: "Prakash", score: 9 },
        { name: "Tim", score: 25 },
      ];

      assert.strictEqual(
        await AsyncEnumerable.create(source)
          .groupBy((r) => r.name)
          .count(),
        4,
      );
    });
    test("Grouping With ElementSelector Count", async () => {
      const source: Array<ScoreRecord> = [
        { name: "Tim", score: 55 },
        { name: "Chris", score: 49 },
        { name: "Robert", score: -100 },
        { name: "Chris", score: 24 },
        { name: "Prakash", score: 9 },
        { name: "Tim", score: 25 },
      ];

      assert.strictEqual(
        await AsyncEnumerable.create(source)
          .groupBy(
            (r) => r.name,
            (e) => e.score,
          )
          .count(),
        4,
      );
    });
    test("Grouping With Results Count", async () => {
      const source: Array<ScoreRecord> = [
        { name: "Tim", score: 55 },
        { name: "Chris", score: 49 },
        { name: "Robert", score: -100 },
        { name: "Chris", score: 24 },
        { name: "Prakash", score: 9 },
        { name: "Tim", score: 25 },
      ];

      assert.strictEqual(
        await AsyncEnumerable.create(source)
          .groupBy(
            (r) => r.name,
            undefined,
            async (_r, e) => e,
          )
          .count(),
        4,
      );
    });
    test("Grouping With ElementSelector And Results Count", async () => {
      const source: Array<ScoreRecord> = [
        { name: "Tim", score: 55 },
        { name: "Chris", score: 49 },
        { name: "Robert", score: -100 },
        { name: "Chris", score: 24 },
        { name: "Prakash", score: 9 },
        { name: "Tim", score: 25 },
      ];

      assert.strictEqual(
        await AsyncEnumerable.create(source)
          .groupBy(
            (r) => r.name,
            (e) => e,
            async (_r, e) => e,
          )
          .count(),
        4,
      );
    });
    test("Empty Grouping ToArray", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.empty<number>()
          .groupBy((i) => i)
          .toArray(),
        [],
      );
    });
    test("Empty Grouping Count", async () => {
      assert.strictEqual(
        await AsyncEnumerable.empty<number>()
          .groupBy((i) => i)
          .count(),
        0,
      );
    });
    test("Empty Grouping With Result ToArray", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.empty<number>()
          .groupBy(
            (i) => i,
            undefined,
            async (x, y) => x + (await y.count()),
          )
          .toArray(),
        [],
      );
    });
    test("Empty Grouping With Result Count", async () => {
      assert.strictEqual(
        await AsyncEnumerable.empty<number>()
          .groupBy(
            (i) => i,
            undefined,
            async (x, y) => x + (await y.count()),
          )
          .count(),
        0,
      );
    });
    test("Multiple Iterations Of Same AsyncEnumerable", async () => {
      const enumerables = [
        AsyncEnumerable.range(0, 10).groupBy((i) => i),
        AsyncEnumerable.range(0, 10).groupBy(
          (i) => i,
          (i) => i,
        ),
      ];

      for (const e1 of enumerables) {
        for (let trial = 0; trial < 3; trial++) {
          let count = 0;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          for await (const _g of e1) count++;
          assert.strictEqual(count, 10);
        }
      }

      const resultEnumerables = [
        AsyncEnumerable.range(0, 10).groupBy(
          (i) => i,
          undefined,
          async (i) => i,
        ),
        AsyncEnumerable.range(0, 10).groupBy(
          (i) => i,
          (i) => i,
          async (i) => i,
        ),
      ];

      for (const e2 of resultEnumerables) {
        for (let trial = 0; trial < 3; trial++) {
          let count = 0;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          for await (const _i of e2) count++;
          assert.strictEqual(count, 10);
        }
      }
    });
    test("Enumerate Grouping", async () => {
      const g = await AsyncEnumerable.range(0, 42)
        .groupBy(() => "onegroup")
        .first();
      assert.strictEqual(g.key, "onegroup");
      assert.strictEqual(g.count(), 42);

      const iterator = g.iterator();
      const values = new Set<number>();

      let result = iterator.next();
      while (!result.done) {
        values.add(result.value);
        result = iterator.next();
      }

      assert.strictEqual(values.size, 42);
      assert.deepStrictEqual(
        Array.from(values).sort((a, b) => a - b),
        Array.from({ length: 42 }, (_, i) => i),
      );
    });
  });
});
