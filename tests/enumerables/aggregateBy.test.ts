import {
  AsyncEnumerable,
  Enumerable,
  type IAsyncEnumerable,
  type IEnumerable,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { CaseInsensitiveEqualityComparer } from "../shared.ts";

describe("AggregateBy", function () {
  describe("Enumerable", function () {
    test("empty", () => {
      assert.deepStrictEqual(
        Enumerable.empty<number>()
          .aggregateBy(
            (k) => k,
            (s) => s,
            (r, c) => r + c,
          )
          .toArray(),
        [],
      );
    });
    test("group and sum by key", () => {
      const data = [
        { category: "A", value: 1 },
        { category: "B", value: 2 },
        { category: "A", value: 3 },
      ];

      const result = Enumerable.create(data)
        .aggregateBy(
          (x) => x.category,
          0,
          (acc, curr) => acc + curr.value,
        )
        .toArray();

      assert.deepStrictEqual(result, [
        ["A", 4],
        ["B", 2],
      ]);
    });
    test("with custom seed function", () => {
      const data = [1, 2, 3, 4];
      const result = Enumerable.create(data)
        .aggregateBy(
          (x) => x % 2,
          (key) => key * 10,
          (acc, curr) => acc + curr,
        )
        .toArray();

      assert.deepStrictEqual(result, [
        [1, 14], // odd numbers: 10 + 1 + 3
        [0, 6], // even numbers: 0 + 2 + 4
      ]);
    });
    test("complex object aggregation", () => {
      const transactions = [
        { id: 1, category: "food", amount: 50 },
        { id: 2, category: "transport", amount: 30 },
        { id: 3, category: "food", amount: 25 },
        { id: 4, category: "transport", amount: 45 },
      ];

      const result = Enumerable.create(transactions)
        .aggregateBy(
          (x) => x.category,
          { count: 0, total: 0 },
          (acc, curr) => ({
            count: acc.count + 1,
            total: acc.total + curr.amount,
          }),
        )
        .toArray();

      assert.deepStrictEqual(result, [
        ["food", { count: 2, total: 75 }],
        ["transport", { count: 2, total: 75 }],
      ]);
    });
    test("performance with large dataset", () => {
      const size = 10000;
      const data = Array.from({ length: size }, (_, i) => ({
        group: i % 10,
        value: i,
      }));

      const start = performance.now();
      const result = Enumerable.create(data)
        .aggregateBy(
          (x) => x.group,
          0,
          (acc, curr) => acc + curr.value,
        )
        .toArray();

      assert.ok(performance.now() - start < 150);
      assert.strictEqual(result.length, 10);
    });
    test("with custom comparer", () => {
      const data = [
        { key: "A", value: 1 },
        { key: "a", value: 2 },
        { key: "B", value: 3 },
      ];

      const result = Enumerable.create(data)
        .aggregateBy(
          (x) => x.key,
          0,
          (acc, curr) => acc + curr.value,
          new CaseInsensitiveEqualityComparer(),
        )
        .toArray();

      assert.deepStrictEqual(result, [
        ["A", 3],
        ["B", 3],
      ]);
    });
    test("with null/undefined keys", () => {
      const data = [
        { key: null, value: 1 },
        { key: undefined, value: 2 },
        { key: "valid", value: 3 },
      ];

      const result = Enumerable.create(data)
        .aggregateBy(
          (x) => x.key,
          0,
          (acc, curr) => acc + curr.value,
        )
        .toArray();

      assert.strictEqual(result.length, 3);
    });
    test("date grouping", () => {
      const events = [
        { date: new Date("2024-01-01"), value: 10 },
        { date: new Date("2024-01-01"), value: 20 },
        { date: new Date("2024-01-02"), value: 30 },
      ];

      const result = Enumerable.create(events)
        .aggregateBy(
          (x) => x.date.toISOString().split("T")[0],
          { count: 0, total: 0 },
          (acc, curr) => ({
            count: acc.count + 1,
            total: acc.total + curr.value,
          }),
        )
        .toArray();

      assert.deepStrictEqual(result, [
        ["2024-01-01", { count: 2, total: 30 }],
        ["2024-01-02", { count: 1, total: 30 }],
      ]);
    });
    test("nested object aggregation", () => {
      const data = [
        { user: { id: 1, group: "A" }, score: 10 },
        { user: { id: 2, group: "A" }, score: 20 },
        { user: { id: 3, group: "B" }, score: 30 },
      ];

      const result = Enumerable.create(data)
        .aggregateBy(
          (x) => x.user.group,
          () => ({ users: new Set<number>(), totalScore: 0 }),
          (acc, curr) => ({
            users: acc.users.add(curr.user.id),
            totalScore: acc.totalScore + curr.score,
          }),
        )
        .toArray();

      assert.strictEqual(result[0][1].users.size, 2);
      assert.strictEqual(result[0][1].totalScore, 30);
    });
    test("chaining with other operations", () => {
      const data = [1, 2, 3, 4, 5, 6];
      const result = Enumerable.create(data)
        .where((x) => x > 0)
        .aggregateBy(
          (x) => x % 2,
          [] as Array<number>,
          (acc, curr) => [...acc, curr],
        )
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .where(([_, values]) => values.length > 1)
        .toArray();

      assert.strictEqual(result.length, 2);
    });
    describe(".net tests", () => {
      test("has expected output", async (t) => {
        const testCases = [
          {
            source: [],
            keySelector: (x: number) => x,
            seedSelector: () => 0,
            func: (x: number, y: number) => x + y,
            comparer: undefined,
            expected: [],
          },
          {
            source: Array.from({ length: 10 }, (_, i) => i),
            keySelector: (x: number) => x,
            seedSelector: () => 0,
            func: (x: number, y: number) => x + y,
            comparer: undefined,
            expected: Array.from(
              { length: 10 },
              (_, i) => [i, i] as [number, number],
            ),
          },
          {
            source: Array.from({ length: 10 }, (_, i) => i + 5),
            keySelector: () => true,
            seedSelector: () => 0,
            func: (x: number, y: number) => x + y,
            comparer: undefined,
            expected: [[true, 95]],
          },
          {
            source: Array.from({ length: 20 }, (_, i) => i),
            keySelector: (x: number) => x % 5,
            seedSelector: () => 0,
            func: (x: number, y: number) => x + y,
            comparer: undefined,
            expected: Array.from(
              { length: 5 },
              (_, i) => [i, 30 + 4 * i] as [number, number],
            ),
          },
          {
            source: Array(20).fill(5),
            keySelector: (x: number) => x,
            seedSelector: () => 0,
            func: (x: number, y: number) => x + y,
            comparer: undefined,
            expected: [[5, 100]],
          },
          {
            source: ["Bob", "bob", "tim", "Bob", "Tim"],
            keySelector: (x: string) => x,
            seedSelector: () => "",
            func: (x: string, y: string) => x + y,
            comparer: undefined,
            expected: [
              ["Bob", "BobBob"],
              ["bob", "bob"],
              ["tim", "tim"],
              ["Tim", "Tim"],
            ],
          },
          {
            source: ["Bob", "bob", "tim", "Bob", "Tim"],
            keySelector: (x: string) => x,
            seedSelector: () => "",
            func: (x: string, y: string) => x + y,
            comparer: new CaseInsensitiveEqualityComparer(),
            expected: [
              ["Bob", "BobbobBob"],
              ["tim", "timTim"],
            ],
          },
          {
            source: [
              { name: "Tom", age: 20 },
              { name: "Dick", age: 30 },
              { name: "Harry", age: 40 },
            ],
            keySelector: (x: { age: number }) => x.age,
            seedSelector: (x: number) => `I am ${x} and my name is `,
            func: (x: string, y: { name: string }) => x + y.name,
            comparer: undefined,
            expected: [
              [20, "I am 20 and my name is Tom"],
              [30, "I am 30 and my name is Dick"],
              [40, "I am 40 and my name is Harry"],
            ],
          },
        ];
        for (const testCase of testCases) {
          await t.test(`aggregateBy ${testCase.source}`, () => {
            const e = Enumerable.create(testCase.source);
            assert.deepStrictEqual(
              e
                .aggregateBy(
                  testCase.keySelector as never,
                  testCase.seedSelector as never,
                  testCase.func as never,
                  testCase.comparer as never,
                )
                .toArray(),
              testCase.expected,
            );
          });
        }
      });
      test("groupBy", () => {
        function groupBy<TSource, TKey>(
          source: IEnumerable<TSource>,
          keySelector: (item: TSource) => TKey,
        ): IEnumerable<[TKey, Array<TSource>]> {
          return source.aggregateBy(
            keySelector,
            () => [] as Array<TSource>,
            (group, element) => {
              group.push(element);
              return group;
            },
          );
        }

        const numbers = Enumerable.create([1, 2, 3, 4]);
        const oddsEvens = groupBy(numbers, (i) => i % 2 === 0).iterator();

        // Check odds
        const [oddKey, odds] = oddsEvens.next().value;
        assert.strictEqual(oddKey, false);
        assert.ok(odds.includes(1));
        assert.ok(odds.includes(3));
        assert.ok(!odds.includes(2));
        assert.ok(!odds.includes(4));

        // Check evens
        const [evenKey, evens] = oddsEvens.next().value;
        assert.strictEqual(evenKey, true);
        assert.ok(evens.includes(2));
        assert.ok(evens.includes(4));
        assert.ok(!evens.includes(1));
        assert.ok(!evens.includes(3));
      });
    });
  });

  describe("AsyncEnumerable", function () {
    test("empty", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.empty<number>()
          .aggregateBy(
            (k) => k,
            (s) => s,
            (r, c) => r + c,
          )
          .toArray(),
        [],
      );
    });
    test("group and sum by key", async () => {
      const data = [
        { category: "A", value: 1 },
        { category: "B", value: 2 },
        { category: "A", value: 3 },
      ];

      const result = await AsyncEnumerable.create(data)
        .aggregateBy(
          (x) => x.category,
          0,
          (acc, curr) => acc + curr.value,
        )
        .toArray();

      assert.deepStrictEqual(result, [
        ["A", 4],
        ["B", 2],
      ]);
    });
    test("with custom seed function", async () => {
      const data = [1, 2, 3, 4];
      const result = await AsyncEnumerable.create(data)
        .aggregateBy(
          (x) => x % 2,
          (key) => key * 10,
          (acc, curr) => acc + curr,
        )
        .toArray();

      assert.deepStrictEqual(result, [
        [1, 14], // odd numbers: 10 + 1 + 3
        [0, 6], // even numbers: 0 + 2 + 4
      ]);
    });
    test("complex object aggregation", async () => {
      const transactions = [
        { id: 1, category: "food", amount: 50 },
        { id: 2, category: "transport", amount: 30 },
        { id: 3, category: "food", amount: 25 },
        { id: 4, category: "transport", amount: 45 },
      ];

      const result = await AsyncEnumerable.create(transactions)
        .aggregateBy(
          (x) => x.category,
          { count: 0, total: 0 },
          (acc, curr) => ({
            count: acc.count + 1,
            total: acc.total + curr.amount,
          }),
        )
        .toArray();

      assert.deepStrictEqual(result, [
        ["food", { count: 2, total: 75 }],
        ["transport", { count: 2, total: 75 }],
      ]);
    });
    test("with custom comparer", async () => {
      const data = [
        { key: "A", value: 1 },
        { key: "a", value: 2 },
        { key: "B", value: 3 },
      ];

      const result = await AsyncEnumerable.create(data)
        .aggregateBy(
          (x) => x.key,
          0,
          (acc, curr) => acc + curr.value,
          new CaseInsensitiveEqualityComparer(),
        )
        .toArray();

      assert.deepStrictEqual(result, [
        ["A", 3],
        ["B", 3],
      ]);
    });
    test("with null/undefined keys", async () => {
      const data = [
        { key: null, value: 1 },
        { key: undefined, value: 2 },
        { key: "valid", value: 3 },
      ];

      const result = await AsyncEnumerable.create(data)
        .aggregateBy(
          (x) => x.key,
          0,
          (acc, curr) => acc + curr.value,
        )
        .toArray();

      assert.strictEqual(result.length, 3);
    });
    test("async with delayed key selector", async () => {
      const data = [
        { id: 1, value: "A" },
        { id: 2, value: "B" },
        { id: 3, value: "A" },
      ];

      const result = await AsyncEnumerable.create(data)
        .aggregateBy(
          async (x) => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            return x.value;
          },
          [] as Array<number>,
          async (acc, curr) => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            return [...acc, curr.id];
          },
        )
        .toArray();

      assert.deepStrictEqual(result, [
        ["A", [1, 3]],
        ["B", [2]],
      ]);
    });
    test("error handling in async aggregation", async () => {
      const data = AsyncEnumerable.create([1, 2, 3]);
      await assert.rejects(async () => {
        await data
          .aggregateBy(
            (x) => x,
            0,
            () => {
              throw new Error("Aggregation error");
            },
          )
          .toArray();
      }, /Aggregation error/);
    });
    test("mixed sync/async operations", async () => {
      const data = [
        { id: 1, values: Promise.resolve([1, 2]) },
        { id: 2, values: [3, 4] },
        { id: 1, values: Promise.resolve([5, 6]) },
      ];

      const result = await AsyncEnumerable.create(data)
        .aggregateBy(
          (x) => x.id,
          [] as Array<number>,
          async (acc, curr) => {
            const values = await curr.values;
            return [...acc, ...values];
          },
        )
        .toArray();

      assert.deepStrictEqual(result[0][1], [1, 2, 5, 6]);
    });
    describe(".net tests", () => {
      test("has expected output", async (t) => {
        const testCases = [
          {
            source: [],
            keySelector: (x: number) => x,
            seedSelector: () => 0,
            func: (x: number, y: number) => x + y,
            comparer: undefined,
            expected: [],
          },
          {
            source: Array.from({ length: 10 }, (_, i) => i),
            keySelector: (x: number) => x,
            seedSelector: () => 0,
            func: (x: number, y: number) => x + y,
            comparer: undefined,
            expected: Array.from(
              { length: 10 },
              (_, i) => [i, i] as [number, number],
            ),
          },
          {
            source: Array.from({ length: 10 }, (_, i) => i + 5),
            keySelector: () => true,
            seedSelector: () => 0,
            func: (x: number, y: number) => x + y,
            comparer: undefined,
            expected: [[true, 95]],
          },
          {
            source: Array.from({ length: 20 }, (_, i) => i),
            keySelector: (x: number) => x % 5,
            seedSelector: () => 0,
            func: (x: number, y: number) => x + y,
            comparer: undefined,
            expected: Array.from(
              { length: 5 },
              (_, i) => [i, 30 + 4 * i] as [number, number],
            ),
          },
          {
            source: Array(20).fill(5),
            keySelector: (x: number) => x,
            seedSelector: () => 0,
            func: (x: number, y: number) => x + y,
            comparer: undefined,
            expected: [[5, 100]],
          },
          {
            source: ["Bob", "bob", "tim", "Bob", "Tim"],
            keySelector: (x: string) => x,
            seedSelector: () => "",
            func: (x: string, y: string) => x + y,
            comparer: undefined,
            expected: [
              ["Bob", "BobBob"],
              ["bob", "bob"],
              ["tim", "tim"],
              ["Tim", "Tim"],
            ],
          },
          {
            source: ["Bob", "bob", "tim", "Bob", "Tim"],
            keySelector: (x: string) => x,
            seedSelector: () => "",
            func: (x: string, y: string) => x + y,
            comparer: new CaseInsensitiveEqualityComparer(),
            expected: [
              ["Bob", "BobbobBob"],
              ["tim", "timTim"],
            ],
          },
          {
            source: [
              { name: "Tom", age: 20 },
              { name: "Dick", age: 30 },
              { name: "Harry", age: 40 },
            ],
            keySelector: (x: { age: number }) => x.age,
            seedSelector: (x: number) => `I am ${x} and my name is `,
            func: (x: string, y: { name: string }) => x + y.name,
            comparer: undefined,
            expected: [
              [20, "I am 20 and my name is Tom"],
              [30, "I am 30 and my name is Dick"],
              [40, "I am 40 and my name is Harry"],
            ],
          },
        ];
        for (const testCase of testCases) {
          await t.test(`aggregateBy ${testCase.source}`, async () => {
            const e = AsyncEnumerable.create(testCase.source);
            assert.deepStrictEqual(
              await e
                .aggregateBy(
                  testCase.keySelector as never,
                  testCase.seedSelector as never,
                  testCase.func as never,
                  testCase.comparer as never,
                )
                .toArray(),
              testCase.expected,
            );
          });
        }
      });
      test("groupBy", async () => {
        function groupBy<TSource, TKey>(
          source: IAsyncEnumerable<TSource>,
          keySelector: (item: TSource) => TKey,
        ): IAsyncEnumerable<[TKey, Array<TSource>]> {
          return source.aggregateBy(
            keySelector,
            () => [] as Array<TSource>,
            (group, element) => {
              group.push(element);
              return group;
            },
          );
        }

        const numbers = AsyncEnumerable.create([1, 2, 3, 4]);
        const oddsEvens = groupBy(numbers, (i) => i % 2 === 0).iterator();

        // Check odds
        const [oddKey, odds] = (await oddsEvens.next()).value;
        assert.strictEqual(oddKey, false);
        assert.ok(odds.includes(1));
        assert.ok(odds.includes(3));
        assert.ok(!odds.includes(2));
        assert.ok(!odds.includes(4));

        // Check evens
        const [evenKey, evens] = (await oddsEvens.next()).value;
        assert.strictEqual(evenKey, true);
        assert.ok(evens.includes(2));
        assert.ok(evens.includes(4));
        assert.ok(!evens.includes(1));
        assert.ok(!evens.includes(3));
      });
    });
  });
});
