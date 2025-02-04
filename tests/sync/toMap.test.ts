import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("toMap", function () {
  describe("Enumerable", function () {
    test("empty source returns empty map", () => {
      const map = Enumerable.create([]).toMap((x) => x);
      assert.strictEqual(map.size, 0);
    });
    test("basic", function () {
      const map = Enumerable.create([1, 2, 3, 1]).toMap((x) => `Key_${x}`);
      assert.deepStrictEqual(Array.from(map), [
        ["Key_1", [1, 1]],
        ["Key_2", [2]],
        ["Key_3", [3]],
      ]);
      const map2 = Enumerable.create([1, 2, 3]).toMap((x) => x * 2);

      assert.deepStrictEqual(Array.from(map2), [
        [2, [1]],
        [4, [2]],
        [6, [3]],
      ]);
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2, 3]);
      assert.deepStrictEqual(
        Array.from(e.toMap((x) => x)),
        Array.from(e.toMap((x) => x)),
      );
    });
    test("duplicate keys group values", () => {
      const source = [1, 2, 3, 1, 2];
      const map = Enumerable.create(source).toMap((x) => x % 2);

      assert.deepStrictEqual(Array.from(map), [
        [1, [1, 3, 1]],
        [0, [2, 2]],
      ]);
    });
    test("null keys", () => {
      const source = [null, "value", null];
      const map = Enumerable.create(source).toMap((x) => x);

      assert.deepStrictEqual(Array.from(map), [
        [null, [null, null]],
        ["value", ["value"]],
      ]);
    });
    test("complex objects", () => {
      const source = [
        { id: 1, value: "one" },
        { id: 2, value: "two" },
        { id: 1, value: "another one" },
      ];

      const map = Enumerable.create(source).toMap((x) => x.id);

      assert.deepStrictEqual(Array.from(map), [
        [1, [source[0], source[2]]],
        [2, [source[1]]],
      ]);
    });
  });
  describe("AsyncEnumerable", function () {
    test("empty source returns empty map", async () => {
      const map = await AsyncEnumerable.create([]).toMap((x) => x);
      assert.strictEqual(map.size, 0);
    });
    test("basic", async function () {
      const map = await AsyncEnumerable.create([1, 2, 3]).toMap(
        (x) => `Key_${x}`,
      );
      assert.deepStrictEqual(Array.from(map), [
        ["Key_1", [1]],
        ["Key_2", [2]],
        ["Key_3", [3]],
      ]);
      const map2 = await AsyncEnumerable.create([1, 2, 3]).toMap((x) => x * 2);

      assert.deepStrictEqual(Array.from(map2), [
        [2, [1]],
        [4, [2]],
        [6, [3]],
      ]);
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 3]);
      assert.deepStrictEqual(
        Array.from(await e.toMap((x) => x)),
        Array.from(await e.toMap((x) => x)),
      );
    });
    test("duplicate keys group values", async () => {
      const source = [1, 2, 3, 1, 2];
      const map = await AsyncEnumerable.create(source).toMap((x) => x % 2);

      assert.deepStrictEqual(Array.from(map), [
        [1, [1, 3, 1]],
        [0, [2, 2]],
      ]);
    });
    test("null keys", async () => {
      const source = [null, "value", null];
      const map = await AsyncEnumerable.create(source).toMap((x) => x);

      assert.deepStrictEqual(Array.from(map), [
        [null, [null, null]],
        ["value", ["value"]],
      ]);
    });
    test("complex objects", async () => {
      const source = [
        { id: 1, value: "one" },
        { id: 2, value: "two" },
        { id: 1, value: "another one" },
      ];

      const map = await AsyncEnumerable.create(source).toMap((x) => x.id);

      assert.deepStrictEqual(Array.from(map), [
        [1, [source[0], source[2]]],
        [2, [source[1]]],
      ]);
    });
  });
  describe("AsyncEnumerable async keySelector", function () {
    test("basic", async function () {
      const map = await AsyncEnumerable.create([1, 2, 3]).toMap(async (x) =>
        Promise.resolve(`Key_${x}`),
      );
      assert.deepStrictEqual(Array.from(map), [
        ["Key_1", [1]],
        ["Key_2", [2]],
        ["Key_3", [3]],
      ]);
    });
  });
});
