import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("skipWhile", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.deepStrictEqual(
        Enumerable.asEnumerable([59, 82, 70, 56, 92, 98, 85])
          .orderByDescending((grade) => grade)
          .skipWhile((grade) => grade >= 80)
          .toArray(),
        [70, 59, 56],
      );

      assert.deepStrictEqual(
        Enumerable.asEnumerable([5000, 2500, 9000, 8000, 6500, 4000, 1500, 5500])
          .skipWhile((amount, index) => amount > index * 1000)
          .toArray(),
        [4000, 1500, 5500],
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([59, 82, 70, 56, 92, 98, 85])
        .orderByDescending((grade) => grade)
        .skipWhile((grade) => grade >= 80);

      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync([59, 82, 70, 56, 92, 98, 85])
          .orderByDescending((grade) => grade)
          .skipWhile((grade) => grade >= 80)
          .toArray(),
        [70, 59, 56],
      );

      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync([5000, 2500, 9000, 8000, 6500, 4000, 1500, 5500])
          .skipWhile((amount, index) => amount > index * 1000)
          .toArray(),
        [4000, 1500, 5500],
      );
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([59, 82, 70, 56, 92, 98, 85])
        .orderByDescending((grade) => grade)
        .skipWhile((grade) => grade >= 80);

      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
  });
  describe("EnumerableAsync async", function () {
    test("basic", async function () {
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync([59, 82, 70, 56, 92, 98, 85])
          .orderByDescending(async (grade) => Promise.resolve(grade))
          .skipWhile(async (grade) => Promise.resolve(grade >= 80))
          .toArray(),
        [70, 59, 56],
      );

      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync([5000, 2500, 9000, 8000, 6500, 4000, 1500, 5500])
          .skipWhile(async (amount, index) => Promise.resolve(amount > index * 1000))
          .toArray(),
        [4000, 1500, 5500],
      );
    });
  });
});
