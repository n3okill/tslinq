import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("append", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      const c = Enumerable.create([1, 2]);
      assert.strictEqual(c.count(), 2);
      assert.strictEqual(c.append(3).count(), 3);
      const e = c.append(4);
      assert.strictEqual(e.count(), 3);
      assert.deepStrictEqual(e.toArray(), [1, 2, 4]);
      assert.deepStrictEqual(Enumerable.create("Hell").append("o").toArray(), [
        "H",
        "e",
        "l",
        "l",
        "o",
      ]);
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2]).append(3);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    test("combinations", () => {
      const source = Enumerable.range(0, 3).append(3).append(4);
      const app0a = source.append(5);
      const app0b = source.append(6);
      const app1aa = app0a.append(7);
      const app1ab = app0a.append(8);
      const app1ba = app0b.append(9);
      const app1bb = app0b.append(10);

      assert.deepStrictEqual(app0a.toArray(), [0, 1, 2, 3, 4, 5]);
      assert.deepStrictEqual(app0b.toArray(), [0, 1, 2, 3, 4, 6]);
      assert.deepStrictEqual(app1aa.toArray(), [0, 1, 2, 3, 4, 5, 7]);
      assert.deepStrictEqual(app1ab.toArray(), [0, 1, 2, 3, 4, 5, 8]);
      assert.deepStrictEqual(app1ba.toArray(), [0, 1, 2, 3, 4, 6, 9]);
      assert.deepStrictEqual(app1bb.toArray(), [0, 1, 2, 3, 4, 6, 10]);
    });
    test("complex combination", () => {
      const v = Enumerable.create("foo")
        .append("1")
        .append("2")
        .prepend("3")
        .concat(Enumerable.create("qq").append("Q").prepend("W"));

      assert.deepStrictEqual(v.toArray(), "3foo12WqqQ".split(""));

      // Test append chain
      const v1 = Enumerable.create("a").append("b").append("c").append("d");

      assert.deepStrictEqual(v1.toArray(), "abcd".split(""));

      // Test prepend chain
      const v2 = Enumerable.create("a").prepend("b").prepend("c").prepend("d");

      assert.deepStrictEqual(v2.toArray(), "dcba".split(""));
    });
    test("append_first_last_elementAt", () => {
      // Array source tests
      assert.strictEqual(Enumerable.create([42]).append(84).first(), 42);
      assert.strictEqual(Enumerable.create([42]).append(84).last(), 84);
      assert.strictEqual(Enumerable.create([42]).append(84).elementAt(0), 42);
      assert.strictEqual(Enumerable.create([42]).append(84).elementAt(1), 84);

      // Range source tests
      assert.strictEqual(Enumerable.range(42, 1).append(84).first(), 42);
      assert.strictEqual(Enumerable.range(42, 1).append(84).last(), 84);
      assert.strictEqual(Enumerable.range(42, 1).append(84).elementAt(0), 42);
      assert.strictEqual(Enumerable.range(42, 1).append(84).elementAt(1), 84);
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      const c = AsyncEnumerable.create([1, 2]);
      assert.strictEqual(await c.count(), 2);
      assert.strictEqual(await c.append(3).count(), 3);
      const e = c.append(4);
      assert.strictEqual(await e.count(), 3);
      assert.deepStrictEqual(await e.toArray(), [1, 2, 4]);
      assert.deepStrictEqual(
        await AsyncEnumerable.create("Hell").append("o").toArray(),
        ["H", "e", "l", "l", "o"],
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2]).append(3);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("combinations", async () => {
      const source = AsyncEnumerable.range(0, 3).append(3).append(4);
      const app0a = source.append(5);
      const app0b = source.append(6);
      const app1aa = app0a.append(7);
      const app1ab = app0a.append(8);
      const app1ba = app0b.append(9);
      const app1bb = app0b.append(10);

      assert.deepStrictEqual(await app0a.toArray(), [0, 1, 2, 3, 4, 5]);
      assert.deepStrictEqual(await app0b.toArray(), [0, 1, 2, 3, 4, 6]);
      assert.deepStrictEqual(await app1aa.toArray(), [0, 1, 2, 3, 4, 5, 7]);
      assert.deepStrictEqual(await app1ab.toArray(), [0, 1, 2, 3, 4, 5, 8]);
      assert.deepStrictEqual(await app1ba.toArray(), [0, 1, 2, 3, 4, 6, 9]);
      assert.deepStrictEqual(await app1bb.toArray(), [0, 1, 2, 3, 4, 6, 10]);
    });
    test("complex combination", async () => {
      const v = AsyncEnumerable.create("foo")
        .append("1")
        .append("2")
        .prepend("3")
        .concat(AsyncEnumerable.create("qq").append("Q").prepend("W"));

      assert.deepStrictEqual(await v.toArray(), "3foo12WqqQ".split(""));

      // Test append chain
      const v1 = AsyncEnumerable.create("a")
        .append("b")
        .append("c")
        .append("d");

      assert.deepStrictEqual(await v1.toArray(), "abcd".split(""));

      // Test prepend chain
      const v2 = AsyncEnumerable.create("a")
        .prepend("b")
        .prepend("c")
        .prepend("d");

      assert.deepStrictEqual(await v2.toArray(), "dcba".split(""));
    });
    test("append_first_last_elementAt", async () => {
      // Array source tests
      assert.strictEqual(
        await AsyncEnumerable.create([42]).append(84).first(),
        42,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([42]).append(84).last(),
        84,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([42]).append(84).elementAt(0),
        42,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([42]).append(84).elementAt(1),
        84,
      );

      // Range source tests
      assert.strictEqual(
        await AsyncEnumerable.range(42, 1).append(84).first(),
        42,
      );
      assert.strictEqual(
        await AsyncEnumerable.range(42, 1).append(84).last(),
        84,
      );
      assert.strictEqual(
        await AsyncEnumerable.range(42, 1).append(84).elementAt(0),
        42,
      );
      assert.strictEqual(
        await AsyncEnumerable.range(42, 1).append(84).elementAt(1),
        84,
      );
    });
  });
});
