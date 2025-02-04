import { AsyncEnumerable, Enumerable } from "../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("Other", function () {
  describe("Enumerable", function () {
    test("large collection handling", () => {
      const largeArray = new Array(1_000_000).fill(0).map((_, i) => i);
      const enumerable = Enumerable.create(largeArray);

      const initialMemory = process.memoryUsage().heapUsed;
      enumerable.elementAt(999_999);
      enumerable.count();
      enumerable.contains(999_999);
      const finalMemory = process.memoryUsage().heapUsed;

      assert.ok(
        (finalMemory - initialMemory) / 1024 / 1024 < 100,
        "Memory usage should be reasonable",
      );
    });
    describe("Iterator Behavior Tests", () => {
      test("iterator completion", () => {
        let completed = false;
        const iterator = Enumerable.create(
          (function* () {
            try {
              yield 1;
              yield 2;
            } finally {
              completed = true;
            }
          })(),
        );

        iterator.toArray();
        assert.strictEqual(completed, true);
      });

      test("lazy evaluation", () => {
        let evaluated = 0;
        const iterator = Enumerable.create(
          (function* () {
            evaluated++;
            yield 1;
            evaluated++;
            yield 2;
          })(),
        );

        iterator.elementAt(0);
        assert.strictEqual(evaluated, 1);
      });
    });
    describe("Performance Benchmark Tests", () => {
      test("array vs iterator performance", () => {
        const size = 100_000;
        const array = Enumerable.create(
          Array.from({ length: size }, (_, i) => i),
        );
        const iterator = Enumerable.create(
          (function* () {
            for (let i = 0; i < size; i++) yield i;
          })(),
        );

        const t1 = performance.now();
        array.elementAt(size - 1);
        const arrayTime = performance.now() - t1;

        const t2 = performance.now();
        iterator.elementAt(size - 1);
        const iteratorTime = performance.now() - t2;

        assert.ok(arrayTime <= iteratorTime, "Array access should be faster");
      });
    });
  });
  describe("AsyncEnumerable", function () {
    test("large collection handling", async () => {
      const largeArray = new Array(1_000_000).fill(0).map((_, i) => i);
      const enumerable = AsyncEnumerable.create(largeArray);

      const initialMemory = process.memoryUsage().heapUsed;
      await enumerable.elementAt(999_999);
      await enumerable.count();
      await enumerable.contains(999_999);
      const finalMemory = process.memoryUsage().heapUsed;

      assert.ok(
        (finalMemory - initialMemory) / 1024 / 1024 < 100,
        "Memory usage should be reasonable",
      );
    });
    test("async operation rejection handling", async () => {
      const asyncEnum = AsyncEnumerable.create(
        (async function* () {
          yield 1;
          throw new Error("Intentional error");
        })(),
      );

      await assert.rejects(async () => {
        await asyncEnum.elementAt(2);
      });
    });
    describe("Iterator Behavior Tests", () => {
      test("iterator completion", async () => {
        let completed = false;
        const iterator = AsyncEnumerable.create(
          (function* () {
            try {
              yield 1;
              yield 2;
            } finally {
              completed = true;
            }
          })(),
        );

        await iterator.toArray();
        assert.strictEqual(completed, true);
      });

      test("lazy evaluation", async () => {
        let evaluated = 0;
        const iterator = AsyncEnumerable.create(
          (function* () {
            evaluated++;
            yield 1;
            evaluated++;
            yield 2;
          })(),
        );

        await iterator.elementAt(0);
        assert.strictEqual(evaluated, 1);
      });
    });
    describe("Performance Benchmark Tests", () => {
      test("async operation timing", async () => {
        const asyncEnum = AsyncEnumerable.create(
          Array.from({ length: 1000 }, (_, i) => i),
        );

        const start = performance.now();
        await Promise.all([
          asyncEnum.elementAt(500),
          asyncEnum.count(),
          asyncEnum.contains(999),
        ]);
        const duration = performance.now() - start;

        assert.ok(
          duration < 1000,
          "Async operations should complete within reasonable time",
        );
      });
    });
  });

  describe("Code examples", () => {
    test("aggregate", () => {
      // Sum all numbers
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).aggregate((acc, val) => acc + val),
        6,
      );
      // Find maximum value
      assert.strictEqual(
        Enumerable.create([1, 5, 3]).aggregate((acc, val) =>
          Math.max(acc, val),
        ),
        5,
      );

      // Concatenate strings
      assert.strictEqual(
        Enumerable.create(["a", "b", "c"]).aggregate((acc, val) => acc + val),
        "abc",
      );

      // Sum with initial value
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).aggregate((acc, val) => acc + val, 10),
        16,
      );

      // Custom accumulation with seed
      assert.strictEqual(
        Enumerable.create(["a", "b"]).aggregate(
          (acc, val) => acc + "," + val,
          "start",
        ),
        "start,a,b",
      );
      // Empty sequence with seed returns seed
      assert.strictEqual(
        Enumerable.create([]).aggregate((acc, val) => acc + val, 0),
        0,
      );

      // Sum and convert to string
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).aggregate(
          (acc, val) => acc + val,
          0,
          (sum) => `Total: ${sum}`,
        ),
        "Total: 6",
      );
      // Calculate average
      assert.strictEqual(
        Enumerable.create([1, 2, 3, 4]).aggregate(
          (acc, val) => ({ sum: acc.sum + val, count: acc.count + 1 }),
          { sum: 0, count: 0 },
          (result) => result.sum / result.count,
        ),
        2.5,
      );
    });
    test("aggregateBy", () => {
      // Sum values by category
      const items = [
        { category: "A", value: 10 },
        { category: "B", value: 20 },
        { category: "A", value: 30 },
      ];

      assert.deepStrictEqual(
        Enumerable.create(items)
          .aggregateBy(
            (x) => x.category,
            0,
            (acc, item) => acc + item.value,
          )
          .toArray(),
        [
          ["A", 40],
          ["B", 20],
        ],
      );
      // Using seed selector
      assert.deepStrictEqual(
        Enumerable.create(items)
          .aggregateBy(
            (x) => x.category,
            (key) => ({ key, sum: 0 }),
            (acc, item) => ({ ...acc, sum: acc.sum + item.value }),
          )
          .toArray(),
        [
          ["A", { key: "A", sum: 40 }],
          ["B", { key: "B", sum: 20 }],
        ],
      );
    });
  });
});
