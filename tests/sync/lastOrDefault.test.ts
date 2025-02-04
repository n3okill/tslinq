import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("lastOrDefault", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.create([1, 2, 3]).lastOrDefault(0), 3);
      assert.strictEqual(
        Enumerable.create([]).lastOrDefault(undefined as never),
        undefined,
      );
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).lastOrDefault(0, (x) => x === 5),
        0,
      );
    });
    test("defaultValue", function () {
      const defaultValue = 1000;
      assert.strictEqual(
        Enumerable.create<number>([]).lastOrDefault(defaultValue, () => true),
        defaultValue,
      );
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).lastOrDefault(defaultValue, (x) => x > 5),
        defaultValue,
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2, 3]);
      assert.strictEqual(e.lastOrDefault(0), e.lastOrDefault(0));
    });

    test("with null and undefined values", () => {
      const withNull = Enumerable.create([1, null, 3, undefined]);
      assert.strictEqual(
        withNull.lastOrDefault(0, (x) => x === null),
        null,
      );
      assert.strictEqual(
        withNull.lastOrDefault(0, (x) => x === undefined),
        undefined,
      );
    });

    test("complex object predicates", () => {
      const objects = Enumerable.create([
        { id: 1, value: "first" },
        { id: 2, value: "second" },
        { id: 3, value: "first" },
      ]);
      assert.deepStrictEqual(
        objects.lastOrDefault(
          { id: 0, value: "default" },
          (x) => x.value === "first",
        ),
        { id: 3, value: "first" },
      );
    });

    test("performance with large collection", () => {
      const size = 100000;
      const large = Enumerable.create(
        Array.from({ length: size }, (_, i) => i),
      );
      const start = performance.now();
      large.lastOrDefault(-1, (x) => x > 99990);
      assert.ok(performance.now() - start < 100);
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).lastOrDefault(0),
        3,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([]).lastOrDefault(undefined as never),
        undefined,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).lastOrDefault(
          0,
          (x) => x === 5,
        ),
        0,
      );
    });
    test("defaultValue", async function () {
      const defaultValue = 1000;
      assert.strictEqual(
        await AsyncEnumerable.create<number>([]).lastOrDefault(
          defaultValue,
          () => true,
        ),
        defaultValue,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).lastOrDefault(
          defaultValue,
          (x) => x > 5,
        ),
        defaultValue,
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 3]);
      assert.strictEqual(await e.lastOrDefault(0), await e.lastOrDefault(0));
    });
    test("async with delayed values", async () => {
      const delayed = AsyncEnumerable.create(
        (async function* () {
          yield 1;
          await new Promise((resolve) => setTimeout(resolve, 10));
          yield 2;
        })(),
      );
      assert.strictEqual(
        await delayed.lastOrDefault(0 as never, async (x) => {
          await new Promise((resolve) => setTimeout(resolve, 10));
          return x > 5;
        }),
        0,
      );
    });

    test("async with error handling", async () => {
      const errorEnum = AsyncEnumerable.create(
        (async function* () {
          yield 1;
          throw new Error("Test error");
        })(),
      );
      assert.strictEqual(await errorEnum.lastOrDefault(999), 999);
    });

    test("async with mixed types", async () => {
      const mixed = AsyncEnumerable.create([1, "two", 3, "four"]);
      assert.strictEqual(
        await mixed.lastOrDefault("default", (x) => typeof x === "string"),
        "four",
      );
    });
  });
  describe("AsyncEnumerable async predicate", function () {
    test("basic", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).lastOrDefault(0),
        3,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([]).lastOrDefault(undefined as never),
        undefined,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).lastOrDefault(0, async (x) =>
          Promise.resolve(x === 5),
        ),
        0,
      );
    });
    test("defaultValue", async function () {
      const defaultValue = 1000;
      assert.strictEqual(
        await AsyncEnumerable.create<number>([]).lastOrDefault(
          defaultValue,
          () => true,
        ),
        defaultValue,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([1, 2, 3]).lastOrDefault(
          defaultValue,
          (x) => x > 5,
        ),
        defaultValue,
      );
    });
  });
});
