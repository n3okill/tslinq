import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("elementAtOrDefault", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).elementAtOrDefault(0, 10),
        0,
      );
      assert.strictEqual(
        Enumerable.create(["a", "b", "c"]).elementAtOrDefault("", 5),
        "",
      );
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).elementAtOrDefault(0, 1),
        2,
      );
      assert.strictEqual(
        Enumerable.create(["a", "b", "c"]).elementAtOrDefault("", 2),
        "c",
      );
      assert.strictEqual(
        Enumerable.create([]).elementAtOrDefault(undefined as never, 0),
        undefined,
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2, 3]);
      assert.strictEqual(
        e.elementAtOrDefault(0, 1),
        e.elementAtOrDefault(0, 1),
      );
    });
    test("negative index returns default", () => {
      const numbers = Enumerable.create([1, 2, 3]);
      assert.strictEqual(numbers.elementAtOrDefault(999, -1), 999);
      assert.strictEqual(numbers.elementAtOrDefault(0, -5), 0);
    });

    test("with iterator source", () => {
      function* generator() {
        yield 1;
        yield 2;
        yield 3;
      }
      const iter = Enumerable.create(generator());
      assert.strictEqual(iter.elementAtOrDefault(999 as never, 4), 999);
    });

    test("with null/undefined values", () => {
      const withNull = Enumerable.create([null, undefined, 3]);
      assert.strictEqual(withNull.elementAtOrDefault(null, 0), null);
      assert.strictEqual(withNull.elementAtOrDefault(undefined, 1), undefined);
    });

    test("with mixed types", () => {
      const mixed = Enumerable.create([1, "two", true]);
      assert.strictEqual(mixed.elementAtOrDefault("default", 5), "default");
      assert.strictEqual(mixed.elementAtOrDefault(false, 2), true);
    });

    test("large collection performance", () => {
      const large = Enumerable.create(
        Array.from({ length: 10_000 }, (_, i) => i),
      );
      assert.strictEqual(large.elementAtOrDefault(-1, 10_000), -1);
    });
    test("default value type matching", () => {
      const numbers = Enumerable.create([1, 2, 3]);
      const result: number = numbers.elementAtOrDefault(0, -1);
      assert.strictEqual(typeof result, "number");
    });

    test("object reference preservation", () => {
      const obj = { id: 1 };
      const objects = Enumerable.create([{ id: 2 }]);
      const result = objects.elementAtOrDefault(obj, 1);
      assert.strictEqual(result, obj);
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).elementAtOrDefault(0, 10),
        0,
      );
      assert.strictEqual(
        await AsyncEnumerable.create(["a", "b", "c"]).elementAtOrDefault("", 5),
        "",
      );
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).elementAtOrDefault(0, 1),
        2,
      );
      assert.strictEqual(
        await AsyncEnumerable.create(["a", "b", "c"]).elementAtOrDefault("", 2),
        "c",
      );
      assert.strictEqual(
        await AsyncEnumerable.create([]).elementAtOrDefault(
          undefined as never,
          0,
        ),
        undefined,
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 3]);
      assert.strictEqual(
        await e.elementAtOrDefault(0, 1),
        await e.elementAtOrDefault(0, 1),
      );
    });
    test("async with delayed values", async () => {
      const delayed = AsyncEnumerable.create(
        (async function* () {
          yield await Promise.resolve(1);
          await new Promise((resolve) => setTimeout(resolve, 10));
          yield 2;
        })(),
      );
      assert.strictEqual(await delayed.elementAtOrDefault(999, 3), 999);
    });

    test("async with errors in iterator", async () => {
      const errorIterator = AsyncEnumerable.create(
        (async function* () {
          yield 1;
          throw new Error("Iterator error");
        })(),
      );
      assert.strictEqual(await errorIterator.elementAtOrDefault(0, 5), 0);
      assert.strictEqual(await errorIterator.elementAtOrDefault(999, 5), 999);
    });

    test("async with boundary values", async () => {
      const numbers = AsyncEnumerable.create([1, 2, 3]);
      assert.strictEqual(await numbers.elementAtOrDefault(999, 0), 1);
      assert.strictEqual(await numbers.elementAtOrDefault(999, 3), 999);
    });

    test("async with empty source", async () => {
      const empty = AsyncEnumerable.create([]);
      assert.strictEqual(
        await empty.elementAtOrDefault("default" as never, 0),
        "default",
      );
    });
  });
});
