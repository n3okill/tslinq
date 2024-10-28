import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("forEach", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      const a = [1, 2, 3];
      let count = 0;
      Enumerable.asEnumerable(a)
        .forEach((x) => {
          assert.strictEqual(x, a[count++]);
        })
        .toArray();
      assert.strictEqual(count, a.length);
      const result = Enumerable.asEnumerable(a)
        .forEach((x) => x * 2)
        .toArray();
      assert.deepStrictEqual(result, [2, 4, 6]);
    });
    test("repeated calls", function () {
      const a = [1, 2, 3];
      const enumerable = Enumerable.asEnumerable(a);
      const _for = enumerable.forEach((x) => x * 2);
      const result1 = _for.toArray();
      const result2 = _for.toArray();
      assert.deepStrictEqual(result1, [2, 4, 6]);
      assert.deepStrictEqual(result2, result1);
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      const a = [1, 2, 3];
      let count = 0;
      await EnumerableAsync.asEnumerableAsync(a)
        .forEach((x) => {
          assert.strictEqual(x, a[count++]);
        })
        .toArray();
      assert.strictEqual(count, a.length);
    });
    test("async action", async function () {
      const a = [1, 2, 3, 4, 5];
      let count = 0;
      const enumerable = EnumerableAsync.asEnumerableAsync(a);
      const result = await enumerable
        .forEach(async (x) => {
          count++;
          return await Promise.resolve(x * 2);
        })
        .toArray();
      assert.strictEqual(count, 5);
      assert.deepStrictEqual(result, [2, 4, 6, 8, 10]);
    });
    test("repeated calls", async function () {
      const a = [1, 2, 3];
      const enumerable = EnumerableAsync.asEnumerableAsync(a);
      const _for = enumerable.forEach((x) => x * 2);
      const result1 = await _for.toArray();
      const result2 = await _for.toArray();
      assert.deepStrictEqual(result1, [2, 4, 6]);
      assert.deepStrictEqual(result2, result1);
    });
  });
});
