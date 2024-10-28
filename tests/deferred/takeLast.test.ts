import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("takeLast", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(
        Enumerable.asEnumerable([59, 82, 70, 56, 92, 98, 85])
          .orderByDescending((grade) => grade)
          .takeLast(3)
          .toArray(),
        [70, 59, 56],
      );
      assert.deepStrictEqual(Enumerable.asEnumerable([]).takeLast(3).toArray(), []);
      assert.deepStrictEqual(
        Enumerable.asEnumerable([59, 82, 70, 56, 92, 98, 85])
          .orderByDescending((grade) => grade)
          .takeLast(-3)
          .toArray(),
        [],
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([59, 82, 70, 56, 92, 98, 85])
        .orderByDescending((grade) => grade)
        .takeLast(3);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync([59, 82, 70, 56, 92, 98, 85])
          .orderByDescending((grade) => grade)
          .takeLast(3)
          .toArray(),
        [70, 59, 56],
      );
      assert.deepStrictEqual(await EnumerableAsync.asEnumerableAsync([]).takeLast(3).toArray(), []);
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync([59, 82, 70, 56, 92, 98, 85])
          .orderByDescending((grade) => grade)
          .takeLast(-3)
          .toArray(),
        [],
      );
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([59, 82, 70, 56, 92, 98, 85])
        .orderByDescending((grade) => grade)
        .takeLast(3);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
});
